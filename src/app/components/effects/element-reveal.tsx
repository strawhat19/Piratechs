'use client';

import gsap from 'gsap';
import { createElement, useLayoutEffect, useRef, useState, type ElementType, type ReactNode } from 'react';
import { isPageTransitionPending, pageTransitionReadyEvent } from '@/app/components/effects/page-transition-events';

const pendingClass = `elementRevealPending`;
const animatingClass = `elementRevealAnimating`;

type ElementRevealProps = {
  as?: ElementType;
  x?: number;
  y?: number;
  blur?: boolean;
  delay?: number;
  scale?: number;
  slide?: boolean;
  scroll?: boolean;
  /** Replay the reveal every time the element re-enters the viewport (implies scroll). */
  onScroll?: boolean;
  replayKey?: string;
  children: ReactNode;
  className?: string;
  duration?: number;
  origin?: string;
  ease?: string;
  [key: string]: unknown;
};

export default function ElementReveal({
  x = 0,
  y = 5,
  children,
  scale = 1,
  className,
  delay = 0.1,
  as = `span`,
  blur = false,
  slide = false,
  scroll = false,
  onScroll = false,
  replayKey,
  duration = 0.48,
  origin = `center`,
  ease = `power3.out`,
  ...props
}: ElementRevealProps) {
  const ref = useRef<HTMLElement>(null);
  const [revealed, setRevealed] = useState(false);
  const [animating, setAnimating] = useState(false);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reveal = (updateState = true) => {
      el.classList.remove(pendingClass);
      if (updateState) setRevealed(true);
    };

    if (window.matchMedia(`(prefers-reduced-motion: reduce)`).matches) {
      reveal();
      return;
    }

    let tween: gsap.core.Tween | null = null;
    let observer: IntersectionObserver | null = null;
    let cancelled = false;
    let started = false;
    let transitionReadyHandler: (() => void) | null = null;

    // The hidden "from" state, shared so onScroll can reset the element to it
    // when it leaves the viewport and animate from it again on the way back.
    const fromVarsFor = () => {
      const fromVars: gsap.TweenVars = { scale, x, y, transformOrigin: origin };
      if (slide) {
        fromVars.clipPath = `inset(100% 0% 0% 0%)`;
        fromVars.webkitClipPath = `inset(100% 0% 0% 0%)`;
      } else {
        fromVars.autoAlpha = 0;
      }
      if (blur) fromVars.filter = `blur(2px)`;
      return fromVars;
    };

    const run = () => {
      if (cancelled || !ref.current) return;
      started = true;
      tween?.kill();
      const fromVars = fromVarsFor();
      const toVars: gsap.TweenVars = {
        delay,
        duration,
        ease,
        scale: 1,
        x: 0,
        y: 0,
        onComplete: () => {
          gsap.set(el, { clearProps: `opacity,visibility,filter,scale,x,y,transform,transformOrigin,clipPath,webkitClipPath` });
          el.classList.remove(animatingClass);
          setAnimating(false);
        },
      };
      if (slide) {
        toVars.clipPath = `inset(0% 0% 0% 0%)`;
        toVars.webkitClipPath = `inset(0% 0% 0% 0%)`;
      } else {
        toVars.autoAlpha = 1;
      }
      el.classList.add(animatingClass);
      setAnimating(true);
      gsap.set(el, fromVars);
      reveal();
      tween = gsap.to(el, toVars);
    };

    // Reset to the hidden state when an onScroll element leaves the viewport so
    // the reveal can play again the next time it scrolls back into view.
    const hide = () => {
      tween?.kill();
      el.classList.remove(animatingClass);
      setAnimating(false);
      gsap.set(el, fromVarsFor());
    };

    const start = () => {
      if (isPageTransitionPending()) {
        if (transitionReadyHandler) return;
        transitionReadyHandler = () => start();
        window.addEventListener(pageTransitionReadyEvent, transitionReadyHandler, { once: true });
        return;
      }
      run();
    };

    // Enter the viewport: animate in on the first entry, and (with onScroll)
    // replay on every subsequent entry. Without onScroll the observer is a
    // one-shot, so it disconnects once the reveal has fired.
    const enter = () => {
      if (onScroll) {
        if (started) run();
        else start();
        return;
      }
      observer?.disconnect();
      observer = null;
      start();
    };

    if (scroll || onScroll) {
      observer = new IntersectionObserver(entries => {
        if (!entries.some(entry => entry.isIntersecting)) {
          if (onScroll && started) hide();
          return;
        }
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
      }, { threshold: 0.05, rootMargin: `0px 0px -2%` });
      observer.observe(el);
    } else {
      start();
    }

    return () => {
      cancelled = true;
      observer?.disconnect();
      tween?.kill();
      if (transitionReadyHandler) window.removeEventListener(pageTransitionReadyEvent, transitionReadyHandler);
      el.classList.remove(animatingClass);
    };
  }, [x, y, blur, slide, delay, scale, scroll, onScroll, replayKey, duration, origin, ease]);

  return createElement(as, {
    ...props,
    ref,
    className: [`elementReveal`, slide ? `elementRevealSlide` : ``, className, revealed ? `` : pendingClass, animating ? animatingClass : ``].filter(Boolean).join(` `),
  }, children);
}
