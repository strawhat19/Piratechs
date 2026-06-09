'use client';

import Link from 'next/link';
import Logo from '../logo/logo';
import Word from '../logo/word';
import { config } from '@/shared/config/config';
import { getTechnologyMeta } from '@/shared/utils/tech';
import TextReveal from '@/app/components/effects/text-reveal';
import { scrollToElement } from '@/shared/common/scripts/globals';
import ElementReveal from '@/app/components/effects/element-reveal';
import HeroCircuitOverlay from '@/app/components/hero/hero-circuit-overlay';

export default function HomeLanding() {
  const page: any = config?.pages?.home;
  return (
    <>
      <section className={`pageSection heroSection`}>
        <div className={`heroBgClip`}>
          <div className={`heroBg`}>
            <HeroCircuitOverlay />
            <span className={`gridPlane gridPlaneA`} />
            <span className={`gridPlane gridPlaneB`} />
            <span className={`signalLine signalLineA`} />
            <span className={`signalLine signalLineB`} />
          </div>
        </div>
        <div className={`sectionInner heroGrid`}>
          <div className={`heroCopy`}>
            <TextReveal as={`span`} className={`eyebrow`} text={page.eyebrow} delay={0.4} />
            {page?.html ? (
              <TextReveal as={`h1`} className={`bannerText`} text={page.html} html delay={0.1} />
            ) : (
              <TextReveal as={`h1`} className={`bannerText`} text={page.title} delay={0.1} />
            )}
            {page?.summaryHtml ? (
              <TextReveal as={`p`} className={`bannerText`} text={page.summaryHtml} html />
            ) : (
              <TextReveal as={`p`} className={`bannerText`} text={page.summary} />
            )}
            <div className={`heroActions`}>
              <ElementReveal as={`span`} delay={0.22} className={`heroActionReveal`}>
                <Link href={`/contact`} className={`buttonLink primary`}>
                  <ElementReveal delay={0.23}>
                    <i className={`fa-solid fa-paper-plane logoLetter`} />
                  </ElementReveal>
                  <TextReveal as={`span`} className={`logoLetter`} text={`Get In Touch`} delay={0.24} />
                </Link>
              </ElementReveal>
              <ElementReveal as={`span`} delay={0.28} className={`heroActionReveal`}>
                <Link href={`/projects`} className={`buttonLink ghost`}>
                  <ElementReveal delay={0.29}>
                    <i className={`fa-solid fa-diagram-project gradientTextColor logoLetter`} />
                  </ElementReveal>
                  <TextReveal as={`span`} className={`logoLetter`} text={`Our Work`} delay={0.3} />
                </Link>
              </ElementReveal>
            </div>
          </div>
          <ElementReveal as={`div`} delay={0.26} y={16} className={`heroBrand`}>
            <Link href={`/`} onClick={scrollToElement} className={`heroLogoPlate`}>
              <Logo fullSword className={`heroLogo`} />
              <div className={`wordLogoHome`}>
                <Word gradient={false} arrows gradientSword />
              </div>
            </Link>
            <div className={`heroMiniStats`}>
              {config?.stats?.map((stat, index) => (
                <span className={`heroMiniStat`} key={stat.label}>
                  <TextReveal as={`strong`} className={`gradientTextColor`} text={stat.value} delay={0.39 + index * 0.06} />
                  <TextReveal as={`i`} text={stat.label} delay={0.42 + index * 0.06} />
                </span>
              ))}
            </div>
          </ElementReveal>
        </div>
      </section>

      <div id={`anchor`} className={`sep`} />

      {/* <Section /> */}

      <section className={`pageSection backendSection`}>
        <div className={`sectionInner backendGrid`}>
          <div className={`sectionTitle`}>
            <TextReveal scroll as={`span`} className={`eyebrow`} text={`Technologies`} delay={0.4} />
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

      <div className={`sep reveal`} />

      <section className={`pageSection skillsSection`}>
        <div className={`sectionInner`}>
          <div className={`sectionTitle`}>
            <TextReveal scroll as={`span`} className={`eyebrow`} text={`Skills`} delay={0.4} />
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

      <div className={`sep reveal`} />

      <section className={`pageSection servicesSection`}>
        <div className={`sectionInner`}>
          <div className={`sectionTitle`}>
            <TextReveal scroll as={`span`} className={`eyebrow`} text={`Services`} delay={0.4} />
            <TextReveal scroll as={`h2`} text={`Useful enough for clients, sharp enough for hiring teams`} delay={0.06} />
          </div>
          <div className={`serviceGrid`}>
            {config.services.map(service => (
              <article key={service.title} className={`serviceCard reveal`}>
                <i className={`${service.icon} gradientTextColor reveal`} />
                <TextReveal scroll as={`h3`} html text={`<i>${service.title}</i>`} />
                <TextReveal scroll as={`p`} text={service.text} />
              </article>
            ))}
          </div>
        </div>
      </section>

      <div className={`sep reveal`} />

      <section className={`pageSection contactSection reveal`}>
        <ElementReveal as={`div`} delay={0.35} y={16} className={`sectionInner contactBand`}>
          <TextReveal scroll as={`span`} className={`eyebrow`} text={`Get In Touch`} delay={0.4} />
          <TextReveal scroll as={`h2`} text={`Ready for the next version`} delay={0.06} />
          <TextReveal scroll as={`p`} html text={`<i>This first Next pass keeps the structure lean while setting up the app shell, pages, auth surface, PWA pieces, API route, and future Firebase growth path.</i>`} />
          <ElementReveal as={`span`} delay={0.45} className={`heroActionReveal`}>
            <Link href={`mailto:${config.contactEmail}`} className={`buttonLink primary`}>
              <ElementReveal delay={0.46}>
                <i className={`fa-solid fa-paper-plane logoLetter`} />
              </ElementReveal>
              <TextReveal as={`span`} className={`logoLetter`} text={config?.contactEmail} delay={0.47} />
            </Link>
          </ElementReveal>
        </ElementReveal>
      </section>

      <div className={`sep reveal`} />
    </>
  );
}
