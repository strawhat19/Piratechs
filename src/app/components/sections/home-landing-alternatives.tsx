'use client';

import Link from 'next/link';
import { useId, useState, type KeyboardEvent as ReactKeyboardEvent } from 'react';
import ElementReveal from '@/app/components/effects/element-reveal';
import TextReveal from '@/app/components/effects/text-reveal';
import Logo from '@/app/components/logo/logo';

const manifestoPrinciples = [
  {
    icon: `fa-solid fa-compass`,
    title: `Plot the useful course`,
    text: `Every screen earns its place by making the next decision clearer.`,
  },
  {
    icon: `fa-solid fa-anchor`,
    title: `Build for rough water`,
    text: `Fast, accessible systems that stay dependable after launch day.`,
  },
  {
    icon: `fa-solid fa-flag`,
    title: `Leave a distinct wake`,
    text: `A visual point of view that feels like your brand, not a template.`,
  },
] as const;

const voyageChartPoints = [
  { label: `Chart`, value: 38, x: 44 },
  { label: `Design`, value: 57, x: 170 },
  { label: `Build`, value: 72, x: 296 },
  { label: `Test`, value: 80, x: 422 },
  { label: `Launch`, value: 91, x: 548 },
  { label: `Evolve`, value: 97, x: 676 },
] as const;

const voyageMetrics = [
  { value: `10`, suffix: `+`, label: `Years across design + development`, icon: `fa-solid fa-compass-drafting` },
  { value: `100`, suffix: `+`, label: `Technologies charted`, icon: `fa-solid fa-code-branch` },
  { value: `1`, suffix: ``, label: `Accountable studio crew`, icon: `fa-solid fa-anchor` },
] as const;

const bentoProjects = [
  {
    title: `Forge`,
    label: `Cloud intelligence`,
    summary: `A precise product surface that turns infrastructure signals into decisions teams can act on.`,
    metric: `Product`,
    metricLabel: `cloud operations`,
    icon: `fa-solid fa-cloud-bolt`,
    href: `/projects`,
    layout: `landingAltBentoCardWide`,
    tags: [`Product UI`, `Next.js`, `Data`],
  },
  {
    title: `Creative Workshop`,
    label: `Commerce`,
    summary: `A playful storefront with a practical Shopify backbone.`,
    metric: `Shopify`,
    metricLabel: `commerce backbone`,
    icon: `fa-solid fa-wand-magic-sparkles`,
    href: `/case-studies/CreativeWorkshop`,
    layout: `landingAltBentoCardTall`,
    tags: [`Shopify`, `React`, `Realtime`],
  },
  {
    title: `Smart Garden`,
    label: `Connected product`,
    summary: `Live growing conditions made legible from anywhere.`,
    metric: `Realtime`,
    metricLabel: `sensor visibility`,
    icon: `fa-solid fa-seedling`,
    href: `/projects`,
    layout: `landingAltBentoCardCompact`,
    tags: [`IoT`, `Firebase`, `PWA`],
  },
  {
    title: `MyDex`,
    label: `Interactive archive`,
    summary: `A fast, tactile catalog built for curious explorers.`,
    metric: `PWA`,
    metricLabel: `searchable archive`,
    icon: `fa-solid fa-map`,
    href: `/projects`,
    layout: `landingAltBentoCardCompact`,
    tags: [`React`, `API`, `Search`],
  },
] as const;

const voyageProjects = [
  {
    number: `01`,
    title: `Forge`,
    category: `Product design / Development`,
    summary: `A cloud operations interface designed like a captain's chart: layered, legible, and calm under pressure.`,
    result: `Complex infrastructure translated into one navigable product surface.`,
    icon: `fa-solid fa-cloud-bolt`,
    href: `/projects`,
  },
  {
    number: `02`,
    title: `Creative Workshop`,
    category: `Commerce / Realtime`,
    summary: `A colorful commerce build connecting a tactile studio identity to a maintainable Shopify system.`,
    result: `A quicker route from discovery to the right piece.`,
    icon: `fa-solid fa-wand-magic-sparkles`,
    href: `/case-studies/CreativeWorkshop`,
  },
  {
    number: `03`,
    title: `Dyer & Posta`,
    category: `Brand platform / CMS`,
    summary: `A polished salon presence designed around services, people, and a steady editorial rhythm.`,
    result: `A brand-led site the team can keep current.`,
    icon: `fa-solid fa-scissors`,
    href: `/case-studies/Dyer-Posta`,
  },
  {
    number: `04`,
    title: `Smart Garden`,
    category: `IoT / Application`,
    summary: `A connected garden dashboard that surfaces live environmental signals without visual noise.`,
    result: `Remote growing conditions made clear at a glance.`,
    icon: `fa-solid fa-seedling`,
    href: `/projects`,
  },
] as const;

