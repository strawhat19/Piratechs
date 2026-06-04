import Link from 'next/link';

export default function NotFound() {
  return (
    <section className={`pageSection heroSection subHero`}>
      <div className={`heroBg`}>
        <span className={`gridPlane gridPlaneA`} />
      </div>
      <div className={`sectionInner heroGrid`}>
        <div className={`heroCopy`}>
          <span className={`eyebrow`}>404</span>
          <h1>Route not found</h1>
          <p>This Piratechs route is not wired up yet, but the app shell is ready for it.</p>
          <div className={`heroActions`}>
            <Link href={`/`} className={`buttonLink primary`}>
              <i className={`fa-solid fa-house`} />
              Home
            </Link>
            <Link href={`/projects`} className={`buttonLink ghost`}>
              <i className={`fa-solid fa-diagram-project`} />
              Projects
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
