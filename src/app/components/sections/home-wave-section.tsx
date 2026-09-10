'use client';

import Link from 'next/link';
import type { Ref } from 'react';
import ServicePrice from './service-price';
import AuthWidget from '../auth/auth-widget';
import ElementReveal from '../effects/element-reveal';
import { serviceCards } from './service-estimator-catalog';
import HomeServiceEstimator from './home-service-estimator';
import { useCallback, useEffect, useId, useRef, useState } from 'react';
import { type EstimatorStage, type ServiceEstimatorSelectionProps } from './service-estimator-model';

// Each crest repeats at x=1440 with matching end tangents for a seamless loop.
const waveCrest = `M0 100 C240 20 480 20 720 100 S1200 180 1440 100 S1920 20 2160 100 S2640 180 2880 100`;
const waveLayers = [`distant`, `middle`, `near`] as const;

function WaveServiceSelection({ selectedServices, onToggle, onStart, startButtonRef, instructions = false }: ServiceEstimatorSelectionProps & { instructions?: boolean; startButtonRef: Ref<HTMLButtonElement> }) {
  return (
    <div className="homeWaveServices">
      <fieldset className="homeWaveServiceChoices">
        <legend><i className={`fa-solid fa-circle-question gradientTextColor`} aria-hidden={`true`} /> How can we help?</legend>
        {instructions && <p>Choose your services, or start with a free consultation.</p>}
        <div className="homeWaveServiceButtons">
          {serviceCards.map(service => (
            <button key={service.id} type="button" className="homeWaveServiceButton" aria-pressed={selectedServices.includes(service.id)} onClick={() => onToggle(service.id)}>
              <div className={`homeWaveServiceTop`}>
                {service.icon == `piratechs-drone` ? (
                  <i className={`piratechsDroneIcon`} aria-hidden={`true`} />
                ) : (
                  <i className={`fa-solid gradientTextColor ${service.icon}`} aria-hidden={`true`} />
                )}
                <span className="homeWaveServiceIconLabel">
                  <i><span className={`smallText`}>From</span> <strong><ServicePrice amount={service.price} /></strong></i>
                </span>
              </div>
              <span>{service.label}</span>
              <i className="fa-solid fa-check homeWaveServiceCheck gradientTextColor" aria-hidden="true" />
            </button>
          ))}
        </div>
      </fieldset>
      <button type="button" ref={startButtonRef} className="homeWaveStart" data-ready={selectedServices.length > 0} onClick={onStart}>
        <i className={`piratechsSailIcon`} aria-hidden={`true`} />
        <span>
          Start
          <span className="homeWaveStartDetail">
            {selectedServices.length ? `Ready · ${selectedServices.length} service${selectedServices.length === 1 ? `` : `s`}` : `Set Sail`}
          </span>
        </span>
        <i className={`fa-solid fa-chevron-right gradientTextColor`} aria-hidden={`true`} />
      </button>
    </div>
  );
}

