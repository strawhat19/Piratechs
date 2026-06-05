import Link from 'next/link';
import { config } from '@/shared/config/config';
import type { RouteID } from '@/shared/types/app';
import { getTechnologyMeta } from '@/shared/utils/tech';
import ProjectGrid from '@/app/components/sections/project-grid';
import HeroCircuitOverlay from '@/app/components/hero/hero-circuit-overlay';

export default function RoutePage({ pageID }: { pageID: RouteID }) {
  const page: any = config?.pages?.[pageID];
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
            <div className={`heroBannerText`}>
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
            </div>
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
            <i className={config.nav.find(item => item.id == pageID)?.icon ?? `fa-solid fa-code`} />
            <span>{page.eyebrow}</span>
          </div>
        </div>
      </section>

      <section className={`pageSection detailSection`}>
        <div className={`sectionInner detailGrid`}>
          <div className={`sectionTitle reveal`}>
            <span className={`eyebrow`}>
              {page.eyebrow} Direction
            </span>
            <h2>{pageID == `projects` ? `Portfolio work stays prominent` : `A focused route ready to expand`}</h2>
            <p>{page.summary}</p>
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
