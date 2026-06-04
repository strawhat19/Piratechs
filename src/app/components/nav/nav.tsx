'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import AuthWidget from '@/app/components/auth/auth-widget';
import { siteConfig } from '@/shared/config/site';
import { useGlobalContext } from '@/shared/global-context';

export default function Nav() {
  const pathname = usePathname();
  const { user, theme, toggleTheme, menuExpanded, setMenuExpanded } = useGlobalContext();

  const isActiveRoute = (href: string) => {
    if (href == `/`) return pathname == `/`;
    return pathname?.startsWith(href) || pathname?.startsWith(`/pages${href}`);
  };

  const renderLinks = (className: string) => (
    <nav className={className} aria-label={`${className} navigation`}>
      {siteConfig.nav.map(item => (
        <Link
          href={item.href}
          key={item.id}
          onClick={() => setMenuExpanded(false)}
          className={`navLink ${isActiveRoute(item.href) ? `activeRoute` : ``}`}
        >
          <i className={item.icon} />
          <span>{item.label}</span>
        </Link>
      ))}
    </nav>
  );

  return (
    <header className={`siteHeader ${menuExpanded ? `headerMenuOpen` : ``}`}>
      <div className={`navBar`}>
        <Link href={`/`} className={`homeButton`} aria-label={`Home`}>
          <i className={`fa-solid fa-house`} />
        </Link>
        <Link href={`/`} className={`brandMark`} aria-label={`Piratechs home`}>
          <Image className={`brandLogo brandLogoDark`} src={siteConfig.logo.dark} width={42} height={42} alt={`Piratechs logo`} priority />
          <Image className={`brandLogo brandLogoLight`} src={siteConfig.logo.light} width={42} height={42} alt={`Piratechs logo`} priority />
          <span>{siteConfig.title}</span>
        </Link>
        {renderLinks(`desktopNav`)}
        <div className={`navActions`}>
          <AuthWidget />
          {user ? (
            <span className={`userBadge`} title={user.email}>
              {user.name?.[0]?.toUpperCase() ?? user.email?.[0]?.toUpperCase() ?? `P`}
            </span>
          ) : null}
          <button type={`button`} className={`iconButton themeButton`} aria-label={`Toggle theme`} onClick={toggleTheme}>
            <i className={`fa-solid ${theme == `dark` ? `fa-sun` : `fa-moon`}`} />
          </button>
          <button
            type={`button`}
            aria-label={`Toggle menu`}
            aria-expanded={menuExpanded}
            className={`iconButton mobileMenuButton`}
            onClick={() => setMenuExpanded(!menuExpanded)}
          >
            <i className={`fa-solid ${menuExpanded ? `fa-xmark` : `fa-bars`}`} />
          </button>
        </div>
      </div>
      <div className={`mobileMenu`}>
        {renderLinks(`mobileNav`)}
        <AuthWidget mobile />
      </div>
    </header>
  );
}
