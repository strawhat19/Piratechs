'use client';

import gsap from 'gsap';
import Link from 'next/link';
import Image from 'next/image';
import Logo from '@/app/components/logo/logo';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import TextReveal from '@/app/components/effects/text-reveal';
import ElementReveal from '@/app/components/effects/element-reveal';
import { useId, useLayoutEffect, useRef, useState, type KeyboardEvent as ReactKeyboardEvent } from 'react';

const manifestoPrinciples = [
  {
    icon: `fa-solid fa-chart-line`,
    title: `Think like a business`,
    discipline: `Scalable business`,
    headerEyebrow: `Business insight`,
    headerStatement: `Built for momentum.`,
    stageTitle: `Clarity before complexity.`,
    about: `Assistant Manager from 2017 - 2019`,
    stageText: `Real constraints become focused digital decisions that create useful leverage.`,
    text: `We have worked alongside growing businesses, so we know the pain points are rarely abstract: limited time, tight budgets, disconnected tools, and inconsistent lead flow. We find the friction and build the specific website, workflow, or product that creates useful leverage.`,
    image: `/assets/piratechs/studio-story/scalable-business-photo-v3.webp`,
    imageAlt: `A growing business team reviewing operations together in a working studio`,
    coordinate: `MARIETTA // 33.9526° N, 84.5499° W`,
    signals: [
      { icon: `fa-solid fa-bullseye`, label: `Practical priorities` },
      { icon: `fa-solid fa-layer-group`, label: `Lean, focused systems` },
      { icon: `fa-solid fa-gears`, label: `Built for daily operations` },
    ],
  },
  {
    title: `Work like an agency`,
    icon: `fa-solid fa-pen-ruler`,
    headerEyebrow: `Agency rhythm`,
    discipline: `Agency operations`,
    stageTitle: `Volume without compromise.`,
    headerStatement: `Move fast. Stay sharp.`,
    about: `Designer // Developer from 2019 - 2021`,
    stageText: `A practiced production rhythm keeps speed, visibility, and craft moving together.`,
    text: `We have partnered with many agencies and understand how they manage volume, track customers and leads, coordinate handoffs, and protect quality under deadline pressure. That experience lets us support an agency workflow with high-volume output and a high-quality standard.`,
    image: `/assets/piratechs/studio-story/agency-operations-photo-v3.webp`,
    imageAlt: `A creative agency team coordinating projects in an active production studio`,
    coordinate: `KENNESAW // 34.0234° N, 84.6155° W`,
    signals: [
      { icon: `fa-solid fa-gauge-high`, label: `High-volume delivery` },
      { icon: `fa-solid fa-address-card`, label: `Lead + client visibility` },
      { icon: `fa-solid fa-circle-check`, label: `Quality at every handoff` },
    ],
  },
  {
    icon: `fa-solid fa-microchip`,
    title: `Build like an engineer`,
    discipline: `Enterprise systems`,
    headerEyebrow: `Engineering depth`,
    stageTitle: `Systems built to hold.`,
    headerStatement: `Complexity, engineered.`,
    about: `Software Engineer from 2022 - ${new Date().getFullYear()}`,
    stageText: `Complex requirements become resilient architecture designed for the long run.`,
    text: `We have worked with corporations on custom internal software engineering, so we know how to turn complex, specific requirements into robust solutions. We design for integrations, edge cases, maintainability, security, and the enterprise-level scale the system must support next.`,
    image: `/assets/piratechs/studio-story/enterprise-engineering-photo.webp`,
    imageAlt: `An enterprise engineering team reviewing a complex system architecture`,
    coordinate: `DULUTH // 34.0029° N, 84.1446° W`,
    signals: [
      { icon: `fa-solid fa-server`, label: `Custom internal systems` },
      { icon: `fa-solid fa-link`, label: `Complex integrations` },
      { icon: `fa-solid fa-shield-halved`, label: `Enterprise-ready scale` },
    ],
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
  const sectionRef = useRef<HTMLElement | null>(null);
  const chapterRefs = useRef<Array<HTMLLIElement | null>>([]);
  const mobileStoryTriggerRef = useRef<ScrollTrigger | null>(null);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    gsap.registerPlugin(ScrollTrigger);
    const media = gsap.matchMedia();
    media.add(`(min-width: 981px)`, () => {
      chapterRefs.current.forEach((chapter, index) => {
        if (!chapter) return;
        ScrollTrigger.create({
          trigger: chapter,
          start: `top 58%`,
          end: `bottom 42%`,
          onEnter: () => setActiveIndex(index),
          onEnterBack: () => setActiveIndex(index),
          onLeaveBack: () => {
            if (index === 0) setActiveIndex(null);
          },
          onToggle: trigger => {
            if (trigger.isActive) setActiveIndex(index);
          },
        });
      });
    });

    media.add(`(max-width: 980px)`, () => {
      const inner = section.querySelector<HTMLElement>(`.studioStoryInner`);
      if (!inner) return;

      const getTop = () => (document.querySelector<HTMLElement>(`.header`)?.offsetHeight ?? 104) + 12;
      const syncTop = () => section.style.setProperty(`--story-top`, `${getTop()}px`);
      const syncChapter = (trigger: ScrollTrigger) => {
        setActiveIndex(Math.min(manifestoPrinciples.length - 1, Math.floor(trigger.progress * manifestoPrinciples.length)));
      };

      syncTop();
      const trigger = ScrollTrigger.create({
        trigger: inner,
        pin: inner,
        start: () => `top ${getTop()}px`,
        end: () => `+=${inner.clientHeight * manifestoPrinciples.length}`,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onRefreshInit: syncTop,
        onUpdate: syncChapter,
        onRefresh: syncChapter,
      });
      mobileStoryTriggerRef.current = trigger;
      syncChapter(trigger);

      return () => {
        mobileStoryTriggerRef.current = null;
        section.style.removeProperty(`--story-top`);
      };
    });

    return () => media.revert();
  }, []);

  const scrollToChapter = (index: number) => {
    const reducedMotion = window.matchMedia(`(prefers-reduced-motion: reduce)`).matches;
    const smoothEnabled = document.documentElement.classList.contains(`smoothScrollEnabled`);
    const behavior = reducedMotion || smoothEnabled ? `auto` : `smooth`;
    const mobileTrigger = mobileStoryTriggerRef.current;
    if (mobileTrigger) {
      // Mobile chapters share one frame, so navigation targets their scroll ranges.
      const top = mobileTrigger.start + ((index + 0.5) / manifestoPrinciples.length) * (mobileTrigger.end - mobileTrigger.start);
      window.scrollTo({ top, behavior });
      return;
    }
    const chapter = chapterRefs.current[index];
    if (!chapter) return;
    chapter.scrollIntoView({ behavior, block: `center` });
  };

  const activePrinciple = activeIndex === null ? null : manifestoPrinciples[activeIndex];
  const activeKey = activeIndex === null ? `default` : String(activeIndex);

  return (
    <section
      id={`services`}
      ref={sectionRef}
      aria-label={`How Piratechs thinks and works`}
      data-active-chapter={activeIndex ?? `default`}
      className={`landingAltSection studioStorySection`}
    >
      <div className={`studioStoryStickyDecor`} aria-hidden={`true`}>
        <div className={`studioStoryStickyDecorFrame`}>
          <div className={`studioStoryWatermark`}>
            <Logo fullSword className={`studioStoryWatermarkLogo`} />
          </div>
          <svg className={`landingAltWave studioStoryWave`} viewBox={`0 0 1440 180`} preserveAspectRatio={`none`}>
            <path className={`landingAltWaveLine landingAltWaveLineBack`} d={`M0 111C172 37 307 163 493 94C662 31 786 124 947 88C1126 48 1262 108 1440 42`} />
            <path className={`landingAltWaveLine landingAltWaveLineFront`} d={`M0 146C189 70 320 178 520 124C682 80 852 164 1018 110C1176 59 1303 136 1440 90`} />
          </svg>
        </div>
      </div>

      <div id={`anchor`} className={`landingAltInner studioStoryInner`}>
        <aside className={`studioStoryStage`}>
          <header className={`studioStoryHeader`}>
            <span className={`landingAltEyebrow studioStoryHeaderSwap`} key={`eyebrow-${activeKey}`}>
              {activePrinciple?.headerEyebrow ?? `What we do`}
            </span>
            <p className={`studioStoryRange studioStoryHeaderSwap`} key={`statement-${activeKey}`}>
              {activePrinciple?.headerStatement ?? `One studio. More range.`}
            </p>
          </header>

          <div className={`studioStoryVisual`} aria-hidden={`true`}>
            <div className={`studioStoryVisualIdle ${activeIndex === null ? `studioStoryVisualIdleActive` : ``}`}>
              <Logo fullSword className={`studioStoryVisualIdleLogo`} />
            </div>
            <div className={`studioStoryImageStack`}>
              {manifestoPrinciples.map((principle, index) => (
                <figure className={`studioStoryImage ${index === activeIndex ? `studioStoryImageActive` : ``}`} key={principle.image}>
                  <Image fill unoptimized loading={`eager`} src={principle.image} alt={``} sizes={`(max-width: 980px) 92vw, 32vw`} />
                  <span className={`studioStoryImageShade`} />
                </figure>
              ))}
            </div>
            <span className={`studioStoryVisualIndex`}>{activeIndex === null ? `00 / 03` : `0${activeIndex + 1} / 03`}</span>
            <span className={`studioStoryVisualCoordinate`} key={`coordinate-${activeKey}`}>
              {activePrinciple?.coordinate ?? `ATLANTA // 33.7490° N, 84.3880° W`}
            </span>
            <span className={`studioStoryScanline`} />
          </div>

          <div className={`studioStoryStageCopy`} aria-live={`polite`}>
            {manifestoPrinciples.map((principle, index) => (
              <div
                className={`studioStoryStageCopyItem ${index === activeIndex ? `studioStoryStageCopyItemActive` : ``}`}
                aria-hidden={index !== activeIndex}
                key={principle.stageTitle}
              >
                <span>{principle.discipline} // 0{index + 1}</span>
                <h2>{principle.stageTitle}</h2>
                <p>{principle.stageText}</p>
              </div>
            ))}
          </div>

          <nav className={`studioStoryNav`} aria-label={`Story chapters`}>
            <span className={`studioStoryProgress`} aria-hidden={`true`}><span /></span>
            {manifestoPrinciples.map((principle, index) => (
              <button
                type={`button`}
                onClick={() => scrollToChapter(index)}
                className={index === activeIndex ? `studioStoryNavActive` : ``}
                aria-label={`Go to ${principle.title}`}
                aria-current={index === activeIndex ? `step` : undefined}
                key={principle.title}
              >
                0{index + 1}
              </button>
            ))}
          </nav>
        </aside>

        <ol className={`studioStoryList`}>
          {manifestoPrinciples.map((principle, index) => (
            <li
              ref={element => { chapterRefs.current[index] = element; }}
              className={`studioStoryChapter ${index === activeIndex ? `studioStoryChapterActive` : ``}`}
              aria-current={index === activeIndex ? `step` : undefined}
              key={principle.title}
            >
              <div className={`studioStoryMobileVisual`}>
                <Image fill unoptimized src={principle.image} alt={principle.imageAlt} sizes={`(max-width: 980px) 92vw, 0px`} />
                <span className={`studioStoryImageShade`} aria-hidden={`true`} />
              </div>
              <div className={`studioStoryTopline`}>
                <span className={`studioStoryIndex`}>0{index + 1}</span>
                <i className={`${principle.icon} studioStoryIcon`} aria-hidden={`true`} />
                <span className={`studioStoryDiscipline`}>
                  {principle.about}
                </span>
              </div>
              <TextReveal scroll as={`h3`} text={`${principle.title}.`} />
              <p>{principle.text}</p>
              <ul className={`studioStorySignals`} aria-label={`${principle.title} priorities`}>
                {principle.signals.map(signal => (
                  <li key={signal.label}>
                    <i className={`${signal.icon} studioStorySignalIcon`} aria-hidden={`true`} />
                    <span>{signal.label}</span>
                  </li>
                ))}
              </ul>
            </li>
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
              <TextReveal scroll as={`h3`} text={project.title} />
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
            <TextReveal scroll as={`span`} className={`landingAltEyebrow`} text={`Featured Projects`} />
            <TextReveal scroll slide byLetter as={`h2`} id={titleId} className={`landingAltDisplay`} text={`Make Waves.`} />
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
              <TextReveal scroll as={`h3`} text={activeProject.title} />
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
          <TextReveal scroll byLetter slide as={`h2`} className={`landingAltDisplay`} text={`Any Tech`} delay={0.06} />
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
