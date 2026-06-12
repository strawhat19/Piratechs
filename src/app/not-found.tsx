'use client';

import Link from 'next/link';
import HeroBg from './components/hero/hero-bg';
import Section from './components/sections/section';
import HeroContent from './components/hero/hero-content';
import TextReveal from './components/effects/text-reveal';
import ElementReveal from './components/effects/element-reveal';

export default function NotFound() {
  return <>
    <section className={`pageSection heroSection subHero`}>
      <HeroBg />
      <HeroContent
        start={
          <>
            <TextReveal as={`span`} className={`eyebrow`} text={`404`} delay={0.4} />
            <TextReveal as={`h1`} className={`bannerText`} text={`Not Found`} delay={0.1} />
            <TextReveal as={`p`} className={`bannerText`} text={`<i>We could not find what you were looking for.</i>`} html />
            <div className={`heroActions`}>
              <ElementReveal as={`span`} delay={0.22} className={`heroActionReveal`}>
                <Link href={`/`} className={`buttonLink primary`}>
                  <ElementReveal delay={0.23}>
                    <i className={`fa-solid fa-house logoLetter`} />
                  </ElementReveal>
                  <TextReveal as={`span`} className={`logoLetter`} text={`Back To Home`} delay={0.24} />
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
          </>
        }
        end={
          <ElementReveal className={`heroEnd pageBadge`} as={`div`} delay={0.28} y={16}>
            <i className={`fa-solid fa-ban gradientTextColor`} />
            <TextReveal as={`span`} text={`404`} delay={0.3} />
          </ElementReveal>
        }
      />
    </section>

    <div id={`anchor`} className={`sep reveal`} />
    
    <Section />
  </>;
}
