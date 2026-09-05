'use client';

import gsap from 'gsap';
import type { CSSProperties } from 'react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import HeroCircuitOverlay from './hero-circuit-overlay';
import { useGlobalContext } from '@/shared/global-context';
import { useCallback, useLayoutEffect, useRef } from 'react';

const accentsReadyClass = `heroCircuitAccentsReady`;
const accentsPendingClass = `heroCircuitAccentsPending`;

const defaultGridsStagger = 0.18;
const defaultSignalLinesStagger = 0.2;

export type HeroBgMilestoneHandler = (releaseAccents: () => void) => void;

type HeroBgStyle = CSSProperties & {
  '--gridsStagger': string;
  '--signalLinesStagger': string;
};

type HeroBgProps = {
  gridsStagger?: number;
  signalLinesStagger?: number;
  onGridPlaneRevealStart?: HeroBgMilestoneHandler;
  onCircuitRevealComplete?: HeroBgMilestoneHandler;
  onSignalLineRevealComplete?: () => void;
};

export default function HeroBg({
  gridsStagger = defaultGridsStagger,
  signalLinesStagger = defaultSignalLinesStagger,
  onGridPlaneRevealStart,
  onCircuitRevealComplete,
  onSignalLineRevealComplete,
}: HeroBgProps) {
  const { slantedSignalLines } = useGlobalContext();
  const heroBgStyle: HeroBgStyle = {
    '--gridsStagger': `${gridsStagger}s`,
    '--signalLinesStagger': `${signalLinesStagger}s`,
  };
  
  const heroBgRef = useRef<HTMLDivElement | null>(null);
  const heroBgClipRef = useRef<HTMLDivElement | null>(null);
  const gridPlaneBRef = useRef<HTMLSpanElement | null>(null);
  const signalLineARef = useRef<HTMLSpanElement | null>(null);

  const releaseAccents = useCallback(() => {
    const heroBg = heroBgRef.current;
    if (!heroBg) return;
    const accentsWerePending = heroBg.classList.contains(accentsPendingClass);
    heroBg.classList.remove(accentsPendingClass);
    if (accentsWerePending) heroBg.classList.add(accentsReadyClass);
  }, []);

  const holdAccents = useCallback(() => {
    heroBgRef.current?.classList.add(accentsPendingClass);
    heroBgRef.current?.classList.remove(accentsReadyClass);
  }, []);

  const circuitRevealComplete = useCallback(() => {
    if (onCircuitRevealComplete) {
      onCircuitRevealComplete(releaseAccents);
      return;
    }
    releaseAccents();
  }, [onCircuitRevealComplete, releaseAccents]);

  useLayoutEffect(() => {
    const heroBgClip = heroBgClipRef.current;
    if (!heroBgClip || window.matchMedia(`(prefers-reduced-motion: reduce)`).matches) return;

    gsap.registerPlugin(ScrollTrigger);
    const scrollTween = gsap.to(heroBgClip, {
      scale: 1.18,
      ease: `none`,
      scrollTrigger: {
        scrub: true,
        start: `top top`,
        end: () => window.innerHeight,
        trigger: document.documentElement,
      },
    });

    return () => {
      scrollTween.scrollTrigger?.kill();
      scrollTween.kill();
      gsap.set(heroBgClip, { clearProps: `transform` });
    };
  }, []);

  useLayoutEffect(() => {
    const gridPlaneB = gridPlaneBRef.current;
    const signalLineA = signalLineARef.current;
    if (!gridPlaneB || !signalLineA) return;

    const gridPlaneRevealHandler = (event: AnimationEvent) => {
      if (event.animationName.startsWith(`gridPlaneClipInLeft`)) onGridPlaneRevealStart?.(releaseAccents);
    };
    const signalLineRevealHandler = (event: AnimationEvent) => {
      if (event.animationName.startsWith(`signalLineSlashInLeft`)) onSignalLineRevealComplete?.();
    };

    gridPlaneB.addEventListener(`animationstart`, gridPlaneRevealHandler);
    signalLineA.addEventListener(`animationend`, signalLineRevealHandler);
    return () => {
      gridPlaneB.removeEventListener(`animationstart`, gridPlaneRevealHandler);
      signalLineA.removeEventListener(`animationend`, signalLineRevealHandler);
      heroBgRef.current?.classList.remove(accentsReadyClass, accentsPendingClass);
    };
  }, [onGridPlaneRevealStart, onSignalLineRevealComplete, releaseAccents]);

  return (
    <div ref={heroBgClipRef} className={`heroBgClip`}>
      <div ref={heroBgRef} style={heroBgStyle} className={`heroBg`}>
        <HeroCircuitOverlay onRevealComplete={circuitRevealComplete} onGridPlaneRevealPending={holdAccents} />
        <span className={`gridPlane gridPlaneA`} />
        <span ref={gridPlaneBRef} className={`gridPlane gridPlaneB`} />
        <span ref={signalLineARef} className={`signalLine signalLineA${slantedSignalLines ? ` slanted` : ``}`} />
        <span className={`signalLine signalLineB${slantedSignalLines ? ` slanted` : ``}`} />
      </div>
    </div>
  );
}
