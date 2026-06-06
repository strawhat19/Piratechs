import Link from 'next/link';
import { config } from '@/shared/config/config';
import type { RouteID } from '@/shared/types/app';
import { getTechnologyMeta } from '@/shared/utils/tech';
import TextReveal from '@/app/components/effects/text-reveal';
import ProjectGrid from '@/app/components/sections/project-grid';
import HeroCircuitOverlay from '@/app/components/hero/hero-circuit-overlay';

export default function RoutePage({ pageID }: { pageID: RouteID }) {
  const page: any = config?.pages?.[pageID];
  return (
    <>
      <section className={`pageSection heroSection subHero subPageSection`}>
        <div className={`heroBg`}>
          <HeroCircuitOverlay />
          <span className={`gridPlane gridPlaneA`} />
          <span className={`gridPlane gridPlaneB`} />
          <span className={`signalLine signalLineA`} />
          <span className={`signalLine signalLineB`} />
        </div>
        <div className={`sectionInner heroGrid`}>
          <div className={`heroCopy`}>
            <div className={`heroBannerText`}>
              <TextReveal as={`span`} className={`eyebrow`} text={page.eyebrow} />
              {page?.html ? (
                <TextReveal as={`h1`} className={`bannerText`} text={page.html} html delay={0.1} />
              ) : (
                <TextReveal as={`h1`} className={`bannerText`} text={page.title} delay={0.1} />
              )}
              <TextReveal as={`p`} className={`bannerText`} text={`<i>${page.summary}</i>`} html />
            </div>
            <div className={`heroActions reveal`}>
              <Link href={`/projects`} className={`buttonLink primary`}>
                <i className={`fa-solid fa-diagram-project`} />
                View Projects
              </Link>
              <Link href={`/contact`} className={`buttonLink ghost`}>
                <i className={`fa-solid fa-paper-plane gradientTextColor`} />
                Contact
              </Link>
            </div>
          </div>
          <div className={`pageBadge reveal`}>
            <i className={`${config.nav.find(item => item.id == pageID)?.icon ?? `fa-solid fa-code`} gradientTextColor`} />
            <span>{page.eyebrow}</span>
          </div>
        </div>
      </section>

      <section className={`pageSection detailSection subPageSection`}>
        <div className={`sectionInner detailGrid`}>
          <div className={`sectionTitle reveal`}>
            <span className={`eyebrow`}>
              {pageID == `projects` ? `Our Work` : page?.eyebrow}
            </span>
            <h2>{pageID == `projects` ? `Projects` : `What We Do`}</h2>
            <p>
              <i>
                {page.summary}
              </i>
            </p>
          </div>
          {pageID == `projects` ? (
            <ProjectGrid />
          ) : (
            <div className={`detailCards`}>
              {config.capabilities.slice(0, 6).map(capability => {
                const meta = getTechnologyMeta(capability);
                return (
                  <article key={capability} className={`serviceCard reveal`}>
                    <i className={`${meta.icon} techIcon ${meta.className}`} />
                    <h3>{capability}</h3>
                    <p>This page can grow into a dedicated Piratechs section with content, API data, Firebase records, filters, and project links.</p>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
