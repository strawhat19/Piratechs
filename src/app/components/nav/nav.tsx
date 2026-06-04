'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import AuthWidget from '@/app/components/auth/auth-widget';
import NotificationBell from '@/app/components/notifications/notification-bell';
import { siteConfig } from '@/shared/config/site';
import { useGlobalContext } from '@/shared/global-context';
import TopBar from '@/app/components/topbar/top-bar';
import Logo from '../logo/logo';

export default function Nav() {
  const pathname = usePathname();
  const { theme, toggleTheme, menuExpanded, setMenuExpanded } = useGlobalContext();

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
      <TopBar />
      <div className={`navBar`}>
        <Link href={`/`} className={`homeButton`} aria-label={`Home`}>
          <i className={`fa-solid fa-house`} />
        </Link>
        <Link href={`/`} className={`brandMark`} aria-label={`Piratechs home`}>
          <Logo className={`brandLogo`} />
          <span>{siteConfig.title}</span>
        </Link>
        {renderLinks(`desktopNav`)}
        <div className={`navActions`}>
          <AuthWidget />
          <NotificationBell />
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
