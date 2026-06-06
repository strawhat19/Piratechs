import Link from 'next/link';
import { config } from '@/shared/config/config';
import TextReveal from './components/effects/text-reveal';
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
        <div className={`heroCopy`}>
          <TextReveal as={`span`} className={`eyebrow`} text={`404`} />
          <TextReveal as={`h1`} className={`bannerText`} text={`Not Found`} delay={0.1} />
          <TextReveal as={`p`} className={`bannerText`} text={`<i>We could not find what you were looking for.</i>`} html />
          <div className={`heroActions reveal`}>
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
          <TextReveal as={`span`} text={`404`} delay={0.3} />
        </div>
      </div>
    </section>
    
    <section className={`pageSection projectsSection`} id={`projects`}>
      <div className={`sectionInner`}>
        <div className={`sectionTitle`}>
          <TextReveal scroll as={`span`} className={`eyebrow`} text={`Our Work`} />
          <TextReveal scroll as={`h2`} text={`Projects`} delay={0.06} />
          <TextReveal scroll as={`p`} text={`Applications, CMS, APIs, Games, and other Design // Development.`} />
        </div>
        <ProjectGrid featuredOnly />
      </div>
    </section>

    <div className={`sep reveal`} />

    <section className={`pageSection experienceSection`}>
      <div className={`sectionInner experienceGrid`}>
        {config.stats.map(stat => (
          <article key={stat.label} className={`statCard reveal`}>
            <TextReveal scroll as={`span`} className={`gradientTextColor`} html text={`<i>${stat.label}</i>`} />
            <TextReveal scroll as={`strong`} text={stat.value} delay={0.06} />
            <TextReveal scroll as={`p`} html text={`<i>${stat.text}</i>`} />
          </article>
        ))}
      </div>
    </section>
  </>;
}
