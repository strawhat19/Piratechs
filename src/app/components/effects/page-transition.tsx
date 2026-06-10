'use client';

import gsap from 'gsap';
import { usePathname } from 'next/navigation';
import Spinner from '../loaders/spinners/spinner';
import { TransitionRouter } from 'next-transition-router';
import { useGlobalContext } from '@/shared/global-context';
import { getDeviceDetails, getPageName } from '@/shared/common/scripts/globals';
import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import { pageTransitionCompleteClass, pageTransitionPendingClass, pageTransitionReadyEvent } from '@/app/components/effects/page-transition-events';
import Word from '../logo/word';

const rows = 4;
const cols = 50;
const slantExtraCols = 3;

const gifResetClass = `pageTransitionGifReset`;
const rowIndexes = Array.from({ length: rows }, (_, index) => index);
const loaderDoneDelay = 360;
const loaderMinVisibleMs = 1100;
const loaderMaxBeforeReady = 94;
const authMaxWaitMs = 2000;

type LoaderRampWindow = Window & {
  __plProgress?: number;
  __plTimer?: number;
  __plDone?: boolean;
};

type PageTransitionProps = {
  children: ReactNode;
  duration?: number;
  slanted?: boolean;
};

const getReducedMotion = () => (
  typeof window != `undefined` && window.matchMedia(`(prefers-reduced-motion: reduce)`).matches
);

const useIsomorphicLayoutEffect = typeof window != `undefined` ? useLayoutEffect : useEffect;

const wait = (ms: number) => new Promise<void>(resolve => {
  window.setTimeout(resolve, ms);
});

const withTimeout = (promise: Promise<void>, ms: number) => Promise.race([promise, wait(ms)]);

const waitForFonts = () => {
  if (`fonts` in document) return document.fonts.ready.then(() => undefined);
  return Promise.resolve();
};

