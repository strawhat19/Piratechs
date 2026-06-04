import Link from 'next/link';
import HeroCircuitOverlay from '@/app/components/hero/hero-circuit-overlay';
import ProjectGrid from '@/app/components/sections/project-grid';
import { siteConfig } from '@/shared/config/site';
import { getTechnologyMeta } from '@/shared/utils/tech';
import type { RouteID } from '@/shared/types/site';

export default function RoutePage({ pageID }: { pageID: RouteID }) {
  const page = siteConfig.pages[pageID];

  return (
    <>
      <section className={`pageSection heroSection subHero`}>
        <div className={`heroBg`}>
          <HeroCircuitOverlay />
          <span className={`gridPlane gridPlaneA`} />
          <span className={`signalLine signalLineA`} />
        </div>
        <div className={`sectionInner heroGrid`}>
          <div className={`heroCopy reveal`}>
            <span className={`eyebrow`}>{page.eyebrow}</span>
            <h1>{page.title}</h1>
            <p>{page.summary}</p>
            <div className={`heroActions`}>
              <Link href={`/projects`} className={`buttonLink primary`}>
                <i className={`fa-solid fa-diagram-project`} />
                View Projects
              </Link>
              <Link href={`/contact`} className={`buttonLink ghost`}>
                <i className={`fa-solid fa-paper-plane`} />
                Contact
              </Link>
            </div>
          </div>
          <div className={`pageBadge reveal`}>
            <i className={siteConfig.nav.find(item => item.id == pageID)?.icon ?? `fa-solid fa-code`} />
            <span>{page.eyebrow}</span>
          </div>
        </div>
      </section>

      <section className={`pageSection detailSection`}>
        <div className={`sectionInner detailGrid`}>
          <div className={`sectionTitle reveal`}>
            <span className={`eyebrow`}>{page.eyebrow} Direction</span>
            <h2>{pageID == `projects` ? `Portfolio work stays prominent` : `A focused route ready to expand`}</h2>
            <p>{page.summary}</p>
          </div>
          {pageID == `projects` ? (
            <ProjectGrid />
          ) : (
            <div className={`detailCards`}>
              {siteConfig.capabilities.slice(0, 6).map(capability => {
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
