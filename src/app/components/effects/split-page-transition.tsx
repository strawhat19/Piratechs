'use client';

import Image from 'next/image';
import Word from '../logo/word';
import { usePathname } from 'next/navigation';
import { config } from '@/shared/config/config';
import { TransitionRouter } from 'next-transition-router';
import type { PageTransitionProps } from './page-transition-config';
import { useCallback, useEffect, useRef, useState, type CSSProperties } from 'react';
import { pageTransitionCompleteClass, pageTransitionPendingClass, pageTransitionReadyEvent, pageTransitionRevealEvent, pageTransitionRevealingClass } from '@/app/components/effects/page-transition-events';

type TransitionPhase = `covered` | `covering` | `revealing` | `idle`;

const splitRows = [1, 2, 3, 4];
const loaderKeywordSteps = 4;
const loaderKeywords = Array.from(new Set<string>([
  ...(config?.services ?? []).map((service: { title: string }) => service.title),
  ...(config?.skills ?? []).map((skill: { label: string }) => skill.label),
  ...(config?.topBarItems ?? []).map((item: { label: string }) => item.label),
]));

const getReducedMotion = () => (
  typeof window != `undefined` && window.matchMedia(`(prefers-reduced-motion: reduce)`).matches
);

const humanizeRouteSegment = (segment: string) => {
  let decodedSegment = segment;
  try {
    decodedSegment = decodeURIComponent(segment);
  } catch {
    decodedSegment = segment;
  }

  return decodedSegment
    .replace(/([a-z0-9])([A-Z])/g, `$1 $2`)
    .replace(/[-_]+/g, ` `)
    .replace(/\b\w/g, character => character.toUpperCase());
};

