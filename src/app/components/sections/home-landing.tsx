import Link from 'next/link';
import Logo from '../logo/logo';
import { config } from '@/shared/config/config';
import { getTechnologyMeta } from '@/shared/utils/tech';
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
          <div className={`heroCopy reveal`}>
            <span className={`eyebrow`}>
              {page.eyebrow}
            </span>
            {page?.html ? (
              <h1 className={`bannerText`} dangerouslySetInnerHTML={{__html: page?.html}} />
            ) : (
              <h1 className={`bannerText`}>
                {page.title}
              </h1>
            )}
            <p className={`bannerText`}>
              {page.summary}
            </p>
            <div className={`heroActions`}>
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
              {config.stats.map(stat => (
                <span key={stat.label}>
                  <strong className={`gradientTextColor`}>
                    {stat.value}
                  </strong>
                  <i>{stat.label}</i>
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

      <section className={`pageSection backendSection`}>
        <div className={`sectionInner backendGrid`}>
          <div className={`sectionTitle reveal`}>
            <span className={`eyebrow`}>
              Back End // API // Data
            </span>
            <h2>Built for the parts recruiters actually inspect</h2>
            <p>Python, JSON, SQL, REST, Firebase, WordPress/MySQL, Shopify thinking, auth, and responsive UI are organized as a real app foundation instead of a one-off portfolio page.</p>
          </div>
          <div className={`capabilityGrid reveal`}>
            {config.capabilities.map(capability => {
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
            <span className={`eyebrow`}>
              Skills // Refined
            </span>
            <h2>Front-end polish backed by full-stack range</h2>
          </div>
          <div className={`skillsGrid`}>
            {config.skills.map(skill => {
              const meta = getTechnologyMeta(skill.label);
              return (
                <article key={skill.label} className={`skillTile reveal`}>
                  <i className={`${skill.icon || meta.icon} techIcon ${meta.className}`} />
                  <span className={`gradientTextColor`}>
                    {skill.group}
                  </span>
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
            <span className={`eyebrow`}>
              Services
            </span>
            <h2>Useful enough for clients, sharp enough for hiring teams</h2>
          </div>
          <div className={`serviceGrid`}>
            {config.services.map(service => (
              <article key={service.title} className={`serviceCard reveal`}>
                <i className={`${service.icon} gradientTextColor`} />
                <h3><i>{service.title}</i></h3>
                <p>{service.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* <section className={`pageSection gallerySection`}>
        <div className={`sectionInner`}>
          <div className={`sectionTitle reveal`}>
            <span className={`eyebrow`}>
              Gallery
            </span>
            <h2>Visual buckets for the next portfolio pass</h2>
          </div>
          <div className={`galleryGrid`}>
            {config.gallery.map(item => {
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
      </section> */}

      <section className={`pageSection contactSection`}>
        <div className={`sectionInner contactBand reveal`}>
          <span className={`eyebrow`}>
            Contact
          </span>
          <h2>Ready for the next version</h2>
          <p>
            <i>
              This first Next pass keeps the structure lean while setting up the app shell, pages, auth surface, PWA pieces, API route, and future Firebase growth path.
            </i>
          </p>
          <a href={`mailto:${config.contactEmail}`} className={`buttonLink primary`}>
            <i className={`fa-solid fa-paper-plane`} />
            {config.contactEmail}
          </a>
        </div>
      </section>
    </>
  );
}
