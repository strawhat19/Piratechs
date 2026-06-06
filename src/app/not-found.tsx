import Link from 'next/link';
import Section from './components/sections/section';
import TextReveal from './components/effects/text-reveal';
import ElementReveal from './components/effects/element-reveal';
import HeroCircuitOverlay from './components/hero/hero-circuit-overlay';

export default function NotFound() {
  return <>
    <section className={`pageSection heroSection subHero`}>
      <div className={`heroBg`}>
        <HeroCircuitOverlay />
        <span className={`gridPlane gridPlaneA`} />
        <span className={`gridPlane gridPlaneB`} />
        <span className={`signalLine signalLineA`} />
        <span className={`signalLine signalLineB`} />
      </div>
      <div className={`sectionInner heroGrid`}>
        <div className={`heroCopy`}>
          <TextReveal as={`span`} className={`eyebrow`} text={`404`} delay={0.3} />
          <TextReveal as={`h1`} className={`bannerText`} text={`Not Found`} delay={0.1} />
          <TextReveal as={`p`} className={`bannerText`} text={`<i>We could not find what you were looking for.</i>`} html />
          <div className={`heroActions`}>
            <ElementReveal as={`span`} delay={0.22} className={`heroActionReveal`}>
              <Link href={`/`} className={`buttonLink primary`}>
                <i className={`fa-solid fa-house`} />
                Home
              </Link>
            </ElementReveal>
            <ElementReveal as={`span`} delay={0.28} className={`heroActionReveal`}>
              <Link href={`/projects`} className={`buttonLink ghost`}>
                <i className={`fa-solid fa-diagram-project gradientTextColor`} />
                Projects
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