export default function PageTransition({ 
  children,
  slanted = true,
  duration = 0.24, 
}: PageTransitionProps) {
  const pathname = usePathname();
  const gridRef = useRef<HTMLDivElement>(null);
  const loaderRef = useRef<HTMLDivElement>(null);
  const blocksRef = useRef<HTMLDivElement[]>([]);
  const authLoadedResolversRef = useRef<Array<() => void>>([]);
  const transitionCoveredRef = useRef(true);
  const initialLoadCompleteRef = useRef(false);
  const authLoadedRef = useRef(false);

  const { width, isPWA, loaded } = useGlobalContext();
  const [loaderProgress, setLoaderProgress] = useState(3);
  const [showInitialLoader, setShowInitialLoader] = useState(true);

  const colOffset = slanted ? slantExtraCols : 0;
  const renderCols = cols + colOffset * 2;
  const renderBlockCount = rows * renderCols;

  const getRowBlocks = (row: number) => blocksRef.current.slice(row * renderCols, row * renderCols + renderCols);

  const getInitialBlockStyle = (index: number): CSSProperties => {
    const row = Math.floor(index / renderCols);
    const col = (index % renderCols) - colOffset;
    return {
      top: `${(row * 100) / rows}dvh`,
      left: `${(col * 100) / cols}vw`,
      width: `calc(${100 / cols}vw + 1px)`,
      height: `calc(${100 / rows}dvh + 1px)`,
      transform: slanted ? `skew(-15deg) scaleX(0)` : `scaleX(1)`,
      transformOrigin: row % 2 == 0 ? `left center` : `right center`,
    };
  };

  const restartGifAnimation = (element: HTMLElement | null) => {
    if (!element) return;
    element.classList.add(gifResetClass);
    void element.offsetWidth;
    element.classList.remove(gifResetClass);
  };

  const waitForAuthLoaded = () => new Promise<void>(resolve => {
    if (authLoadedRef.current) {
      resolve();
      return;
    }
    authLoadedResolversRef.current.push(resolve);
  });

  const setTransitionPending = () => {
    document.body.classList.add(pageTransitionPendingClass);
    document.body.classList.remove(pageTransitionCompleteClass);
  };

  const setTransitionComplete = () => {
    document.body.classList.remove(pageTransitionPendingClass);
    document.body.classList.add(pageTransitionCompleteClass);
    window.dispatchEvent(new Event(pageTransitionReadyEvent));
  };

  const createShutterBlindsGrid = (scaleX = transitionCoveredRef.current ? 1 : 0) => {
    const grid = gridRef.current;
    if (!grid) return;
    const blockWidth = window.innerWidth / cols;
    const blockHeight = window.innerHeight / rows;
    blocksRef.current.forEach((pageTransitionBlock, index) => {
      const row = Math.floor(index / renderCols);
      const col = (index % renderCols) - colOffset;
      gsap.set(pageTransitionBlock, {
        scaleX,
        width: blockWidth + 1,
        top: row * blockHeight,
        left: col * blockWidth,
        height: blockHeight + 1,
        transformOrigin: row % 2 == 0 ? `left center` : `right center`,
        ...(slanted ? { transform: `skew(-15deg) scaleX(${scaleX})` } : { transform: `scaleX(${scaleX})` }),
      });
    });
  };

  const animateIn = (onComplete: () => void) => {
    if (getReducedMotion()) {
      onComplete();
      return gsap.timeline();
    }
    const grid = gridRef.current;
    const loader = loaderRef.current;
    if (!grid) {
      onComplete();
      return gsap.timeline();
    }
    const timeline = gsap.timeline({ onComplete });
    gsap.killTweensOf(blocksRef.current);
    transitionCoveredRef.current = false;
    gsap.set(grid, { autoAlpha: 1, pointerEvents: `auto` });
    if (loader) gsap.set(loader, { autoAlpha: 0 });
    restartGifAnimation(grid);
    createShutterBlindsGrid(0);
    rowIndexes.forEach(row => {
      const blocks = getRowBlocks(row);
      timeline.to(blocks, {
        duration,
        scaleX: 1,
        ease: `power3.inOut`,
        stagger: {
          each: 0.012,
          from: row % 2 == 0 ? `start` : `end`,
        },
      }, row == 0 ? 0 : `<`);
    });
    timeline.call(() => {
      transitionCoveredRef.current = true;
    });
    return timeline;
  };

  const animateOut = (onComplete: () => void, withLoader = false, completeInitialLoad = false) => {
    if (getReducedMotion()) {
      if (completeInitialLoad) {
        initialLoadCompleteRef.current = true;
        setTransitionComplete();
      }
      onComplete();
      return gsap.timeline();
    }
    const grid = gridRef.current;
    const loader = loaderRef.current;
    if (!grid) {
      if (completeInitialLoad) {
        initialLoadCompleteRef.current = true;
        setTransitionComplete();
      }
      onComplete();
      return gsap.timeline();
    }
    const timeline = gsap.timeline({
      onComplete: () => {
        transitionCoveredRef.current = false;
        gsap.set(grid, { autoAlpha: 0, pointerEvents: `none` });
        if (loader) gsap.set(loader, { autoAlpha: 0 });
        if (completeInitialLoad) {
          initialLoadCompleteRef.current = true;
          setTransitionComplete();
        }
        onComplete();
      },
    });
    gsap.killTweensOf(blocksRef.current);
    gsap.set(grid, { autoAlpha: 1, pointerEvents: `auto` });
    if (withLoader) {
      timeline.to(loader, {
        y: -8,
        autoAlpha: 0,
        duration: 0.28,
        ease: `power2.out`,
      }, 0);
    } else {
      if (loader) gsap.set(loader, { autoAlpha: 0 });
    }
    rowIndexes.forEach(row => {
      const blocks = getRowBlocks(row);
      timeline.to(blocks, {
        duration,
        scaleX: 0,
        ease: `power3.inOut`,
        stagger: {
          each: 0.012,
          from: row % 2 == 0 ? `end` : `start`,
        },
      }, row == 0 ? (withLoader ? 0.16 : 0.05) : `<`);
    });
    return timeline;
  };

  useEffect(() => {
    if (!loaded) return;
    authLoadedRef.current = true;
    authLoadedResolversRef.current.splice(0).forEach(resolve => resolve());
  }, [loaded]);

  useIsomorphicLayoutEffect(() => {
    authLoadedRef.current = loaded;
    const rampWindow = window as LoaderRampWindow;
    rampWindow.__plDone = true;
    if (rampWindow.__plTimer) {
      window.clearInterval(rampWindow.__plTimer);
      rampWindow.__plTimer = undefined;
    }
    if (typeof rampWindow.__plProgress == `number`) setLoaderProgress(rampWindow.__plProgress);
    setTransitionPending();
    createShutterBlindsGrid(0);
    animateIn(() => {});
    const resizeShutterGrid = () => createShutterBlindsGrid();
    window.addEventListener(`resize`, resizeShutterGrid);
    if (getReducedMotion()) {
      setLoaderProgress(100);
      setShowInitialLoader(false);
      transitionCoveredRef.current = false;
      if (gridRef.current) gsap.set(gridRef.current, { autoAlpha: 0, pointerEvents: `none`, background: `none` });
      setTransitionComplete();
      return () => window.removeEventListener(`resize`, resizeShutterGrid);
    }
    if (gridRef.current) gsap.set(gridRef.current, { autoAlpha: 1, pointerEvents: `auto`, background: `none` });
    if (loaderRef.current) gsap.set(loaderRef.current, { autoAlpha: 1, y: 0 });
    restartGifAnimation(loaderRef.current);

    let cancelled = false;
    let initialOutTimeline: gsap.core.Timeline | null = null;
    const startedAt = window.performance.now();
    const progressInterval = window.setInterval(() => {
      setLoaderProgress(currentProgress => (
        Math.min(loaderMaxBeforeReady, currentProgress + Math.max(0.5, (loaderMaxBeforeReady - currentProgress) * 0.055))
      ));
    }, 90);

    const finishInitialLoad = async () => {
      await Promise.all([waitForFonts(), withTimeout(waitForAuthLoaded(), authMaxWaitMs)]);
      const remainingVisibleMs = Math.max(0, loaderMinVisibleMs - (window.performance.now() - startedAt));
      if (remainingVisibleMs > 0) await wait(remainingVisibleMs);
      if (cancelled) return;
      window.clearInterval(progressInterval);
      setLoaderProgress(100);
      await wait(loaderDoneDelay);
      if (cancelled) return;
      initialOutTimeline = animateOut(() => {
        setShowInitialLoader(false);
      }, true, true);
    };

    finishInitialLoad();

    return () => {
      cancelled = true;
      window.clearInterval(progressInterval);
      initialOutTimeline?.kill();
      window.removeEventListener(`resize`, resizeShutterGrid);
    };
  }, []);

  return (
    <TransitionRouter
      auto
      leave={next => {
        if (!initialLoadCompleteRef.current) {
          next();
          return () => {};
        }
        const timeline = animateIn(next);
        return () => timeline.kill();
      }}
      enter={next => {
        if (!initialLoadCompleteRef.current) {
          next();
          return () => {};
        }
        const timeline = animateOut(next);
        return () => timeline.kill();
      }}
    >
      <div ref={gridRef} className={`pageTransitionShutter shutterBlindsEffect 
        ${showInitialLoader ? `initialLoaderActive` : ``}
        ${isPWA ? `pwa` : `nonPWA`} 
        ${getPageName(pathname)}Page  
        ${slanted ? `slanted` : `straightened`} 
        ${getDeviceDetails()?.ios ? `ios` : `noIos`} 
        ${(width <= 768 || getDeviceDetails()?.mobile) ? `mobile` : ``}
      `} aria-hidden={`true`}>
        {Array.from({ length: renderBlockCount }).map((_, index) => (
          <div
            key={index}
            style={getInitialBlockStyle(index)}
            className={`pageTransitionBlock shutterBlindBlock`}
            ref={block => {
              if (block) blocksRef.current[index] = block;
            }}
          />
        ))}
        {showInitialLoader && (
          <div ref={loaderRef} className={`pageTransitionLoader`}>
            <div className={`pageLoaderSpinnerWrapper`}>
              <div className={`pageLoaderSpinnerContainer`}>
                <Spinner size={`50%`} thickness={0.2} className={`pageLoaderSpinner dropShadow`} />
              </div>
            </div>
            <div className={`pageTransitionLoaderInner`}>
              <img
                aria-hidden={`true`}
                className={`pageTransitionGif`}
                alt={`Piratechs_Distortion_GIF`}
                src={`/assets/piratechs/gifs/Piratech-Glitch.gif`}
              />
              <div className={`pageLoaderProgress dropShadow`}>
                <div
                  data-pl-fill={`true`}
                  suppressHydrationWarning
                  className={`pageLoaderProgressFill`}
                  style={{ width: `${loaderProgress}%` }}
                />
              </div>
              <span className={`pageLoaderProgressText column`}>
                {/* <Spinner size={30} thickness={4} className={`dropShadow`} /> */}
                <Word className={`loaderWord`} gradient={false} gradientSword arrows shadows />
                <span className={`dropShadow`} data-pl-pct={`true`} suppressHydrationWarning>
                  {`${Math.round(loaderProgress)}%`}
                </span>
                {/* <span className={`dropShadow`}>
                  Loading <Word className={`loaderWord`} gradient={false} gradientSword arrows /> ... {Math.round(loaderProgress)}%
                </span> */}
                {/* <Spinner size={30} thickness={4} value={loaderProgress} variant={`determinate`} className={`dropShadow`} /> */}
              </span>
            </div>
          </div>
        )}
      </div>
      {children}
    </TransitionRouter>
  );
}
