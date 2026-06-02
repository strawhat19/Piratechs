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
    { id: `home`, label: `Home`, href: `./index.html` },
    { id: `about`, label: `About`, href: `./about.html` },
    { id: `projects`, label: `Projects`, href: `./projects.html` },
    { id: `services`, label: `Services`, href: `./services.html` },
    { id: `features`, label: `Features`, href: `./features.html` },
    { id: `gallery`, label: `Gallery`, href: `./gallery.html` },
    { id: `contact`, label: `Contact`, href: `./contact.html` }
  ],
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
  },
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
  ],
  services: [
    { title: `Front-End Systems`, text: `Responsive HTML, CSS, Sass, JavaScript, TypeScript, app shells, design systems, and polished UI states.` },
    { title: `Back-End + Data`, text: `Python, JSON, SQL, REST APIs, Firebase, WordPress/MySQL, automation, and practical integration work.` },
    { title: `CMS + Commerce`, text: `WordPress restorations, Shopify ideas, Squarespace support, branded pages, portfolio pieces, and content workflows.` }
  ],
  capabilities: [`Python`, `JSON`, `SQL`, `REST`, `Firebase`, `WordPress`, `Shopify`, `Auth`, `PWA`, `Sass`, `TypeScript`, `Responsive UI`],
  gallery: [`Dashboards`, `WordPress`, `PWA Shells`, `Data Apps`, `Design Studies`, `Game UI`],
  social: [
    { label: `GitHub`, href: `https://github.com/strawhat19` },
    { label: `LinkedIn`, href: `https://www.linkedin.com/` },
    { label: `Piratechs`, href: `https://piratechs.com/` }
  ]
};
