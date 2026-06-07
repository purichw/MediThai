# MediThai Network — Roadmap

## Status Key
- ✅ Done
- 🔧 Built (UI only — needs real backend data)
- 🚧 In progress
- 📋 Planned
- 💡 Nice to have

---

## Phase 1 — Core Site ✅

Foundation: framework, deployment, navigation, design system.

| Item | Status |
|---|---|
| Astro SSR setup with Vercel adapter | ✅ |
| Global design system (CSS tokens, typography, components) | ✅ |
| Header with desktop dropdown nav + mobile hamburger nav | ✅ |
| Footer | ✅ |
| Page loader (first-visit only, sessionStorage gated) | ✅ |
| TH/EN language toggle (i18n) | ✅ |
| Smooth scroll (Lenis) + scroll-to-top | ✅ |
| Scroll reveal animations | ✅ |
| Homepage (hero, stats, services, packages, doctors, testimonials, map) | ✅ |
| Locations page with Leaflet map | ✅ |
| Supabase Auth (email/password login, register, logout, OAuth callback) | ✅ |
| Protected dashboard + my-appointments pages | ✅ |
| Admin portal (appointments management UI) | ✅ |

---

## Phase 2 — Content Pages ✅

All major informational pages built.

| Page | Status |
|---|---|
| 6 Hospital sub-pages (Bangkok, Heart, Cancer, Spine, Children, Chiang Mai) | ✅ |
| Doctors listing with search + specialty/hospital filter | ✅ |
| Individual doctor profiles (`/doctors/[id]`) | ✅ |
| Appointment booking (3-step form UI) | ✅ |
| Telehealth / online consultation | ✅ |
| Symptoms checker | ✅ |
| Health library (A-Z article filter) | ✅ |
| Patient stories | ✅ |
| Packages (tab filter + Swiper carousel) | ✅ |
| Executive Health | ✅ |
| MediThai Card (loyalty programme) | ✅ |
| Corporate health services | ✅ |
| Expat Hub (international patients) | ✅ |
| About us | ✅ |
| Careers | ✅ |
| Giving / CSR | ✅ |
| Contact | ✅ |
| Concierge | ✅ |
| Bill payment (UI) | ✅ |
| Medical records request (UI) | ✅ |

---

## Phase 3 — Health Tools ✅

| Item | Status |
|---|---|
| Health Calculators page (`/calculators`) | ✅ |
| BMI calculator (weight, height, age, gender → BMI, category, ideal weight) | ✅ |
| BMR calculator (Mifflin-St Jeor formula) | ✅ |
| TDEE calculator (BMR × activity factor) | ✅ |
| Body Fat calculator (Deurenberg formula, 6 outputs) | ✅ |
| Water intake calculator (weight + activity) | ✅ |
| Ovulation calculator (4 outputs incl. pregnancy test date) | ✅ |
| Age calculator (years/months/days + next birthday countdown) | ✅ |
| Percentage calculator (4 modes) | ✅ |
| Calorie reference table | ✅ |
| Browser compatibility (Safari fallbacks, touch targets) | ✅ |

---

## Phase 4 — Backend Integration 🚧

Connect the UI to real data in Supabase.

| Item | Status | Notes |
|---|---|---|
| Doctors table + API endpoints | 📋 | `/doctors/[id]` currently uses hardcoded mock data |
| Packages table + API endpoints | 📋 | Packages page uses hardcoded mock data |
| Appointment booking → Supabase insert | 📋 | Form submits but data not saved |
| Admin portal: real appointment CRUD | 📋 | UI only, no DB reads/writes |
| Patient dashboard: real appointment history | 📋 | UI only |
| Medical records request → form submission | 📋 | — |
| Bill payment integration | 📋 | Needs payment gateway (Omise / Stripe) |
| Health Library articles → Supabase | 📋 | Articles are hardcoded HTML |
| Patient Stories → Supabase | 📋 | Testimonials are hardcoded |
| Careers → Supabase | 📋 | Job listings are hardcoded |

---

## Phase 5 — Notifications & Automation 📋

| Item | Status |
|---|---|
| Email confirmation on appointment booking (Supabase Edge Functions + Resend) | 📋 |
| SMS reminder 24h before appointment | 📋 |
| Admin email alert on new appointment | 📋 |
| Password reset flow | 📋 |

---

## Phase 6 — Performance & SEO 📋

| Item | Status | Notes |
|---|---|---|
| XML Sitemap | 📋 | Add `@astrojs/sitemap` integration |
| Open Graph / Twitter meta tags per page | 📋 | Currently only basic `<meta description>` |
| Structured data (Schema.org: Hospital, Physician, MedicalClinic) | 📋 | Important for Google search |
| Image optimisation via Astro's `<Image>` component | 📋 | All images are currently raw `<img>` tags |
| Lighthouse audit & Core Web Vitals baseline | 📋 | — |
| robots.txt | 📋 | — |

---

## Phase 7 — CI/CD & DevOps 📋

| Item | Status |
|---|---|
| GitHub Actions: build + deploy on push to `main` | 📋 |
| Preview deployments for pull requests | 📋 |
| Environment secrets managed in GitHub + Vercel | 📋 |
| Error monitoring (Sentry) | 💡 |
| Uptime monitoring | 💡 |

---

## Phase 8 — Growth Features 💡

| Item | Notes |
|---|---|
| Online payment (appointment deposit) | Omise or Stripe |
| Video consultation (WebRTC or Whereby embed) | Telehealth page currently UI only |
| Patient portal: upload documents, view results | Medical records page currently UI only |
| Push notifications (web push) | Appointment reminders |
| Review & rating system | Post-appointment |
| Multi-language expansion (ZH, JA, KO) | Framework already supports i18n toggle |
| Mobile app (React Native or Flutter) | Shares Supabase backend |

---

## Known Issues / Tech Debt

| Issue | Priority |
|---|---|
| No CI/CD pipeline — deploys are manual | Medium |
| Mock data is hardcoded in `.astro` files — should come from DB | High |
| No rate limiting on auth endpoints | Medium |
| Admin portal has no role-based access control beyond login check | Medium |
| `translations.js` is a flat object — will become hard to maintain at scale | Low |
