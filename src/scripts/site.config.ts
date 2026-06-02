export type NavItem = {
  id: string;
  label: string;
  href: string;
  icon: string;
};

export type Project = {
  id: string;
  title: string;
  type: string;
  summary: string;
  status: string;
  liveUrl?: string;
  codeUrl?: string;
  tech: string[];
  featured?: boolean;
};

export type PageCopy = {
  eyebrow: string;
  title: string;
  summary: string;
};

export type Skill = {
  label: string;
  group: string;
  icon: string;
};

export const siteConfig = {
  title: `Piratechs`,
  description: `Full-stack software portfolio and digital studio.`,
  contactEmail: `hello@piratechs.com`,
  logo: {
    dark: `./public/assets/piratechs/svg/Piratechs-Icon-White.svg`,
    light: `./public/assets/piratechs/svg/Piratechs-Icon-Navy.svg`,
    tile: `./public/assets/piratechs/images/Piratechs-Icon-App-Tile-Navy-BG.png`
  },
  nav: [
    { id: `home`, label: `Home`, href: `./index.html`, icon: `fa-solid fa-house` },
    { id: `about`, label: `About`, href: `./about.html`, icon: `fa-solid fa-anchor` },
    { id: `projects`, label: `Projects`, href: `./projects.html`, icon: `fa-solid fa-diagram-project` },
    { id: `services`, label: `Services`, href: `./services.html`, icon: `fa-solid fa-screwdriver-wrench` },
    { id: `store`, label: `Store`, href: `./store.html`, icon: `fa-solid fa-store` },
    { id: `features`, label: `Features`, href: `./features.html`, icon: `fa-solid fa-list-check` },
    { id: `gallery`, label: `Gallery`, href: `./gallery.html`, icon: `fa-solid fa-images` },
    { id: `contact`, label: `Contact`, href: `./contact.html`, icon: `fa-solid fa-paper-plane` }
  ] satisfies NavItem[],
  pages: {
    home: {
      eyebrow: `Portfolio PWA`,
      title: `Full-stack systems with a sharp front-end edge`,
      summary: `Piratechs is evolving into a modern portfolio, product lab, and proof-of-work hub for polished interfaces, practical APIs, data workflows, and production-minded software.`
    },
    about: {
      eyebrow: `About Piratechs`,
      title: `A brand-first portfolio for serious software craft`,
      summary: `Built around the Piratechs identity, this site focuses on technical range, product thinking, and the kind of UI polish that makes complex systems easier to use.`
    },
    projects: {
      eyebrow: `Selected Work`,
      title: `Projects that prove the stack`,
      summary: `A growing archive of web apps, WordPress restorations, dashboards, data tools, game-adjacent builds, and experiments with live links and source references.`
    },
    services: {
      eyebrow: `Services`,
      title: `From landing pages to full-stack products`,
      summary: `A practical service map for responsive front ends, data-driven apps, CMS builds, automation, integrations, and branded product systems.`
    },
    store: {
      eyebrow: `Store`,
      title: `A future shelf for digital products and tools`,
      summary: `This page will become the place for templates, small utilities, downloadable assets, and productized Piratechs experiments.`
    },
    features: {
      eyebrow: `Features`,
      title: `Fast, installable, responsive, and easy to expand`,
      summary: `The static foundation starts as a GitHub Pages-friendly PWA and can later be rebuilt across Next, Angular/Nx/Ionic, and Expo without losing the design system.`
    },
    gallery: {
      eyebrow: `Gallery`,
      title: `A visual archive for apps, brands, and experiments`,
      summary: `A simple first pass at showcasing screenshots, logos, WordPress work, interface studies, game projects, and future portfolio media.`
    },
    contact: {
      eyebrow: `Contact`,
      title: `Let Piratechs build the next version`,
      summary: `A focused contact page for portfolio reviewers, collaborators, recruiters, and future clients looking for front-end polish backed by full-stack depth.`
    }
  } satisfies Record<string, PageCopy>,
  stats: [
    { label: `Years`, value: `4+`, text: `Software engineering at Mitsubishi Electric` },
    { label: `Focus`, value: `UI + API`, text: `Front-end polish with backend reliability` },
    { label: `Stack`, value: `TS / Python / SQL`, text: `Product interfaces, data, automation, integrations` }
  ],
  filters: [`Featured`, `All`, `Web App`, `WordPress`, `Data/API`, `Design`, `Shopify`, `PWA`],
  projects: [
    {
      id: `productivf`,
      title: `ProductivF`,
      type: `Web App`,
      status: `Live`,
      liveUrl: `https://www.productivf.com/`,
      summary: `Dashboard-style productivity app with auth, grids, records, and app-shell navigation patterns.`,
      tech: [`TypeScript`, `Sass`, `Auth`, `Data UI`],
      featured: true
    },
    {
      id: `dyer-posta`,
      title: `Dyer & Posta`,
      type: `WordPress`,
      status: `Restored`,
      liveUrl: `https://dyerposta.com/`,
      summary: `Elegant salon portfolio restoration with responsive layout, classic WordPress editing, and refined carousel behavior.`,
      tech: [`WordPress`, `PHP`, `MySQL`, `CSS`],
      featured: true
    },
    {
      id: `mydex`,
      title: `MyDex Pokedex`,
      type: `Web App`,
      status: `Live`,
      liveUrl: `https://mydex-pokedex.com/`,
      codeUrl: `https://github.com/strawhat19/MyDex-Pokedex-Clone`,
      summary: `Pokedex clone with accounts, saved teams, profile concepts, API data, PHP templating, Sass, and Firebase.`,
      tech: [`PHP`, `Sass`, `Firebase`, `API`],
      featured: true
    },
    {
      id: `piratechs-pwa`,
      title: `Piratechs Next PWA`,
      type: `PWA`,
      status: `Template`,
      liveUrl: `https://piratechs-next-pwa-template-2025.vercel.app/`,
      summary: `Reusable app-shell template with PWA direction, settings, navigation, and installable app thinking.`,
      tech: [`Next.js`, `PWA`, `TypeScript`, `Sass`],
      featured: true
    },
    {
      id: `smasherscape`,
      title: `Smasherscape`,
      type: `Web App`,
      status: `Live`,
      liveUrl: `https://smasherscape.vercel.app/`,
      codeUrl: `https://github.com/strawhat19/Smasherscape`,
      summary: `Game-flavored leaderboard and admin tooling with searchable player stats and custom UI identity.`,
      tech: [`Next.js`, `Firebase`, `Sass`, `Admin`],
      featured: true
    },
    {
      id: `geodata`,
      title: `GeoData`,
      type: `Data/API`,
      status: `Live`,
      liveUrl: `https://strawhat19.github.io/GeoData/`,
      codeUrl: `https://github.com/strawhat19/GeoData`,
      summary: `Location, timezone, weather, maps, and API-driven data visualization work in a compact interface.`,
      tech: [`JavaScript`, `JSON`, `Maps`, `Weather API`],
      featured: true
    },
    {
      id: `creative-workshop`,
      title: `Creative Workshop`,
      type: `Shopify`,
      status: `Live`,
      liveUrl: `https://creative-workshop.vercel.app/`,
      codeUrl: `https://github.com/strawhat19/CreativeWorkshop`,
      summary: `Commerce and creative studio concept with product management, auth patterns, Shopify thinking, and live UI controls.`,
      tech: [`Next.js`, `Shopify`, `Firebase`, `WebSockets`]
    },
    {
      id: `design-development`,
      title: `Design Development`,
      type: `Design`,
      status: `Archive`,
      liveUrl: `https://strawhat19.github.io/Design-Development/`,
      codeUrl: `https://github.com/strawhat19/Design-Development`,
      summary: `Early design/code lab exploring page state, animation, Sass, TypeScript, PHP, jQuery, and interaction patterns.`,
      tech: [`HTML`, `Sass`, `TypeScript`, `Motion`]
    }
  ] satisfies Project[],
  services: [
    { title: `Front-End Systems`, text: `Responsive HTML, CSS, Sass, JavaScript, TypeScript, app shells, design systems, and polished UI states.` },
    { title: `Back-End + Data`, text: `Python, JSON, SQL, REST APIs, Firebase, WordPress/MySQL, automation, and practical integration work.` },
    { title: `CMS + Commerce`, text: `WordPress restorations, Shopify ideas, Squarespace support, branded pages, portfolio pieces, and content workflows.` }
  ],
  skills: [
    { label: `HTML`, group: `Markup`, icon: `fa-brands fa-html5` },
    { label: `CSS`, group: `Style`, icon: `fa-brands fa-css3-alt` },
    { label: `Sass`, group: `Style`, icon: `fa-brands fa-sass` },
    { label: `JavaScript`, group: `Logic`, icon: `fa-brands fa-js` },
    { label: `TypeScript`, group: `Logic`, icon: `fa-solid fa-code` },
    { label: `React`, group: `UI`, icon: `fa-brands fa-react` },
    { label: `Angular`, group: `UI`, icon: `fa-brands fa-angular` },
    { label: `Node`, group: `Runtime`, icon: `fa-brands fa-node-js` },
    { label: `Python`, group: `Backend`, icon: `fa-brands fa-python` },
    { label: `SQL`, group: `Data`, icon: `fa-solid fa-database` },
    { label: `JSON`, group: `Data`, icon: `fa-solid fa-file-code` },
    { label: `Firebase`, group: `BaaS`, icon: `fa-solid fa-fire-flame-curved` },
    { label: `WordPress`, group: `CMS`, icon: `fa-brands fa-wordpress` },
    { label: `Shopify`, group: `Commerce`, icon: `fa-brands fa-shopify` },
    { label: `GitHub`, group: `Code`, icon: `fa-brands fa-github` },
    { label: `PWA`, group: `App`, icon: `fa-solid fa-mobile-screen-button` }
  ] satisfies Skill[],
  capabilities: [`Python`, `JSON`, `SQL`, `REST`, `Firebase`, `WordPress`, `Shopify`, `Auth`, `PWA`, `Sass`, `TypeScript`, `Responsive UI`],
  gallery: [`Dashboards`, `WordPress`, `PWA Shells`, `Data Apps`, `Design Studies`, `Game UI`],
  social: [
    { label: `GitHub`, href: `https://github.com/strawhat19` },
    { label: `LinkedIn`, href: `https://www.linkedin.com/` },
    { label: `Piratechs`, href: `https://piratechs.com/` }
  ]
};