const getLoaderPageName = (href: string = `/`) => {
  const routeSegments = href
    .split(/[?#]/)?.[0]
    ?.split(`/`)
    .filter(segment => segment && segment != `pages`) ?? [];
  if (!routeSegments?.[0]) return `Home`;

  const routeName = routeSegments?.[0];
  if (routeName == `case-studies`) {
    return routeSegments?.[1] ? humanizeRouteSegment(routeSegments[1]) : `Case Studies`;
  }

  const navItem = config?.nav?.find((item: { href: string }) => item.href == `/${routeName}`);
  return navItem?.label ?? config?.pages?.[routeName]?.eyebrow ?? humanizeRouteSegment(routeSegments.at(-1) ?? routeName);
};

const getKeywordOffset = (pageName: string) => (
  Array.from(pageName).reduce((total, character) => total + character.charCodeAt(0), 0) % Math.max(loaderKeywords.length, 1)
);

const getLoaderKeyword = (offset: number, step: number = 0) => (
  loaderKeywords?.[(offset + step) % Math.max(loaderKeywords.length, 1)] ?? `TypeScript`
);

export default function SplitPageTransition({
  children,
  duration = 0.36,
  doneDelayBeforeLeave = 0,
}: PageTransitionProps) {
  const pathname = usePathname();
  const initialPageName = getLoaderPageName(pathname);
  const [phase, setPhase] = useState<TransitionPhase>(`covered`);
  const [loadingPage, setLoadingPage] = useState(initialPageName);
  const timerRef = useRef<number | null>(null);
  const frameRef = useRef<number | null>(null);
  const progressFrameRef = useRef<number | null>(null);
  const progressRef = useRef<HTMLSpanElement | null>(null);
  const progressTrailRef = useRef<HTMLSpanElement | null>(null);
  const displayedProgressRef = useRef(-1);
  const keywordRef = useRef<HTMLSpanElement | null>(null);
  const motionBlurRef = useRef<SVGFEGaussianBlurElement | null>(null);
  const keywordIndexRef = useRef(-1);
  const keywordOffsetRef = useRef(getKeywordOffset(initialPageName));
  const initialRevealCompleteRef = useRef(false);
  const durationMs = Math.max(180, Math.round(duration * 1000));
  const doneDelayBeforeLeaveMs = Number.isFinite(doneDelayBeforeLeave)
    ? Math.max(0, doneDelayBeforeLeave * 1000)
    : 0;
  const initialHoldMs = 220;
  const transitionStyle = {
    '--page-transition-panel-duration': `${Math.max(108, durationMs - 72)}ms`,
  } as CSSProperties;

  const clearScheduledWork = useCallback(() => {
    if (timerRef.current != null) window.clearTimeout(timerRef.current);
    if (frameRef.current != null) window.cancelAnimationFrame(frameRef.current);
    timerRef.current = null;
    frameRef.current = null;
  }, []);

  const updateKeyword = useCallback((progress: number) => {
    const keyword = keywordRef.current;
    const nextStep = Math.min(loaderKeywordSteps - 1, Math.floor((progress / 100) * loaderKeywordSteps));
    if (!keyword || nextStep == keywordIndexRef.current) return;

    const nextKeyword = getLoaderKeyword(keywordOffsetRef.current, nextStep);
    keywordIndexRef.current = nextStep;
    keyword.textContent = nextKeyword;
    keyword.dataset.keyword = nextKeyword;
    keyword.classList.remove(`isChanging`);
    void keyword.offsetWidth;
    keyword.classList.add(`isChanging`);
  }, []);

  const updateProgress = useCallback((value: number, keywordProgress: number = value) => {
    const clampedValue = Math.min(100, Math.max(0, value));
    const roundedValue = Math.round(clampedValue);
    const progressTrail = progressTrailRef.current;
    if (progressTrail) {
      progressTrail.style.setProperty(`--page-transition-progress`, `${clampedValue / 100}`);
    }

    if (roundedValue != displayedProgressRef.current) {
      displayedProgressRef.current = roundedValue;
      const counter = progressRef.current;
      if (counter) {
        const label = `${String(roundedValue).padStart(3, `0`)}%`;
        counter.textContent = label;
        counter.dataset.progress = label;
      }
      if (progressTrail) {
        progressTrail.setAttribute(`aria-valuenow`, String(roundedValue));
        progressTrail.setAttribute(`aria-valuetext`, `${roundedValue}%`);
      }
    }

    updateKeyword(keywordProgress);
  }, [updateKeyword]);

  const stopProgress = useCallback((complete = false) => {
    if (progressFrameRef.current != null) window.cancelAnimationFrame(progressFrameRef.current);
    progressFrameRef.current = null;
    if (complete) updateProgress(100);
    motionBlurRef.current?.setAttribute(`stdDeviation`, `0 0`);
  }, [updateProgress]);

  const startProgress = useCallback((totalMs: number) => {
    stopProgress();
    displayedProgressRef.current = -1;
    updateProgress(0);

    if (getReducedMotion()) {
      updateProgress(100);
      return;
    }

    let lastValue = 0;
    let blurAmount = 0;
    let lastTime = window.performance.now();
    const startedAt = lastTime;
    const tick = (now: number) => {
      const elapsed = Math.min(1, (now - startedAt) / totalMs);
      const eased = 1 - Math.pow(1 - elapsed, 2.2);
      const nextValue = eased * 100;
      const deltaTime = Math.max(now - lastTime, 1) / 1000;
      const velocity = Math.abs(nextValue - lastValue) / deltaTime;
      const targetBlur = Math.min(10, velocity * 0.02);
      blurAmount += (targetBlur - blurAmount) * 0.35;
      motionBlurRef.current?.setAttribute(`stdDeviation`, `0 ${blurAmount.toFixed(2)}`);
      updateProgress(nextValue, elapsed * 100);
      lastValue = nextValue;
      lastTime = now;

      if (elapsed < 1) {
        progressFrameRef.current = window.requestAnimationFrame(tick);
        return;
      }

      motionBlurRef.current?.setAttribute(`stdDeviation`, `0 0`);
      progressFrameRef.current = null;
    };

    progressFrameRef.current = window.requestAnimationFrame(tick);
  }, [stopProgress, updateProgress]);

  const setTransitionPending = useCallback(() => {
    [document.documentElement, document.body].forEach(element => {
      element.classList.add(pageTransitionPendingClass);
      element.classList.remove(pageTransitionRevealingClass, pageTransitionCompleteClass);
    });
  }, []);

  const setTransitionRevealing = useCallback(() => {
    [document.documentElement, document.body].forEach(element => element.classList.add(pageTransitionRevealingClass));
    window.dispatchEvent(new Event(pageTransitionRevealEvent));
  }, []);

  const setTransitionComplete = useCallback(() => {
    [document.documentElement, document.body].forEach(element => {
      element.classList.remove(pageTransitionPendingClass, pageTransitionRevealingClass);
      element.classList.add(pageTransitionCompleteClass);
    });
    window.dispatchEvent(new Event(pageTransitionReadyEvent));
  }, []);

  const revealPage = useCallback((onComplete: () => void, initial = false) => {
    clearScheduledWork();
    setTransitionRevealing();
    setPhase(`revealing`);

    const finish = () => {
      stopProgress(true);
      setPhase(`idle`);
      setTransitionComplete();
      if (initial) initialRevealCompleteRef.current = true;
      onComplete();
    };

    if (getReducedMotion()) {
      finish();
      return () => {};
    }

    timerRef.current = window.setTimeout(finish, durationMs);
    return clearScheduledWork;
  }, [clearScheduledWork, durationMs, setTransitionComplete, setTransitionRevealing, stopProgress]);

  const handleLeave = useCallback((next: () => void, _from?: string, to?: string) => {
    if (!initialRevealCompleteRef.current || getReducedMotion()) {
      next();
      return () => {};
    }

    const nextPageName = getLoaderPageName(to ?? pathname);
    setLoadingPage(nextPageName);
    keywordOffsetRef.current = getKeywordOffset(nextPageName);
    keywordIndexRef.current = -1;
    clearScheduledWork();
    setTransitionPending();
    setPhase(`covering`);
    progressFrameRef.current = window.requestAnimationFrame(() => startProgress(durationMs));
    timerRef.current = window.setTimeout(() => {
      stopProgress(true);
      setPhase(`covered`);
      if (doneDelayBeforeLeaveMs > 0) {
        timerRef.current = window.setTimeout(next, doneDelayBeforeLeaveMs);
        return;
      }
      next();
    }, durationMs);
    return clearScheduledWork;
  }, [clearScheduledWork, doneDelayBeforeLeaveMs, durationMs, pathname, setTransitionPending, startProgress, stopProgress]);

  const handleEnter = useCallback((next: () => void) => (
    revealPage(next, !initialRevealCompleteRef.current)
  ), [revealPage]);

  const initialLoaderRef = useRef({
    clearScheduledWork,
    doneDelayBeforeLeaveMs,
    revealPage,
    setTransitionPending,
    startProgress,
    stopProgress,
  });

  useEffect(() => {
    const initialLoader = initialLoaderRef.current;
    initialLoader.setTransitionPending();
    initialLoader.startProgress(initialHoldMs);
    frameRef.current = window.requestAnimationFrame(() => {
      if (getReducedMotion()) {
        initialLoader.revealPage(() => {}, true);
        return;
      }

      timerRef.current = window.setTimeout(() => {
        initialLoader.stopProgress(true);
        if (initialLoader.doneDelayBeforeLeaveMs > 0) {
          timerRef.current = window.setTimeout(
            () => initialLoader.revealPage(() => {}, true),
            initialLoader.doneDelayBeforeLeaveMs,
          );
          return;
        }
        initialLoader.revealPage(() => {}, true);
      }, initialHoldMs);
    });

    return () => {
      initialLoader.clearScheduledWork();
      initialLoader.stopProgress();
    };
  }, []);

  return (
    <TransitionRouter
      auto
      leave={handleLeave}
      enter={handleEnter}
    >
      <div
        className={`pageTransitionRoot pageTransitionSplit ${phase}`}
        style={transitionStyle}
        aria-hidden={phase == `idle`}
      >
        <svg className={`pageTransitionMotionFilter`} aria-hidden={true} focusable={false}>
          <defs>
            <filter
              id={`pageTransitionMotionBlur`}
              x={`-50%`}
              y={`-80%`}
              width={`200%`}
              height={`260%`}
              colorInterpolationFilters={`sRGB`}
            >
              <feGaussianBlur ref={motionBlurRef} in={`SourceGraphic`} stdDeviation={`0 0`} />
            </filter>
          </defs>
        </svg>
        {splitRows.map(row => (
          <div key={row} className={`pageTransitionRow pageTransitionRow${row}`}>
            <span className={`pageTransitionPanel pageTransitionPanelStart`} />
            <span className={`pageTransitionPanel pageTransitionPanelEnd`} />
          </div>
        ))}
        {phase != `idle` ? (
          <div className={`pageTransitionIdentity`}>
            <div className={`pageTransitionMeta`} aria-hidden={true}>
              <span>PT / SYSTEM 01</span>
              <span>ATL / 404</span>
            </div>
            <div className={`pageTransitionDistortion`} aria-hidden={true}>
              <Image
                src={`/assets/piratechs/animations/piratechs-distortion-loader.webp`}
                alt={``}
                width={500}
                height={177}
                priority
                unoptimized
              />
            </div>
            <div className={`pageTransitionBrand`} aria-hidden={true}>
              <Word className={`pageTransitionWord`} gradient={false} arrows={false} gradientSword />
            </div>
            <div className={`pageTransitionKeyword`} aria-hidden={true}>
              <span>Building With /</span>
              <span className={`pageTransitionKeywordWindow`}>
                <span
                  ref={keywordRef}
                  className={`pageTransitionKeywordValue`}
                  data-keyword={getLoaderKeyword(keywordOffsetRef.current)}
                >
                  {getLoaderKeyword(keywordOffsetRef.current)}
                </span>
              </span>
            </div>
            <div className={`pageTransitionProgress`}>
              <span className={`pageTransitionProgressRow`} aria-hidden={true}>
                <span className={`pageTransitionRoute`}>
                  <span>Loading Page /</span>
                  <strong>{loadingPage}</strong>
                </span>
                <span ref={progressRef} className={`pageTransitionProgressValue`} data-progress={`000%`}>
                  000%
                </span>
              </span>
              <span
                ref={progressTrailRef}
                className={`pageTransitionProgressTrail`}
                role={`progressbar`}
                aria-label={`Loading ${loadingPage}`}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={0}
                aria-valuetext={`0%`}
              >
                <span className={`pageTransitionProgressFill`} />
              </span>
            </div>
          </div>
        ) : null}
      </div>
      {children}
    </TransitionRouter>
  );
}
