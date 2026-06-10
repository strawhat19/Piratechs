'use client';

import Link from 'next/link';
import Logo from '../logo/logo';
import Word from '../logo/word';
import Section from './section';
import { useEffect, useState } from 'react';
import AuthWidget from '../auth/auth-widget';
import { config } from '@/shared/config/config';
import { getTechnologyMeta } from '@/shared/utils/tech';
import { useGlobalContext } from '@/shared/global-context';
import TextReveal from '@/app/components/effects/text-reveal';
import { scrollToElement } from '@/shared/common/scripts/globals';
import ElementReveal from '@/app/components/effects/element-reveal';
import HeroCircuitOverlay from '@/app/components/hero/hero-circuit-overlay';

export default function HomeLanding() {
  const page: any = config?.pages?.home;

  const { isPWA, platform } = useGlobalContext();

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setIsMounted(true);
    }, 1000)
  }, []);

  const isChromeOrAdvancedDevice = isMounted && Boolean(
    !isPWA && (platform && platform?.chrome && !platform?.mobile && !platform?.ios && (
      !platform?.os?.toLowerCase()?.includes(`mac`)
    ) || (
      platform?.os?.toLowerCase()?.includes(`windows`)
    ))
  );

  return (
    <>
      <section className={`pageSection heroSection`}>
        <div className={`heroBgClip`}>
          <div className={`heroBg`}>
            <HeroCircuitOverlay />
            {/* <ElementReveal> */}
              <span className={`gridPlane gridPlaneA`} />
            {/* </ElementReveal> */}
            {/* <ElementReveal> */}
              <span className={`gridPlane gridPlaneB`} />
            {/* </ElementReveal> */}
            <span className={`signalLine signalLineA reveal revealLeft`} />
            <span className={`signalLine signalLineB reveal revealRight`} />
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
              <TextReveal as={`p`} className={`bannerText`} text={`<i>${page?.summaryHtml}</i>`} html />
            ) : (
              <TextReveal as={`p`} className={`bannerText`} text={`<i>${page?.summary}</i>`} html />
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
                <Word className={`wordLogoHomeGraphic`} gradient={false} arrows gradientSword />
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

      <section className={`pageSection specialtiesSection`}>
        <div className={`sectionInner backendGrid`}>
          <div className={`sectionTitle`}>
            <TextReveal scroll as={`span`} className={`eyebrow`} text={`Specialties`} delay={0.4} />
            <TextReveal scroll as={`h2`} text={`Our studio <span class="slashes">//</span><br> specializes in technologies<span class="slashes">:</span>`} html delay={0.06} />
            <TextReveal scroll as={`p`} text={`
              Python, JSON, SQL, REST, Firebase, WordPress/MySQL, Shopify thinking, auth, and responsive UI are organized as a real app foundation instead of a one-off portfolio page.
            `} />
          </div>
          <div className={`capabilityGrid reveal`}>
            {config.capabilities.map(capability => {
              const meta = getTechnologyMeta(capability);
              return (
                <ElementReveal as={`span`} key={capability}>
                  <i className={`${meta.icon} techIcon ${meta.className}`} />
                  <TextReveal scroll as={`strong`} text={capability} />
                </ElementReveal>
              );
            })}
          </div>
        </div>
      </section>

      <div className={`sep reveal`} />

      {isChromeOrAdvancedDevice && <Section inversed />}

      <section className={`pageSection skillsSection`}>
        <div className={`sectionInner`}>
          <div className={`sectionTitle`}>
            <TextReveal scroll as={`span`} className={`eyebrow`} text={`Skills`} delay={0.4} />
            <TextReveal scroll as={`h2`} text={`Skills <span class="slashes">//</span> Technologies`} html delay={0.06} />
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

      <section className={`pageSection contactSection reveal cta`}>
        <ElementReveal as={`div`} delay={0.35} y={16} className={`sectionInner contactBand`}>
          <div className={`ctaOuterRow flex gap16 spaceBetween alignCenter`}>
            <div className={`ctaOuterColumn flex gap16 column`}>
              <TextReveal scroll as={`span`} className={`eyebrow`} text={`Start`} delay={0.4} />
              <TextReveal scroll as={`h2`} text={`Ready for the next version?`} delay={0.06} />
              <div className={`ctaRow flex gap16 spaceBetween alignCenter`}>
                <div className={`ctaColumn flex gap16 column`}>
                  <TextReveal scroll as={`p`} html text={`<i>Join us as we turn your vision into a reality.</i>`} />
                  <ElementReveal as={`span`} delay={0.45} className={`heroActionReveal`}>
                    <Link href={`mailto:${config.contactEmail}`} className={`buttonLink primary`}>
                      <ElementReveal delay={0.46}>
                        <i className={`fa-solid fa-paper-plane logoLetter`} />
                      </ElementReveal>
                      <TextReveal as={`span`} className={`logoLetter`} text={config?.contactEmail} delay={0.47} />
                    </Link>
                  </ElementReveal>
                </div>
              </div>
            </div>
            <div className={`ctaOuterColumn flex gap16 column`}>
              <ElementReveal as={`span`} delay={0.45} className={`heroActionReveal`}>
                <AuthWidget defaultOpen />
              </ElementReveal>
            </div>
          </div>
        </ElementReveal>
      </section>

      <div className={`sep reveal`} />
    </>
  );
}