import { siteConfig } from './site.config.js';
const app = document.querySelector(`[data-router-view]`);
const toast = document.querySelector(`[data-toast]`);
const pageIds = Object.keys(siteConfig.pages);
const routePageId = () => {
    const parts = location.pathname.split(`/`).filter(Boolean);
    const segment = parts.at(-1) || `home`;
    const pageSlug = segment === `index.html` ? parts.at(-2) || `home` : segment.replace(/\.html$/, ``);
    return pageIds.includes(pageSlug) ? pageSlug : document.body.dataset.page || `home`;
};
let pageId = routePageId();
let pageCopy = siteConfig.pages[pageId] || siteConfig.pages.home;
const iconMap = {
    api: `fa-solid fa-cloud-arrow-up`,
    admin: `fa-solid fa-user-shield`,
    angular: `fa-brands fa-angular`,
    auth: `fa-solid fa-fingerprint`,
    css: `fa-brands fa-css3-alt`,
    'cms + commerce': `fa-solid fa-store`,
    design: `fa-solid fa-pen-ruler`,
    dashboards: `fa-solid fa-table-columns`,
    'data ui': `fa-solid fa-table-cells-large`,
    'data/api': `fa-solid fa-database`,
    'data apps': `fa-solid fa-chart-line`,
    'design studies': `fa-solid fa-pen-ruler`,
    firebase: `fa-solid fa-fire-flame-curved`,
    'front-end systems': `fa-solid fa-display`,
    'game ui': `fa-solid fa-gamepad`,
    github: `fa-brands fa-github`,
    html: `fa-brands fa-html5`,
    javascript: `fa-brands fa-js`,
    json: `fa-solid fa-file-code`,
    maps: `fa-solid fa-map-location-dot`,
    mobile: `fa-solid fa-mobile-screen-button`,
    motion: `fa-solid fa-wave-square`,
    mysql: `fa-solid fa-database`,
    next: `fa-solid fa-n`,
    'next.js': `fa-solid fa-n`,
    node: `fa-brands fa-node-js`,
    php: `fa-brands fa-php`,
    pwa: `fa-solid fa-mobile-screen-button`,
    'pwa shells': `fa-solid fa-mobile-screen-button`,
    python: `fa-brands fa-python`,
    react: `fa-brands fa-react`,
    'responsive ui': `fa-solid fa-display`,
    rest: `fa-solid fa-cloud-arrow-up`,
    sass: `fa-brands fa-sass`,
    shopify: `fa-brands fa-shopify`,
    sql: `fa-solid fa-database`,
    typescript: `fa-solid fa-code`,
    wordpress: `fa-brands fa-wordpress`,
    'back-end + data': `fa-solid fa-database`,
    'weather api': `fa-solid fa-cloud-sun`,
    websockets: `fa-solid fa-network-wired`,
    'web app': `fa-solid fa-window-restore`
};
const techSlug = (label) => label.toLowerCase().replace(/[^a-z0-9]+/g, `-`).replace(/^-|-$/g, ``);
const iconFor = (label) => iconMap[label.toLowerCase()] || `fa-solid fa-code`;
const iconMarkup = (label) => `<i class="${iconFor(label)} techIcon techIcon-${techSlug(label)}" aria-hidden="true"></i>`;
const renderNav = (target) => {
    if (!target)
        return;
    target.innerHTML = siteConfig.nav.map(item => `
    <a class="navLink ${item.id === pageId ? `activeRoute` : ``}" href="${item.href}">
      <i class="${item.icon}" aria-hidden="true"></i>
      <span>${item.label}</span>
    </a>
  `).join(``);
};
const routeHref = (href) => {
    const url = new URL(href, location.href);
    if (url.origin !== location.origin)
        return undefined;
    const homePath = new URL(`./`, document.baseURI).pathname;
    if (url.pathname === homePath || url.pathname === `${homePath}index.html`)
        return `home`;
    const parts = url.pathname.split(`/`).filter(Boolean);
    const segment = parts.at(-1) || `home`;
    const pageSlug = segment === `index.html` ? parts.at(-2) || `home` : segment.replace(/\.html$/, ``);
    return pageIds.includes(pageSlug) ? pageSlug : undefined;
};
const techList = (tech) => tech.map(item => `<span>${iconMarkup(item)}${item}</span>`).join(``);
const projectCard = (project) => `
  <article class="projectCard reveal" data-project-card data-type="${project.type}" data-featured="${project.featured ? `true` : `false`}">
    <div class="projectTop">
      <span class="typeBadge">${iconMarkup(project.type)}${project.type}</span>
      <span class="statusPill"><i class="fa-solid fa-satellite-dish" aria-hidden="true"></i>${project.status}</span>
    </div>
    <div class="projectIconCloud" aria-hidden="true">${project.tech.slice(0, 4).map(item => iconMarkup(item)).join(``)}</div>
    <h3>${project.title}</h3>
    <p>${project.summary}</p>
    <div class="techList">${techList(project.tech)}</div>
    <div class="projectActions">
      ${project.liveUrl ? `<a class="buttonLink primary" href="${project.liveUrl}" target="_blank" rel="noreferrer">Live URL</a>` : ``}
      ${project.codeUrl ? `<a class="buttonLink ghost" href="${project.codeUrl}" target="_blank" rel="noreferrer">GitHub</a>` : ``}
    </div>
  </article>
`;
const sectionTitle = (eyebrow, title, summary) => `
  <div class="sectionTitle reveal">
    <span class="eyebrow">${eyebrow}</span>
    <h2>${title}</h2>
    <p>${summary}</p>
  </div>
`;
const authMarkup = () => `
  <form class="authForm" data-auth-form>
    <div class="authHeader">
      <strong>Sign Up or Sign In</strong>
      <small>Portfolio access preview</small>
    </div>
    <label>
      <span>Email</span>
      <input type="email" name="email" placeholder="you@example.com" autocomplete="email">
    </label>
    <label>
      <span>Password</span>
      <input type="password" name="password" placeholder="Password" autocomplete="current-password">
    </label>
    <button class="submitButton" type="submit">Sign In</button>
    <button class="googleButton" type="button" data-google-auth>Continue with Google</button>
    <a href="./pages/contact/">Need access? Start with contact.</a>
  </form>
`;
const renderHero = () => `
  <section class="heroSection pageSection ${pageId === `home` ? `homeHero` : `subHero`}">
    <div class="heroBg" aria-hidden="true">
      <span class="gridPlane gridPlaneA"></span>
      <span class="gridPlane gridPlaneB"></span>
      <span class="signalLine signalLineA"></span>
      <span class="signalLine signalLineB"></span>
    </div>
    <div class="sectionInner heroGrid">
      <div class="heroCopy reveal">
        <span class="eyebrow">${pageCopy.eyebrow}</span>
        <h1>${pageCopy.title}</h1>
        <p>${pageCopy.summary}</p>
        <div class="heroActions">
          <a class="buttonLink primary" href="./pages/projects/">View Projects</a>
          <a class="buttonLink ghost" href="./pages/contact/">Contact Piratechs</a>
        </div>
      </div>
      <div class="heroBrand reveal">
        <div class="heroLogoPlate">
          <img class="heroLogoDark" src="${siteConfig.logo.dark}" alt="Piratechs logo">
          <img class="heroLogoLight" src="${siteConfig.logo.light}" alt="Piratechs logo">
          <div class="heroOrbit" aria-hidden="true"></div>
        </div>
        <div class="heroMiniStats">
          ${siteConfig.stats.map(stat => `<span><strong>${stat.value}</strong>${stat.label}</span>`).join(``)}
        </div>
      </div>
    </div>
  </section>
`;
const renderProjects = () => {
    const projects = [...siteConfig.projects].sort((a, b) => Number(Boolean(b.featured)) - Number(Boolean(a.featured)));
    const activeFilter = pageId === `projects` ? `All` : `Featured`;
    return `
    <section class="pageSection projectsSection" id="projects">
      <div class="sectionInner">
        ${sectionTitle(`Featured Projects`, `Proof-of-work cards that can scale`, `GitHub repos, live deployments, WordPress sites, data apps, design labs, and future game/mobile work all share one card system.`)}
        <div class="filterBar reveal" data-filter-bar>
          ${siteConfig.filters.map(filter => `<button class="filterButton ${filter === activeFilter ? `activeFilter` : ``}" type="button" data-filter="${filter}">${filter}</button>`).join(``)}
        </div>
        <div class="projectGrid" data-project-grid>${projects.map(projectCard).join(``)}</div>
      </div>
    </section>
  `;
};
const renderExperience = () => `
  <section class="pageSection experienceSection" id="about">
    <div class="sectionInner experienceGrid">
      ${siteConfig.stats.map((stat, index) => `
        <article class="statCard reveal">
          <i class="${[`fa-solid fa-briefcase`, `fa-solid fa-layer-group`, `fa-solid fa-terminal`][index] || `fa-solid fa-code`}" aria-hidden="true"></i>
          <span>${stat.label}</span>
          <strong>${stat.value}</strong>
          <p>${stat.text}</p>
        </article>
      `).join(``)}
    </div>
  </section>
`;
const renderBackend = () => `
  <section class="pageSection backendSection" id="features">
    <div class="sectionInner backendGrid">
      <div>
        ${sectionTitle(`Back End / API / Data`, `Reliable systems behind polished screens`, `This section becomes the backend credibility band: data modeling, REST contracts, authentication, automation, CMS work, and integration patterns.`)}
      </div>
      <div class="capabilityGrid reveal">
        ${siteConfig.capabilities.map(item => `<span>${iconMarkup(item)}<strong>${item}</strong></span>`).join(``)}
      </div>
    </div>
  </section>
`;
const renderSkillsRefined = () => `
  <section class="pageSection skillsSection" id="skills">
    <div class="sectionInner">
      ${sectionTitle(`Skills // Refined`, `The working stack behind the brand`, `A tighter version of the classic portfolio skills row, expanded into a reusable icon system for the new Piratechs site.`)}
      <div class="skillsGrid">
        ${siteConfig.skills.map(skill => `
          <article class="skillTile reveal">
            ${iconMarkup(skill.label)}
            <span>${skill.group}</span>
            <strong>${skill.label}</strong>
          </article>
        `).join(``)}
      </div>
    </div>
  </section>