const radarCapabilities = [
  { label: `Strategy`, shortLabel: `STR`, score: 84 },
  { label: `Product design`, shortLabel: `UX`, score: 94 },
  { label: `Engineering`, shortLabel: `DEV`, score: 97 },
  { label: `Integrations`, shortLabel: `API`, score: 88 },
  { label: `Motion`, shortLabel: `MOTION`, score: 76 },
  { label: `Launch care`, shortLabel: `CARE`, score: 91 },
] as const;

const chartY = (value: number) => 220 - (value / 100) * 170;
const voyageLine = voyageChartPoints.map(point => `${point.x},${chartY(point.value)}`).join(` `);
const voyageArea = `44,220 ${voyageLine} 676,220`;
const radarCenter = 180;
const radarRadius = 124;
const radarPoint = (score: number, index: number, radius = radarRadius) => {
  const angle = -Math.PI / 2 + (index * Math.PI * 2) / radarCapabilities.length;
  const distance = radius * (score / 100);
  return {
    x: Number((radarCenter + Math.cos(angle) * distance).toFixed(2)),
    y: Number((radarCenter + Math.sin(angle) * distance).toFixed(2)),
  };
};
const radarPolygon = radarCapabilities.map((capability, index) => {
  const point = radarPoint(capability.score, index);
  return `${point.x},${point.y}`;
}).join(` `);
const radarRings = [25, 50, 75, 100].map(score => radarCapabilities.map((_, index) => {
  const point = radarPoint(score, index);
  return `${point.x},${point.y}`;
}).join(` `));

export function HomeManifestoReveal() {
  return (
    <section className={`landingAltSection landingAltManifesto`} aria-label={`Piratechs studio manifesto`}>
      <div className={`landingAltManifestoMark`} aria-hidden={`true`}>
        <Logo fullSword className={`landingAltManifestoLogo`} />
      </div>
      <svg className={`landingAltWave landingAltManifestoWave`} viewBox={`0 0 1440 180`} preserveAspectRatio={`none`} aria-hidden={`true`}>
        <path className={`landingAltWaveLine landingAltWaveLineBack`} d={`M0 111C172 37 307 163 493 94C662 31 786 124 947 88C1126 48 1262 108 1440 42`} />
        <path className={`landingAltWaveLine landingAltWaveLineFront`} d={`M0 146C189 70 320 178 520 124C682 80 852 164 1018 110C1176 59 1303 136 1440 90`} />
      </svg>

      <div className={`landingAltInner landingAltManifestoInner`}>
        <div className={`landingAltManifestoHeading`}>
          <TextReveal scroll as={`span`} className={`landingAltEyebrow`} text={`The code of the crew`} />
          <TextReveal
            scroll
            byLetter
            slide
            as={`h2`}
            className={`landingAltDisplay landingAltManifestoTitle`}
            text={`Make waves. Keep the code calm.`}
            duration={0.72}
            stagger={0.018}
          />
        </div>

        <ElementReveal scroll as={`div`} className={`landingAltManifestoIntro`} y={24} blur>
          <span className={`landingAltManifestoRule`} aria-hidden={`true`} />
          <p>We pair a pirate's appetite for unexplored territory with an engineer's respect for a sound vessel.</p>
          <Link className={`landingAltTextLink`} href={`/about`}>
            Meet the studio <span aria-hidden={`true`}>↗</span>
          </Link>
        </ElementReveal>

        <ol className={`landingAltManifestoList`}>
          {manifestoPrinciples.map((principle, index) => (
            <ElementReveal
              scroll
              as={`li`}
              className={`landingAltManifestoItem`}
              y={30}
              delay={0.06 + index * 0.08}
              key={principle.title}
            >
              <span className={`landingAltManifestoIndex`}>{String(index + 1).padStart(2, `0`)}</span>
              <i className={`${principle.icon} landingAltManifestoIcon`} aria-hidden={`true`} />
              <h3>{principle.title}</h3>
              <p>{principle.text}</p>
            </ElementReveal>
          ))}
        </ol>
      </div>
    </section>
  );
}

