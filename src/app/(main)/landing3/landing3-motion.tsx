'use client';

import gsap from 'gsap';
import { SplitText } from 'gsap/SplitText';
import { useLayoutEffect, useRef } from 'react';
import styles from './landing3-motion.module.scss';
import { isPageTransitionPending, pageTransitionReadyEvent } from '@/app/components/effects/page-transition-events';

const revealSelector = `[data-l3-reveal], [data-l3-split], [data-l3-image]`;

type RunningReveal = {
  split: SplitText | null;
  context: gsap.Context;
};

const Landing3Motion = () => {
  const markerRef = useRef<HTMLSpanElement>(null);

  useLayoutEffect(() => {
    const landing = markerRef.current?.closest<HTMLElement>(`[data-landing3]`);
    const preference = window.matchMedia?.(`(prefers-reduced-motion: reduce)`);
    if (!landing || preference?.matches || typeof IntersectionObserver == `undefined`) return;

    let started = false;
    let disposed = false;
    let observer: IntersectionObserver | null = null;
    const running = new Map<HTMLElement, RunningReveal>();
    const elements = [...landing.querySelectorAll<HTMLElement>(revealSelector)];
    const pending = new Set(elements);
    if (!elements.length) return;
    gsap.registerPlugin(SplitText);

    const releaseListeners = () => {
      landing.removeEventListener(`focusin`, onFocus);
      preference?.removeEventListener?.(`change`, onPreferenceChange);
      window.removeEventListener(pageTransitionReadyEvent, start);
    };

    const finish = (element: HTMLElement) => {
      element.dataset.l3State = `done`;
      pending.delete(element);
      observer?.unobserve(element);
      const animation = running.get(element);
      running.delete(element);
      animation?.context.revert();
      animation?.split?.revert();
      if (!pending.size) observer?.disconnect();
      if (!pending.size && !running.size) releaseListeners();
    };

    const reveal = (element: HTMLElement) => {
      if (!pending.has(element) || disposed) return;
      const delay = Math.min(Math.max(Number(element.dataset.l3Delay) || 0, 0), 1200) / 1000;
      const animation: RunningReveal = { split: null, context: gsap.context(() => {}, landing) };
      running.set(element, animation);
      pending.delete(element);
      observer?.unobserve(element);

      try {
        animation.context.add(() => {
          if (element.hasAttribute(`data-l3-split`)) {
            const byCharacter = element.tagName == `H1`;
            const lines = element.querySelectorAll<HTMLElement>(`[data-l3-line]`);
            animation.split = new SplitText(lines.length ? lines : element, {
              tag: `span`,
              aria: `none`,
              mask: `words`,
              wordsClass: styles.word,
              type: byCharacter ? `words,chars` : `words`,
            });
            animation.split.words.forEach(word => word.setAttribute(`data-l3-word`, ``));
            animation.split.masks.forEach(mask => mask.classList.add(styles.wordMask));
            const targets = byCharacter ? animation.split.chars : animation.split.words;
            gsap.fromTo(targets, {
              opacity: 0,
              yPercent: byCharacter ? 115 : 110,
              rotation: byCharacter ? -4 : 0,
              transformOrigin: `0% 100%`,
            }, {
              delay,
              opacity: 1,
              rotation: 0,
              yPercent: 0,
              force3D: false,
              ease: `power3.out`,
              duration: byCharacter ? 0.9 : 0.8,
              stagger: byCharacter ? 0.035 : 0.065,
              onComplete: () => finish(element),
            });
          } else {
            const isImage = element.hasAttribute(`data-l3-image`);
            const hasInteractiveContent = element.matches(`a, button, summary`) || !!element.querySelector(`a, button, summary`);
            const movementDistance = isImage ? 46 : hasInteractiveContent ? 0 : 32;
            gsap.fromTo(element, {
              opacity: 0,
              y: movementDistance,
              ...(isImage ? { clipPath: `inset(0 0 100% 0)` } : {}),
            }, {
              delay,
              y: 0,
              opacity: 1,
              force3D: false,
              ease: `power3.out`,
              duration: isImage ? 1.1 : 0.8,
              onComplete: () => finish(element),
              ...(isImage ? { clipPath: `inset(0 0 0% 0)` } : {}),
            });
          }
          element.dataset.l3State = `running`;
        });
      } catch {
        finish(element);
      }
      if (!pending.size) observer?.disconnect();
    };

    const showFocusedContent = (target: Element) => {
      target.querySelectorAll<HTMLElement>(revealSelector).forEach(finish);
      let element = target.closest<HTMLElement>(revealSelector);
      while (element && landing.contains(element)) {
        finish(element);
        element = element.parentElement?.closest<HTMLElement>(revealSelector) ?? null;
      }
    };

    const onFocus = (event: FocusEvent) => {
      if (event.target instanceof Element) showFocusedContent(event.target);
    };

    const onPreferenceChange = () => {
      if (!preference?.matches) return;
      observer?.disconnect();
      elements.forEach(finish);
      landing.classList.remove(styles.motion);
      releaseListeners();
    };

    const start = () => {
      if (started || disposed || preference?.matches) return;
      started = true;
      window.removeEventListener(pageTransitionReadyEvent, start);
      observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) reveal(entry.target as HTMLElement);
        });
      }, { threshold: 0.01, rootMargin: `0px 0px -12% 0px` });
      const focused = document.activeElement;
      if (focused && landing.contains(focused)) showFocusedContent(focused);
      pending.forEach(element => observer?.observe(element));
    };

    elements.forEach(element => { element.dataset.l3State = `pending`; });
    landing.classList.add(styles.motion);
    landing.addEventListener(`focusin`, onFocus);
    preference?.addEventListener?.(`change`, onPreferenceChange);
    if (isPageTransitionPending()) window.addEventListener(pageTransitionReadyEvent, start, { once: true });
    else start();

    return () => {
      disposed = true;
      observer?.disconnect();
      releaseListeners();
      elements.forEach(finish);
      landing.classList.remove(styles.motion);
      elements.forEach(element => { delete element.dataset.l3State; });
    };
  }, []);

  return <span hidden aria-hidden ref={markerRef} />;
};

export default Landing3Motion;
