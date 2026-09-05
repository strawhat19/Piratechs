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

type TransitionCssProperties = CSSProperties & {
  [key: `--${string}`]: string | number;
};

const loaderKeywordSteps = 4;
const shutterBlindCount = 12;
const loaderCompleteHoldMs = 80;
const revealDurationMs = 1120;
const initialHoldMs = revealDurationMs;
const centerRevealMaxDurationMs = 760;
const revealBlindStaggerMs = 38;
const coverBlindStaggerMs = revealBlindStaggerMs;
const shutterBlinds = Array.from({ length: shutterBlindCount }, (_, index) => index);
const loaderCornerPositions = [`TopLeft`, `TopRight`, `BottomLeft`, `BottomRight`];
const loaderKeywords = Array.from(new Set<string>([
  `Next`,
  `Design`,
  `TypeScript`,
  `JavaScript`,
  `Developnent`,
  `API`,
  `AI`,
  `App`,
  `PHP`,
  `C-Sharp`,
  `Python`,
  `React`,
  `Piratechs`,
  `SCSS`,
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
  duration = revealDurationMs / 1000,
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
  const coverDurationMs = Math.max(180, Math.round(duration * 1000));
  const coverBlindTransitionMs = Math.max(48, coverDurationMs - coverBlindStaggerMs * (shutterBlindCount - 1));
  const revealBlindTransitionMs = Math.max(480, revealDurationMs - revealBlindStaggerMs * (shutterBlindCount - 1));
  const centerRevealDurationMs = Math.min(centerRevealMaxDurationMs, Math.max(120, Math.round(coverDurationMs * 0.68)));
  const centerRevealDelayMs = Math.max(0, coverDurationMs - centerRevealDurationMs);
  const doneDelayBeforeLeaveMs = Number.isFinite(doneDelayBeforeLeave)
    ? Math.max(0, doneDelayBeforeLeave * 1000)
    : 0;
  const transitionStyle: TransitionCssProperties = {
    '--page-transition-cover-duration': `${coverBlindTransitionMs}ms`,
    '--page-transition-center-delay': `${centerRevealDelayMs}ms`,
    '--page-transition-reveal-duration': `${revealBlindTransitionMs}ms`,
    '--page-transition-center-duration': `${centerRevealDurationMs}ms`,
  };

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
        const label = `${roundedValue}%`;
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
      const eased = elapsed * elapsed * (3 - 2 * elapsed);
      const nextValue = eased * 100;
      const deltaTime = Math.max(now - lastTime, 1) / 1000;
      const velocity = Math.abs(nextValue - lastValue) / deltaTime;
      const targetBlur = Math.min(3.5, velocity * 0.006);
      blurAmount += (targetBlur - blurAmount) * 0.3;
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

    timerRef.current = window.setTimeout(finish, revealDurationMs);
    return clearScheduledWork;
  }, [clearScheduledWork, setTransitionComplete, setTransitionRevealing, stopProgress]);

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
    progressFrameRef.current = window.requestAnimationFrame(() => startProgress(coverDurationMs));
    timerRef.current = window.setTimeout(() => {
      stopProgress(true);
      setPhase(`covered`);
      if (doneDelayBeforeLeaveMs > 0) {
        timerRef.current = window.setTimeout(next, doneDelayBeforeLeaveMs);
        return;
      }
      next();
    }, coverDurationMs);
    return clearScheduledWork;
  }, [clearScheduledWork, coverDurationMs, doneDelayBeforeLeaveMs, pathname, setTransitionPending, startProgress, stopProgress]);

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
        timerRef.current = window.setTimeout(
          () => initialLoader.revealPage(() => {}, true),
          loaderCompleteHoldMs + initialLoader.doneDelayBeforeLeaveMs,
        );
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
        <div className={`pageTransitionBlinds`} aria-hidden={true}>
          {shutterBlinds.map(index => (
            <span
              key={index}
              className={`pageTransitionBlind`}
              style={{
                '--cover-delay': `${index * coverBlindStaggerMs}ms`,
                '--reveal-delay': `${(shutterBlindCount - index - 1) * revealBlindStaggerMs}ms`,
              } as TransitionCssProperties}
            />
          ))}
        </div>
        <div className={`pageTransitionAmbience`} aria-hidden={true}>
          {loaderCornerPositions.map(position => (
            <span key={position} className={`pageTransitionCorner pageTransitionCorner${position}`}>
              <svg className={`pageTransitionCornerCircuit`} viewBox={`0 0 240 200`} fill={`none`} focusable={false}>
                <path className={`pageTransitionCornerFrame`} d={`M4 122V24L24 4H156L166 14H236M4 138V176L14 186V196M16 136V32L32 16H126`} />
                <path className={`pageTransitionCornerPlate`} d={`M44 4H118L124 10H38ZM4 48L10 42V96L4 102Z`} />
                <path className={`pageTransitionCornerTrace`} d={`M88 54L108 34H180L190 24H224M54 88L34 108V158L24 168V188M96 70H132L148 54H210M70 96V124L54 140V176`} />
                <path className={`pageTransitionCornerSignal`} pathLength={100} d={`M54 88L34 108V158L24 168V188`} />
                <path className={`pageTransitionCornerSignal pageTransitionCornerSignalAlt`} pathLength={100} d={`M88 54L108 34H180L190 24H224`} />
                <g className={`pageTransitionCornerDial`}>
                  <path className={`pageTransitionCornerTrace`} d={`M66 34V42M66 90V98M34 66H42M90 66H98M43 43L48 48M84 84L89 89`} />
                  <circle className={`pageTransitionCornerTrace`} cx={66} cy={66} r={25} />
                  <path className={`pageTransitionCornerAccent`} d={`M41 66A25 25 0 0 1 66 41M91 66A25 25 0 0 1 66 91`} />
                  <path className={`pageTransitionCornerFrame`} d={`M66 50L82 66L66 82L50 66Z`} />
                  <path className={`pageTransitionCornerTrace`} d={`M59 66H73M66 59V73`} />
                  <circle className={`pageTransitionCornerBeacon`} cx={66} cy={66} r={3} />
                </g>
                <path className={`pageTransitionCornerTicks`} d={`M142 20V25M150 20V25M158 20V25M166 20V25M174 20V25M20 118H25M20 126H25M20 134H25M20 142H25M20 150H25`} />
                <path className={`pageTransitionCornerAccent`} d={`M204 10L208 14L204 18M214 10L218 14L214 18M10 178L14 182L18 178`} />
                <g className={`pageTransitionCornerTerminals`}>
                  <circle cx={224} cy={24} r={3} />
                  <circle cx={210} cy={54} r={3} />
                  <circle cx={54} cy={176} r={3} />
                  <path d={`M21 185H27V191H21Z`} />
                </g>
              </svg>
            </span>
          ))}
        </div>
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
              <span>Progress /</span>
              <span
                ref={progressRef}
                className={`pageTransitionProgressValue pageTransitionProgressValuePrimary`}
                data-progress={`0%`}
              >
                0%
              </span>
            </div>
            <div className={`pageTransitionProgress`}>
              <span className={`pageTransitionProgressRow`} aria-hidden={true}>
                <span className={`pageTransitionRoute`}>
                  <span>Loading /</span>
                  <strong>{loadingPage}</strong>
                </span>
                <span className={`pageTransitionTechnology`}>
                  <span>Technologies /</span>
                  <span className={`pageTransitionKeywordWindow`}>
                    <span
                      ref={keywordRef}
                      className={`pageTransitionKeywordValue`}
                      data-keyword={getLoaderKeyword(keywordOffsetRef.current)}
                    >
                      {getLoaderKeyword(keywordOffsetRef.current)}
                    </span>
                  </span>
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
