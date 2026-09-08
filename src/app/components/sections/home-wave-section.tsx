'use client';

import Link from 'next/link';
import AuthWidget from '../auth/auth-widget';
import { serviceCards } from './service-estimator-catalog';
import HomeServiceEstimator from './home-service-estimator';
import { useCallback, useEffect, useId, useRef, useState } from 'react';
import { type EstimatorStage, type ServiceEstimatorSelectionProps } from './service-estimator-model';

// Each crest repeats at x=1440 with matching end tangents for a seamless loop.
const waveCrest = `M0 100 C240 20 480 20 720 100 S1200 180 1440 100 S1920 20 2160 100 S2640 180 2880 100`;
const waveLayers = [`distant`, `middle`, `near`] as const;

function WaveServiceSelection({ selectedServices, onToggle, onStart }: ServiceEstimatorSelectionProps) {
  return (
    <div className="homeWaveServices">
      <fieldset className="homeWaveServiceChoices">
        <legend>How can we help?</legend>
        <p>Choose your services, or start with a free consultation.</p>
        <div className="homeWaveServiceButtons">
          {serviceCards.map(service => (
            <button key={service.id} type="button" className="homeWaveServiceButton"
              aria-pressed={selectedServices.includes(service.id)} onClick={() => onToggle(service.id)}>
              <i className={`fa-solid ${service.icon}`} aria-hidden="true" />
              <span>{service.label}</span>
              <i className="fa-solid fa-check homeWaveServiceCheck" aria-hidden="true" />
            </button>
          ))}
        </div>
      </fieldset>
      <button type="button" className="homeWaveStart" onClick={onStart}>
        <i className="fa-solid fa-bolt" aria-hidden="true" />
        <span>Start<span className="homeWaveStartDetail">{selectedServices.length ? `${selectedServices.length} service${selectedServices.length === 1 ? '' : 's'} selected` : 'Let’s chart your course'}</span></span>
        <i className="fa-solid fa-arrow-right" aria-hidden="true" />
      </button>
    </div>
  );
}

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
  const [estimatorActive, setEstimatorActive] = useState(false);
  const estimatorWasActive = useRef(false);
  const onEstimatorStageChange = useCallback((stage: EstimatorStage) => {
    const active = stage !== 'services';
    setEstimatorActive(active);
    if (!active && estimatorWasActive.current) {
      const selected = sectionRef.current?.querySelector<HTMLButtonElement>('.homeWaveServiceButton[aria-pressed="true"]');
      const first = sectionRef.current?.querySelector<HTMLButtonElement>('.homeWaveServiceButton');
      (selected ?? first)?.focus({ preventScroll: true });
    }
    estimatorWasActive.current = active;
  }, []);

  useEffect(() => {
    // Reveal the extra form space on Start; changing form tabs keeps the page still.
    if (estimatorActive) sectionRef.current?.scrollIntoView({ block: 'start', behavior: 'instant' });
  }, [estimatorActive]);

  useEffect(() => {
    const section = sectionRef.current;
    const header = document.querySelector<HTMLElement>('.header');
    if (!section || !header) return;

    const syncHeaderHeight = () => {
      section.style.setProperty('--home-wave-header-height', `${header.offsetHeight}px`);
    };
    syncHeaderHeight();
    const observer = new ResizeObserver(syncHeaderHeight);
    observer.observe(header);
    return () => observer.disconnect();
  }, []);

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

  const copy = (
    <div className="homeWaveCopy" key="copy">
      <h2 id={`${id}-heading`}>
        Make waves.<br /><span>Design what's next.</span>
      </h2>
      {!estimatorActive && (
        <div className="homeWaveIntro">
          <p>Bold design. Purposeful code. A crew ready to take your next idea beyond the horizon.</p>
          <Link href="/contact" className="homeWaveLink">
            Chart your course <i className="fa-solid fa-arrow-up-right-from-square" aria-hidden="true" />
          </Link>
        </div>
      )}
    </div>
  );

  const estimator = (
    <div className="homeWaveEstimator" key="estimator">
      <HomeServiceEstimator 
        onStageChange={onEstimatorStageChange}
        renderServiceSelection={selection => (
          <WaveServiceSelection {...selection} />
        )} 
      />
    </div>
  );

  return (
    <section
      ref={sectionRef}
      id="waves"
      className="homeWaveSection"
      data-service-estimator={includeServiceEstimator}
      data-estimator-active={includeServiceEstimator && estimatorActive}
      aria-labelledby={`${id}-heading`}
      data-paused={paused}
    >
      <div className="homeWaveTopline">
        <span className="eyebrow">
          Our Services
        </span>

        {showPlayPauseButton && (
          <button
          type="button"
          aria-pressed={paused}
          className="homeWaveToggle"
          aria-label="Pause wave animation"
          onClick={() => setPaused(value => !value)}
        >
            <i className={`fa-solid ${paused ? `fa-play` : `fa-pause`}`} aria-hidden="true" />
            <span>{paused ? `Resume waves` : `Pause waves`}</span>
          </button>
        )}
      </div>

      <div className="homeWaveContent">
        {includeServiceEstimator ? (
          // Stable keys keep the plan mounted while its position changes.
          estimatorActive ? [copy, estimator] : [copy, estimator]
        ) : (
          <>{copy}<div className="homeWaveAuth">
            <AuthWidget defaultOpen />
            </div>
          </>
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
