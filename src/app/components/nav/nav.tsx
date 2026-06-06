'use client';

import Link from 'next/link';
import Logo from '../logo/logo';
import { useMemo } from 'react';
import { Roles } from '@/shared/types/types';
import { usePathname } from 'next/navigation';
import { minRole } from '@/shared/models/User';
import { config } from '@/shared/config/config';
import type { NavItem } from '@/shared/types/app';
import TopBar from '@/app/components/topbar/top-bar';
import { useGlobalContext } from '@/shared/global-context';
import AuthWidget from '@/app/components/auth/auth-widget';
import TextReveal from '@/app/components/effects/text-reveal';
import NotificationBell from '@/app/components/notifications/notification-bell';

export default function Nav() {
  const pathname = usePathname();

  const { user, theme, toggleTheme, menuExpanded, setMenuExpanded } = useGlobalContext();

  const navItems = useMemo(() => {
    return config.nav.filter(navItem => !navItem?.role || Boolean(user?.role && minRole(user.role, navItem.role)));
  }, [user?.role]);

  const isActiveRoute = (href: string) => {
    if (href == `/`) return pathname == `/`;
    return pathname?.startsWith(href) || pathname?.startsWith(`/pages${href}`);
  };

  const renderLinks = (className: string) => {
    return (
      <nav className={className} aria-label={`${className} navigation`}>
        {navItems.map((navItem: NavItem, index: number) => (
          <Link
            key={navItem?.id}
            href={navItem?.href}
            onClick={() => setMenuExpanded(false)}
            className={`navLink ${isActiveRoute(navItem?.href) ? `activeRoute` : ``}`}
          >
            <i className={`${navItem?.icon} gradientTextColor`} />
            <TextReveal
              byLetter
              as={`span`}
              duration={0.42}
              stagger={0.012}
              text={navItem?.label}
              delay={0.6 + index * 0.025}
            />
          </Link>
        ))}
      </nav>
    )
  };

  return (
    <header className={`header ${menuExpanded ? `headerMenuOpen` : ``}`}>
      <TopBar />
      <div className={`navBar`}>
        <Link href={`/`} className={`homeButton`} aria-label={`Home`}>
          <i className={`fa-solid fa-house`} />
        </Link>
        <Link href={`/`} className={`brandMark`} aria-label={`Piratechs home`}>
          <Logo className={`brandLogo`} />
          <span className={`navLink`} style={{ position: `relative`, left: -7, color: `white` }}>
            <TextReveal
              byLetter
              as={`span`}
              delay={0.6}
              duration={0.48}
              stagger={0.018}
              text={config.title}
            />
          </span>
        </Link>
        {renderLinks(`desktopNav`)}
        <div className={`navActions`}>
          <AuthWidget />
          {Boolean(user?.role && minRole(user.role, Roles.Editor)) && <>
            <NotificationBell />
          </>}
          <button type={`button`} className={`iconButton themeButton`} aria-label={`Toggle theme`} onClick={toggleTheme}>
            <i className={`fa-solid ${theme == `dark` ? `fa-sun` : `fa-moon`} gradientTextColor`} />
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
