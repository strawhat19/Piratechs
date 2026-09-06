'use client';

import { useEffect } from 'react';
import {
  isPageTransitionPending,
  pageTransitionReadyEvent,
} from '@/app/components/effects/page-transition-events';

const landingSelector = `[data-piratechs-landing]`;
const revealSelector = `[data-landing-reveal]`;

export default function LandingReveal() {
  useEffect(() => {
    const landing = document.querySelector<HTMLElement>(landingSelector);
    if (!landing) return;

    const reducedMotion = window.matchMedia(`(prefers-reduced-motion: reduce)`).matches;
    const revealedElements = new WeakSet<HTMLElement>();
    const visibleElements = new WeakSet<HTMLElement>();
    let observer: IntersectionObserver | null = null;
    let frame = 0;

    const reveal = (element: HTMLElement) => {
      element.dataset.landingVisible = `true`;
      revealedElements.add(element);
      visibleElements.add(element);
    };

    const start = () => {
      frame = window.requestAnimationFrame(() => {
        landing.classList.remove(`landingMotionPending`);
        landing.classList.add(`landingMotionReady`);

        const revealItems = landing.querySelectorAll<HTMLElement>(revealSelector);
        if (reducedMotion) {
          revealItems.forEach(reveal);
          return;
        }

        observer = new IntersectionObserver(entries => {
          entries.forEach(entry => {
            const element = entry.target as HTMLElement;
            const threshold = revealedElements.has(element) ? 0.025 : 0.08;
            const isVisible = entry.isIntersecting && entry.intersectionRatio >= threshold;
            if (isVisible && !visibleElements.has(element)) {
              reveal(element);
              return;
            }
            if (!isVisible && revealedElements.has(element) && entry.intersectionRatio <= 0.025) {
              visibleElements.delete(element);
              delete element.dataset.landingVisible;
            }
          });
        }, { threshold: [0, 0.025, 0.08], rootMargin: `0px 0px -5%` });

        revealItems.forEach(element => {
          if (element.dataset.landingHero == `true`) {
            reveal(element);
            return;
          }
          observer?.observe(element);
        });
      });
    };

    if (reducedMotion || !isPageTransitionPending()) {
      start();
    } else {
      window.addEventListener(pageTransitionReadyEvent, start, { once: true });
    }

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener(pageTransitionReadyEvent, start);
      observer?.disconnect();
    };
  }, []);

  return null;
}
