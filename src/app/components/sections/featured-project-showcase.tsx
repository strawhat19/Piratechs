'use client';

import Link from 'next/link';
import Image from 'next/image';
import Logo from '@/app/components/logo/logo';
import { ScrollSmoother } from 'gsap/ScrollSmoother';
import { getTechnologyMeta } from '@/shared/utils/tech';
import styles from '@/styles/featured-project-showcase.module.scss';
import type { LandingFeaturedProject } from './landing-featured-projects';
import { useId, useRef, useState, useEffect, useLayoutEffect, type CSSProperties, type PointerEvent } from 'react';

type FeaturedProjectShowcaseProps = {
  projects: LandingFeaturedProject[];
};

type ProjectImageProps = {
  sizes: string;
  eager?: boolean;
  project: LandingFeaturedProject;
};

type OpenProject = {
  index: number;
  origin: DOMRect;
};

type ReelDrag = {
  id: number;
  step: number;
  startX: number;
  startY: number;
  offset: number;
  lastX: number;
  lastTime: number;
  velocity: number;
  active: boolean;
};

type ReelCardStyle = CSSProperties & {
  '--card-position': number;
};

type DetailDrag = Omit<ReelDrag, `step`>;

type ProjectDetailProps = FeaturedProjectShowcaseProps & OpenProject & {
  onClose: () => void;
  onSelect: (index: number) => void;
  getReturnRect: () => DOMRect | undefined;
};

type ProjectThumbnailsProps = FeaturedProjectShowcaseProps & {
  index: number;
  detail?: boolean;
  onSelect: (index: number) => void;
};

const getProjectTopics = (project: LandingFeaturedProject) => Array.from(new Map([...(project.technologies ?? []), ...project.topics].filter(Boolean).map(topic => [topic.toLowerCase(), topic] as const)).values());
const getImageTransform = (source: DOMRect, target: DOMRect) => `translate(${source.left - target.left}px, ${source.top - target.top}px) scale(${source.width / target.width}, ${source.height / target.height})`;

const ProjectImage = ({ project, sizes, eager = false }: ProjectImageProps) => {
  const [failedSource, setFailedSource] = useState<string | null>(null);
  const imageSource = project.mediaURL ?? ``;
  const optimizeImage = !/\.gif(?:$|\?)/i.test(imageSource) && (imageSource.startsWith(`/`) || imageSource.startsWith(`https://raw.githubusercontent.com/`) || imageSource.startsWith(`https://piratechs.com/wp-content/uploads/`));

  return (
    <>
      <span className={styles.imageFallback} aria-hidden={`true`}>{project.number}</span>
      {imageSource && imageSource !== failedSource ? (
        <Image
          fill
          alt={``}
          sizes={sizes}
          key={imageSource}
          src={imageSource}
          draggable={false}
          unoptimized={!optimizeImage}
          className={styles.projectImage}
          loading={eager ? `eager` : `lazy`}
          onError={() => setFailedSource(imageSource)}
        />
      ) : null}
    </>
  );
};

const ProjectThumbnails = ({ index, projects, onSelect, detail = false }: ProjectThumbnailsProps) => {
  const stripRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const strip = stripRef.current;
    const thumbnail = strip?.children?.[index];
    if (!strip || !(thumbnail instanceof HTMLElement)) return;
    const reducedMotion = window.matchMedia(`(prefers-reduced-motion: reduce)`).matches;
    const centerThumbnail = () => strip.scrollTo({ left: thumbnail.offsetLeft - (strip.clientWidth - thumbnail.offsetWidth) / 2, behavior: reducedMotion ? `instant` : `smooth` });
    const observer = new ResizeObserver(centerThumbnail);
    centerThumbnail();
    observer.observe(strip);
    return () => observer.disconnect();
  }, [index]);

  return (
    <div ref={stripRef} role={`group`} data-no-swipe className={`${styles.thumbnails}${detail ? ` ${styles.detailThumbnails}` : ``}`} aria-label={detail ? `Choose project details` : `Choose a project preview`}>
      {projects.map((project, thumbnailIndex) => (
        <button type={`button`} key={project.id} onClick={() => onSelect(thumbnailIndex)} aria-label={`${detail ? `View` : `Preview`} ${project.title}`} aria-current={thumbnailIndex === index ? `true` : undefined}>
          <ProjectImage project={project} sizes={detail ? `64px` : `48px`} />
          <span className={styles.thumbnailNumber} aria-hidden={`true`}>{project.number}</span>
        </button>
      ))}
    </div>
  );
};

