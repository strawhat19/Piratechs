'use client';

import gsap from 'gsap';
import { SplitText } from 'gsap/SplitText';
import { createElement, useLayoutEffect, useRef, type ElementType } from 'react';
import { isPageTransitionPending, pageTransitionReadyEvent } from '@/app/components/effects/page-transition-events';

const pendingClass = `textRevealPending`;

type TextRevealProps = {
  /** The text (or trusted HTML string when `html` is set) to reveal. */
  text: string;
  /** Split into letters instead of the default word-by-word reveal. */
  byLetter?: boolean;
  /** Treat `text` as trusted HTML so inline markup (e.g. styled spans) is preserved. */
  html?: boolean;
  /** Element/tag to render, e.g. `h1`, `p`, `span`. Defaults to `span`. */
  as?: ElementType;
  id?: string;
  className?: string;
  /** Start offset in seconds, handy for sequencing multiple reveals. */
  delay?: number;
  duration?: number;
  stagger?: number;
  slide?: boolean;
  /** Defer the reveal until the element scrolls into view (for below-the-fold content). */
  scroll?: boolean;
  /** Replay the reveal every time the element re-enters the viewport (implies scroll). */
  onScroll?: boolean;
  threshold?: number;
  replayThreshold?: number;
};

export default function TextReveal({
  text,
  stagger,
  duration,
  delay = 0,
  id,
  className,
  as = `span`,
  html = false,
  slide = false,
  scroll = false,
  onScroll = false,
  byLetter = false,
  threshold = 0.12,
  replayThreshold = 0.025,
}: TextRevealProps) {
  const ref = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reveal = () => el.classList.remove(pendingClass);

    if (window.matchMedia(`(prefers-reduced-motion: reduce)`).matches) {
      reveal();
      return;
    }

    gsap.registerPlugin(SplitText);
    el.classList.add(pendingClass);

    let cancelled = false;
    let started = false;
    let inView = false;
    let split: SplitText | null = null;
    let timeline: gsap.core.Timeline | null = null;
    let observer: IntersectionObserver | null = null;
    let transitionReadyHandler: (() => void) | null = null;
    const replayOnEntry = scroll || onScroll;
    const firstThreshold = Math.min(Math.max(threshold, 0), 1);
    const returnThreshold = Math.min(firstThreshold, Math.max(replayThreshold, 0));

    const run = () => {
      if (cancelled || !ref.current) return;

      split = new SplitText(el, {
        aria: `auto`,
        // tag: `span`,
        wordsClass: `textRevealWord`,
        charsClass: `textRevealChar`,
        type: byLetter ? `words,chars` : `words`,
      });
      const targets = byLetter ? split.chars : split.words;
      if (!targets.length) {
        reveal();
        return;
      }

      timeline = gsap.timeline({
        paused: true,
        defaults: { ease: `power3.out` },
        // Revert the split once revealed so we don't leave word/char wrappers (and
        // their will-change layers) on the page now that reveals run on lots of text.
        onStart: () => gsap.set(targets, { willChange: `transform, opacity` }),
        onComplete: () => {
          if (replayOnEntry) {
            gsap.set(targets, { willChange: `auto` });
            return;
          }
          split?.revert();
          split = null;
        },
      });
      const revealOffset = byLetter ? 35 : 25;
      const tweenVars: gsap.TweenVars = {
        delay,
        duration: duration ?? (byLetter ? 0.5 : 0.6),
        stagger: stagger ?? (byLetter ? 0.018 : 0.07),
      };
      if (slide) {
        timeline.from(targets, {
          delay,
          autoAlpha: 0,
          yPercent: 68,
          ease: `power4.out`,
          duration: duration ?? 0.8,
          stagger: stagger ?? 0.035,
        });
      } else {
        timeline.from(targets, {
          ...tweenVars,
          autoAlpha: 0,
          yPercent: revealOffset,
        });
      }

      reveal();
      timeline.play();
    };

    const start = () => {
      if (started) return;
      if (isPageTransitionPending()) {
        if (transitionReadyHandler) return;
        transitionReadyHandler = () => start();
        window.addEventListener(pageTransitionReadyEvent, transitionReadyHandler, { once: true });
        return;
      }
      started = true;
      if (`fonts` in document) {
        document.fonts.ready.then(run);
      } else {
        run();
      }
    };

    const enter = () => {
      if (timeline) timeline.restart();
      else start();
    };

    if (scroll || onScroll) {
      observer = new IntersectionObserver(entries => {
        const entry = entries[0];
        if (!entry) return;
        const requiredThreshold = started ? returnThreshold : firstThreshold;
        const isVisible = entry.isIntersecting && entry.intersectionRatio >= requiredThreshold;
        if (!isVisible) {
          if (started && entry.intersectionRatio <= returnThreshold) {
            inView = false;
            timeline?.pause(0);
          }
          return;
        }
        if (inView) return;
        inView = true;
        if (isPageTransitionPending()) {
          if (transitionReadyHandler) return;
          transitionReadyHandler = () => {
            transitionReadyHandler = null;
            if (cancelled || !ref.current) return;
            const bounds = ref.current.getBoundingClientRect();
            if (bounds.bottom <= 0 || bounds.top >= window.innerHeight) return;
            enter();
          };
          window.addEventListener(pageTransitionReadyEvent, transitionReadyHandler, { once: true });
          return;
        }
        enter();
      }, {
        threshold: [...new Set([0, returnThreshold, firstThreshold])].sort((a, b) => a - b),
        rootMargin: `0px 0px -2%`,
      });
      observer.observe(el);
    } else {
      start();
    }

    return () => {
      cancelled = true;
      observer?.disconnect();
      timeline?.kill();
      split?.revert();
      if (transitionReadyHandler) window.removeEventListener(pageTransitionReadyEvent, transitionReadyHandler);
    };
  }, [text, byLetter, html, slide, delay, duration, stagger, scroll, onScroll, threshold, replayThreshold]);

  return createElement(as, {
    id,
    ref,
    className: `${className ?? ``} ${slide ? `textRevealSlide` : ``} ${pendingClass}`.trim(),
    ...(html ? { dangerouslySetInnerHTML: { __html: text } } : { children: text }),
  });
}
