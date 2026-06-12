'use client';

import { useEffect } from 'react';
import { isPageTransitionPending, pageTransitionReadyEvent } from '@/app/components/effects/page-transition-events';

export default function ScrollReveal() {
  useEffect(() => {
    const revealSelector = `.reveal`;
    const observedAttr = `data-reveal-observed`;
    const visibleAttr = `data-reveal-visible`;
    const reducedMotion = window.matchMedia(`(prefers-reduced-motion: reduce)`).matches;
    
    let started = false;
    let mutationObserver: MutationObserver | null = null;
    const pendingRevealItems = new Set<HTMLElement>();

    const revealItem = (item: HTMLElement) => {
      if (item.dataset.revealVisible == `true`) return;
      item.dataset.revealVisible = `true`;
      item.classList.add(`isVisible`);
      observer.unobserve(item);
    };

    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        const item = entry.target as HTMLElement;
        if (!entry.isIntersecting) {
          pendingRevealItems.delete(item);
          return;
        }
        if (isPageTransitionPending()) {
          pendingRevealItems.add(item);
          return;
        }
        revealItem(item);
      });
    }, { threshold: 0.01, rootMargin: `0px 0px 0%` });

    const revealPendingItems = () => {
      pendingRevealItems.forEach(item => {
        const bounds = item.getBoundingClientRect();
        if (bounds.bottom > 0 && bounds.top < window.innerHeight) revealItem(item);
      });
      pendingRevealItems.clear();
    };

    const observeRevealItems = () => {
      document.querySelectorAll<HTMLElement>(`${revealSelector}:not([${observedAttr}])`).forEach((item, index) => {
        item.style.setProperty(`--reveal-delay`, `${Math.min(index % 5, 4) * 32}ms`);
        item.setAttribute(observedAttr, `true`);
        item.removeAttribute(visibleAttr);
        if (reducedMotion) {
          revealItem(item);
          return;
        }
        observer.observe(item);
      });
    };

    const startRevealObserver = () => {
      if (started) return;
      started = true;
      observeRevealItems();
      document.body.classList.add(`revealReady`);
      mutationObserver = new MutationObserver(observeRevealItems);
      mutationObserver.observe(document.body, { childList: true, subtree: true });
    };

    if (reducedMotion || !isPageTransitionPending()) {
      startRevealObserver();
    } else {
      window.addEventListener(pageTransitionReadyEvent, startRevealObserver, { once: true });
    }
    window.addEventListener(pageTransitionReadyEvent, revealPendingItems);

    return () => {
      window.removeEventListener(pageTransitionReadyEvent, startRevealObserver);
      window.removeEventListener(pageTransitionReadyEvent, revealPendingItems);
      observer.disconnect();
      mutationObserver?.disconnect();
    };
  }, []);

  return null;
}
