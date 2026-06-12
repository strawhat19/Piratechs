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
  className?: string;
  /** Start offset in seconds, handy for sequencing multiple reveals. */
  delay?: number;
  duration?: number;
  stagger?: number;
  slide?: boolean;
  /** Defer the reveal until the element scrolls into view (for below-the-fold content). */
  scroll?: boolean;
};

export default function TextReveal({
  text,
  stagger,
  duration,
  delay = 0,
  className,
  as = `span`,
  html = false,
  slide = false,
  scroll = false,
  byLetter = false,
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
    let split: SplitText | null = null;
    let timeline: gsap.core.Timeline | null = null;
    let observer: IntersectionObserver | null = null;
    let transitionReadyHandler: (() => void) | null = null;

    const run = () => {
      if (cancelled || !ref.current) return;

      split = new SplitText(el, {
        aria: `auto`,
        // tag: `span`,
        wordsClass: `textRevealWord`,
        charsClass: `textRevealChar`,
        type: byLetter ? `chars` : `words`,
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
        onComplete: () => {
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
        timeline.fromTo(targets, {
          yPercent: revealOffset,
          clipPath: `inset(100% 0% 0% 0%)`,
          webkitClipPath: `inset(100% 0% 0% 0%)`,
        }, {
          ...tweenVars,
          yPercent: 0,
          clipPath: `inset(0% 0% 0% 0%)`,
          webkitClipPath: `inset(0% 0% 0% 0%)`,
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
      if (isPageTransitionPending()) {
        if (transitionReadyHandler) return;
        transitionReadyHandler = () => start();
        window.addEventListener(pageTransitionReadyEvent, transitionReadyHandler, { once: true });
        return;
      }
      if (`fonts` in document) {
        document.fonts.ready.then(run);
      } else {
        run();
      }
    };

    // Above-the-fold text plays immediately; below-the-fold text waits until it
    // scrolls into view so the reveal isn't already over by the time it's seen.
    if (scroll) {
      observer = new IntersectionObserver(entries => {
        if (entries.some(entry => entry.isIntersecting)) {
          if (isPageTransitionPending()) {
            if (transitionReadyHandler) return;
            transitionReadyHandler = () => {
              transitionReadyHandler = null;
              if (cancelled || !ref.current) return;
              const bounds = ref.current.getBoundingClientRect();
              if (bounds.bottom <= 0 || bounds.top >= window.innerHeight) return;
              observer?.disconnect();
              observer = null;
              start();
            };
            window.addEventListener(pageTransitionReadyEvent, transitionReadyHandler, { once: true });
            return;
          }
          observer?.disconnect();
          observer = null;
          start();
        }
      }, { threshold: 0.05, rootMargin: `0px 0px -2%` });
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
  }, [text, byLetter, html, slide, delay, duration, stagger, scroll]);

  return createElement(as, {
    ref,
    className: `${className ?? ``} ${slide ? `textRevealSlide` : ``} ${pendingClass}`.trim(),
    ...(html ? { dangerouslySetInnerHTML: { __html: text } } : { children: text }),
  });
}
