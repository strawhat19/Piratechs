import { siteConfig, type Project } from './site.config.js';

type PageId = keyof typeof siteConfig.pages;

const pageId = (document.body.dataset.page || `home`) as PageId;
const app = document.querySelector<HTMLElement>(`[data-router-view]`);
const toast = document.querySelector<HTMLElement>(`[data-toast]`);
const pageCopy = siteConfig.pages[pageId] || siteConfig.pages.home;

const renderNav = (target: Element | null) => {
  if (!target) return;
  target.innerHTML = siteConfig.nav.map(item => `
    <a class="navLink ${item.id === pageId ? `activeRoute` : ``}" href="${item.href}">${item.label}</a>
  `).join(``);
};

const techList = (tech: string[]) => tech.map(item => `<span>${item}</span>`).join(``);

const projectCard = (project: Project) => `
  <article class="projectCard reveal" data-project-card data-type="${project.type}" data-featured="${project.featured ? `true` : `false`}">
    <div class="projectTop">
      <span class="typeBadge">${project.type}</span>
      <span class="statusPill">${project.status}</span>
    </div>
    <h3>${project.title}</h3>
    <p>${project.summary}</p>
    <div class="techList">${techList(project.tech)}</div>
    <div class="projectActions">
      ${project.liveUrl ? `<a class="buttonLink primary" href="${project.liveUrl}" target="_blank" rel="noreferrer">Live URL</a>` : ``}
      ${project.codeUrl ? `<a class="buttonLink ghost" href="${project.codeUrl}" target="_blank" rel="noreferrer">GitHub</a>` : ``}
    </div>
  </article>
`;

const sectionTitle = (eyebrow: string, title: string, summary: string) => `
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
    <a href="./contact.html">Need access? Start with contact.</a>
  </form>
`;

const renderHero = () => `
  <section class="heroSection pageSection">
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
          <a class="buttonLink primary" href="./projects.html">View Projects</a>
          <a class="buttonLink ghost" href="./contact.html">Contact Piratechs</a>
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
      ${siteConfig.stats.map(stat => `
        <article class="statCard reveal">
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
        ${siteConfig.capabilities.map(item => `<span>${item}</span>`).join(``)}
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
            <h3>${service.title}</h3>
            <p>${service.text}</p>
          </article>
        `).join(``)}
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

const renderPageShell = () => `
  ${renderHero()}
  ${renderProjects()}
  ${renderExperience()}
  ${renderBackend()}
  ${pageId === `gallery` ? renderGallery() : renderServices()}
  ${pageId === `gallery` ? `` : renderGallery()}
  ${renderContact()}
`;

const renderFooter = () => {
  const footer = document.querySelector<HTMLElement>(`[data-footer]`);
  if (!footer) return;
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

const showToast = (message: string) => {
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add(`showToast`);
  window.setTimeout(() => toast.classList.remove(`showToast`), 2600);
};

const bindAuthForms = () => {
  document.querySelectorAll<HTMLFormElement>(`[data-auth-form]`).forEach(form => {
    form.addEventListener(`submit`, event => {
      event.preventDefault();
      showToast(`Auth UI Ready For Future Backend`);
    });
  });
  document.querySelectorAll<HTMLElement>(`[data-google-auth]`).forEach(button => {
    button.addEventListener(`click`, () => showToast(`Google Sign-In Placeholder`));
  });
};

const bindFilters = () => {
  const buttons = document.querySelectorAll<HTMLButtonElement>(`[data-filter]`);
  const cards = document.querySelectorAll<HTMLElement>(`[data-project-card]`);

  const applyFilter = (filter: string) => {
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

  const activeFilter = document.querySelector<HTMLButtonElement>(`.filterButton.activeFilter`)?.dataset.filter || `Featured`;
  applyFilter(activeFilter);
};

const bindMenus = () => {
  const menuToggle = document.querySelector<HTMLButtonElement>(`[data-menu-toggle]`);
  const mobileMenu = document.querySelector<HTMLElement>(`[data-mobile-menu]`);
  const authToggle = document.querySelector<HTMLButtonElement>(`[data-auth-toggle]`);
  const authWrap = document.querySelector<HTMLElement>(`[data-auth-wrap]`);

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
    if (!authWrap?.contains(event.target as Node)) {
      authWrap?.classList.remove(`authOpen`);
      authToggle?.setAttribute(`aria-expanded`, `false`);
    }
  });
};

const bindTheme = () => {
  const storedTheme = localStorage.getItem(`piratechs-theme`);
  const preferredTheme = storedTheme || `dark`;
  document.body.dataset.theme = preferredTheme;

  document.querySelector<HTMLButtonElement>(`[data-theme-toggle]`)?.addEventListener(`click`, () => {
    const nextTheme = document.body.dataset.theme === `dark` ? `light` : `dark`;
    document.body.dataset.theme = nextTheme;
    localStorage.setItem(`piratechs-theme`, nextTheme);
  });
};

const bindReveal = () => {
  const items = document.querySelectorAll<HTMLElement>(`.reveal`);
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add(`isVisible`);
    });
  }, { threshold: 0.18 });
  items.forEach(item => observer.observe(item));
};

const bindHeader = () => {
  const header = document.querySelector<HTMLElement>(`[data-header]`);
  const update = () => header?.classList.toggle(`headerScrolled`, window.scrollY > 12);
  update();
  window.addEventListener(`scroll`, update, { passive: true });
};

const registerPwa = () => {
  if (!(`serviceWorker` in navigator)) return;
  window.addEventListener(`load`, () => {
    navigator.serviceWorker.register(`./sw.js`).catch(() => undefined);
  });
};

const init = () => {
  if (app) app.innerHTML = renderPageShell();
  document.title = pageId === `home` ? `${siteConfig.title} | Full-Stack Software Portfolio` : `${pageCopy.title} | ${siteConfig.title}`;
  renderNav(document.querySelector(`[data-nav]`));
  renderNav(document.querySelector(`[data-mobile-nav]`));
  document.querySelector(`[data-auth-panel]`)?.insertAdjacentHTML(`beforeend`, authMarkup());
  document.querySelector(`[data-mobile-auth]`)?.insertAdjacentHTML(`beforeend`, authMarkup());
  renderFooter();
  bindTheme();
  bindMenus();
  bindAuthForms();
  bindFilters();
  bindReveal();
  bindHeader();
  registerPwa();
};

init();
