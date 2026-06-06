import Link from 'next/link';
import { config } from '@/shared/config/config';
import ProjectGrid from './components/sections/project-grid';
import HeroCircuitOverlay from './components/hero/hero-circuit-overlay';

export default function NotFound() {
  return <>
    <section className={`pageSection heroSection subHero`}>
      <div className={`heroBg`}>
        <HeroCircuitOverlay />
        <span className={`gridPlane gridPlaneA`} />
        <span className={`gridPlane gridPlaneB`} />
        <span className={`signalLine signalLineA`} />
        <span className={`signalLine signalLineB`} />
      </div>
      <div className={`sectionInner heroGrid`}>
        <div className={`heroCopy reveal`}>
          <span className={`eyebrow`}>
            404
          </span>
          <h1>Not Found</h1>
          <p>
            <i>
              We could not find what you were looking for.
            </i>
          </p>
          <div className={`heroActions`}>
            <Link href={`/`} className={`buttonLink primary`}>
              <i className={`fa-solid fa-house`} />
              Home
            </Link>
            <Link href={`/projects`} className={`buttonLink ghost`}>
              <i className={`fa-solid fa-diagram-project gradientTextColor`} />
              Projects
            </Link>
          </div>
        </div>
        <div className={`pageBadge reveal`}>
          <i className={`fa-solid fa-ban gradientTextColor`} />
          <span>404</span>
        </div>
      </div>
    </section>
    
    <section className={`pageSection projectsSection`} id={`projects`}>
      <div className={`sectionInner`}>
        <div className={`sectionTitle reveal`}>
          <span className={`eyebrow`}>
            Our Work
          </span>
          <h2>Projects</h2>
          <p>Applications, CMS, APIs, Games, and other Design // Development.</p>
        </div>
        <ProjectGrid featuredOnly />
      </div>
    </section>

    <div className={`sep reveal`} />

    <section className={`pageSection experienceSection`}>
      <div className={`sectionInner experienceGrid`}>
        {config.stats.map(stat => (
          <article key={stat.label} className={`statCard reveal`}>
            <span className={`gradientTextColor`}>
              <i>
                {stat.label}
              </i>
            </span>
            <strong>{stat.value}</strong>
            <p>
              <i>{stat.text}</i>
            </p>
          </article>
        ))}
      </div>
    </section>
  </>;
}
