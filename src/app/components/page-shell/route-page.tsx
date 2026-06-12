'use client';

import Link from 'next/link';
import HeroBg from '../hero/hero-bg';
import Section from '../sections/section';
import HeroContent from '../hero/hero-content';
import { config } from '@/shared/config/config';
import type { RouteID } from '@/shared/types/app';
import { getTechnologyMeta } from '@/shared/utils/tech';
import TextReveal from '@/app/components/effects/text-reveal';
import ElementReveal from '@/app/components/effects/element-reveal';

export default function RoutePage({ pageID }: { pageID: RouteID }) {
  const page: any = config?.pages?.[pageID];
  return (
    <>
      <section className={`pageSection heroSection subHero subPageSection`}>
        <HeroBg />
        <HeroContent
          start={
            <>
              <div className={`heroBannerText`}>
                <TextReveal as={`span`} className={`eyebrow`} text={page.eyebrow} delay={0.4} />
                {page?.html ? (
                  <TextReveal as={`h1`} className={`bannerText`} text={page.html} html delay={0.1} />
                ) : (
                  <TextReveal as={`h1`} className={`bannerText`} text={page.title} delay={0.1} />
                )}
                {page?.summaryHtml ? (
                  <TextReveal as={`p`} className={`bannerText`} text={`<i>${page?.summaryHtml}</i>`} html />
                ) : (
                  <TextReveal as={`p`} className={`bannerText`} text={`<i>${page?.summary}</i>`} html />
                )}
              </div>
              <div className={`heroActions`}>
                <ElementReveal as={`span`} delay={0.22} className={`heroActionReveal`}>
                  <Link href={`/projects`} className={`buttonLink primary`}>
                    <ElementReveal delay={0.23}>
                      <i className={`fa-solid fa-diagram-project logoLetter`} />
                    </ElementReveal>
                    <TextReveal as={`span`} className={`logoLetter`} text={`Our Work`} delay={0.24} />
                  </Link>
                </ElementReveal>
                <ElementReveal as={`span`} delay={0.28} className={`heroActionReveal`}>
                  <Link href={`/contact`} className={`buttonLink ghost`}>
                    <ElementReveal delay={0.29}>
                      <i className={`fa-solid fa-paper-plane gradientTextColor logoLetter`} />
                    </ElementReveal>
                    <TextReveal as={`span`} className={`logoLetter`} text={`Get In Touch`} delay={0.3} />
                  </Link>
                </ElementReveal>
              </div>
            </>
          }
          end={
            <ElementReveal className={`heroEnd pageBadge`} as={`div`} delay={0.28} y={16}>
              <i className={`${config.nav.find(item => item.id == pageID)?.icon ?? `fa-solid fa-code`} gradientTextColor`} />
              <TextReveal as={`span`} text={page.eyebrow} delay={0.3} />
            </ElementReveal>
          }
        />
      </section>

      <div id={`anchor`} className={`sep reveal`} />

      {pageID == `projects` ? <Section /> : <>
        <section className={`pageSection detailSection subPageSection`}>
          <div className={`sectionInner detailGrid`}>
            <div className={`sectionTitle`}>
              <TextReveal scroll as={`span`} className={`eyebrow`} text={page?.eyebrow} />
              <TextReveal scroll as={`h2`} text={`What We Do`} delay={0.06} />
              <TextReveal scroll as={`p`} html text={`<i>${page.summary}</i>`} />
            </div>
            <div className={`detailCards`}>
              {config.capabilities.slice(0, 6).map(capability => {
                const meta = getTechnologyMeta(capability);
                return (
                  <article key={capability} className={`serviceCard reveal`}>
                    <i className={`${meta.icon} techIcon ${meta.className}`} />
                    <TextReveal scroll as={`h3`} text={capability} />
                    <TextReveal scroll as={`p`} text={`This page can grow into a dedicated section with content, filters, and links.`} />
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <div className={`sep reveal`} />
        
      </>}
    </>
  );
}
