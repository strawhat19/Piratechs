'use client';

import gsap from 'gsap';
import { SplitText } from 'gsap/SplitText';
import { createElement, useLayoutEffect, useRef, type ElementType } from 'react';

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
      timeline.from(targets, {
        delay,
        autoAlpha: 0,
        yPercent: byLetter ? 35 : 25,
        duration: duration ?? (byLetter ? 0.5 : 0.6),
        stagger: stagger ?? (byLetter ? 0.018 : 0.07),
      });

      reveal();
      timeline.play();
    };

    const start = () => {
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
      reveal();
    };
  }, [text, byLetter, html, delay, duration, stagger, scroll]);

  return createElement(as, {
    ref,
    className: `${className ?? ``} ${pendingClass}`.trim(),
    ...(html ? { dangerouslySetInnerHTML: { __html: text } } : { children: text }),
  });
}
