import { Roles } from './types';

export type PageID =
  | `home`
  | `about`
  | `projects`
  | `services`
  | `store`
  | `features`
  | `gallery`
  | `contact`;

export type ThemeMode = `dark` | `light`;
export type RouteID = Exclude<PageID, `home`>;

export type NavItem = {
  id: PageID;
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
};

export type Stat = {
  text: string;
  label: string;
  value: string;
};

export type Project = {
  id: string;
  type: string;
  title: string;
  tech: string[];
  status: string;
  summary: string;
  liveUrl?: string;
  codeUrl?: string;
  urlImage?: string;
  mediaURL?: string;
  featured?: boolean;
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
