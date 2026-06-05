import Link from 'next/link';
import Logo from '../logo/logo';
import { siteConfig } from '@/shared/config/site';

export default function Footer({
  showNav = false,
}: any) {
  return (
    <footer className={`siteFooter`}>
      <div className={`footerInner`}>
        <Link href={`/`} className={`footerBrand`}>
          <Logo className={`footerLogo`} />
          <div className={`sep`} style={{ minHeight: 54 }} />
          <span>
            <strong>
              {siteConfig.title}
            </strong>
            <div className={`sep`} />
            <small>
              <i>{siteConfig.description}</i>
            </small>
          </span>
        </Link>
        {showNav && (
          <nav className={`footerNav`} aria-label={`Footer navigation`}>
            {siteConfig.nav.map(item => (
              <Link key={item.id} href={item.href}>
                {item.label}
              </Link>
            ))}
          </nav>
        )}
        <div className={`footerLinks`}>
          <span className={`copyright`}>
            Copyright <i className={`fas fa-copyright gradientTextColor`} style={{ margin: `0 3px`, color: `var(--main)` }} /> {new Date()?.getFullYear()}
          </span>
          {siteConfig.social.map(item => (
            <a key={item.label} href={item.href} target={`_blank`} rel={`noreferrer`} aria-label={item.label} className={`iconButton`}>
              <i className={item.icon} style={{ color: `white` }} />
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
