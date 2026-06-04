import Link from 'next/link';
import Logo from '../logo/logo';
import { siteConfig } from '@/shared/config/site';

export default function Footer() {
  return (
    <footer className={`siteFooter`}>
      <div className={`footerInner`}>
        <Link href={`/`} className={`footerBrand`}>
          <Logo className={`footerLogo`} />
          <span>
            <strong>{siteConfig.title}</strong>
            <small>{siteConfig.description}</small>
          </span>
        </Link>
        {/* <nav className={`footerNav`} aria-label={`Footer navigation`}>
          {siteConfig.nav.map(item => (
            <Link key={item.id} href={item.href}>
              {item.label}
            </Link>
          ))}
        </nav> */}
        <div className={`footerLinks`}>
          <span className={`copyright`}>
            Copyright <i className={`fas fa-copyright`} style={{ margin: `0 3px`, color: `var(--main)` }} /> {new Date()?.getFullYear()}
          </span>
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
