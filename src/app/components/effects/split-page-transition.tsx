'use client';

import Image from 'next/image';
import Word from '../logo/word';
import { useEffect, useRef, useState } from 'react';
import { TransitionRouter } from 'next-transition-router';
import type { PageTransitionProps } from './page-transition-config';
import {
  pageTransitionCompleteClass,
  pageTransitionPendingClass,
  pageTransitionReadyEvent,
  pageTransitionRevealEvent,
  pageTransitionRevealingClass,
} from '@/app/components/effects/page-transition-events';

type TransitionPhase = `covered` | `covering` | `revealing` | `idle`;

const getReducedMotion = () => (
  typeof window != `undefined` && window.matchMedia(`(prefers-reduced-motion: reduce)`).matches
);

export default function SplitPageTransition({ children, duration = 0.36 }: PageTransitionProps) {
  const [phase, setPhase] = useState<TransitionPhase>(`covered`);
  const timerRef = useRef<number | null>(null);
  const frameRef = useRef<number | null>(null);
  const progressFrameRef = useRef<number | null>(null);
  const progressRef = useRef<HTMLSpanElement | null>(null);
  const initialRevealCompleteRef = useRef(false);
  const durationMs = Math.max(180, Math.round(duration * 1000));
  const initialHoldMs = 220;

  const clearScheduledWork = () => {
    if (timerRef.current != null) window.clearTimeout(timerRef.current);
    if (frameRef.current != null) window.cancelAnimationFrame(frameRef.current);
    timerRef.current = null;
    frameRef.current = null;
  };

  const updateProgress = (value: number) => {
    const counter = progressRef.current;
    if (!counter) return;
    const label = `${String(Math.round(value)).padStart(3, `0`)}%`;
    counter.textContent = label;
    counter.dataset.progress = label;
  };

  const stopProgress = (complete = false) => {
    if (progressFrameRef.current != null) window.cancelAnimationFrame(progressFrameRef.current);
    progressFrameRef.current = null;
    if (complete) updateProgress(100);
  };

  const startProgress = (totalMs: number) => {
    stopProgress();
    updateProgress(0);

    if (getReducedMotion()) {
      updateProgress(100);
      return;
    }

    const startedAt = window.performance.now();
    const tick = (now: number) => {
      const elapsed = Math.min(1, (now - startedAt) / totalMs);
      const eased = 1 - Math.pow(1 - elapsed, 2.2);
      updateProgress(eased * 100);
      if (elapsed < 1) progressFrameRef.current = window.requestAnimationFrame(tick);
      else progressFrameRef.current = null;
    };

    progressFrameRef.current = window.requestAnimationFrame(tick);
  };

  const setTransitionPending = () => {
    [document.documentElement, document.body].forEach(element => {
      element.classList.add(pageTransitionPendingClass);
      element.classList.remove(pageTransitionRevealingClass, pageTransitionCompleteClass);
    });
  };

  const setTransitionRevealing = () => {
    [document.documentElement, document.body].forEach(element => element.classList.add(pageTransitionRevealingClass));
    window.dispatchEvent(new Event(pageTransitionRevealEvent));
  };

  const setTransitionComplete = () => {
    [document.documentElement, document.body].forEach(element => {
      element.classList.remove(pageTransitionPendingClass, pageTransitionRevealingClass);
      element.classList.add(pageTransitionCompleteClass);
    });
    window.dispatchEvent(new Event(pageTransitionReadyEvent));
  };

  const revealPage = (onComplete: () => void, initial = false) => {
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
  };

  useEffect(() => {
    setTransitionPending();
    startProgress(initialHoldMs);
    frameRef.current = window.requestAnimationFrame(() => {
      if (getReducedMotion()) {
        revealPage(() => {}, true);
        return;
      }

      timerRef.current = window.setTimeout(() => revealPage(() => {}, true), initialHoldMs);
    });

    return () => {
      clearScheduledWork();
      stopProgress();
    };
  }, []);

  return (
    <TransitionRouter
      auto
      leave={next => {
        if (!initialRevealCompleteRef.current || getReducedMotion()) {
          next();
          return () => {};
        }

        clearScheduledWork();
        setTransitionPending();
        setPhase(`covering`);
        progressFrameRef.current = window.requestAnimationFrame(() => startProgress(durationMs));
        timerRef.current = window.setTimeout(() => {
          setPhase(`covered`);
          next();
        }, durationMs);
        return clearScheduledWork;
      }}
      enter={next => revealPage(next)}
    >
      <div className={`pageTransitionRoot pageTransitionSplit ${phase}`} aria-hidden={`true`}>
        <span className={`pageTransitionPanel pageTransitionPanelStart`} />
        <span className={`pageTransitionPanel pageTransitionPanelEnd`} />
        {phase != `idle` ? (
          <div className={`pageTransitionIdentity`}>
            <div className={`pageTransitionMeta`}>
              <span>PT / SYSTEM 01</span>
              <span>ATL / 404</span>
            </div>
            <div className={`pageTransitionDistortion`}>
              <Image
                src={`/assets/piratechs/animations/piratechs-distortion-loader.webp`}
                alt={``}
                width={500}
                height={177}
                priority
                unoptimized
              />
            </div>
            <div style={{ textAlign: `center` }}>
              <Word className={`wordLogoHomeGraphic`} gradient={false} arrows gradientSword />
            </div>
            <div className={`pageTransitionProgress`}>
              <span>Loading /</span>
              <span ref={progressRef} className={`pageTransitionProgressValue`} data-progress={`000%`}>
                000%
              </span>
            </div>
          </div>
        ) : null}
      </div>
      {children}
    </TransitionRouter>
  );
}