const ProjectDetail = ({ index, origin, projects, onClose, onSelect, getReturnRect }: ProjectDetailProps) => {
  const titleId = useId();
  const closingRef = useRef(false);
  const mountedRef = useRef(false);
  const didDragRef = useRef(false);
  const dragFrameRef = useRef(0);
  const dragRef = useRef<DetailDrag | null>(null);
  const [slide, setSlide] = useState<{ index: number; direction: number } | null>(null);
  const imageAnimationRef = useRef<Animation | null>(null);
  const visualRef = useRef<HTMLElement>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const project = projects?.[index];
  const nextIndex = (index + 1) % projects.length;
  const previousIndex = (index - 1 + projects.length) % projects.length;

  useLayoutEffect(() => {
    const dialog = dialogRef.current;
    const visual = visualRef.current;
    if (!dialog || !visual) return;
    mountedRef.current = true;
    const trigger = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const previousOverflow = document.body.style.overflow;
    const previousRootOverflow = document.documentElement.style.overflow;
    const smoother = ScrollSmoother.get();
    const wasPaused = smoother?.paused();
    document.body.style.overflow = `hidden`;
    document.documentElement.style.overflow = `hidden`;
    smoother?.paused(true);
    dialog.showModal();

    if (!window.matchMedia(`(prefers-reduced-motion: reduce)`).matches) {
      imageAnimationRef.current = visual.animate([
        { transform: getImageTransform(origin, visual.getBoundingClientRect()), borderRadius: `8px` },
        { transform: `none`, borderRadius: `0px` },
      ], { duration: 620, easing: `cubic-bezier(0.22, 1, 0.36, 1)`, fill: `both` });
    }

    return () => {
      mountedRef.current = false;
      dragRef.current = null;
      window.cancelAnimationFrame(dragFrameRef.current);
      imageAnimationRef.current?.cancel();
      dialog.close();
      document.body.style.overflow = previousOverflow;
      document.documentElement.style.overflow = previousRootOverflow;
      smoother?.paused(wasPaused ?? false);
      if (trigger?.isConnected) trigger.focus({ preventScroll: true });
    };
  }, [origin]);

  const clearDrag = () => {
    const drag = dragRef.current;
    const dialog = dialogRef.current;
    dragRef.current = null;
    window.cancelAnimationFrame(dragFrameRef.current);
    dragFrameRef.current = 0;
    dialog?.removeAttribute(`data-dragging`);
    dialog?.style.removeProperty(`--detail-drag`);
    if (drag && dialog?.hasPointerCapture(drag.id)) dialog.releasePointerCapture(drag.id);
  };

  const selectProject = (next: number, direction = next > index ? 1 : -1) => {
    if (closingRef.current || next === index) return;
    clearDrag();
    imageAnimationRef.current?.cancel();
    const reducedMotion = window.matchMedia(`(prefers-reduced-motion: reduce)`).matches;
    setSlide(reducedMotion ? null : { index, direction });
    onSelect(next);
  };

  const startDrag = (event: PointerEvent<HTMLDialogElement>) => {
    if (!event.isPrimary || event.button !== 0) return;
    didDragRef.current = false;
    if (closingRef.current || projects.length < 2 || !(event.target instanceof Element)) return;
    if (event.target.closest(`a, button, input, select, textarea, [contenteditable], [data-no-swipe]`)) return;
    dragRef.current = {
      id: event.pointerId,
      active: false,
      offset: 0,
      velocity: 0,
      lastX: event.clientX,
      startX: event.clientX,
      startY: event.clientY,
      lastTime: event.timeStamp,
    };
  };

  const moveDrag = (event: PointerEvent<HTMLDialogElement>) => {
    const drag = dragRef.current;
    if (!drag || drag.id !== event.pointerId) return;
    const offset = event.clientX - drag.startX;
    const verticalDistance = Math.abs(event.clientY - drag.startY);
    if (!drag.active) {
      if (Math.max(Math.abs(offset), verticalDistance) < 8) return;
      if (verticalDistance > Math.abs(offset)) {
        clearDrag();
        return;
      }
      drag.active = true;
      didDragRef.current = true;
      imageAnimationRef.current?.cancel();
      event.currentTarget.dataset.dragging = `true`;
      event.currentTarget.setPointerCapture(event.pointerId);
    }
    event.preventDefault();
    drag.offset = offset;
    drag.velocity = (event.clientX - drag.lastX) / Math.max(8, event.timeStamp - drag.lastTime);
    drag.lastX = event.clientX;
    drag.lastTime = event.timeStamp;
    if (dragFrameRef.current) return;
    dragFrameRef.current = window.requestAnimationFrame(() => {
      dragFrameRef.current = 0;
      if (!dragRef.current) return;
      const offset = Math.max(-100, Math.min(100, dragRef.current.offset * 0.28));
      dialogRef.current?.style.setProperty(`--detail-drag`, `${offset}px`);
    });
  };

  const finishDrag = (event: PointerEvent<HTMLDialogElement>, cancelled = false) => {
    const drag = dragRef.current;
    if (!drag || drag.id !== event.pointerId) return;
    clearDrag();
    if (!drag.active || cancelled || closingRef.current) return;
    const offset = event.clientX - drag.startX;
    const velocity = event.timeStamp - drag.lastTime < 100 ? drag.velocity : 0;
    const threshold = Math.min(96, Math.max(40, event.currentTarget.clientWidth * 0.08));
    if (Math.abs(offset) < threshold && !(Math.abs(offset) > 20 && Math.abs(velocity) > 0.5)) return;
    const direction = offset < 0 ? 1 : -1;
    selectProject((index + direction + projects.length) % projects.length, direction);
  };

  const closeDetail = async () => {
    if (closingRef.current) return;
    closingRef.current = true;
    setSlide(null);
    const dialog = dialogRef.current;
    const visual = visualRef.current;
    if (!dialog || !visual || window.matchMedia(`(prefers-reduced-motion: reduce)`).matches) {
      onClose();
      return;
    }

    dialog.dataset.closing = `true`;
    clearDrag();
    const currentTransform = getComputedStyle(visual).transform;
    imageAnimationRef.current?.cancel();
    const target = getReturnRect();
    imageAnimationRef.current = visual.animate([
      { opacity: 1, transform: currentTransform },
      { opacity: target ? 1 : 0, transform: target ? getImageTransform(target, visual.getBoundingClientRect()) : `scale(0.96)` },
    ], { duration: 440, easing: `cubic-bezier(0.4, 0, 0.2, 1)`, fill: `forwards` });
    await imageAnimationRef.current.finished.catch(() => undefined);
    if (mountedRef.current) onClose();
  };

  if (!project) return null;
  const topics = getProjectTopics(project);

  return (
    <dialog
      ref={dialogRef}
      style={{ '--detail-direction': slide?.direction ?? 1 } as CSSProperties}
      className={`${styles.dialog} landingAltSection`}
      aria-labelledby={titleId}
      onPointerDown={startDrag}
      onPointerMove={moveDrag}
      onPointerUp={event => finishDrag(event)}
      onPointerCancel={event => finishDrag(event, true)}
      onLostPointerCapture={event => finishDrag(event, true)}
      onCancel={event => { event.preventDefault(); void closeDetail(); }}
      onClickCapture={event => {
        if (!didDragRef.current || event.detail === 0) return;
        event.preventDefault();
        event.stopPropagation();
        didDragRef.current = false;
      }}
      onKeyDown={event => {
        if (closingRef.current || event.altKey || event.ctrlKey || event.metaKey || ![`ArrowLeft`, `ArrowRight`].includes(event.key)) return;
        event.preventDefault();
        selectProject(event.key === `ArrowLeft` ? previousIndex : nextIndex, event.key === `ArrowLeft` ? -1 : 1);
      }}
    >
      <button type={`button`} onClick={() => void closeDetail()} className={styles.closeButton} aria-label={`Close project details`} data-detail-chrome>
        <i className={`fa-solid fa-xmark`} aria-hidden={`true`} />
      </button>
      <div className={styles.detailWatermark} aria-hidden={`true`} data-detail-chrome>
        <Logo fullSword gradient={false} skullWhite={false} color={`var(--main)`} className={styles.watermarkLogo} />
      </div>
      <div className={styles.dialogInner}>
        <div className={styles.detailBody}>
          <figure ref={visualRef} className={styles.detailVisual}>
            {slide && projects?.[slide.index] ? <div key={`outgoing-${projects[slide.index].id}`} className={styles.outgoingImage} aria-hidden={`true`}><ProjectImage eager project={projects[slide.index]} sizes={`100vw`} /></div> : null}
            <div key={project.id} className={styles.detailImage} data-sliding={Boolean(slide)} onAnimationEnd={event => { if (event.target === event.currentTarget) setSlide(null); }}>
              <ProjectImage eager project={project} sizes={`100vw`} />
            </div>
          </figure>
          <div className={styles.detailPanel} data-detail-chrome>
            <header className={styles.dialogHeader}>
              <span className={styles.eyebrow}>Piratechs <span>/ Selected Work</span></span>
            </header>
            <article key={project.id} className={styles.detailCopy} data-sliding={Boolean(slide)}>
              <div className={styles.detailHeading}>
                <div className={styles.detailMeta}>
                  <span className={styles.eyebrow}>Project / {project.number}</span>
                  <span className={styles.status} data-live={project.status.toLowerCase() === `live`}><i />{project.status}</span>
                </div>
                <h2 id={titleId}>{project.title}</h2>
              </div>
              <div className={styles.detailText} tabIndex={0} role={`region`} aria-label={`${project.title} overview`}>
                <p>{project.summary || project.title}</p>
                {topics.length ? <ul className={styles.topics} aria-label={`Project technologies`}>{topics.map(topic => <li key={topic}><i className={getTechnologyMeta(topic.toLowerCase()).icon} aria-hidden={`true`} />{topic}</li>)}</ul> : null}
              </div>
              <div className={styles.detailActions}>
                {project.liveUrl ? (
                  <a href={project.liveUrl} target={`_blank`} rel={`noreferrer`} className={styles.primaryLink}>
                    Visit Website<i className={`fa-solid fa-arrow-up-right-from-square`} aria-hidden={`true`} />
                  </a>
                ) : null}
                <Link href={project.viewHref} onClick={onClose} className={styles.textLink}>
                  Full Project<i className={`fa-solid fa-arrow-right`} aria-hidden={`true`} />
                </Link>
                {project.codeUrl ? <a href={project.codeUrl} target={`_blank`} rel={`noreferrer`} className={styles.codeLink} aria-label={`View ${project.title} source code`}><i className={`fa-brands fa-github`} aria-hidden={`true`} /></a> : null}
              </div>
            </article>
          </div>
        </div>
        <footer className={styles.detailFooter} data-detail-chrome>
          <ProjectThumbnails detail index={index} projects={projects} onSelect={selectProject} />
          <button type={`button`} disabled={projects.length < 2} onClick={() => selectProject(previousIndex, -1)} aria-label={`Previous project: ${projects?.[previousIndex]?.title}`}>
            <i className={`fa-solid fa-arrow-left`} aria-hidden={`true`} />
            <span><small>Previous Project</small><strong>{projects?.[previousIndex]?.title}</strong></span>
          </button>
          <span className={styles.detailCount} aria-live={`polite`} aria-atomic={`true`}><strong>{project.number}</strong> / {String(projects.length).padStart(2, `0`)}</span>
          <button type={`button`} disabled={projects.length < 2} onClick={() => selectProject(nextIndex, 1)} aria-label={`Next project: ${projects?.[nextIndex]?.title}`}>
            <span><small>Next Project</small><strong>{projects?.[nextIndex]?.title}</strong></span>
            <i className={`fa-solid fa-arrow-right`} aria-hidden={`true`} />
          </button>
        </footer>
      </div>
    </dialog>
  );
};

