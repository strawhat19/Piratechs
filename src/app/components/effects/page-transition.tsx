'use client';

import gsap from 'gsap';
import { usePathname } from 'next/navigation';
import LinearProgress from '@mui/material/LinearProgress';
import { TransitionRouter } from 'next-transition-router';
import { useGlobalContext } from '@/shared/global-context';
import { getDeviceDetails, getPageName } from '@/shared/common/scripts/globals';
import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import { pageTransitionCompleteClass, pageTransitionPendingClass, pageTransitionReadyEvent } from '@/app/components/effects/page-transition-events';

const rows = 4;
const cols = 20;

const blockCount = rows * cols;
const gifResetClass = `pageTransitionGifReset`;
const rowIndexes = Array.from({ length: rows }, (_, index) => index);
const loaderDoneDelay = 360;
const loaderMinVisibleMs = 1100;
const loaderMaxBeforeReady = 94;

type PageTransitionProps = {
  children: ReactNode;
  duration?: number;
};

const getReducedMotion = () => (
  typeof window != `undefined` && window.matchMedia(`(prefers-reduced-motion: reduce)`).matches
);

const useIsomorphicLayoutEffect = typeof window != `undefined` ? useLayoutEffect : useEffect;

const wait = (ms: number) => new Promise<void>(resolve => {
  window.setTimeout(resolve, ms);
});

const waitForWindowLoad = () => new Promise<void>(resolve => {
  if (document.readyState == `complete`) {
    resolve();
    return;
  }
  window.addEventListener(`load`, () => resolve(), { once: true });
});

const waitForFonts = () => {
  if (`fonts` in document) return document.fonts.ready.then(() => undefined);
  return Promise.resolve();
};

export default function PageTransition({ 
  children,
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

  const getRowBlocks = (row: number) => blocksRef.current.slice(row * cols, row * cols + cols);

  const getInitialBlockStyle = (index: number): CSSProperties => {
    const row = Math.floor(index / cols);
    const col = index % cols;
    return {
      transform: `scaleX(1)`,
      top: `${(row * 100) / rows}dvh`,
      left: `${(col * 100) / cols}vw`,
      width: `calc(${100 / cols}vw + 1px)`,
      height: `calc(${100 / rows}dvh + 1px)`,
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
    blocksRef.current.forEach((block, index) => {
      const row = Math.floor(index / cols);
      const col = index % cols;
      gsap.set(block, {
        scaleX,
        width: blockWidth + 1,
        top: row * blockHeight,
        left: col * blockWidth,
        height: blockHeight + 1,
        transformOrigin: row % 2 == 0 ? `left center` : `right center`,
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
        duration: 0.28,
        autoAlpha: 0,
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
    setTransitionPending();
    createShutterBlindsGrid(1);
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
      await Promise.all([waitForWindowLoad(), waitForFonts(), waitForAuthLoaded()]);
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
        ${getDeviceDetails()?.ios ? `ios` : `noIos`} 
        ${(width <= 768 || getDeviceDetails()?.mobile) ? `mobile` : ``}
      `} aria-hidden={`true`}>
        {Array.from({ length: blockCount }).map((_, index) => (
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
            <div className={`pageTransitionLoaderInner`}>
              <img
                aria-hidden={`true`}
                className={`pageTransitionGif`}
                alt={`Piratechs_Distortion_GIF`}
                src={`/assets/piratechs/gifs/Piratech-Glitch.gif`}
              />
              <LinearProgress
                value={loaderProgress}
                variant={`determinate`}
                className={`pageLoaderProgress dropShadow`}
              />
              <span className={`pageLoaderProgressText dropShadow`}>
                {Math.round(loaderProgress)}%
                </span>
            </div>
          </div>
        )}
      </div>
      {children}
    </TransitionRouter>
  );
}
