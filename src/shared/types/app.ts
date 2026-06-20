import { Roles } from './types';

export type ThemeMode = `dark` | `light`;
export type RouteID = Exclude<string, `home`>;

export type NavItem = {
  id: string;
  href: string;
  icon: string;
  label: string;
  role?: Roles | string;
};

export type PageCopy = {
  title: string;
  html?: string;
  eyebrow: string;
  summary: string;
  summaryHtml?: string;
};

export type Stat = {
  text: string;
  label: string;
  html?: string;
  value: string;
  title?: string;
};

export type Service = {
  text: string;
  icon: string;
  title: string;
};

export type Skill = {
  icon: string;
  label: string;
  group: string;
};

export type SocialLink = {
  href: string;
  icon: string;
  label: string;
};

export type TopBarItem = {
  text: string;
  icon: string;
  label?: string;
};