`;
const renderServices = () => `
  <section class="pageSection servicesSection" id="services">
    <div class="sectionInner">
      ${sectionTitle(`Services`, `Buildable paths for the portfolio and beyond`, `A first pass at the service story, designed to expand later into real case studies and contact flows.`)}
      <div class="serviceGrid">
        ${siteConfig.services.map(service => `
          <article class="serviceCard reveal">
            ${iconMarkup(service.title)}
            <h3>${service.title}</h3>
            <p>${service.text}</p>
          </article>
        `).join(``)}
      </div>
    </div>
  </section>
`;
const renderStore = () => `
  <section class="pageSection storeSection" id="store">
    <div class="sectionInner">
      ${sectionTitle(`Store`, `Digital products and tools will live here`, `This first pass reserves a clean app-style shelf for future templates, UI kits, utilities, downloadable assets, and productized experiments.`)}
      <div class="serviceGrid">
        <article class="serviceCard reveal"><i class="fa-solid fa-file-code" aria-hidden="true"></i><h3>Templates</h3><p>Future starter kits for portfolio pages, PWA shells, dashboards, and branded app layouts.</p></article>
        <article class="serviceCard reveal"><i class="fa-solid fa-screwdriver-wrench" aria-hidden="true"></i><h3>Utilities</h3><p>Small tools and scripts that can ship as public demos or downloadable resources.</p></article>
        <article class="serviceCard reveal"><i class="fa-solid fa-icons" aria-hidden="true"></i><h3>Assets</h3><p>Logo packs, UI studies, icon treatments, and visual systems connected to the Piratechs brand.</p></article>
      </div>
    </div>
  </section>
