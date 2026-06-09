'use client';

import Link from 'next/link';
import Logo from '../logo/logo';
import { useMemo } from 'react';
import Word from '../logo/word';
import { Roles } from '@/shared/types/types';
import { usePathname } from 'next/navigation';
import { minRole } from '@/shared/models/User';
import { config } from '@/shared/config/config';
import type { NavItem } from '@/shared/types/app';
import TopBar from '@/app/components/topbar/top-bar';
import { useGlobalContext } from '@/shared/global-context';
import AuthWidget from '@/app/components/auth/auth-widget';
import ElementReveal from '@/app/components/effects/element-reveal';
import NotificationBell from '@/app/components/notifications/notification-bell';
import { Code, Star, Edit, Person, Security, WorkspacePremium, AdminPanelSettings, ShoppingCart, Logout, Delete, KeyboardArrowDown } from '@mui/icons-material';

export const roleIcons = {
  [Roles.Guest]: <Person fontSize={`small`} className={`gradientTextColor`} />,
  [Roles.Subscriber]: <Star fontSize={`small`} className={`gradientTextColor`} />,
  [Roles.Customer]: <ShoppingCart style={{ fontSize: 18 }} className={`gradientTextColor`} />,
  [Roles.Editor]: <Edit fontSize={`small`} className={`gradientTextColor`} />,
  [Roles.Moderator]: <Security style={{ fontSize: 18 }} className={`gradientTextColor`} />,
  [Roles.Administrator]: <AdminPanelSettings fontSize={`small`} className={`gradientTextColor`} />,
  [Roles.Developer]: <Code fontSize={`small`} className={`gradientTextColor`} />,
  [Roles.Owner]: <WorkspacePremium fontSize={`small`} className={`gradientTextColor`} />,
};

export default function Nav({
  titleGraphic = true,
}: any) {
  const pathname = usePathname();

  const { user, theme, toggleTheme, menuExpanded, setMenuExpanded } = useGlobalContext();

  const navItems = useMemo(() => {
    return config.nav.filter(navItem => !navItem?.role || Boolean(user?.role && minRole(user.role, navItem.role)));
  }, [user?.role]);

  const isActiveRoute = (href: string) => {
    if (href == `/`) return pathname == `/`;
    return pathname?.startsWith(href) || pathname?.startsWith(`/pages${href}`);
  };

  const renderLinks = (className: string, mobile: boolean = className?.includes(`mobile`)) => {
    return (
      <nav className={className} aria-label={`${className} navigation`}>
        {navItems.map((navItem: NavItem, index: number) => (
          <ElementReveal
            as={Link}
            blur={false}
            duration={0.42}
            key={navItem?.id}
            href={navItem?.href}
            delay={0.5 + index * 0.025}
            onClick={() => setMenuExpanded(false)}
            className={`navLink ${mobile ? `mobileNavLink` : ``} ${isActiveRoute(navItem?.href) ? `activeRoute` : ``}`}
          >
            <i className={`${navItem?.icon} gradientTextColor`} />
            <span className={`logoLetter`}>
              {navItem?.label}
            </span>
          </ElementReveal>
        ))}
      </nav>
    )
  };

  return (
    <header className={`header ${menuExpanded ? `headerMenuOpen` : ``}`}>
      <TopBar />
      <div className={`navBar`}>
        <ElementReveal as={Link} href={`/`} blur={false} delay={0.5} className={`homeButton`} aria-label={`Home`}>
          <i className={`fa-solid fa-house logoLetter`} />
        </ElementReveal>
        <ElementReveal as={Link} href={`/`} blur={false} delay={0.5} className={`brandMark`} aria-label={`Piratechs home`}>
          <Logo className={`brandLogo`} />
          <span className={`navLink`} style={{ position: `relative`, left: -7, color: `white` }}>
            {titleGraphic ? (
              <Word className={`wordLogoNav`} gradient={false} gradientSword arrows={false} />
            ) : config?.title}
          </span>
        </ElementReveal>
        {renderLinks(`desktopNav`)}
        <div className={`navActions`}>
          <ElementReveal as={`span`} blur={false} delay={0.5} className={`navActionReveal`}>
            <AuthWidget />
          </ElementReveal>
          {Boolean(user?.role && minRole(user.role, Roles.Editor)) && <>
            <ElementReveal as={`span`} blur={false} delay={0.5} className={`navActionReveal`}>
              <NotificationBell />
            </ElementReveal>
          </>}
          <ElementReveal as={`button`} type={`button`} blur={false} delay={0.5} className={`iconButton themeButton`} aria-label={`Toggle theme`} onClick={toggleTheme}>
            <i className={`fa-solid ${theme == `dark` ? `fa-sun` : `fa-moon`}`} />
          </ElementReveal>
          <ElementReveal
            delay={0.5}
            blur={false}
            as={`button`}
            type={`button`}
            aria-label={`Toggle menu`}
            aria-expanded={menuExpanded}
            className={`iconButton mobileMenuButton`}
            onClick={() => setMenuExpanded(!menuExpanded)}
          >
            <i className={`fa-solid ${menuExpanded ? `fa-xmark` : `fa-bars`}`} />
          </ElementReveal>
        </div>
      </div>
      <div className={`mobileMenu`}>
        {renderLinks(`mobileNav`)}
        <AuthWidget mobile />
      </div>
    </header>
  );
}
