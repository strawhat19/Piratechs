import Link from 'next/link';
import Logo from '../logo/logo';
import Word from '../logo/word';
import { config } from '@/shared/config/config';
import TextReveal from '@/app/components/effects/text-reveal';
import ElementReveal from '@/app/components/effects/element-reveal';

export default function Footer({
  showNav = false,
  titleGraphic = true,
}: any) {
  return (
    <footer className={`footer`}>
      <div className={`footerInner`}>
        <ElementReveal scroll as={`div`} delay={0.04} y={10} className={`footerBrandReveal`}>
          <Link href={`/`} className={`footerBrand`}>
            <Logo className={`footerLogo`} />
            <div className={`sep bgReversed`} style={{ minHeight: 54 }} />
            <span className={`footerContent`}>
              {titleGraphic ? (
                <Word className={`wordLogoFooter`} gradient={false} gradientSword arrows />
              ) : <TextReveal scroll as={`strong`} text={config.title} />}
              <div className={`sep reveal`} />
              <TextReveal scroll as={`small`} html text={`<i>${config.description}</i>`} delay={0.06} />
            </span>
          </Link>
        </ElementReveal>
        {showNav && (
          <nav className={`footerNav`} aria-label={`Footer navigation`}>
            {config.nav.map((item, index) => (
              <ElementReveal scroll as={`span`} key={item.id} delay={0.08 + index * 0.025} className={`footerNavReveal`}>
                <Link href={item.href}>
                  <TextReveal scroll as={`span`} text={item.label} />
                </Link>
              </ElementReveal>
            ))}
          </nav>
        )}
        <div className={`footerLinks`}>
          <ElementReveal scroll as={`span`} delay={0.1} className={`copyright`}>
            <TextReveal scroll as={`span`} text={`Copyright`} />
            <i className={`fas fa-copyright gradientTextColor`} style={{ margin: `0 3px`, color: `var(--main)` }} />
            <TextReveal scroll as={`span`} text={String(new Date()?.getFullYear())} delay={0.04} />
          </ElementReveal>
          <div className={`footerSocials`}>
            {config.social.map((item, index) => (
              <ElementReveal scroll as={`span`} key={item.label} delay={0.14 + index * 0.035} className={`footerIconReveal`}>
                <a href={item.href} target={`_blank`} rel={`noreferrer`} aria-label={item.label} className={`iconButton`}>
                  <i className={item.icon} style={{ color: `white` }} />
                </a>
              </ElementReveal>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
