'use client';

import gsap from 'gsap';
import { TransitionRouter } from 'next-transition-router';
import { useGlobalContext } from '@/shared/global-context';
import { getBrowserOS, getDeviceDetails } from '@/shared/common/scripts/globals';
import { useEffect, useLayoutEffect, useRef, type CSSProperties } from 'react';

const rows = 4;
const cols = 20;

const blockCount = rows * cols;
const gifResetClass = `pageTransitionGifReset`;
const rowIndexes = Array.from({ length: rows }, (_, index) => index);

const getReducedMotion = () => (
  typeof window != `undefined` && window.matchMedia(`(prefers-reduced-motion: reduce)`).matches
);

const useIsomorphicLayoutEffect = typeof window != `undefined` ? useLayoutEffect : useEffect;

export default function PageTransition({ 
  children,
  duration = 0.19, 
}: any) {
  const gridRef = useRef<HTMLDivElement>(null);
  const blocksRef = useRef<HTMLDivElement[]>([]);

  const { width, isPWA } = useGlobalContext();

  const getRowBlocks = (row: number) => blocksRef.current.slice(row * cols, row * cols + cols);

  const getInitialBlockStyle = (index: number): CSSProperties => {
    const row = Math.floor(index / cols);
    const col = index % cols;
    return {
      transform: `scaleX(1)`,
      top: `${(row * 100) / rows}dvh`,
      left: `${(col * 100) / cols}vw`,
      width: `calc(${100 / cols}vw + 1px)`,
      height: `calc(${100 / rows}dvh + 1px)`,
      transformOrigin: row % 2 == 0 ? `left center` : `right center`,
    };
  };

  const restartGifAnimation = () => {
    const grid = gridRef.current;
    if (!grid) return;
    grid.classList.add(gifResetClass);
    void grid.offsetWidth;
    grid.classList.remove(gifResetClass);
  };

  const createShutterBlindsGrid = () => {
    const grid = gridRef.current;
    if (!grid) return;
    const blockWidth = window.innerWidth / cols;
    const blockHeight = window.innerHeight / rows;
    blocksRef.current.forEach((block, index) => {
      const row = Math.floor(index / cols);
      const col = index % cols;
      gsap.set(block, {
        scaleX: 0,
        width: blockWidth + 1,
        top: row * blockHeight,
        left: col * blockWidth,
        height: blockHeight + 1,
        transformOrigin: row % 2 == 0 ? `left center` : `right center`,
      });
    });
  };

  const animateIn = (onComplete: () => void) => {
    if (getReducedMotion()) {
      onComplete();
      return gsap.timeline();
    }
    const grid = gridRef.current;
    const timeline = gsap.timeline({ onComplete });
    gsap.killTweensOf(blocksRef.current);
    gsap.set(grid, { autoAlpha: 1, pointerEvents: `auto` });
    restartGifAnimation();
    createShutterBlindsGrid();
    rowIndexes.forEach(row => {
      const blocks = getRowBlocks(row);
      timeline.to(blocks, {
        duration,
        scaleX: 1,
        ease: `power3.inOut`,
        stagger: {
          each: 0.012,
          from: row % 2 == 0 ? `start` : `end`,
        },
      }, row == 0 ? 0 : `<`);
    });
    return timeline;
  };

  const animateOut = (onComplete: () => void) => {
    if (getReducedMotion()) {
      onComplete();
      return gsap.timeline();
    }
    const grid = gridRef.current;
    const timeline = gsap.timeline({
      onComplete: () => {
        gsap.set(grid, { autoAlpha: 0, pointerEvents: `none` });
        onComplete();
      },
    });
    gsap.killTweensOf(blocksRef.current);
    gsap.set(grid, { autoAlpha: 1, pointerEvents: `auto` });
    rowIndexes.forEach(row => {
      const blocks = getRowBlocks(row);
      timeline.to(blocks, {
        duration,
        scaleX: 0,
        ease: `power3.inOut`,
        stagger: {
          each: 0.012,
          from: row % 2 == 0 ? `end` : `start`,
        },
      }, row == 0 ? 0.05 : `<`);
    });
    return timeline;
  };

  useIsomorphicLayoutEffect(() => {
    createShutterBlindsGrid();
    window.addEventListener(`resize`, createShutterBlindsGrid);
    if (getReducedMotion()) {
      gsap.set(gridRef.current, { autoAlpha: 0, pointerEvents: `none`, background: `none` });
      return () => window.removeEventListener(`resize`, createShutterBlindsGrid);
    }
    gsap.set(blocksRef.current, { scaleX: 1 });
    gsap.set(gridRef.current, { background: `none` });
    const timeline = animateOut(() => {});
    return () => {
      timeline.kill();
      window.removeEventListener(`resize`, createShutterBlindsGrid);
    };
  }, []);

  return (
    <TransitionRouter
      auto
      leave={next => {
        const timeline = animateIn(next);
        return () => timeline.kill();
      }}
      enter={next => {
        const timeline = animateOut(next);
        return () => timeline.kill();
      }}
    >
      <div ref={gridRef} className={`pageTransitionShutter shutterBlindsEffect 
        ${isPWA ? `pwa` : `nonPWA`} 
        ${getDeviceDetails()?.ios ? `ios` : `noIos`} 
        ${(width <= 768 || getDeviceDetails()?.mobile) ? `mobile` : ``}
      `} aria-hidden={`true`}>
        {Array.from({ length: blockCount }).map((_, index) => (
          <div
            key={index}
            style={getInitialBlockStyle(index)}
            className={`pageTransitionBlock shutterBlindBlock`}
            ref={block => {
              if (block) blocksRef.current[index] = block;
            }}
          />
        ))}
      </div>
      {children}
    </TransitionRouter>
  );
}