export default function HomeWaveSection({
  stretchForm = false,
  instructions = false,
  showPlayPauseButton = false,
  includeServiceEstimator = false,
}: {
  stretchForm?: boolean;
  instructions?: boolean;
  showPlayPauseButton?: boolean;
  includeServiceEstimator?: boolean;
}) {
  const id = useId();
  const sectionRef = useRef<HTMLElement>(null);
  const startButtonRef = useRef<HTMLButtonElement>(null);
  const [paused, setPaused] = useState(false);
  const [estimatorActive, setEstimatorActive] = useState(false);
  const expandedEstimator = stretchForm && estimatorActive;
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
    // Align the estimator on Start; changing its tabs keeps the page still.
    if (estimatorActive && stretchForm) sectionRef.current?.scrollIntoView({ block: `start`, behavior: `instant` });
  }, [estimatorActive, stretchForm]);

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
    <ElementReveal onScroll as={`div`} y={18} duration={0.64} className={`homeWaveCopy`} key={`copy`}>
      <h2 id={`${id}-heading`}>
        Make waves.<br /><span>Design what’s next.</span>
      </h2>
      {!expandedEstimator && (
        <div className="homeWaveIntro">
          <p>Bold design. Purposeful code. A crew ready to take your next idea beyond the horizon.</p>
          {includeServiceEstimator ? (
            <button type={`button`} className={`homeWaveLink fillButton`} onClick={() => {
              if (startButtonRef.current) startButtonRef.current.click();
              else sectionRef.current?.querySelector<HTMLElement>(`.servicesWidgetStageHeading h3`)?.focus({ preventScroll: true });
            }}>
              <i className={`fa-solid fa-compass gradientTextColor`} aria-hidden={`true`} /> 
              <span className={`chartYourCourse`}>
                CHART YOUR COURSE
              </span>
            </button>
          ) : (
            <Link href={`/contact`} className={`homeWaveLink fillButton`}>
              <i className={`fa-solid fa-compass gradientTextColor`} aria-hidden={`true`} /> 
              <span className={`chartYourCourse`}>
                CHART YOUR COURSE
              </span>
            </Link>
          )}
        </div>
      )}
    </ElementReveal>
  );

  const estimator = (
    <div className="homeWaveEstimator" key="estimator">
      <HomeServiceEstimator 
        instructions={instructions}
        onStageChange={onEstimatorStageChange}
        renderServiceSelection={selection => (
          <WaveServiceSelection {...selection} instructions={instructions} startButtonRef={startButtonRef} onStart={() => {
            const section = sectionRef.current;
            if (section) {
              const sectionBounds = section.getBoundingClientRect();
              const estimatorBounds = section.querySelector(`.homeWaveEstimator`)?.getBoundingClientRect();
              section.style.setProperty(`--home-wave-resting-height`, `${sectionBounds.height}px`);
              if (estimatorBounds) {
                const formHeight = Math.max(estimatorBounds.height, sectionBounds.bottom - estimatorBounds.top - 48);
                section.style.setProperty(`--home-wave-form-height`, `${formHeight}px`);
                section.style.setProperty(`--home-wave-selection-height`, `${estimatorBounds.height}px`);
              }
            }
            setEstimatorActive(true);
            selection.onStart();
          }} />
        )} 
      />
    </div>
  );

  return (
    <section
      ref={sectionRef}
      id="waves"
      className="homeWaveSection"
      data-stretch-form={stretchForm}
      data-service-estimator={includeServiceEstimator}
      data-estimator-active={includeServiceEstimator && estimatorActive}
      aria-labelledby={`${id}-heading`}
      data-paused={paused}
    >
      {!expandedEstimator && <ElementReveal onScroll as={`div`} y={12} className={`homeWaveTopline`}>
        <span className={`eyebrow`}>
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
            <i className={`fa-solid gradientTextColor ${paused ? `fa-play` : `fa-pause`}`} aria-hidden="true" />
            <span>{paused ? `Resume waves` : `Pause waves`}</span>
          </button>
        )}
      </ElementReveal>}

      <div className="homeWaveContent">
        {includeServiceEstimator ? (
          [copy, estimator]
        ) : (
          <>{copy}<div className="homeWaveAuth">
            <AuthWidget defaultOpen />
            </div>
          </>
        )}
      </div>

      <ElementReveal onScroll as={`div`} y={28} delay={0.12} duration={0.76} className={`homeWaveOcean`} aria-hidden={`true`}>
        {waveLayers.map(layer => (
          <div key={layer} className={`homeWaveLayer homeWaveLayer--${layer}`}>
            <svg viewBox={`0 0 2880 360`} preserveAspectRatio={`none`} focusable={`false`}>
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
      </ElementReveal>

      {!expandedEstimator && <ElementReveal onScroll as={`div`} y={10} delay={0.18} className={`homeWaveCoordinates`} aria-hidden={`true`}>
        <span>PIRATECHS<span className="homeWaveCoordinatesStudio"> <span>{`//`}</span> STUDIOS</span></span>
        <span>
          <span className="homeWaveCoordinatesFull">DESIGN <span>→</span> DEVELOP <span>→</span> DISTORT</span>
          <span className="homeWaveCoordinatesShort">DSGN <span>→</span> DEV <span>→</span> DISTORT</span>
        </span>
      </ElementReveal>}
    </section>
  );
}
