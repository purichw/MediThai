# MediThai Network — Architecture

## Tech Stack

| Layer | Technology | Version |
|---|---|---|
| Framework | Astro | 6.4.4 |
| Rendering | SSR (server-side) | — |
| Adapter | @astrojs/vercel | 10.0.8 |
| Deployment | Vercel | — |
| Auth + Database | Supabase | 2.x |
| Icons | astro-icon + @iconify-json/fa6-solid | 1.1.5 |
| Smooth scroll | Lenis | 1.1.9 (CDN) |
| Carousels | Swiper | CDN |
| Maps | Leaflet | CDN |

**Live URL:** https://medithai-network.vercel.app  
**GitHub:** https://github.com/purichw/MediThai  
**Node runtime on Vercel:** 22.x (patched at build time — see `package.json` build script)

---

## Project Structure

```
hospital-astro/
├── src/
│   ├── components/
│   │   ├── Layout.astro       # Root HTML shell (head, loader, header, footer, scripts)
│   │   ├── Header.astro       # Desktop nav + mobile nav + auth state
│   │   └── Footer.astro       # Footer links + newsletter form
│   └── pages/
│       ├── index.astro            # Homepage
│       ├── calculators.astro      # Health calculator hub (9 calculators)
│       ├── appointments.astro     # Multi-step appointment booking form
│       ├── doctors.astro          # Doctors listing with search/filter
│       ├── doctors/[id].astro     # Individual doctor profile (dynamic route)
│       ├── hospitals/             # 6 hospital sub-pages
│       │   ├── medithai-bangkok.astro
│       │   ├── medithai-heart.astro
│       │   ├── medithai-cancer.astro
│       │   ├── medithai-spine.astro
│       │   ├── medithai-children.astro
│       │   └── medithai-chiangmai.astro
│       ├── health-library.astro   # Article library with A-Z filter
│       ├── symptoms.astro         # Symptom checker
│       ├── telehealth.astro       # Online consultation
│       ├── packages.astro         # Health packages with tab filter
│       ├── executive-health.astro # Premium health check programmes
│       ├── loyalty.astro          # MediThai Card membership
│       ├── corporate.astro        # Corporate health services
│       ├── expat-hub.astro        # International patient centre
│       ├── patient-stories.astro  # Patient testimonials
│       ├── locations.astro        # Branch map (Leaflet)
│       ├── about.astro            # About us
│       ├── careers.astro          # Job listings
│       ├── giving.astro           # CSR / donations
│       ├── contact.astro          # Contact form
│       ├── concierge.astro        # Concierge services
│       ├── bill-payment.astro     # Online bill payment (UI)
│       ├── medical-records.astro  # Medical record request (UI)
│       ├── book.astro             # Quick booking (UI)
│       ├── login.astro            # Login (Supabase Auth)
│       ├── register.astro         # Registration (Supabase Auth)
│       ├── logout.ts              # Logout endpoint (POST)
│       ├── dashboard.astro        # Patient dashboard (protected)
│       ├── my-appointments.astro  # Patient appointment history (protected)
│       ├── auth/
│       │   └── callback.ts        # Supabase OAuth callback handler
│       └── admin/
│           ├── index.astro            # Admin portal home (protected)
│           └── appointments/
│               └── appointments.astro # Admin appointment management
├── public/
│   ├── css/
│   │   ├── style.css              # Global styles (all components)
│   │   └── hdmall-features.css    # HDmall-style feature cards / UI patterns
│   └── js/
│       ├── main.js                # Core JS: loader, scroll, nav, carousels, map, forms
│       ├── translations.js        # TH/EN i18n strings + switchLang()
│       └── hospital-page.js       # Hospital sub-page specific logic
└── astro.config.mjs
```

---

## Rendering Model

All pages use **SSR (`output: 'server'`)** via the Vercel adapter. Every request hits a Vercel Serverless Function (`nodejs22.x`). There is no static pre-rendering.

This was chosen to support:
- Server-side Supabase session validation (protected pages)
- Dynamic content from the database
- Consistent auth cookie handling via `@supabase/ssr`

---

## Authentication Flow

```
User → Login page → Supabase Auth (email/password or OAuth)
                          ↓
              auth/callback.ts exchanges code for session
                          ↓
              Session cookie set server-side (@supabase/ssr)
                          ↓
        Protected pages check session in frontmatter:
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return Astro.redirect('/login')
```

Protected pages: `/dashboard`, `/my-appointments`, `/admin/*`

Client-side auth state (header login/logout button visibility) is handled by a small inline script in `Header.astro` that calls `supabase.auth.getUser()` on page load.

---

## CSS Architecture

Single global stylesheet (`style.css`, ~2200 lines) organised by section:

1. CSS Custom Properties (design tokens)
2. Reset & base
3. Utilities (`.container`, `.btn`, `.tag`, `.section-pad`)
4. Header / Navigation
5. Hero section
6. Content sections (cards, grids, forms)
7. Page-specific overrides
8. Admin portal styles
9. Page loader

**Key design decisions:**
- `overflow-x: hidden` + `overflow-x: clip` (clip prevents scroll container creation; hidden is the Safari < 16 fallback)
- `inset: 0` with `top/right/bottom/left: 0` fallbacks for Safari 14
- Nav links: `padding: 10px 14px` = 44px touch target (WCAG 2.5.5)
- `backdrop-filter` uses `-webkit-` prefix for Safari compatibility

---

## JavaScript Architecture

**`main.js`** runs inline (non-deferred) at end of `<body>`. Responsibilities:

- **Page loader** — first visit: 800ms min + window.load → fade out → `display:none` after 450ms. Return visit (sessionStorage): `display:none` immediately, no transition.
- **Scroll effects** — Lenis smooth scroll; header shadow on scroll; scroll-to-top button; parallax on hero image; reading progress bar
- **Mobile nav** — hamburger toggle, body scroll lock
- **Intersection Observer** — `.reveal` scroll animations; animated number counters
- **Swiper carousels** — packages, doctors, testimonials
- **Leaflet map** — locations page
- **Form logic** — appointment multi-step, doctor filter, A-Z article filter, newsletter

**`translations.js`** — TH/EN dictionary + `switchLang()` + `applyTranslations()`. Strings keyed by `data-i18n` attributes on elements. Language persists via `localStorage`.

**`hospital-page.js`** — Tab switching, specialty filter, and stats specific to individual hospital pages.

---

## Environment Variables

```
PUBLIC_SUPABASE_URL        # Supabase project URL (exposed to client)
PUBLIC_SUPABASE_ANON_KEY   # Supabase anon key (exposed to client)
```

Set in Vercel project settings. No `.env` file committed to the repo.

---

## Deployment Pipeline

```
Local edit
    ↓
npm run build          # Astro SSR build + patch nodejs22.x runtime
    ↓
vercel --prod --yes    # Deploy to Vercel, get unique deployment URL
    ↓
vercel alias <url> medithai-network.vercel.app   # Point alias to new deployment
    ↓
git add . && git commit && git push origin main  # Commit to GitHub
```

No CI/CD pipeline yet — all deployments are manual from local machine.
