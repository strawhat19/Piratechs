import Image from 'next/image';
import Link from 'next/link';
import { siteConfig } from '@/shared/config/site';

export default function Footer() {
  return (
    <footer className={`siteFooter`}>
      <div className={`footerInner`}>
        <Link href={`/`} className={`footerBrand`}>
          <Image className={`footerLogo footerLogoDark`} src={siteConfig.logo.dark} width={64} height={64} alt={`Piratechs logo`} />
          <Image className={`footerLogo footerLogoLight`} src={siteConfig.logo.light} width={64} height={64} alt={`Piratechs logo`} />
          <span>
            <strong>{siteConfig.title}</strong>
            <small>{siteConfig.description}</small>
          </span>
        </Link>
        <nav className={`footerNav`} aria-label={`Footer navigation`}>
          {siteConfig.nav.map(item => (
            <Link key={item.id} href={item.href}>
              {item.label}
            </Link>
          ))}
        </nav>
        <div className={`footerLinks`}>
          {siteConfig.social.map(item => (
            <a key={item.label} href={item.href} target={`_blank`} rel={`noreferrer`} aria-label={item.label}>
              <i className={item.icon} />
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
