'use client';

import gsap from 'gsap';
import type { ReactNode } from 'react';
import { useLayoutEffect, useRef } from 'react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { scrollToElement } from '@/shared/common/scripts/globals';

type HeroContentProps = {
  end: ReactNode;
  start: ReactNode;
};

export default function HeroContent({ end, start }: HeroContentProps) {
  const heroStartRef = useRef<HTMLDivElement | null>(null);
  const heroEndWrapperRef = useRef<HTMLDivElement | null>(null);

  useLayoutEffect(() => {
    const heroStart = heroStartRef.current;
    const heroEndWrapper = heroEndWrapperRef.current;

    if (!heroStart || !heroEndWrapper || window.matchMedia(`(prefers-reduced-motion: reduce)`).matches) return;

    gsap.registerPlugin(ScrollTrigger);
    const scrollTimeline = gsap.timeline({
      scrollTrigger: {
        scrub: true,
        start: `top top`,
        end: () => window.innerHeight,
        trigger: document.documentElement,
      },
    });

    scrollTimeline
      .to(heroEndWrapper, {
        y: 250,
        scale: 1.18,
        ease: `none`,
        xPercent: -35,
        duration: 0.25,
      })
      .addLabel(`heroContentHandoff`)
      .to(heroEndWrapper, {
        duration: 0.4,
        ease: `none`,
        xPercent: -85,
        scale: 1.18,
        transformOrigin: `bottom`,
      }, `heroContentHandoff`)
      .to(heroStart, {
        scale: 1.18,
        duration: 0.4,
        ease: `none`,
        yPercent: -100,
      }, `heroContentHandoff`);

    return () => {
      scrollTimeline.scrollTrigger?.kill();
      scrollTimeline.kill();
      gsap.set([heroStart, heroEndWrapper], { clearProps: `transform,opacity` });
    };
  }, []);

  return (
    <div className={`heroContent sectionInner heroGrid`}>
      <div ref={heroStartRef} className={`heroStart heroCopy`}>
        {start}
      </div>
      <div ref={heroEndWrapperRef} onClick={scrollToElement} className={`heroEndWrapper cursorPointer`}>
        {end}
      </div>
    </div>
  );
}
