'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import AuthWidget from '@/app/components/auth/auth-widget';
import { siteConfig } from '@/shared/config/site';
import type { ThemeMode } from '@/shared/types/site';

export default function Nav() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [theme, setTheme] = useState<ThemeMode>(`dark`);

  useEffect(() => {
    const storedTheme = window.localStorage.getItem(`piratechs-theme`) as ThemeMode | null;
    const nextTheme = storedTheme == `light` ? `light` : `dark`;
    setTheme(nextTheme);
    document.body.dataset.theme = nextTheme;
  }, []);

  useEffect(() => {
    document.body.classList.toggle(`menuOpen`, menuOpen);
    return () => document.body.classList.remove(`menuOpen`);
  }, [menuOpen]);

  const toggleTheme = () => {
    const nextTheme: ThemeMode = theme == `dark` ? `light` : `dark`;
    setTheme(nextTheme);
    document.body.dataset.theme = nextTheme;
    window.localStorage.setItem(`piratechs-theme`, nextTheme);
  };

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
          onClick={() => setMenuOpen(false)}
          className={`navLink ${isActiveRoute(item.href) ? `activeRoute` : ``}`}
        >
          <i className={item.icon} />
          <span>{item.label}</span>
        </Link>
      ))}
    </nav>
  );

  return (
    <header className={`siteHeader ${menuOpen ? `headerMenuOpen` : ``}`}>
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
          <button type={`button`} className={`iconButton themeButton`} aria-label={`Toggle theme`} onClick={toggleTheme}>
            <i className={`fa-solid ${theme == `dark` ? `fa-sun` : `fa-moon`}`} />
          </button>
          <button
            type={`button`}
            aria-label={`Toggle menu`}
            aria-expanded={menuOpen}
            className={`iconButton mobileMenuButton`}
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <i className={`fa-solid ${menuOpen ? `fa-xmark` : `fa-bars`}`} />
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
