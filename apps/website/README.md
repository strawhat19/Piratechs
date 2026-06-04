# Piratechs

Piratechs is a static portfolio PWA for a full-stack software engineer with a front-end focus. The first build is a GitHub Pages-ready HTML, CSS, and JavaScript site that uses the real Piratechs brand assets, a dark-mode-first navy/cyan palette, responsive navigation, a compact auth widget, featured project cards, and sections for experience, services, backend/API/data proof, gallery, and contact.

This version is the foundation for the future Piratechs portfolio/app ecosystem. It is intentionally simple enough to deploy as a static site today, while keeping the design direction easy to rebuild in a future Next.js app.

## Current Direction

- Brand-first portfolio centered on the Piratechs logo and visual system
- Dark mode default with a matching light mode
- Mobile responsive landing page and shared route shell
- Project cards for live apps, GitHub repos, WordPress sites, data/API work, design studies, and future games/mobile apps
- Back End / API / Data section for Python, JSON, SQL, REST, Firebase, WordPress, Shopify, auth, and integrations
- PWA basics with a web manifest and service worker

## Local Preview

Open `apps/website/index.html` in VS Code and start Live Server from that file. Shared brand assets live at the Piratechs root in `public/`.

## File Structure

This archive version is plain HTML, CSS, and JavaScript. There is no TypeScript, Sass, package install, or build step for `apps/website`.

- `index.html` is the home page
- `pages/` contains the non-home pages
- `styles/main.css` contains the compiled site CSS
- `scripts/` contains the browser JavaScript and site config
- `.htaccess` rewrites clean URLs like `/about` to `pages/about.html` when served through Apache
