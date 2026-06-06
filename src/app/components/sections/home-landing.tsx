import Link from 'next/link';
import Logo from '../logo/logo';
import { config } from '@/shared/config/config';
import { getTechnologyMeta } from '@/shared/utils/tech';
import TextReveal from '@/app/components/effects/text-reveal';
import ProjectGrid from '@/app/components/sections/project-grid';
import HeroCircuitOverlay from '@/app/components/hero/hero-circuit-overlay';

export default function HomeLanding() {
  const page: any = config?.pages?.home;
  return (
    <>
      <section className={`pageSection heroSection`}>
        <div className={`heroBg`}>
          <HeroCircuitOverlay />
          <span className={`gridPlane gridPlaneA`} />
          <span className={`gridPlane gridPlaneB`} />
          <span className={`signalLine signalLineA`} />
          <span className={`signalLine signalLineB`} />
        </div>
        <div className={`sectionInner heroGrid`}>
          <div className={`heroCopy`}>
            <TextReveal as={`span`} className={`eyebrow`} text={page.eyebrow} />
            {page?.html ? (
              <TextReveal as={`h1`} className={`bannerText`} text={page.html} html delay={0.1} />
            ) : (
              <TextReveal as={`h1`} className={`bannerText`} text={page.title} delay={0.1} />
            )}
            <TextReveal as={`p`} className={`bannerText`} text={page.summary} />
            <div className={`heroActions reveal`}>
              <Link href={`/contact`} className={`buttonLink primary`}>
                <i className={`fa-solid fa-paper-plane`} />
                Get In Touch
              </Link>
              <Link href={`/projects`} className={`buttonLink ghost`}>
                <i className={`fa-solid fa-diagram-project gradientTextColor`} />
                Projects
              </Link>
            </div>
          </div>
          <div className={`heroBrand reveal`}>
            <div className={`heroLogoPlate`}>
              <span className={`heroOrbit`} />
              <Logo className={`heroLogo`} />
            </div>
            <div className={`heroMiniStats`}>
              {config.stats.map((stat, index) => (
                <span key={stat.label}>
                  <TextReveal as={`strong`} className={`gradientTextColor`} text={stat.value} delay={0.39 + index * 0.06} />
                  <TextReveal as={`i`} text={stat.label} delay={0.42 + index * 0.06} />
                </span>
              ))}
            </div>
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
              <TextReveal scroll as={`p`} html text={`<i>${stat.text}</i>`} delay={0.12} />
            </article>
          ))}
        </div>
      </section>

      <section className={`pageSection backendSection`}>
        <div className={`sectionInner backendGrid`}>
          <div className={`sectionTitle`}>
            <TextReveal scroll as={`span`} className={`eyebrow`} text={`Back End // API // Data`} />
            <TextReveal scroll as={`h2`} text={`Built for the parts recruiters actually inspect`} delay={0.06} />
            <TextReveal scroll as={`p`} text={`Python, JSON, SQL, REST, Firebase, WordPress/MySQL, Shopify thinking, auth, and responsive UI are organized as a real app foundation instead of a one-off portfolio page.`} />
          </div>
          <div className={`capabilityGrid reveal`}>
            {config.capabilities.map(capability => {
              const meta = getTechnologyMeta(capability);
              return (
                <span key={capability}>
                  <i className={`${meta.icon} techIcon ${meta.className}`} />
                  <TextReveal scroll as={`strong`} text={capability} />
                </span>
              );
            })}
          </div>
        </div>
      </section>

      <section className={`pageSection skillsSection`}>
        <div className={`sectionInner`}>
          <div className={`sectionTitle`}>
            <TextReveal scroll as={`span`} className={`eyebrow`} text={`Skills // Refined`} />
            <TextReveal scroll as={`h2`} text={`Front-end polish backed by full-stack range`} delay={0.06} />
          </div>
          <div className={`skillsGrid`}>
            {config.skills.map(skill => {
              const meta = getTechnologyMeta(skill.label);
              return (
                <article key={skill.label} className={`skillTile reveal`}>
                  <i className={`${skill.icon || meta.icon} techIcon ${meta.className}`} />
                  <TextReveal scroll as={`span`} className={`gradientTextColor`} text={skill.group} />
                  <TextReveal scroll as={`strong`} text={skill.label} delay={0.06} />
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className={`pageSection servicesSection`}>
        <div className={`sectionInner`}>
          <div className={`sectionTitle`}>
            <TextReveal scroll as={`span`} className={`eyebrow`} text={`Services`} />
            <TextReveal scroll as={`h2`} text={`Useful enough for clients, sharp enough for hiring teams`} delay={0.06} />
          </div>
          <div className={`serviceGrid`}>
            {config.services.map(service => (
              <article key={service.title} className={`serviceCard reveal`}>
                <i className={`${service.icon} gradientTextColor`} />
                <TextReveal scroll as={`h3`} html text={`<i>${service.title}</i>`} />
                <TextReveal scroll as={`p`} text={service.text} />
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className={`pageSection contactSection`}>
        <div className={`sectionInner contactBand`}>
          <TextReveal scroll as={`span`} className={`eyebrow`} text={`Contact`} />
          <TextReveal scroll as={`h2`} text={`Ready for the next version`} delay={0.06} />
          <TextReveal scroll as={`p`} html text={`<i>This first Next pass keeps the structure lean while setting up the app shell, pages, auth surface, PWA pieces, API route, and future Firebase growth path.</i>`} />
          <a href={`mailto:${config.contactEmail}`} className={`buttonLink primary reveal`}>
            <i className={`fa-solid fa-paper-plane`} />
            {config.contactEmail}
          </a>
        </div>
      </section>
    </>
  );
}
