'use client';

import Link from 'next/link';
import Logo from '@/app/components/logo/logo';
import TextReveal from '@/app/components/effects/text-reveal';
import ElementReveal from '@/app/components/effects/element-reveal';
import { useRef, useState, type CSSProperties, type KeyboardEvent, type PointerEvent, type TransitionEvent } from 'react';

type FeaturedProjectStyle = CSSProperties & {
  '--featured-accent': string;
  '--featured-accent-rgb': string;
};

const featuredProjects = [
  {
    number: `01`,
    title: `Forge`,
    category: `Cloud intelligence`,
    summary: `A calm command surface for complex infrastructure, shaped to turn live signals into confident decisions.`,
    result: `One navigable product view for the systems that keep teams moving.`,
    icon: `fa-solid fa-cloud-bolt`,
    href: `/projects`,
    accent: `#00bfff`,
    accentRgb: `0, 191, 255`,
    tags: [`Product UI`, `Next.js`, `Data`],
  },
  {
    number: `02`,
    title: `Creative Workshop`,
    category: `Commerce / Realtime`,
    summary: `A tactile storefront where a colorful studio identity meets a fast, maintainable commerce system.`,
    result: `A shorter, more memorable path from discovery to the right piece.`,
    icon: `fa-solid fa-wand-magic-sparkles`,
    href: `/case-studies/CreativeWorkshop`,
    accent: `#24e0c5`,
    accentRgb: `36, 224, 197`,
    tags: [`Shopify`, `React`, `Realtime`],
  },
  {
    number: `03`,
    title: `Dyer & Posta`,
    category: `Brand platform / CMS`,
    summary: `A polished salon platform built around services, people, and an editorial rhythm the team can own.`,
    result: `A brand-led digital home that stays as current as the studio.`,
    icon: `fa-solid fa-scissors`,
    href: `/case-studies/Dyer-Posta`,
    accent: `#71e38a`,
    accentRgb: `113, 227, 138`,
    tags: [`WordPress`, `UX`, `Brand`],
  },
  {
    number: `04`,
    title: `Smart Garden`,
    category: `IoT / Application`,
    summary: `A connected dashboard that makes live growing conditions legible without burying the signal in noise.`,
    result: `Remote environmental data made useful at a glance.`,
    icon: `fa-solid fa-seedling`,
    href: `/projects`,
    accent: `#b7f34a`,
    accentRgb: `183, 243, 74`,
    tags: [`IoT`, `Firebase`, `PWA`],
  },
] as const;

const projectCount = featuredProjects.length;
const carouselProjects = [featuredProjects[projectCount - 1], ...featuredProjects, featuredProjects[0]];

