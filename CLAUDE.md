# MediThai Network — Claude Instructions

## Project in one line
Hospital group website (6 branches) — Astro SSR + Vercel + Supabase Auth, live at https://medithai-network.vercel.app

## Deploy (every time, in order)
```bash
npm run build
vercel --prod --yes                        # note the unique URL it prints
vercel alias <that-url> medithai-network.vercel.app
git add -A && git commit -m "..." && git push origin main
```

## Key files
| File | What it does |
|---|---|
| `src/components/Layout.astro` | HTML shell — page loader, scripts, head |
| `src/components/Header.astro` | Nav (desktop dropdown + mobile drawer) + auth state |
| `public/css/style.css` | Single global stylesheet (~2200 lines) |
| `public/js/main.js` | Core JS — loader, scroll, nav, carousels, map |
| `public/js/translations.js` | TH/EN strings + `switchLang()` |
| `ARCHITECTURE.md` | Full technical architecture |
| `ROADMAP.md` | What's done, what's next |

## Icons
Uses `astro-icon` + `@iconify-json/fa6-solid`. Always verify icon names exist before using — some FA5 names changed in FA6 (e.g. `ambulance` → `truck-medical`). Check with:
```bash
node -e "const d=JSON.parse(require('fs').readFileSync('node_modules/@iconify-json/fa6-solid/icons.json','utf8')); console.log(d.icons['ICON-NAME'] ? 'OK' : 'MISSING')"
```

## Auth
Supabase SSR — session validated server-side in frontmatter. Protected pages redirect to `/login` if no user. Client-side header button state handled by inline script in `Header.astro`.

## CSS conventions
- Design tokens in `:root` — always use `var(--primary)` etc., never hardcode colours
- Safari compat: `overflow-x: hidden` fallback before `clip`; `top/right/bottom/left: 0` fallback before `inset: 0`
- Touch targets: minimum `padding: 10px` vertical on interactive elements (44px height)

## Current state (as of 2026-06-11)
- All pages built and rendering — 0 JS console errors across site
- Phase 4–6 complete: appointment booking API live, SEO layer (OG/Schema/sitemap), doctors DB-first
- **Full CMS live**: every content page (about, careers, patient-stories, telehealth,
  giving, loyalty, corporate, expat-hub, executive-health, contact, packages,
  health-library, locations, concierge, 6 hospital pages, home, global) is editable
  from /admin — including repeating lists (jobs, stories, package cards, timeline,
  FAQ, branches...) with add/remove/reorder/duplicate, full Quill rich text, and
  image upload to Supabase Storage (`site-media` bucket, auto-created)
- CMS architecture: `src/lib/cmsSchema.ts` (schemas + `list()` fields + live-content
  defaults), `src/lib/cmsPage.ts` (`makePageCms()` — t/m/items/li + auto __CMS_P__),
  admin inline editor in `src/pages/admin/index.astro`, styles in `public/css/admin-cms.css`
- To make new content editable: add fields/lists to the page's schema in cmsSchema.ts
  (defaults = current live content), then render via `cms.t()` / `cms.items()` + `cms.li()`
- Supabase SQL migrations written (`supabase/migrations/`) — must be run manually in Supabase dashboard
- `RESEND_API_KEY` not yet added to Vercel env (email confirmation won't send until then)
- No CI/CD — deploys are manual via the commands above

## What the user prefers
- Concise responses, no over-explaining
- Test fixes end-to-end in browser before reporting done
- Always notify before touching files, wait for confirmation on risky actions
- User is a non-technical PM — avoid jargon, speak in outcomes