`;
const renderGallery = () => `
  <section class="pageSection gallerySection" id="gallery">
    <div class="sectionInner">
      ${sectionTitle(`Gallery`, `A visual lane for future screenshots`, `The layout is ready for screenshots, mockups, app tiles, before-and-after restorations, and project media.`)}
      <div class="galleryGrid">
        ${siteConfig.gallery.map((item, index) => `
          <article class="galleryTile reveal">
            ${iconMarkup(item)}
            <span>0${index + 1}</span>
            <strong>${item}</strong>
          </article>
        `).join(``)}
      </div>
    </div>
  </section>
`;
const renderContact = () => `
  <section class="pageSection contactSection" id="contact">
    <div class="sectionInner contactBand reveal">
      <span class="eyebrow">Contact</span>
      <h2>Ready for the next version of Piratechs</h2>
      <p>Use this as the first public landing page while the full app versions grow in Angular, Expo, and Next.</p>
      <a class="buttonLink primary" href="mailto:${siteConfig.contactEmail}">${siteConfig.contactEmail}</a>
    </div>
  </section>
`;
const renderAbout = () => `
  <section class="pageSection pageDetailSection">
    <div class="sectionInner detailGrid">
      ${sectionTitle(`About`, `Built around the brand, not a headshot`, `Piratechs is becoming the public proof layer for production engineering experience, side-project range, and a cleaner full-stack identity.`)}
      <div class="detailCards">
        ${siteConfig.stats.map(stat => `
          <article class="statCard reveal">
            <span>${stat.label}</span>
            <strong>${stat.value}</strong>
            <p>${stat.text}</p>
          </article>
        `).join(``)}
      </div>
    </div>
  </section>
