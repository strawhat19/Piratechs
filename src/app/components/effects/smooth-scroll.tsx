'use client';

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollSmoother } from 'gsap/ScrollSmoother';
import { usePathname } from 'next/navigation';
import { useEffect, type ReactNode } from 'react';
import { useGlobalContext } from '@/shared/global-context';

type SmoothScrollProps = {
  children: ReactNode;
};

export default function SmoothScroll({ children }: SmoothScrollProps) {
  const pathname = usePathname();
  const { smoothScroll } = useGlobalContext();

  useEffect(() => {
    if (!smoothScroll || window.matchMedia(`(prefers-reduced-motion: reduce)`).matches) return;

    gsap.registerPlugin(ScrollTrigger, ScrollSmoother);
    ScrollSmoother.get()?.kill();
    const smoother = ScrollSmoother.create({
      smooth: 2,
      effects: true,
      wrapper: `#smooth-wrapper`,
      content: `#smooth-content`,
    });
    document.documentElement.classList.add(`smoothScrollEnabled`);

    return () => {
      smoother.kill();
      document.documentElement.classList.remove(`smoothScrollEnabled`);
    };
  }, [smoothScroll]);

  useEffect(() => {
    if (!smoothScroll) return;
    const refreshFrame = window.requestAnimationFrame(() => ScrollSmoother.get()?.refresh());
    return () => window.cancelAnimationFrame(refreshFrame);
  }, [pathname, smoothScroll]);

  return smoothScroll ? (
    <div id={`smooth-wrapper`}>
      <div id={`smooth-content`}>
        {children}
      </div>
    </div>
  ) : children;
}