export function HomeVoyageMetrics() {
  const chartTitleId = useId();
  const chartDescriptionId = useId();

  return (
    <section className={`landingAltSection landingAltMetrics`} aria-label={`Project voyage metrics`}>
      <div className={`landingAltInner`}>
        <header className={`landingAltSectionHeading landingAltMetricsHeading`}>
          <TextReveal scroll as={`span`} className={`landingAltEyebrow`} text={`Measured momentum`} />
          <TextReveal scroll as={`h2`} className={`landingAltDisplay`} text={`From first chart to full sail.`} delay={0.06} />
          <TextReveal scroll as={`p`} className={`landingAltLead`} text={`A useful process gets clearer as it moves. We watch the signals that keep quality, speed, and visibility heading together.`} />
        </header>

        <ElementReveal scroll as={`figure`} className={`landingAltChartCard`} y={28} blur>
          <div className={`landingAltChartTopline`}>
            <div>
              <span className={`landingAltChartKicker`}>Delivery confidence</span>
              <strong>Voyage health</strong>
            </div>
            <span className={`landingAltChartSignal`}><i className={`fa-solid fa-satellite-dish`} aria-hidden={`true`} /> Live rhythm</span>
          </div>
          <svg
            className={`landingAltVoyageChart`}
            viewBox={`0 0 720 270`}
            role={`img`}
            aria-labelledby={`${chartTitleId} ${chartDescriptionId}`}
          >
            <title id={chartTitleId}>Delivery confidence rises from 38 to 97 percent over six project phases.</title>
            <desc id={chartDescriptionId}>A line chart showing steady progress through chart, design, build, test, launch, and evolve.</desc>
            {[50, 135, 220].map((y, index) => (
              <line className={`landingAltChartGridline`} x1={44} y1={y} x2={676} y2={y} key={y} aria-hidden={`true`} data-grid-index={index} />
            ))}
            <polygon className={`landingAltChartArea`} points={voyageArea} aria-hidden={`true`} />
            <polyline className={`landingAltChartLine`} points={voyageLine} aria-hidden={`true`} />
            {voyageChartPoints.map(point => (
              <g className={`landingAltChartPoint`} key={point.label} aria-hidden={`true`}>
                <circle cx={point.x} cy={chartY(point.value)} r={6} />
                <text x={point.x} y={chartY(point.value) - 16} textAnchor={`middle`}>{point.value}</text>
                <text className={`landingAltChartAxisLabel`} x={point.x} y={250} textAnchor={`middle`}>{point.label}</text>
              </g>
            ))}
          </svg>
          <figcaption>Illustrative engagement rhythm — every project gets its own measures of success.</figcaption>
        </ElementReveal>

        <div className={`landingAltMetricGrid`}>
          {voyageMetrics.map((metric, index) => (
            <ElementReveal scroll as={`article`} className={`landingAltMetricCard`} y={24} delay={0.08 + index * 0.08} key={metric.label}>
              <i className={`${metric.icon} landingAltMetricIcon`} aria-hidden={`true`} />
              <p className={`landingAltMetricValue`}><strong>{metric.value}</strong><span>{metric.suffix}</span></p>
              <p>{metric.label}</p>
            </ElementReveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export { HomeServiceEstimator } from './home-service-estimator';

export function HomeProjectBento() {
  return (
    <section className={`landingAltSection landingAltBento`} aria-label={`Featured project grid`}>
      <div className={`landingAltInner`}>
        <header className={`landingAltSectionHeading landingAltBentoHeading`}>
          <div>
            <TextReveal scroll as={`span`} className={`landingAltEyebrow`} text={`Signals from the fleet`} />
            <TextReveal scroll as={`h2`} className={`landingAltDisplay`} text={`Featured builds, off the usual grid.`} delay={0.06} />
          </div>
          <ElementReveal scroll as={`p`} className={`landingAltLead`} y={18}>
            Different waters call for different vessels. Each system is shaped around the real job on deck.
          </ElementReveal>
        </header>

        <div className={`landingAltBentoGrid`}>
          {bentoProjects.map((project, index) => (
            <ElementReveal
              scroll
              as={`article`}
              className={`landingAltBentoCard ${project.layout}`}
              y={30}
              delay={0.04 + index * 0.07}
              key={project.title}
            >
              <div className={`landingAltBentoVisual`} aria-hidden={`true`}>
                <span className={`landingAltBentoCoordinate`}>ATL / {String(index + 1).padStart(2, `0`)}</span>
                <i className={`${project.icon} landingAltBentoIcon`} />
                <svg className={`landingAltBentoWake`} viewBox={`0 0 420 120`} preserveAspectRatio={`none`}>
                  <path d={`M-20 88C55 12 128 124 205 58C274 0 345 100 440 33`} />
                  <path d={`M-20 112C58 47 126 137 218 81C291 36 354 116 440 66`} />
                </svg>
              </div>
              <div className={`landingAltBentoMeta`}>
                <span>{project.label}</span>
                <span>{String(index + 1).padStart(2, `0`)}</span>
              </div>
              <h3>{project.title}</h3>
              <p>{project.summary}</p>
              <div className={`landingAltBentoOutcome`}>
                <strong>{project.metric}</strong>
                <span>{project.metricLabel}</span>
              </div>
              <ul className={`landingAltTagList`} aria-label={`${project.title} capabilities`}>
                {project.tags.map(tag => <li key={tag}>{tag}</li>)}
              </ul>
              <Link className={`landingAltCardLink`} href={project.href} aria-label={`Explore ${project.title}`}>
                Explore project <span aria-hidden={`true`}>↗</span>
              </Link>
            </ElementReveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export function HomeProjectVoyageSlider() {
  const [activeIndex, setActiveIndex] = useState(0);
  const titleId = useId();
  const activeProject = voyageProjects[activeIndex];

  const previous = () => setActiveIndex(current => (current - 1 + voyageProjects.length) % voyageProjects.length);
  const next = () => setActiveIndex(current => (current + 1) % voyageProjects.length);
  const handleKeyDown = (event: ReactKeyboardEvent<HTMLElement>) => {
    if (event.target !== event.currentTarget) return;

    if (event.key === `ArrowLeft`) {
      event.preventDefault();
      previous();
    }
    if (event.key === `ArrowRight`) {
      event.preventDefault();
      next();
    }
    if (event.key === `Home`) {
      event.preventDefault();
      setActiveIndex(0);
    }
    if (event.key === `End`) {
      event.preventDefault();
      setActiveIndex(voyageProjects.length - 1);
    }
  };

  return (
    <section
      className={`landingAltSection landingAltVoyageSlider`}
      role={`region`}
      aria-roledescription={`carousel`}
      aria-labelledby={titleId}
      tabIndex={0}
      onKeyDown={handleKeyDown}
    >
      <div className={`landingAltInner`}>
        <header className={`landingAltSectionHeading landingAltSliderHeading`}>
          <div>
            <TextReveal scroll as={`span`} className={`landingAltEyebrow`} text={`Selected voyages`} />
            <h2 className={`landingAltDisplay`} id={titleId}>Work with a wake.</h2>
          </div>
          <div className={`landingAltSliderControls`}>
            <button type={`button`} onClick={previous} aria-label={`Show previous project`}>
              <i className={`fa-solid fa-arrow-left`} aria-hidden={`true`} />
            </button>
            <span aria-live={`polite`} aria-atomic={`true`}>
              <strong>{String(activeIndex + 1).padStart(2, `0`)}</strong> / {String(voyageProjects.length).padStart(2, `0`)}
              <span className={`landingAltSrOnly`}>, {activeProject.title}</span>
            </span>
            <button type={`button`} onClick={next} aria-label={`Show next project`}>
              <i className={`fa-solid fa-arrow-right`} aria-hidden={`true`} />
            </button>
          </div>
        </header>

        <div className={`landingAltSliderViewport`}>
          <article
            className={`landingAltSlide`}
            role={`group`}
            aria-roledescription={`slide`}
            aria-label={`${activeIndex + 1} of ${voyageProjects.length}: ${activeProject.title}`}
            key={activeProject.title}
          >
            <div className={`landingAltSlideVisual`} aria-hidden={`true`}>
              <span className={`landingAltSlideNumber`}>{activeProject.number}</span>
              <i className={`${activeProject.icon} landingAltSlideIcon`} />
              <Logo fullSword className={`landingAltSlideLogo`} />
              <svg className={`landingAltSlideSea`} viewBox={`0 0 760 260`} preserveAspectRatio={`none`}>
                <path className={`landingAltSlideSeaBack`} d={`M-30 172C91 54 211 226 336 123C458 22 569 202 790 74`} />
                <path className={`landingAltSlideSeaFront`} d={`M-30 226C97 112 218 263 365 174C492 97 620 224 790 132`} />
              </svg>
            </div>
            <div className={`landingAltSlideCopy`}>
              <span className={`landingAltSlideCategory`}>{activeProject.category}</span>
              <h3>{activeProject.title}</h3>
              <p>{activeProject.summary}</p>
              <blockquote>{activeProject.result}</blockquote>
              <Link className={`landingAltSlideLink`} href={activeProject.href}>
                View the voyage <span aria-hidden={`true`}>↗</span>
              </Link>
            </div>
          </article>
        </div>

        <div className={`landingAltSliderPagination`} aria-label={`Choose a project slide`}>
          {voyageProjects.map((project, index) => (
            <button
              className={index === activeIndex ? `landingAltSliderDotActive` : ``}
              type={`button`}
              aria-label={`Show slide ${index + 1}: ${project.title}`}
              aria-current={index === activeIndex ? `true` : undefined}
              onClick={() => setActiveIndex(index)}
              key={project.title}
            >
              <span aria-hidden={`true`} />
            </button>
          ))}
        </div>
        <p className={`landingAltSliderHint`}>Use the arrow controls or Left and Right Arrow keys to navigate. Slides never advance on their own.</p>
      </div>
    </section>
  );
}

export function HomeCapabilityRadar() {
  const chartTitleId = useId();
  const chartDescriptionId = useId();

  return (
    <section className={`landingAltSection landingAltRadar`} aria-label={`Studio capability chart`}>
      <div className={`landingAltInner landingAltRadarInner`}>
        <header className={`landingAltSectionHeading landingAltRadarHeading`}>
          <TextReveal scroll as={`span`} className={`landingAltEyebrow`} text={`Full-stack fleet`} />
          <TextReveal scroll byLetter slide as={`h2`} className={`landingAltDisplay`} text={`Range without drift.`} delay={0.06} />
          <TextReveal scroll as={`p`} className={`landingAltLead`} text={`A deliberately broad studio practice, connected by one product-minded standard from discovery through launch care.`} />
          <Link className={`landingAltTextLink`} href={`/services`}>
            Explore every capability <span aria-hidden={`true`}>↗</span>
          </Link>
        </header>

        <ElementReveal scroll as={`figure`} className={`landingAltRadarFigure`} y={26} blur>
          <div className={`landingAltRadarChartWrap`}>
            <svg
              className={`landingAltRadarChart`}
              viewBox={`0 0 360 360`}
              role={`img`}
              aria-labelledby={`${chartTitleId} ${chartDescriptionId}`}
            >
              <title id={chartTitleId}>Piratechs studio capability radar</title>
              <desc id={chartDescriptionId}>Scores from 76 to 97 across strategy, product design, engineering, integrations, motion, and launch care.</desc>
              {radarRings.map((points, index) => (
                <polygon className={`landingAltRadarRing`} points={points} key={points} data-ring-index={index} aria-hidden={`true`} />
              ))}
              {radarCapabilities.map((capability, index) => {
                const axis = radarPoint(100, index);
                const label = radarPoint(100, index, 153);
                return (
                  <g className={`landingAltRadarAxis`} key={capability.label} aria-hidden={`true`}>
                    <line x1={radarCenter} y1={radarCenter} x2={axis.x} y2={axis.y} />
                    <text x={label.x} y={label.y} textAnchor={label.x < radarCenter - 8 ? `end` : label.x > radarCenter + 8 ? `start` : `middle`} dominantBaseline={`middle`}>
                      {capability.shortLabel}
                    </text>
                  </g>
                );
              })}
              <polygon className={`landingAltRadarShape`} points={radarPolygon} aria-hidden={`true`} />
              {radarCapabilities.map((capability, index) => {
                const point = radarPoint(capability.score, index);
                return <circle className={`landingAltRadarPoint`} cx={point.x} cy={point.y} r={4.5} key={capability.label} aria-hidden={`true`} />;
              })}
              <g className={`landingAltRadarCenter`} aria-hidden={`true`}>
                <circle cx={radarCenter} cy={radarCenter} r={20} />
                <text x={radarCenter} y={radarCenter + 1} textAnchor={`middle`} dominantBaseline={`middle`}>P//</text>
              </g>
            </svg>
          </div>
          <figcaption>Illustrative capability profile, scored against Piratechs' current service mix.</figcaption>
        </ElementReveal>

        <ul className={`landingAltRadarLegend`} aria-label={`Capability scores`}>
          {radarCapabilities.map((capability, index) => (
            <ElementReveal scroll as={`li`} y={18} delay={0.05 + index * 0.055} key={capability.label}>
              <span className={`landingAltRadarLegendLabel`}>{capability.label}</span>
              <span className={`landingAltRadarLegendTrack`} aria-hidden={`true`}>
                <span className={`landingAltRadarLegendFill`} style={{ width: `${capability.score}%` }} />
              </span>
              <strong>{capability.score}</strong>
            </ElementReveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
