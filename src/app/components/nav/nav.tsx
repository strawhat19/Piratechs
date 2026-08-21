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
import type { SvgIconProps } from '@mui/material/SvgIcon';
import AuthWidget from '@/app/components/auth/auth-widget';
import { useGlobalContext } from '@/shared/global-context';
import { useMemo, useState, useEffect, type ComponentType } from 'react';
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
  useSideMenu = false,
  titleGraphic = true,
  navLinks = config?.nav,
  useSideMenuBlur = false,
}: any) {
  const pathname = usePathname();
  const [sideMenuAllowed, setSideMenuAllowed] = useState(false);
  const [sideMenu, setSideMenu] = useState<boolean>(useSideMenu);
  const [sideMenuBlur, setSideMenuBlur] = useState(useSideMenuBlur);

  const { user, loaded, theme, toggleTheme, menuExpanded, setMenuExpanded } = useGlobalContext();
  const sideMenuActive = sideMenu && sideMenuAllowed;
  const sideMenuExpanded = sideMenuActive && menuExpanded;
  const sideMenuBlurOff = sideMenuExpanded && !sideMenuBlur;

  useEffect(() => {
    const sideMenuMedia = window.matchMedia(`(min-width: 1101px)`);
    const syncSideMenuAvailability = () => {
      setSideMenuAllowed(sideMenuMedia.matches);
      if (!sideMenuMedia.matches) {
        setSideMenu(false);
        setMenuExpanded(false);
      }
    };
    syncSideMenuAvailability();
    sideMenuMedia.addEventListener(`change`, syncSideMenuAvailability);
    return () => sideMenuMedia.removeEventListener(`change`, syncSideMenuAvailability);
  }, [setMenuExpanded]);

  useEffect(() => {
    document.body.classList.toggle(`sideMenuActive`, sideMenuActive);
    document.body.classList.toggle(`sideMenuExpanded`, sideMenuExpanded);
    document.body.classList.toggle(`sideMenuBlurOff`, sideMenuBlurOff);
    return () => document.body.classList.remove(`sideMenuActive`, `sideMenuExpanded`, `sideMenuBlurOff`);
  }, [sideMenuActive, sideMenuExpanded, sideMenuBlurOff]);

  const navItems = useMemo(() => {
    return navLinks.filter((navItem: any) => {
      if (!navItem?.role) return true;
      return Boolean(loaded && user?.role && minRole(user.role, navItem.role));
    });
  }, [loaded, user?.role, navLinks]);

  const isActiveRoute = (href: string) => {
    if (href == `/`) return pathname == `/`;
    return pathname?.startsWith(href) || pathname?.startsWith(`/pages${href}`);
  };

  const renderLinks = (className: string, mobile: boolean = className?.includes(`mobile`)) => {
    return (
      <nav className={className} aria-label={`${className} navigation`}>
        {navItems.map((navItem: NavItem) => {
          const navDelayIndex = navLinks.findIndex((item: any) => item?.id == navItem?.id);
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
    // <header className={`header ${width <= 768 ? `` : `reveal`} ${menuExpanded ? `headerMenuOpen` : ``}`}>
    <ElementReveal slide as={`header`} className={`header ${sideMenuActive ? `sideMenuMode` : ``} ${sideMenuBlurOff ? `sideMenuBlurOff` : ``} ${menuExpanded ? `headerMenuOpen` : ``}`}>
      <TopBar pauseonhover={false} />
      {/* <TopBar id={`topBar2`} direction={`ltr`} /> */}
      <div className={`navBar`}>
        <ElementReveal as={Link} href={navItems?.find((ni: any) => ni?.id == `home`)?.href} blur={false} delay={0.5} className={`homeButton`} aria-label={`Home`}>
          <i className={`fa-solid fa-house logoLetter`} />
        </ElementReveal>
        <ElementReveal as={Link} href={navItems?.find((ni: any) => ni?.id == `home`)?.href} blur={false} delay={0.5} className={`brandMark`} aria-label={`Piratechs home`}>
          <Logo className={`brandLogo`} />
          <span className={`navLink`} style={{ position: `relative`, left: -7, color: `white` }}>
            {titleGraphic ? (
              <Word className={`wordLogoNav`} gradient={false} gradientSword arrows={false} />
            ) : config?.title}
          </span>
        </ElementReveal>
        {renderLinks(`desktopNav`)}
        <div className={`navActions`}>
          {/* <ElementReveal
            delay={0.5}
            blur={false}
            as={`button`}
            type={`button`}
            disabled={!sideMenuAllowed}
            aria-pressed={sideMenuActive}
            className={`iconButton sideMenuModeButton`}
            aria-label={sideMenuActive ? `Use top navigation` : `Use side navigation`}
            onClick={() => {
              setMenuExpanded(false);
              setSideMenu((currentSideMenu) => !currentSideMenu);
            }}
          >
            <i className={`fa-solid ${sideMenuActive ? `fa-window-maximize` : `fa-table-columns`}`} />
          </ElementReveal> */}
          {/* {sideMenuExpanded && (
            <ElementReveal
              delay={0.5}
              blur={false}
              as={`button`}
              type={`button`}
              aria-pressed={sideMenuBlur}
              className={`iconButton sideMenuBlurButton`}
              title={sideMenuBlur ? `Disable side menu blur` : `Enable side menu blur`}
              aria-label={sideMenuBlur ? `Disable side menu blur` : `Enable side menu blur`}
              onClick={() => setSideMenuBlur((currentSideMenuBlur: any) => !currentSideMenuBlur)}
            >
              <i className={`fa-solid ${sideMenuBlur ? `fa-eye` : `fa-eye-slash`}`} />
            </ElementReveal>
          )} */}
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
            aria-label={sideMenuActive ? (menuExpanded ? `Collapse side menu` : `Expand side menu`) : `Toggle menu`}
            aria-expanded={menuExpanded}
            className={`iconButton mobileMenuButton`}
            onClick={() => setMenuExpanded(!menuExpanded)}
          >
            <i className={`fa-solid ${sideMenuActive ? (menuExpanded ? `fa-angles-left` : `fa-angles-right`) : (menuExpanded ? `fa-xmark` : `fa-bars`)}`} />
          </ElementReveal>
        </div>
      </div>
      <div className={`mobileMenu`}>
        {renderLinks(`mobileNav`)}
        <AuthWidget mobile />
      </div>
    {/* </header> */}
    </ElementReveal>
  );
}
