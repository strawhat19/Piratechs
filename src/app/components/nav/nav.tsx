'use client';

import Link from 'next/link';
import Logo from '../logo/logo';
import Word from '../logo/word';
import { Roles } from '@/shared/types/types';
import { usePathname } from 'next/navigation';
import { minRole } from '@/shared/models/User';
import { config } from '@/shared/config/config';
import type { NavItem } from '@/shared/types/app';
import TopBar from '@/app/components/topbar/top-bar';
import { useMemo, type ComponentType } from 'react';
import type { SvgIconProps } from '@mui/material/SvgIcon';
import AuthWidget from '@/app/components/auth/auth-widget';
import { useGlobalContext } from '@/shared/global-context';
import ElementReveal from '@/app/components/effects/element-reveal';
import NotificationBell from '@/app/components/notifications/notification-bell';
import { Code, Star, Edit, Person, Security, WorkspacePremium, AdminPanelSettings, ShoppingCart } from '@mui/icons-material';

type RoleGradientIconProps = SvgIconProps & {
  icon: ComponentType<SvgIconProps>;
  gradientID: string;
};

const RoleGradientIcon = ({
  icon: Icon,
  gradientID,
  className,
  ...props
}: RoleGradientIconProps) => (
  <span className={`roleIconGradientWrap`}>
    <svg aria-hidden={`true`} focusable={`false`} className={`roleIconGradientDefs`}>
      <defs>
        <linearGradient id={gradientID} x1={`0%`} y1={`0%`} x2={`100%`} y2={`100%`}>
          <stop offset={`0%`} stopColor={`var(--piratechsNeon)`} />
          <stop offset={`100%`} stopColor={`var(--piratechsTeal)`} />
        </linearGradient>
      </defs>
    </svg>
    <Icon
      {...props}
      className={[`roleIconGradient`, className].filter(Boolean).join(` `)}
      sx={{ '& path': { fill: `url(#${gradientID})` } }}
    />
  </span>
);

export const roleIcons = {
  [Roles.Guest]: <RoleGradientIcon icon={Person} gradientID={`roleIconGradientGuest`} fontSize={`small`} />,
  [Roles.Subscriber]: <RoleGradientIcon icon={Star} gradientID={`roleIconGradientSubscriber`} fontSize={`small`} />,
  [Roles.Customer]: <RoleGradientIcon icon={ShoppingCart} gradientID={`roleIconGradientCustomer`} style={{ fontSize: 18 }} />,
  [Roles.Editor]: <RoleGradientIcon icon={Edit} gradientID={`roleIconGradientEditor`} fontSize={`small`} />,
  [Roles.Moderator]: <RoleGradientIcon icon={Security} gradientID={`roleIconGradientModerator`} style={{ fontSize: 18 }} />,
  [Roles.Administrator]: <RoleGradientIcon icon={AdminPanelSettings} gradientID={`roleIconGradientAdministrator`} fontSize={`small`} />,
  [Roles.Developer]: <RoleGradientIcon icon={Code} gradientID={`roleIconGradientDeveloper`} fontSize={`small`} />,
  [Roles.Owner]: <RoleGradientIcon icon={WorkspacePremium} gradientID={`roleIconGradientOwner`} fontSize={`small`} />,
};

export default function Nav({
  titleGraphic = true,
}: any) {
  const pathname = usePathname();

  const { user, loaded, theme, toggleTheme, menuExpanded, setMenuExpanded } = useGlobalContext();

  const navItems = useMemo(() => {
    return config.nav.filter((navItem) => {
      if (!navItem?.role) return true;
      return Boolean(loaded && user?.role && minRole(user.role, navItem.role));
    });
  }, [loaded, user?.role]);

  const isActiveRoute = (href: string) => {
    if (href == `/`) return pathname == `/`;
    return pathname?.startsWith(href) || pathname?.startsWith(`/pages${href}`);
  };

  const renderLinks = (className: string, mobile: boolean = className?.includes(`mobile`)) => {
    return (
      <nav className={className} aria-label={`${className} navigation`}>
        {navItems.map((navItem: NavItem) => {
          const navDelayIndex = config.nav.findIndex(item => item?.id == navItem?.id);
          return (
            <ElementReveal
              as={Link}
              blur={false}
              duration={0.42}
              key={navItem?.id}
              href={navItem?.href}
              delay={0.5 + Math.max(navDelayIndex, 0) * 0.025}
              onClick={() => setMenuExpanded(false)}
              className={`navLink ${mobile ? `mobileNavLink` : ``} ${isActiveRoute(navItem?.href) ? `activeRoute` : ``}`}
            >
              <i className={`${navItem?.icon} gradientTextColor`} />
              <span className={`logoLetter`}>
                {navItem?.label}
              </span>
            </ElementReveal>
          );
        })}
      </nav>
    )
  };

  return (
    <header className={`header reveal ${menuExpanded ? `headerMenuOpen` : ``}`}>
      <TopBar />
      {/* <TopBar id={`topBar2`} direction={`ltr`} /> */}
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
          <ElementReveal as={`button`} type={`button`} blur={false} delay={0.5} className={`iconButton themeButton`} aria-label={`Toggle theme`} onClick={toggleTheme}>
            <i className={`fa-solid ${theme == `dark` ? `fa-sun` : `fa-moon`}`} />
          </ElementReveal>
          <ElementReveal as={`span`} blur={false} delay={0.5} className={`navActionReveal`}>
            <AuthWidget />
          </ElementReveal>
          {loaded && user && Boolean(user?.role && minRole(user.role, Roles.Editor)) && <>
            <ElementReveal as={`span`} blur={false} delay={0.5} className={`navActionReveal`}>
              <NotificationBell />
            </ElementReveal>
          </>}
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
