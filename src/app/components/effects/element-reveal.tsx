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
  scroll?: boolean;
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
  scroll = false,
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
    let transitionReadyHandler: (() => void) | null = null;

    const run = () => {
      if (cancelled || !ref.current) return;
      const fromVars: gsap.TweenVars = { autoAlpha: 0, scale, x, y, transformOrigin: origin };
      if (blur) fromVars.filter = `blur(2px)`;
      el.classList.add(animatingClass);
      setAnimating(true);
      gsap.set(el, fromVars);
      reveal();
      tween = gsap.to(
        el,
        {
          autoAlpha: 1,
          delay,
          duration,
          ease,
          scale: 1,
          x: 0,
          y: 0,
          onComplete: () => {
            gsap.set(el, { clearProps: `opacity,visibility,filter,scale,x,y,transform,transformOrigin` });
            el.classList.remove(animatingClass);
            setAnimating(false);
          },
        },
      );
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
      tween?.kill();
      if (transitionReadyHandler) window.removeEventListener(pageTransitionReadyEvent, transitionReadyHandler);
      el.classList.remove(animatingClass);
    };
  }, [x, y, blur, delay, scale, scroll, duration, origin, ease]);

  return createElement(as, {
    ...props,
    ref,
    className: [`elementReveal`, className, revealed ? `` : pendingClass, animating ? animatingClass : ``].filter(Boolean).join(` `),
  }, children);
}
