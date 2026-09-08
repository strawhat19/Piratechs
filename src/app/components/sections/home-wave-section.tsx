'use client';

import Link from 'next/link';
import AuthWidget from '../auth/auth-widget';
import HomeServiceEstimator from './home-service-estimator';
import { useEffect, useId, useRef, useState } from 'react';

// Each crest repeats at x=1440 with matching end tangents for a seamless loop.
const waveCrest = `M0 100 C240 20 480 20 720 100 S1200 180 1440 100 S1920 20 2160 100 S2640 180 2880 100`;
const waveLayers = [`distant`, `middle`, `near`] as const;

export default function HomeWaveSection({
  showPlayPauseButton = false,
  includeServiceEstimator = false,
}: {
  showPlayPauseButton?: boolean;
  includeServiceEstimator?: boolean;
}) {
  const id = useId();
  const sectionRef = useRef<HTMLElement>(null);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    let inView = false;
    const syncPlayback = () => {
      section.dataset.running = String(inView && !document.hidden);
    };
    const observer = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      syncPlayback();
    });

    observer.observe(section);
    document.addEventListener(`visibilitychange`, syncPlayback);
    return () => {
      observer.disconnect();
      document.removeEventListener(`visibilitychange`, syncPlayback);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="waves"
      className="homeWaveSection"
      data-service-estimator={includeServiceEstimator}
      aria-labelledby={`${id}-heading`}
      data-paused={paused}
    >
      <div className="homeWaveTopline">
        <span className="eyebrow">
          We Appreciate You
        </span>
        {showPlayPauseButton && (
          <button
          type="button"
          className="homeWaveToggle"
          aria-label="Pause wave animation"
          aria-pressed={paused}
          onClick={() => setPaused(value => !value)}
        >
            <i className={`fa-solid ${paused ? `fa-play` : `fa-pause`}`} aria-hidden="true" />
            <span>{paused ? `Resume waves` : `Pause waves`}</span>
          </button>
        )}
      </div>

      <div className="homeWaveContent">
        <div className="homeWaveCopy">
          <h2 id={`${id}-heading`}>
            Make waves.<br /><span>Build what’s next.</span>
          </h2>
          <p>Bold design. Purposeful code. A crew ready to take your next idea beyond the horizon.</p>
          <Link href="/contact" className="homeWaveLink">
            Chart your course <i className="fa-solid fa-arrow-up-right-from-square" aria-hidden="true" />
          </Link>
        </div>

        {includeServiceEstimator ? (
          <div className="homeWaveEstimator"><HomeServiceEstimator /></div>
        ) : (
          <div className="homeWaveAuth"><AuthWidget defaultOpen /></div>
        )}
      </div>

      <div className="homeWaveOcean" aria-hidden="true">
        {waveLayers.map(layer => (
          <div key={layer} className={`homeWaveLayer homeWaveLayer--${layer}`}>
            <svg viewBox="0 0 2880 360" preserveAspectRatio="none" focusable="false">
              <defs>
                <linearGradient id={`${id}-${layer}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" className="homeWaveColor" />
                  <stop offset="100%" className="homeWaveDepth" />
                </linearGradient>
              </defs>
              <path d={`${waveCrest} L2880 360 H0 Z`} fill={`url(#${id}-${layer})`} />
              <path d={waveCrest} className="homeWaveCrest" fill="none" vectorEffect="non-scaling-stroke" />
            </svg>
          </div>
        ))}
      </div>

      <div className="homeWaveCoordinates" aria-hidden="true">
        <span>PIRATECHS<span className="homeWaveCoordinatesStudio"> <span>{`//`}</span> STUDIOS</span></span>
        <span>
          <span className="homeWaveCoordinatesFull">DESIGN <span>→</span> DEVELOP <span>→</span> DISTORT</span>
          <span className="homeWaveCoordinatesShort">DSGN <span>→</span> DEV <span>→</span> DISTORT</span>
        </span>
      </div>
    </section>
  );
}