`;
const renderFeatures = () => `
  ${renderBackend()}
  ${renderSkillsRefined()}
  <section class="pageSection pageDetailSection">
    <div class="sectionInner">
      ${sectionTitle(`PWA Foundation`, `Static today, scalable tomorrow`, `The first build is intentionally simple for GitHub Pages, but the design system is ready to move into Next, Angular/Nx/Ionic, and Expo later.`)}
      <div class="serviceGrid">
        <article class="serviceCard reveal"><i class="fa-solid fa-mobile-screen-button" aria-hidden="true"></i><h3>Installable</h3><p>Manifest and service worker basics are in place so the portfolio can behave like a lightweight app.</p></article>
        <article class="serviceCard reveal"><i class="fa-solid fa-gears" aria-hidden="true"></i><h3>Config Driven</h3><p>Global page copy, nav items, projects, capabilities, and links live in a shared config object.</p></article>
        <article class="serviceCard reveal"><i class="fa-solid fa-display" aria-hidden="true"></i><h3>Responsive First</h3><p>The same nav and auth widget pattern works across desktop, tablet, and mobile menu states.</p></article>
      </div>
    </div>
  </section>
`;
const renderPageDetail = () => {
    switch (pageId) {
        case `about`:
            return renderAbout();
        case `projects`:
            return renderProjects();
        case `services`:
            return renderServices();
        case `store`:
            return renderStore();
        case `features`:
            return renderFeatures();
        case `gallery`:
            return renderGallery();
        case `contact`:
            return renderContact();
        default:
            return renderServices();
    }
};
const renderHomeShell = () => `
  ${renderHero()}
  ${renderProjects()}
  ${renderExperience()}
  ${renderSkillsRefined()}
  ${renderBackend()}
  ${renderServices()}
  ${renderGallery()}
  ${renderContact()}
`;
const renderPageShell = () => pageId === `home` ? renderHomeShell() : `
  ${renderHero()}
  ${renderPageDetail()}
