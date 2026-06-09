import Link from 'next/link';
import Section from './components/sections/section';
import TextReveal from './components/effects/text-reveal';
import ElementReveal from './components/effects/element-reveal';
import HeroCircuitOverlay from './components/hero/hero-circuit-overlay';

export default function NotFound() {
  return <>
    <section className={`pageSection heroSection subHero`}>
      <div className={`heroBgClip`}>
        <div className={`heroBg`}>
          <HeroCircuitOverlay />
          <span className={`gridPlane gridPlaneA`} />
          <span className={`gridPlane gridPlaneB`} />
          <span className={`signalLine signalLineA reveal`} />
          <span className={`signalLine signalLineB reveal`} />
        </div>
      </div>
      <div className={`sectionInner heroGrid`}>
        <div className={`heroCopy`}>
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
        </div>
        <ElementReveal as={`div`} delay={0.28} y={16} className={`pageBadge`}>
          <i className={`fa-solid fa-ban gradientTextColor`} />
          <TextReveal as={`span`} text={`404`} delay={0.3} />
        </ElementReveal>
      </div>
    </section>
    
    <Section />
  </>;
}