export default function FeaturedProjectShowcase({ projects }: FeaturedProjectShowcaseProps) {
  const [paused, setPaused] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [visible, setVisible] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [pageVisible, setPageVisible] = useState(true);
  const [reducedMotion, setReducedMotion] = useState(true);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [detail, setDetail] = useState<OpenProject | null>(null);
  const didDragRef = useRef(false);
  const dragFrameRef = useRef(0);
  const dragRef = useRef<ReelDrag | null>(null);
  const reelRef = useRef<HTMLDivElement>(null);
  const showcaseRef = useRef<HTMLDivElement>(null);
  const selectedProject = projects?.[selectedIndex] ?? projects?.[0];
  const running = visible && pageVisible && !paused && !hovered && !focused && !dragging && !detail && !reducedMotion && projects.length > 1;

  useEffect(() => {
    const showcase = showcaseRef.current;
    if (!showcase) return;
    const media = window.matchMedia(`(prefers-reduced-motion: reduce)`);
    const syncMotion = () => setReducedMotion(media.matches);
    const syncVisibility = () => setPageVisible(document.visibilityState === `visible`);
    const observer = new IntersectionObserver(entries => setVisible(Boolean(entries?.[0]?.isIntersecting)), { threshold: 0.2 });
    syncMotion();
    syncVisibility();
    observer.observe(showcase);
    media.addEventListener(`change`, syncMotion);
    document.addEventListener(`visibilitychange`, syncVisibility);

    return () => {
      observer.disconnect();
      media.removeEventListener(`change`, syncMotion);
      document.removeEventListener(`visibilitychange`, syncVisibility);
    };
  }, []);

  useLayoutEffect(() => {
    const showcase = showcaseRef.current;
    const section = showcase?.closest(`.landingStackSection`);
    if (!showcase || !section || detail) return;
    let frame = 0;
    const updateFocus = () => {
      frame = 0;
      const rect = section.getBoundingClientRect();
      const viewportCenter = window.innerHeight / 2;
      const distance = Math.abs(rect.top + rect.height / 2 - viewportCenter);
      const focus = reducedMotion ? 1 : 1 - Math.min(1, distance / (viewportCenter + rect.height / 2));
      showcase.style.setProperty(`--reel-focus`, String(focus * focus * (3 - 2 * focus)));
    };
    const scheduleFocus = () => {
      if (!frame) frame = window.requestAnimationFrame(updateFocus);
    };
    updateFocus();
    if (!reducedMotion) window.addEventListener(`scroll`, scheduleFocus, { passive: true });
    window.addEventListener(`resize`, scheduleFocus);

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener(`scroll`, scheduleFocus);
      window.removeEventListener(`resize`, scheduleFocus);
    };
  }, [detail, reducedMotion]);

  useEffect(() => () => window.cancelAnimationFrame(dragFrameRef.current), []);

  const startDrag = (event: PointerEvent<HTMLDivElement>) => {
    if (!event.isPrimary || event.button !== 0 || projects.length < 2) return;
    const card = event.currentTarget.querySelector<HTMLButtonElement>(`[data-position="0"]`);
    if (!card) return;
    didDragRef.current = false;
    dragRef.current = {
      id: event.pointerId,
      active: false,
      offset: 0,
      velocity: 0,
      lastX: event.clientX,
      startX: event.clientX,
      startY: event.clientY,
      lastTime: event.timeStamp,
      step: card.offsetWidth * 0.68,
    };
  };

  const moveDrag = (event: PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    if (!drag || drag.id !== event.pointerId) return;
    const offset = event.clientX - drag.startX;
    const verticalDistance = Math.abs(event.clientY - drag.startY);
    if (!drag.active) {
      if (Math.max(Math.abs(offset), verticalDistance) < 8) return;
      if (verticalDistance > Math.abs(offset)) {
        dragRef.current = null;
        return;
      }
      drag.active = true;
      didDragRef.current = true;
      event.currentTarget.dataset.dragging = `true`;
      event.currentTarget.setPointerCapture(event.pointerId);
      setDragging(true);
    }
    drag.offset = offset;
    drag.velocity = (event.clientX - drag.lastX) / Math.max(8, event.timeStamp - drag.lastTime);
    drag.lastX = event.clientX;
    drag.lastTime = event.timeStamp;
    if (dragFrameRef.current) return;
    dragFrameRef.current = window.requestAnimationFrame(() => {
      dragFrameRef.current = 0;
      const current = dragRef.current;
      if (!current) return;
      const steps = Math.trunc(current.offset / current.step);
      if (steps) {
        current.startX += steps * current.step;
        current.offset -= steps * current.step;
        setSelectedIndex(index => ((index - steps) % projects.length + projects.length) % projects.length);
      }
      reelRef.current?.style.setProperty(`--reel-drag`, String(current.offset / current.step));
    });
  };

  const finishDrag = (event: PointerEvent<HTMLDivElement>, cancelled = false) => {
    const drag = dragRef.current;
    if (!drag || drag.id !== event.pointerId) return;
    dragRef.current = null;
    window.cancelAnimationFrame(dragFrameRef.current);
    dragFrameRef.current = 0;
    if (drag.active && !cancelled) {
      const velocity = event.timeStamp - drag.lastTime < 100 ? Math.max(-2, Math.min(2, drag.velocity)) : 0;
      const steps = Math.round((event.clientX - drag.startX + velocity * 140) / drag.step);
      setSelectedIndex(index => ((index - steps) % projects.length + projects.length) % projects.length);
    }
    event.currentTarget.dataset.dragging = `false`;
    event.currentTarget.style.removeProperty(`--reel-drag`);
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
    setDragging(false);
  };

  if (!selectedProject) return null;

  return (
    <div
      data-www={`true`}
      ref={showcaseRef}
      data-running={running}
      className={styles.showcase}
      onFocusCapture={() => setFocused(true)}
      onPointerLeave={() => setHovered(false)}
      onPointerEnter={event => { if (event.pointerType === `mouse`) setHovered(true); }}
      onBlurCapture={event => { if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false); }}
    >
      <div
        ref={reelRef}
        data-dragging={dragging}
        onPointerDown={startDrag}
        onPointerMove={moveDrag}
        className={styles.reelViewport}
        onPointerUp={event => finishDrag(event)}
        onPointerCancel={event => finishDrag(event, true)}
        onLostPointerCapture={event => finishDrag(event, true)}
        onClickCapture={event => {
          if (!didDragRef.current || event.detail === 0) return;
          event.preventDefault();
          event.stopPropagation();
          didDragRef.current = false;
        }}
      >
        {projects.map((project, index) => {
          const midpoint = Math.floor(projects.length / 2);
          const position = (index - selectedIndex + projects.length + midpoint) % projects.length - midpoint;
          return (
            <button
              type={`button`}
              key={project.id}
              data-position={position}
              style={{ '--card-position': position } as ReelCardStyle}
              className={styles.reelCard}
              aria-haspopup={`dialog`}
              inert={Math.abs(position) > 1}
              tabIndex={position === 0 ? 0 : -1}
              aria-label={`Explore ${project.title}`}
              aria-hidden={Math.abs(position) > 1 ? true : undefined}
              onClick={event => { setSelectedIndex(index); setDetail({ index, origin: event.currentTarget.getBoundingClientRect() }); }}
            >
              <span className={styles.cardGlow} aria-hidden={`true`}>
                {Math.abs(position) <= 1 ? <ProjectImage project={project} sizes={`(max-width: 760px) 65vw, 36vw`} /> : null}
              </span>
              <span className={styles.cardSurface}>
                {Math.abs(position) <= 2 ? <ProjectImage project={project} sizes={`(max-width: 760px) 65vw, 36vw`} /> : null}
                <span className={styles.cardShade} aria-hidden={`true`} />
                <span className={styles.cardDimming} aria-hidden={`true`} />
                <span className={styles.cardGhostNumber} aria-hidden={`true`}>{project.number}</span>
                <span className={styles.cardNumber}>{project.number}<span className={styles.cardBadges}>{getProjectTopics(project).slice(0, 3).map(topic => <span key={topic}><i className={getTechnologyMeta(topic.toLowerCase()).icon} aria-hidden={`true`} />{topic}</span>)}</span></span>
                <span className={styles.cardCaption}>
                  <strong>{project.title}</strong>
                  {project.summary ? <span className={styles.cardDescription}><span>{project.summary}</span></span> : null}
                </span>
                {position === 0 ? <span key={project.id} className={styles.reelProgress} aria-hidden={`true`} onAnimationEnd={event => { if (event.target === event.currentTarget && running) setSelectedIndex(current => (current + 1) % projects.length); }} /> : null}
              </span>
            </button>
          );
        })}
      </div>
      <div className={styles.reelFooter}>
        <span className={styles.reelCount}>{selectedProject.number}<span> / {String(projects.length).padStart(2, `0`)}</span></span>
        <ProjectThumbnails projects={projects} index={selectedIndex} onSelect={setSelectedIndex} />
        <div className={styles.reelControls}>
          <button type={`button`} onClick={() => setSelectedIndex(current => (current - 1 + projects.length) % projects.length)} aria-label={`Previous project preview`} disabled={projects.length < 2}><i className={`fa-solid fa-arrow-left`} aria-hidden={`true`} /></button>
          {!reducedMotion ? <button type={`button`} onClick={() => setPaused(value => !value)} aria-pressed={paused} aria-label={paused ? `Play project slideshow` : `Pause project slideshow`}><i className={`fa-solid ${paused ? `fa-play` : `fa-pause`}`} aria-hidden={`true`} /></button> : null}
          <button type={`button`} onClick={() => setSelectedIndex(current => (current + 1) % projects.length)} aria-label={`Next project preview`} disabled={projects.length < 2}><i className={`fa-solid fa-arrow-right`} aria-hidden={`true`} /></button>
        </div>
      </div>
      {detail ? (
        <ProjectDetail
          {...detail}
          projects={projects}
          onClose={() => setDetail(null)}
          onSelect={index => { setSelectedIndex(index); setDetail(current => current ? { ...current, index } : null); }}
          getReturnRect={() => showcaseRef.current?.querySelector<HTMLButtonElement>(`[data-position="0"]`)?.getBoundingClientRect()}
        />
      ) : null}
    </div>
  );
}