export default function HomeFeaturedProjectCarousel() {
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const activeIndexRef = useRef(0);
  const trackIndexRef = useRef(1);
  const isAnimatingRef = useRef(false);
  const dragStartXRef = useRef(0);
  const dragStartTimeRef = useRef(0);
  const dragOffsetRef = useRef(0);
  const draggedRef = useRef(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [trackIndex, setTrackIndex] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  const goToSlide = (index: number) => {
    if (isAnimatingRef.current) return;
    const normalizedIndex = (index + projectCount) % projectCount;
    if (normalizedIndex == activeIndexRef.current) return;
    isAnimatingRef.current = true;
    dragOffsetRef.current = 0;
    activeIndexRef.current = normalizedIndex;
    trackIndexRef.current = normalizedIndex + 1;
    setActiveIndex(normalizedIndex);
    setTrackIndex(normalizedIndex + 1);
  };
  const move = (direction: -1 | 1) => {
    if (isAnimatingRef.current) return;
    isAnimatingRef.current = true;
    const nextActiveIndex = (activeIndexRef.current + direction + projectCount) % projectCount;
    const nextTrackIndex = trackIndexRef.current + direction;
    activeIndexRef.current = nextActiveIndex;
    trackIndexRef.current = nextTrackIndex;
    setActiveIndex(nextActiveIndex);
    setTrackIndex(nextTrackIndex);
  };
  const previous = () => move(-1);
  const next = () => move(1);
  const handleTransitionEnd = (event: TransitionEvent<HTMLDivElement>) => {
    if (event.target != event.currentTarget || event.propertyName != `transform`) return;
    const currentTrackIndex = trackIndexRef.current;
    const snapIndex = currentTrackIndex == 0 ? projectCount : currentTrackIndex == projectCount + 1 ? 1 : currentTrackIndex;
    if (snapIndex == currentTrackIndex) {
      isAnimatingRef.current = false;
      return;
    }
    setIsResetting(true);
    trackIndexRef.current = snapIndex;
    setTrackIndex(snapIndex);
    window.requestAnimationFrame(() => window.requestAnimationFrame(() => {
      setIsResetting(false);
      isAnimatingRef.current = false;
    }));
  };
  const finishDrag = (event: PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;

    const viewportWidth = viewportRef.current?.offsetWidth ?? window.innerWidth;
    const dragDuration = Math.max(performance.now() - dragStartTimeRef.current, 1);
    const threshold = Math.min(120, Math.max(46, viewportWidth * 0.08));
    const dragOffset = dragOffsetRef.current;
    const isSwipe = Math.abs(dragOffset) > 18 && Math.abs(dragOffset / dragDuration) > 0.42;
    const shouldAdvance = Math.abs(dragOffset) >= threshold || isSwipe;
    const direction = dragOffset < 0 ? 1 : -1;

    dragOffsetRef.current = 0;
    setIsDragging(false);
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
    if (shouldAdvance) move(direction);
    else {
      isAnimatingRef.current = true;
      window.requestAnimationFrame(() => {
        if (trackRef.current) trackRef.current.style.transform = `translate3d(${-trackIndexRef.current * 100}%, 0, 0)`;
      });
    }
    window.setTimeout(() => {
      draggedRef.current = false;
    });
  };
  const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if ((event.target as HTMLElement).closest(`button, a`) || isAnimatingRef.current) return;
    if (event.pointerType == `mouse` && event.button != 0) return;
    dragStartXRef.current = event.clientX;
    dragStartTimeRef.current = performance.now();
    dragOffsetRef.current = 0;
    draggedRef.current = false;
    setIsDragging(true);
    event.currentTarget.setPointerCapture(event.pointerId);
  };
  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    const nextOffset = event.clientX - dragStartXRef.current;
    draggedRef.current = draggedRef.current || Math.abs(nextOffset) > 6;
    dragOffsetRef.current = nextOffset;
    if (trackRef.current) trackRef.current.style.transform = `translate3d(calc(${-trackIndexRef.current * 100}% + ${nextOffset}px), 0, 0)`;
  };
  const cancelDrag = (event: PointerEvent<HTMLDivElement>) => {
    dragOffsetRef.current = 0;
    setIsDragging(false);
    draggedRef.current = false;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
    window.requestAnimationFrame(() => {
      if (trackRef.current) trackRef.current.style.transform = `translate3d(${-trackIndexRef.current * 100}%, 0, 0)`;
    });
  };
  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key == `ArrowLeft`) {
      event.preventDefault();
      previous();
    }
    if (event.key == `ArrowRight`) {
      event.preventDefault();
      next();
    }
    if (event.key == `Home`) {
      event.preventDefault();
      goToSlide(0);
    }
    if (event.key == `End`) {
      event.preventDefault();
      goToSlide(projectCount - 1);
    }
  };

  return (
    <section className={`landingAltSection homeFeaturedCarousel`} role={`region`} aria-roledescription={`carousel`} aria-label={`Featured projects`}>
      <header className={`homeFeaturedHeader`}>
        <div>
          <TextReveal scroll as={`span`} className={`landingAltEyebrow`} text={`Featured projects / Swipe the deck`} />
          <TextReveal scroll slide byLetter as={`h2`} className={`landingAltDisplay`} text={`Make waves.`} delay={0.04} duration={0.66} stagger={0.022} />
        </div>
        <ElementReveal scroll as={`p`} y={18} className={`landingAltLead`}>
          Grab the work and pull it into view. Every slide is a different system, identity, and problem worth solving.
        </ElementReveal>
      </header>

      <div
        ref={viewportRef}
        tabIndex={0}
        onKeyDown={handleKeyDown}
        onPointerUp={finishDrag}
        onPointerMove={handlePointerMove}
        onPointerDown={handlePointerDown}
        onPointerCancel={cancelDrag}
        onDragStart={event => event.preventDefault()}
        className={`homeFeaturedViewport ${isDragging ? `homeFeaturedDragging` : ``} ${isResetting ? `homeFeaturedResetting` : ``}`}
        aria-label={`Featured projects. Use arrow keys, controls, or swipe to navigate.`}
        onClickCapture={event => {
          if (!draggedRef.current) return;
          event.preventDefault();
          event.stopPropagation();
        }}
      >
        <div
          ref={trackRef}
          className={`homeFeaturedTrack`}
          onTransitionEnd={handleTransitionEnd}
          style={{ transform: `translate3d(${-trackIndex * 100}%, 0, 0)` }}
        >
          {carouselProjects.map((project, trackPosition) => {
            const projectIndex = (trackPosition - 1 + projectCount) % projectCount;
            const isCurrent = trackPosition == trackIndex;
            return (
              <article
                key={`${project.title}-${trackPosition}`}
                aria-hidden={!isCurrent}
                data-active={isCurrent}
                className={`homeFeaturedSlide`}
                style={{ '--featured-accent': project.accent, '--featured-accent-rgb': project.accentRgb } as FeaturedProjectStyle}
                aria-label={`${projectIndex + 1} of ${projectCount}: ${project.title}`}
              >
              <div className={`homeFeaturedVisual`} aria-hidden={`true`}>
                <span className={`homeFeaturedNumber`}>{project.number}</span>
                <Logo fullSword className={`homeFeaturedGhostLogo`} />
                <div className={`homeFeaturedOrbit homeFeaturedOrbitOuter`} />
                <div className={`homeFeaturedOrbit homeFeaturedOrbitInner`} />
                <svg className={`homeFeaturedSea`} viewBox={`0 0 1200 190`} preserveAspectRatio={`none`}>
                  <path d={`M0 112 C130 42 260 174 405 99 S690 39 830 111 1070 169 1200 80`} />
                  <path d={`M0 151 C160 82 284 202 463 131 S752 80 906 142 1092 176 1200 122`} />
                </svg>
                <div className={`homeFeaturedScreen`}>
                  <div className={`homeFeaturedScreenBar`}><span /><span /><span /></div>
                  <div className={`homeFeaturedScreenGrid`}>
                    <span className={`homeFeaturedScreenLabel`}>Project signal / {project.number}</span>
                    <i className={`${project.icon} homeFeaturedIcon`} />
                    <strong>{project.title}</strong>
                    <div className={`homeFeaturedSignalBars`}><span /><span /><span /><span /><span /></div>
                  </div>
                </div>
              </div>

              <div className={`homeFeaturedCopy`}>
                <span className={`homeFeaturedCategory`}>{project.category}</span>
                <TextReveal scroll slide byLetter as={`h3`} text={project.title} duration={0.54} stagger={0.018} />
                <p>{project.summary}</p>
                <div className={`homeFeaturedResult`}>
                  <span>Outcome</span>
                  <strong>{project.result}</strong>
                </div>
                <ul className={`homeFeaturedTags`} aria-label={`${project.title} technologies`}>
                  {project.tags.map(tag => <li key={tag}>{tag}</li>)}
                </ul>
                <Link tabIndex={isCurrent ? 0 : -1} className={`homeFeaturedLink`} href={project.href}>
                  Open case study <span aria-hidden={`true`}>↗</span>
                </Link>
              </div>
              </article>
            );
          })}
        </div>
        <div className={`homeFeaturedFooter`}>
          <span className={`homeFeaturedCounter`} aria-live={`polite`} aria-atomic={`true`}>
            <strong>{String(activeIndex + 1).padStart(2, `0`)}</strong> / {String(projectCount).padStart(2, `0`)}
          </span>
          <div className={`homeFeaturedPaginationDock`}>
            <button className={`homeFeaturedPaginationArrow`} type={`button`} onClick={previous} aria-label={`Previous featured project`}>
              <i className={`fa-solid fa-arrow-left`} aria-hidden={`true`} />
            </button>
            <div className={`homeFeaturedThumbnails`} aria-label={`Choose a featured project`}>
              {featuredProjects.map((project, index) => (
                <button
                  type={`button`}
                  key={project.title}
                  onClick={() => goToSlide(index)}
                  aria-current={index == activeIndex ? `true` : undefined}
                  aria-label={`Show project ${index + 1}: ${project.title}`}
                  className={index == activeIndex ? `homeFeaturedThumbnailActive` : ``}
                  style={{ '--featured-accent': project.accent, '--featured-accent-rgb': project.accentRgb } as FeaturedProjectStyle}
                >
                  <span className={`homeFeaturedThumbnailVisual`} aria-hidden={`true`}><i className={project.icon} /></span>
                  <span className={`homeFeaturedThumbnailCopy`}><small>{project.number}</small><strong>{project.title}</strong></span>
                </button>
              ))}
            </div>
            <button className={`homeFeaturedPaginationArrow`} type={`button`} onClick={next} aria-label={`Next featured project`}>
              <i className={`fa-solid fa-arrow-right`} aria-hidden={`true`} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
