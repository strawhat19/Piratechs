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
    const heroSection = heroEndWrapper?.closest<HTMLElement>(`.heroSection`);

    if (!heroStart || !heroSection || !heroEndWrapper) return;

    gsap.registerPlugin(ScrollTrigger);
    const media = gsap.matchMedia();

    media.add(`(min-width: 1371px) and (prefers-reduced-motion: no-preference)`, () => {
      const diagonalX = () => -Math.min(160, window.innerWidth * 0.1);
      const diagonalY = () => Math.min(250, window.innerHeight * 0.28);
      const horizontalX = () => -Math.min(500, window.innerWidth * 0.3);
      const scrollTimeline = gsap.timeline({
        scrollTrigger: {
          scrub: 0.65,
          start: `top top`,
          end: `bottom top`,
          trigger: heroSection,
          invalidateOnRefresh: true,
        },
      });

      scrollTimeline
        .to(heroEndWrapper, {
          x: diagonalX,
          y: diagonalY,
          scale: 1.1,
          ease: `none`,
          force3D: true,
          duration: 0.35,
          transformOrigin: `center bottom`,
        })
        .addLabel(`heroContentHandoff`)
        .to(heroEndWrapper, {
          x: horizontalX,
          scale: 1.18,
          ease: `none`,
          force3D: true,
          duration: 0.65,
        }, `heroContentHandoff`)
        .to(heroStart, {
          scale: 1.18,
          ease: `none`,
          force3D: true,
          duration: 0.65,
          yPercent: -100,
          filter: `blur(10px)`,
        }, `heroContentHandoff`);

      return () => {
        scrollTimeline.scrollTrigger?.kill();
        scrollTimeline.kill();
      };
    });

    return () => {
      media.revert();
      gsap.set([heroStart, heroEndWrapper], { clearProps: `transform,filter,willChange` });
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
