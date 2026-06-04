import Link from 'next/link';
import Logo from '../logo/logo';
import { siteConfig } from '@/shared/config/site';
import { getTechnologyMeta } from '@/shared/utils/tech';
import ProjectGrid from '@/app/components/sections/project-grid';
import HeroCircuitOverlay from '@/app/components/hero/hero-circuit-overlay';

export default function HomeLanding() {
  const page = siteConfig.pages.home;

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
          <div className={`heroCopy reveal`}>
            <span className={`eyebrow`}>
              {page.eyebrow}
            </span>
            <h1>{page.title}</h1>
            <p>{page.summary}</p>
            <div className={`heroActions`}>
              <Link href={`/contact`} className={`buttonLink primary`}>
                <i className={`fa-solid fa-paper-plane`} />
                Get In Touch
              </Link>
              <Link href={`/projects`} className={`buttonLink ghost`}>
                <i className={`fa-solid fa-diagram-project`} />
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
              {siteConfig.stats.map(stat => (
                <span key={stat.label}>
                  <strong>{stat.value}</strong>
                  {stat.label}
                </span>
              ))}
            </div>
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

      <section className={`pageSection experienceSection`}>
        <div className={`sectionInner experienceGrid`}>
          {siteConfig.stats.map(stat => (
            <article key={stat.label} className={`statCard reveal`}>
              <span>{stat.label}</span>
              <strong>{stat.value}</strong>
              <p>{stat.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className={`pageSection backendSection`}>
        <div className={`sectionInner backendGrid`}>
          <div className={`sectionTitle reveal`}>
            <span className={`eyebrow`}>Back End / API / Data</span>
            <h2>Built for the parts recruiters actually inspect</h2>
            <p>Python, JSON, SQL, REST, Firebase, WordPress/MySQL, Shopify thinking, auth, and responsive UI are organized as a real app foundation instead of a one-off portfolio page.</p>
          </div>
          <div className={`capabilityGrid reveal`}>
            {siteConfig.capabilities.map(capability => {
              const meta = getTechnologyMeta(capability);
              return (
                <span key={capability}>
                  <i className={`${meta.icon} techIcon ${meta.className}`} />
                  <strong>{capability}</strong>
                </span>
              );
            })}
          </div>
        </div>
      </section>

      <section className={`pageSection skillsSection`}>
        <div className={`sectionInner`}>
          <div className={`sectionTitle reveal`}>
            <span className={`eyebrow`}>Skills // Refined</span>
            <h2>Front-end polish backed by full-stack range</h2>
          </div>
          <div className={`skillsGrid`}>
            {siteConfig.skills.map(skill => {
              const meta = getTechnologyMeta(skill.label);
              return (
                <article key={skill.label} className={`skillTile reveal`}>
                  <i className={`${skill.icon || meta.icon} techIcon ${meta.className}`} />
                  <span>{skill.group}</span>
                  <strong>{skill.label}</strong>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className={`pageSection servicesSection`}>
        <div className={`sectionInner`}>
          <div className={`sectionTitle reveal`}>
            <span className={`eyebrow`}>Services</span>
            <h2>Useful enough for clients, sharp enough for hiring teams</h2>
          </div>
          <div className={`serviceGrid`}>
            {siteConfig.services.map(service => (
              <article key={service.title} className={`serviceCard reveal`}>
                <i className={service.icon} />
                <h3>{service.title}</h3>
                <p>{service.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className={`pageSection gallerySection`}>
        <div className={`sectionInner`}>
          <div className={`sectionTitle reveal`}>
            <span className={`eyebrow`}>Gallery</span>
            <h2>Visual buckets for the next portfolio pass</h2>
          </div>
          <div className={`galleryGrid`}>
            {siteConfig.gallery.map(item => {
              const meta = getTechnologyMeta(item);
              return (
                <article key={item} className={`galleryTile reveal`}>
                  <i className={`${meta.icon} techIcon ${meta.className}`} />
                  <strong>{item}</strong>
                  <span>Portfolio Asset</span>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className={`pageSection contactSection`}>
        <div className={`sectionInner contactBand reveal`}>
          <span className={`eyebrow`}>Contact</span>
          <h2>Ready for the next version</h2>
          <p>This first Next pass keeps the structure lean while setting up the app shell, pages, auth surface, PWA pieces, API route, and future Firebase growth path.</p>
          <a href={`mailto:${siteConfig.contactEmail}`} className={`buttonLink primary`}>
            <i className={`fa-solid fa-paper-plane`} />
            {siteConfig.contactEmail}
          </a>
        </div>
      </section>
    </>
  );
}
