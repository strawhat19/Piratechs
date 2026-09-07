import Link from 'next/link';
import AuthWidget from '../auth/auth-widget';
import TextReveal from '../effects/text-reveal';
import { config } from '@/shared/config/config';
import ElementReveal from '../effects/element-reveal';

export default function StartCtaSection() {
  return (
    <section className={`pageSection contactSection reveal cta`}>
        <ElementReveal as={`div`} delay={0.35} y={16} className={`sectionInner contactBand`}>
            <div className={`ctaOuterRow flex gap16 spaceBetween alignCenter`}>
            <div className={`ctaOuterColumn flex gap16 column`}>
                <TextReveal scroll as={`span`} className={`eyebrow`} text={`Start`} delay={0.4} />
                <TextReveal scroll as={`h2`} text={`Next Version?`} delay={0.06} />
                <div className={`ctaRow flex gap16 spaceBetween alignCenter`}>
                <div className={`ctaColumn flex gap16 column`}>
                    <TextReveal scroll as={`p`} html text={`<i>Hell or High Water.</i>`} />
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
  );
}