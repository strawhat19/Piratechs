# Piratechs

Piratechs is being rebuilt as a modern Next.js portfolio and app shell for Vercel. The root app uses the Piratechs brand system, a dark-mode-first navy/cyan palette, responsive app-style navigation, PWA support, Firebase-ready auth wiring, clean route rewrites, and a typed content config that can scale into pages, API routes, projects, services, store features, and future database-backed work.

The existing GitHub Pages version is preserved in `docs/`.

## Stack

- Next.js App Router
- TypeScript
- Sass / SCSS partials
- Font Awesome icons
- Firebase-ready client auth helpers
- PWA support through `next-pwa`
- Vercel zero-config deployment

## Local Development

```bash
npm install
npm run dev
```

Then open `http://localhost:3000`.

## Structure

- `src/app` contains App Router pages, layout, route handlers, and components
- `src/app/pages/*` contains the clean-route page targets used by `next.config.ts`
- `src/shared/config/site.ts` holds the editable site content, routes, projects, skills, and links
- `src/shared/lib/firebase.ts` contains lazy Firebase initialization for future auth/database work
- `src/styles` contains the global Sass partials and CSS variable theme system
- `public` contains shared Piratechs assets and PWA icons
- `docs` keeps the static GitHub Pages build

## Routes

The public navigation uses clean URLs:

- `/`
- `/about`
- `/projects`
- `/services`
- `/store`
- `/features`
- `/gallery`
- `/contact`

Internally, non-home routes rewrite to `src/app/pages/*` so the structure stays close to the existing Piratechs Next PWA template while keeping URLs simple.