`;
const renderFooter = () => {
    const footer = document.querySelector(`[data-footer]`);
    if (!footer)
        return;
    footer.innerHTML = `
    <div class="footerInner">
      <div class="footerBrand">
        <img class="footerLogoDark" src="${siteConfig.logo.dark}" alt="Piratechs logo">
        <img class="footerLogoLight" src="${siteConfig.logo.light}" alt="Piratechs logo">
        <div>
          <strong>Piratechs</strong>
          <p>${siteConfig.description}</p>
        </div>
      </div>
      <nav aria-label="Footer navigation">${siteConfig.nav.map(item => `<a href="${item.href}">${item.label}</a>`).join(``)}</nav>
      <div class="footerLinks">${siteConfig.social.map(item => `<a href="${item.href}" target="_blank" rel="noreferrer">${item.label}</a>`).join(``)}</div>
    </div>
  `;
};
const showToast = (message) => {
    if (!toast)
        return;
    toast.textContent = message;
    toast.classList.add(`showToast`);
    window.setTimeout(() => toast.classList.remove(`showToast`), 2600);
};
const bindAuthForms = () => {
    document.querySelectorAll(`[data-auth-form]`).forEach(form => {
        form.addEventListener(`submit`, event => {
            event.preventDefault();
            showToast(`Auth UI Ready For Future Backend`);
        });
    });
    document.querySelectorAll(`[data-google-auth]`).forEach(button => {
        button.addEventListener(`click`, () => showToast(`Google Sign-In Placeholder`));
    });
};
const bindFilters = () => {
    const buttons = document.querySelectorAll(`[data-filter]`);
    const cards = document.querySelectorAll(`[data-project-card]`);
    const applyFilter = (filter) => {
        cards.forEach(card => {
            const matches = filter === `All`
                ? true
                : filter === `Featured`
                    ? card.dataset.featured === `true`
                    : card.dataset.type === filter;
            card.classList.toggle(`filteredOut`, !matches);
        });
    };
    buttons.forEach(button => {
        button.addEventListener(`click`, () => {
            const filter = button.dataset.filter || `Featured`;
            buttons.forEach(item => item.classList.toggle(`activeFilter`, item === button));
            applyFilter(filter);
        });
    });
    const activeFilter = document.querySelector(`.filterButton.activeFilter`)?.dataset.filter || `Featured`;
    applyFilter(activeFilter);
};
const bindMenus = () => {
    const menuToggle = document.querySelector(`[data-menu-toggle]`);
    const mobileMenu = document.querySelector(`[data-mobile-menu]`);
    const authToggle = document.querySelector(`[data-auth-toggle]`);
    const authWrap = document.querySelector(`[data-auth-wrap]`);
    menuToggle?.addEventListener(`click`, () => {
        const nextState = !document.body.classList.contains(`menuOpen`);
        document.body.classList.toggle(`menuOpen`, nextState);
        menuToggle.setAttribute(`aria-expanded`, `${nextState}`);
        mobileMenu?.toggleAttribute(`inert`, !nextState);
    });
    authToggle?.addEventListener(`click`, () => {
        const nextState = !authWrap?.classList.contains(`authOpen`);
        authWrap?.classList.toggle(`authOpen`, nextState);
        authToggle.setAttribute(`aria-expanded`, `${nextState}`);
    });
    document.addEventListener(`click`, event => {
        if (!authWrap?.contains(event.target)) {
            authWrap?.classList.remove(`authOpen`);
            authToggle?.setAttribute(`aria-expanded`, `false`);
        }
    });
};
const bindTheme = () => {
    const storedTheme = localStorage.getItem(`piratechs-theme`);
    const preferredTheme = storedTheme || `dark`;
    document.body.dataset.theme = preferredTheme;
    document.querySelector(`[data-theme-toggle]`)?.addEventListener(`click`, () => {
        const nextTheme = document.body.dataset.theme === `dark` ? `light` : `dark`;
        document.body.dataset.theme = nextTheme;
        localStorage.setItem(`piratechs-theme`, nextTheme);
    });
};
const bindReveal = () => {
    const items = document.querySelectorAll(`.reveal`);
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting)
                entry.target.classList.add(`isVisible`);
        });
    }, { threshold: 0.18 });
    items.forEach(item => observer.observe(item));
};
const bindHeader = () => {
    const header = document.querySelector(`[data-header]`);
    const update = () => header?.classList.toggle(`headerScrolled`, window.scrollY > 12);
    update();
    window.addEventListener(`scroll`, update, { passive: true });
};
const registerPwa = () => {
    if (!(`serviceWorker` in navigator))
        return;
    window.addEventListener(`load`, () => {
        navigator.serviceWorker.register(`./sw.js`).catch(() => undefined);
    });
};
const renderCurrentPage = (shouldScroll = false) => {
    pageId = routePageId();
    pageCopy = siteConfig.pages[pageId] || siteConfig.pages.home;
    document.body.dataset.page = pageId;
    if (app)
        app.innerHTML = renderPageShell();
    document.title = pageId === `home` ? `${siteConfig.title} | Full-Stack Software Portfolio` : `${pageCopy.title} | ${siteConfig.title}`;
    renderNav(document.querySelector(`[data-nav]`));
    renderNav(document.querySelector(`[data-mobile-nav]`));
    renderFooter();
    bindFilters();
    bindReveal();
    if (shouldScroll)
        window.scrollTo({ top: 0, behavior: `smooth` });
};
const bindRoutes = () => {
    document.addEventListener(`click`, event => {
        const target = event.target;
        const link = target instanceof Element ? target.closest(`a[href]`) : undefined;
        if (!link || link.target || link.protocol === `mailto:`)
            return;
        const nextPageId = routeHref(link.href);
        if (!nextPageId)
            return;
        event.preventDefault();
        history.pushState({ pageId: nextPageId }, ``, link.href);
        document.body.classList.remove(`menuOpen`);
        document.querySelector(`[data-menu-toggle]`)?.setAttribute(`aria-expanded`, `false`);
        renderCurrentPage(true);
    });
    window.addEventListener(`popstate`, () => renderCurrentPage());
};
const init = () => {
    renderCurrentPage();
    document.querySelector(`[data-auth-panel]`)?.insertAdjacentHTML(`beforeend`, authMarkup());
    document.querySelector(`[data-mobile-auth]`)?.insertAdjacentHTML(`beforeend`, authMarkup());
    bindTheme();
    bindMenus();
    bindRoutes();
    bindAuthForms();
    bindHeader();
    registerPwa();
};
init();
