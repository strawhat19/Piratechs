'use client';

import Link from 'next/link';
import dynamic from 'next/dynamic';
import { createPortal } from 'react-dom';
import { useLayoutEffect, useRef, useState, type CSSProperties } from 'react';

export type LandingFeaturedProject = {
  codeUrl?: string;
  id: string;
  liveUrl?: string;
  mediaURL?: string;
  name: string;
  number: string;
  status: string;
  summary: string;
  title: string;
  topics: string[];
  technologies?: string[];
  viewHref: string;
};

type LandingFeaturedProjectsProps = {
  projects: LandingFeaturedProject[];
  www?: boolean;
};

type ProjectRailStyle = CSSProperties & {
  '--landing-project-focus': number;
};

const getWrappedIndex = (index: number, count: number) => (index + count) % count;
const FeaturedProjectShowcase = dynamic(() => import('./featured-project-showcase'));

export default function LandingFeaturedProjects({ projects, www = false }: LandingFeaturedProjectsProps) {
  return www ? <FeaturedProjectShowcase projects={projects} /> : <LandingFeaturedProjectsClassic projects={projects} />;
}

function LandingFeaturedProjectsClassic({ projects, www = false }: LandingFeaturedProjectsProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const deckRef = useRef<HTMLElement>(null);
  const projectTriggerRef = useRef<HTMLButtonElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const activeProject = activeIndex == null ? null : projects?.[activeIndex];

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const reducedMotion = window.matchMedia(`(prefers-reduced-motion: reduce)`).matches;
    if (reducedMotion) {
      section.style.setProperty(`--landing-project-focus`, `1`);
      return () => section.style.removeProperty(`--landing-project-focus`);
    }

    let animationFrame = 0;
    const updateFocus = () => {
      animationFrame = 0;
      const rect = section.getBoundingClientRect();
      const viewportCenter = window.innerHeight / 2;
      const sectionCenter = rect.top + rect.height / 2;
      const focusRange = viewportCenter + rect.height / 2;
      const linearFocus = 1 - Math.min(1, Math.abs(sectionCenter - viewportCenter) / focusRange);
      const easedFocus = linearFocus * linearFocus * (3 - 2 * linearFocus);
      section.style.setProperty(`--landing-project-focus`, easedFocus.toFixed(4));
    };
    const scheduleFocusUpdate = () => {
      if (animationFrame) return;
      animationFrame = window.requestAnimationFrame(updateFocus);
    };

    scheduleFocusUpdate();
    window.addEventListener(`scroll`, scheduleFocusUpdate, { passive: true });
    window.addEventListener(`resize`, scheduleFocusUpdate);

    return () => {
      window.cancelAnimationFrame(animationFrame);
      section.style.removeProperty(`--landing-project-focus`);
      window.removeEventListener(`scroll`, scheduleFocusUpdate);
      window.removeEventListener(`resize`, scheduleFocusUpdate);
    };
  }, []);

  useLayoutEffect(() => {
    if (activeIndex == null) return;

    document.body.classList.add(`landingProjectDeckOpen`);
    const handleKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key == `Escape`) {
        setActiveIndex(null);
        window.requestAnimationFrame(() => projectTriggerRef.current?.focus());
      }
      if (event.key == `ArrowLeft`) setActiveIndex(index => index == null ? null : getWrappedIndex(index - 1, projects.length));
      if (event.key == `ArrowRight`) setActiveIndex(index => index == null ? null : getWrappedIndex(index + 1, projects.length));
      if (event.key != `Tab`) return;
      const focusableElements = Array.from(deckRef.current?.querySelectorAll<HTMLElement>(`a[href], button:not([disabled])`) ?? []);
      const firstElement = focusableElements?.[0];
      const lastElement = focusableElements?.at(-1);
      if (event.shiftKey && document.activeElement == firstElement) {
        event.preventDefault();
        lastElement?.focus();
      } else if (!event.shiftKey && document.activeElement == lastElement) {
        event.preventDefault();
        firstElement?.focus();
      }
    };
    window.addEventListener(`keydown`, handleKeyDown);
    window.requestAnimationFrame(() => closeButtonRef.current?.focus());

    return () => {
      document.body.classList.remove(`landingProjectDeckOpen`);
      window.removeEventListener(`keydown`, handleKeyDown);
    };
  }, [activeIndex, projects.length]);

  const closeProject = () => {
    setActiveIndex(null);
    window.requestAnimationFrame(() => projectTriggerRef.current?.focus());
  };
  const showPreviousProject = () => setActiveIndex(index => index == null ? null : getWrappedIndex(index - 1, projects.length));
  const showNextProject = () => setActiveIndex(index => index == null ? null : getWrappedIndex(index + 1, projects.length));

  const renderProjectSet = (copy: number) => (
    <div className={`landingFeaturedProjectSet`} aria-hidden={copy == 1 ? `true` : undefined} key={copy}>
      {projects.map((project, index) => (
        <button
          type={`button`}
          key={project.id}
          tabIndex={copy == 1 ? -1 : 0}
          data-project-index={copy == 0 ? index : undefined}
          className={`landingFeaturedProjectCard`}
          onClick={event => {
            projectTriggerRef.current = event.currentTarget;
            setActiveIndex(index);
          }}
          aria-label={`Open ${project.title} project details`}
        >
          {project.mediaURL ? <img src={project.mediaURL} alt={``} draggable={`false`} loading={`lazy`} /> : null}
          <span className={`landingFeaturedProjectShade`} aria-hidden={`true`} />
          <span className={`landingFeaturedProjectMeta`}>
            <small>{project.number}</small>
          </span>
          <span className={`landingFeaturedProjectCopy`}>
            <strong>{project.title}</strong>
            <span className={`landingFeaturedProjectTopics`}>
              {project.topics.slice(0, 3).map(topic => <i key={topic}>{topic}</i>)}
            </span>
          </span>
        </button>
      ))}
    </div>
  );

  const detailView = activeProject && typeof document != `undefined` ? createPortal(
    <div
      role={`presentation`}
      className={`landingProjectDeckBackdrop`}
      onMouseDown={event => event.target == event.currentTarget && closeProject()}
    >
      <section
        ref={deckRef}
        role={`dialog`}
        aria-modal={`true`}
        className={`landingProjectDeck`}
        aria-labelledby={`landing-project-deck-title`}
      >
        <header className={`landingProjectDeckHeader`}>
          <span><i /> {`Flight Deck // Featured Work`}</span>
          <span>{activeProject.number} / {String(projects.length).padStart(2, `0`)}</span>
          <button ref={closeButtonRef} type={`button`} onClick={closeProject} aria-label={`Back to landing page`}>
            <i className={`fa-solid fa-xmark`} aria-hidden={`true`} />
          </button>
        </header>

        <div className={`landingProjectDeckBody`}>
          <div className={`landingProjectDeckVisual`}>
            {activeProject.mediaURL ? <img src={activeProject.mediaURL} alt={`${activeProject.title} project preview`} /> : null}
            <span className={`landingProjectDeckScan`} aria-hidden={`true`} />
            <span className={`landingProjectDeckCoordinate landingProjectDeckCoordinateTop`} aria-hidden={`true`}>{`P-${activeProject.number} // ONLINE`}</span>
            <span className={`landingProjectDeckCoordinate landingProjectDeckCoordinateBottom`} aria-hidden={`true`}>{`PIRATECHS // PROJECT ARCHIVE`}</span>
          </div>

          <div className={`landingProjectDeckCopy`}>
            <div className={`landingProjectDeckStatus`}><i /> {activeProject.status}</div>
            <h2 id={`landing-project-deck-title`}>{activeProject.title}</h2>
            <p>{activeProject.summary}</p>
            <ul aria-label={`${activeProject.title} technologies`}>
              {activeProject.topics.map(topic => <li key={topic}>{topic}</li>)}
            </ul>
            <div className={`landingProjectDeckActions`}>
              <Link className={`buttonLink primary`} href={activeProject.viewHref}>
                Full Project View <i className={`fa-solid fa-arrow-right`} />
              </Link>
              {www && activeProject.liveUrl ? (
                <a className={`buttonLink ghost`} href={activeProject.liveUrl} rel={`noreferrer`} target={`_blank`}>
                  Visit Site <i className={`fa-solid fa-arrow-up-right-from-square`} />
                </a>
              ) : null}
              {activeProject.codeUrl ? (
                <a className={`landingProjectDeckCode`} href={activeProject.codeUrl} rel={`noreferrer`} target={`_blank`} aria-label={`View ${activeProject.title} on Github`}>
                  <i className={`fa-brands fa-github`} />
                </a>
              ) : null}
            </div>
          </div>
        </div>

        <footer className={`landingProjectDeckFooter`}>
          <button type={`button`} onClick={showPreviousProject} aria-label={`Previous featured project`}>
            <i className={`fa-solid fa-arrow-left`} /><span>Previous</span>
          </button>
          <div className={`landingProjectDeckRail`} aria-label={`Choose a featured project`}>
            {projects.map((project, index) => (
              <button
                type={`button`}
                key={project.id}
                onClick={() => setActiveIndex(index)}
                aria-label={`Open ${project.title}`}
                aria-current={index == activeIndex ? `true` : undefined}
              >
                {project.mediaURL ? <img src={project.mediaURL} alt={``} /> : null}
                <span>{project.number}</span>
              </button>
            ))}
          </div>
          <button type={`button`} onClick={showNextProject} aria-label={`Next featured project`}>
            <span>Next</span><i className={`fa-solid fa-arrow-right`} />
          </button>
        </footer>
      </section>
    </div>,
    document.body,
  ) : null;

  return (
    <>
      <div
        ref={sectionRef}
        data-www={www}
        className={`landingFeaturedProjects ${activeProject ? `landingFeaturedProjectsOpen` : ``}`}
        style={{ '--landing-project-focus': 0 } as ProjectRailStyle}
      >
        <div className={`landingFeaturedProjectViewport`}>
          <div className={`landingFeaturedProjectTrack`}>
            {[0, 1].map(renderProjectSet)}
          </div>
        </div>
        <span className={`landingFeaturedProjectHint`}><i className={`fa-solid fa-arrow-pointer`} /> Select a project to board</span>
      </div>
      {detailView}
    </>
  );
}
