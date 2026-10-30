# Website Plan × Shendetperdite — Complete Analysis

**Date:** 2026-09-17  
**Scope:** Analysis only (no implementation)  
**Sources:** `planning/website-plan.zip` + all Shendetperdite git branches (read-only)

---

## Method

Read-only review of the website kit (`planning/website-plan.zip`) plus **every local feature branch tip**, verified as a **linear chain**:

```
main
  → feature/epic-1
  → feature/epic-2
  → feature/epic-3
  → feature/UI
  → feature/epic-4
  → feature/epic-5
  → feature/epic-6
  → feature/epic-7
  → feature/epic-8
  → feature/storefront-must-haves
  → feature/storefront-should-haves
  → feature/storefront-nice-to-haves
```

No checkouts, merges, or project changes were made for this analysis.

**Supabase:** zero references on any branch.

---

## 1. Website Plan overview

### What it is

A **multi-page marketing-site kit** (template **2.3**) for Next.js + Sanity + Cloudflare.

- Kit stays **read-only**
- New client work happens in a **copied folder** via `START-NEW-SITE.md`
- Build starts only after `plan.md` is confirmed

### Kit contents

| Layer | What it gives |
|--------|----------------|
| **Docs** | `plan.md`, `DESIGN.md`, `AGENTS.md`, `LESSONS.md`, `START-NEW-SITE.md`, `README.md` |
| **Rules (8)** | `core`, `design`, `clone-fidelity`, `from-industry`, `site-chrome`, `stack`, `code-conventions`, `mcp` |
| **Skills (5)** | `kickoff-site` → `industry-refs` → `design-system` → `build-page` → `design-qa` |
| **Process** | Interview → Playwright peers → user picks clone → tokens → band-by-band build → clone QA → Pre-ship |
| **Hard locks** | Multi-page only; 100vh hero; header ≥40px; home ≥5 sections; soft-pass ban on “close enough” |
| **Stack lock** | Next.js App Router, Sanity + `/studio`, Tailwind v4, Cloudflare Workers/OpenNext, Lucide, `motion` |
| **MCP catalog** | Playwright (required before design research), Chrome DevTools, shadcn, Context7; optional Sanity / Cloudflare / A1 / Firecrawl |

### Pipeline detail

| Step | Skill | Purpose |
|------|--------|---------|
| 1 | `kickoff-site` | Fill `plan.md` REQUIRED fields; one topic per turn; stop until user confirms |
| 2 | Playwright on | Required before peer/design research |
| 3 | `industry-refs` | Top 5 peers; user picks clone; Clone Blueprint + asset brief |
| 4 | `design-system` | OKLCH tokens, type, `DESIGN.md`, `@theme`; Gate B approval before UI |
| 5 | `build-page` | One route/band; clone-diff vs peer PNGs at 375 + 1440; fail = do not show |
| 6 | `design-qa` | Clone QA first, then 375/768/1440; triage Blocker/High/Medium/Nit; Pre-ship |

### Strengths and limits

| Strengths | Limits (by design) |
|-----------|---------------------|
| Discovery / kickoff interview | No e-commerce |
| Art direction + clone fidelity | No Firebase / Supabase |
| Layout QA vs peer screenshots | No epic delivery model |
| Form / conversion sites | No admin / auth / payments |
| Handoff / Pre-ship hygiene | Sanity + Cloudflare locked; not Vercel+Firebase shop |

### Explicit out of scope (`plan.md`)

Unless explicitly expanded:

- Single-page-only
- **E-commerce**
- Types beyond Content Model
- Languages beyond Overview
- Advanced editorial beyond Sanity defaults
- Migrating an existing site/CMS
- Search (unless Features)
- Pro copy/photo/logo
- Ongoing SEO/marketing after launch
- Dark mode
- Paid typefaces (unless purchased)
- Reading other local project folders without an explicit path

---

## 2. All Shendetperdite branch findings

### Branch chain

The product history is **strictly linear**. Each tip is an ancestor of the next. `main` is a stub; all product work lives on feature branches.

| Branch | Tip | Unique commits | What this branch adds |
|--------|-----|----------------|------------------------|
| **main** | `e1b7fb8` | 1 | Empty README stub only |
| **feature/epic-1** | `9648efc` | 1 | Next 15 shell, shadcn, SQ i18n, header/footer/theme/cookie bar, Firebase client+admin, deny-all rules, emulators, seed stub |
| **feature/epic-2** | `2c7abc2` | 1 | Catalog data layer, Zod schemas, indexes, stricter rules, Cloud Function `onVariantWrite`, Vitest + rules tests, verify scripts |
| **feature/epic-3** | `84d52dd` | 5 | Storefront pages (home/category/brand/PDP/search), newsletter API, legal MD, content JSON; **Vercel + Firestore production fixes** (indexes, Admin SDK bundling) |
| **feature/UI** | `a28ee76` | 2 | Brand UI match (hero, live media, benefits, home composition) + Vercel type fix — **sits between epic-3 and epic-4** |
| **feature/epic-4** | `a80343f` | 1 | Cart + mini-cart, server price validation, discounts, free-shipping UI, cart Firestore rules |
| **feature/epic-5** | `22d949f` | 1 | COD checkout, orders, thank-you, Resend emails, Kosovo cities, Stripe webhook stub (`stripe_disabled`) |
| **feature/epic-6** | `826f013` | 3 | Email + Google auth, session cookies, middleware, account area; **Vercel / jose / Admin Auth session fixes** |
| **feature/epic-7** | `cd44b4c` | 1 | Full admin (products/orders/discounts/content/settings), Admin Storage uploads, CSV, audit log, `admin:set` claims |
| **feature/epic-8** | `b086b4f` | 2 | SEO/sitemap/robots, consent GA/Meta, Sentry, CSP, launch docs, CI + Playwright; CSP tweak for Google Sign-In |
| **feature/storefront-must-haves** | `8687ab3` | 1 | `/offers`, sale badges, sticky PDP CTA, trust cues |
| **feature/storefront-should-haves** | `a2657cc` | 1 | Contact help + FAB, campaign polish, PDP qty, admin campaign fields |
| **feature/storefront-nice-to-haves** | `2bff7d1` | 1 | VAT/SKU/trust, calmer hero/about, favicon, admin CTA guidance |

### Per-branch detail

#### `main`

- Stub only: empty `README.md`
- No app, Firebase, tests, CI, or agent kit

#### `feature/epic-1` — Shell

- Next.js 15 App Router + TypeScript + Tailwind/shadcn
- Albanian i18n (`lib/i18n/sq.ts`), site config, header/footer, dark mode, cookie bar
- Firebase client + Admin SDK wiring
- Deny-all Firestore/Storage rules baseline
- Emulator workflow + seed stub + lighthouse script

#### `feature/epic-2` — Catalog data

- Zod catalog schemas (categories, brands, products, variants)
- Query/cache layer, search tokens, indexes
- Cloud Function: variant write → product aggregates (`minPrice`, `totalStock`, etc.)
- Vitest schema tests + Firestore rules tests
- Verify scripts (`verify-catalog`, `verify-trigger`)

#### `feature/epic-3` — Storefront browse

- Routes: home, category, brand, PDP, search
- Newsletter API; legal pages from markdown
- Content JSON (hero, promos)
- Production hardening: Firestore index race, stop bundling firebase-admin Auth on catalog pages

#### `feature/UI` — Brand match

- Visual alignment to live brand (hero, live media, store benefits, home composition)
- Production type fix for hero slide `textColor`
- Ancestor of epic-4 (cart builds on this tip)

#### `feature/epic-4` — Cart

- Zustand cart + mini-cart drawer
- Server validate prices; discount codes; free-shipping progress
- Firestore rules for discounts + user cart subcollection
- Cart/discount unit tests

#### `feature/epic-5` — Checkout / COD

- COD checkout (“Para në dorë”), Kosovo cities
- Order creation, thank-you page, Resend order emails
- Stripe webhook present but disabled (`stripe_disabled`)
- Checkout schema/totals tests

#### `feature/epic-6` — Accounts

- Email/Password + Google Auth
- Session cookies + middleware for `/account` (and later `/admin`)
- Account area: profile, addresses, orders
- Vercel session fixes (jose pin; avoid Admin Auth path that broke cookies)

#### `feature/epic-7` — Admin

- Admin panel: products (variant matrix), orders, discounts, brands, categories, customers, content, settings
- Image upload via Admin Storage SDK (client storage rules remain deny-all)
- CSV exports (UTF-8), audit log, custom-claim admin via `npm run admin:set`

#### `feature/epic-8` — Launch

- SEO: sitemap, robots, JSON-LD, OG
- Consent-gated GA4 + Meta Pixel; Sentry; CSP/security headers
- Docs: `docs/launch.md`, `deploy.md`, `backups.md`, `qa-checklist.md`
- GitHub CI + Playwright golden path
- CSP allowlist for Google Sign-In scripts

#### Storefront MoSCoW polish

| Branch | Focus |
|--------|--------|
| **must-haves** | Offers page, sale badges, sticky PDP CTA, trust cues |
| **should-haves** | Contact help (header + FAB), campaign polish, PDP quantity |
| **nice-to-haves** | VAT/SKU/trust copy, calmer hero/about, brand favicon, admin CTA guidance |

### Cross-branch stack reality

| Area | Choice |
|------|--------|
| Framework | Next.js 15 + React 19 |
| Backend | **Firebase** (Auth, Firestore, Storage, Functions) — not Sanity |
| Hosting | **Vercel** (app) + **Cloudflare** (DNS/proxy/SSL) |
| Payments | COD first; Stripe stubbed off |
| Content | JSON/MD fallbacks + Firestore overlay + admin editor |
| Locale | Albanian (`sq`) storefront |
| Agent kit in repo | **None** on any branch (no `.cursor/`, no `AGENTS.md`) |

---

## 3. What can be extracted from Shendetperdite

### Process

- Vertical epic delivery: shell → data → storefront → UI match → cart → checkout → accounts → admin → launch
- Then MoSCoW storefront polish (`must` → `should` → `nice`)
- Branch-per-epic workflow

### Implementation patterns

| Pattern | Where it appears | Kit-worthy idea |
|---------|------------------|-----------------|
| Albanian i18n dictionary | epic-1+ (`lib/i18n/sq.ts`) | Monolingual SQ dictionary |
| Firebase catalog + ≤2-axis variants | epic-2 | Catalog schema + aggregates CF |
| Variant matrix admin | epic-7 | Cartesian option builder |
| Server-validated cart/discounts | epic-4 | Never trust client prices |
| COD-first Balkans checkout | epic-5 | Phone/WhatsApp/Viber + COD |
| Session-cookie auth + middleware | epic-6 | Protect account/admin |
| Consent-gated analytics | epic-8 | Load GA/Meta only after consent |
| Content hybrid (files + Firestore) | epic-3 / epic-7 | File fallbacks + optional admin CMS |
| Launch/ops docs + CI | epic-8 | Deploy/launch/QA/backups templates |
| Production hardening lessons | epic-3, epic-6 | Admin SDK bundling, indexes, jose/session |

### Design process note

- Formal Clone Blueprint / peer-PNG pipeline from the website kit was **not** used
- Closest equivalent: informal **“Matched the UI”** on `feature/UI`

---

## 4. Gaps

| Gap | Website kit | Shendetperdite (all branches) |
|-----|-------------|-------------------------------|
| Cursor rules / skills / AGENTS | Complete | Absent everywhere |
| Marketing CMS (Sanity) | Locked in | Not used |
| Ecommerce domain + epics | Out of scope | Fully implemented across branches |
| Plan-type router (Basic vs Advanced) | Missing | Missing |
| Codified epic / MoSCoW skills | Missing | Practiced in git only |
| Clone-fidelity pipeline | Core | Only informal UI match on `feature/UI` |
| Backend choice in plan (Firebase vs Supabase vs Sanity) | Sanity only | Firebase only; no Supabase |
| Dual-backend adapter layer | N/A | Missing (Firebase hard-wired) |
| Stripe live payments | N/A | Stub only |
| Shared MCP for backend ops | Sanity/CF-centric | Emulator scripts exist; no MCP catalog for Firebase/Supabase |

**Strategic miss:** one kit cannot serve both jobs without a **plan selector** and **stack variants**. Forcing Sanity onto shop builds (or Firebase onto brochure sites) fights both codebases.

---

## 5. Basic Plan — what to add

Treat Basic ≈ current website kit, extended with light lessons from Shendetperdite **without** ecommerce.

### Add to `plan.md` / kickoff

- Explicit **Plan type: Basic (multi-page / conversion)**
- Ask Basic vs Advanced up front; if Advanced → hand off
- Optional **rebuild-existing-site** mode (clone peer = current live site; mirrors `feature/UI` informally)
- Conversion channels: add **WhatsApp / Viber** as first-class
- Hosting note: Cloudflare Workers **or** Vercel + Cloudflare DNS
- Content: keep Sanity default; optional file-based MD for tiny legal pages (epic-3 pattern)

### Add docs

- Lightweight launch / Pre-ship expansion: CSP, analytics consent if cookies, Lighthouse, DNS
- Branching guidance: one feature branch per major page group (lighter than epics)

### Add / tighten rules (conceptually — not implemented here)

- Keep clone + design stack as-is
- Soften or dual-path `stack.mdc`: “Sanity + Cloudflare default; Vercel allowed if Ops says so”
- `site-chrome`: optional contact help / phone FAB

### Add skills (thin — conceptually)

- `kickoff-site`: Basic vs Advanced gate
- `pre-ship-ops`: env names, domain, form backend, analytics — without Firebase

### Do not put in Basic

- Cart, checkout, admin, Auth, Firestore/Supabase schemas

---

## 6. Advanced E-commerce Plan — what to add

Productize the **branch chain** as the default delivery map.

### Epic map (from git)

| # | Unit | Source branch |
|---|------|----------------|
| 1 | Shell + chrome + i18n | `feature/epic-1` |
| 2 | Catalog data + rules/indexes | `feature/epic-2` |
| 3 | Storefront templates | `feature/epic-3` |
| 3b | UI / brand match | `feature/UI` |
| 4 | Cart + discounts | `feature/epic-4` |
| 5 | Checkout + orders + email | `feature/epic-5` |
| 6 | Accounts | `feature/epic-6` |
| 7 | Admin | `feature/epic-7` |
| 8 | SEO / security / launch QA | `feature/epic-8` |
| 9 | MoSCoW storefront polish | must → should → nice |

### New plan fields (`plan-commerce.md` concept)

- Catalog model (categories / brands / products / variants)
- Payment mode (COD default; Stripe optional)
- Shipping region / free-shipping threshold
- Auth providers; admin claim model
- Content strategy (Sanity vs Firebase+files vs hybrid)
- Analytics (consent-gated marketing + always-on host analytics)
- Epic map + MoSCoW backlog
- **Backend:** `firebase` (default) or `supabase` (optional)
- Out of scope vs Basic (no brochure-only)

### New rules (conceptually)

- `stack-commerce.mdc` — Next + chosen backend + Vercel + Cloudflare DNS; no silent Sanity swap
- `catalog-conventions.mdc` — Zod schemas, variant matrix, revalidation
- `commerce-security.mdc` — rules/RLS tests, session cookies, admin gates, CSP, rate limits

### New skills (conceptually)

- `kickoff-commerce`
- `scaffold-epic`
- `build-catalog`
- `build-cart-checkout`
- `build-admin`
- `commerce-qa`
- `launch-ecommerce`

### New prompt

- `START-NEW-SHOP.md` (parallel to `START-NEW-SITE.md`)

### Design kit reuse

- Use `industry-refs` / `design-system` / `build-page` / `design-qa` for **marketing surfaces** (home, about, category landing)
- Clone Blueprint for home
- PDP / cart / checkout follow **UX contracts**, not peer clones of checkout flows

### Docs to extract as templates

- `docs/qa-checklist.md`
- `docs/launch.md`
- `docs/deploy.md`
- `docs/backups.md`

---

## 7. Reusable rules, skills, and prompts

### Shared across both plans

| Asset | Role |
|-------|------|
| `core.mdc`, `design.mdc`, `clone-fidelity.mdc`, `from-industry.mdc`, `LESSONS.md` | Design quality + anti-vibe |
| `site-chrome.mdc` (extended) | Header / footer / hero / a11y |
| Skills: `industry-refs`, `design-system`, `build-page`, `design-qa` | Visual pipeline |
| Prompt: plan-type router (“Basic site or Advanced shop?”) | Prevent stack fights |

### Basic-only

| Asset | Role |
|-------|------|
| `stack.mdc` (Sanity + CF), Sanity `code-conventions`, Sanity/CF MCP notes | CMS path |
| `kickoff-site`, `START-NEW-SITE.md`, `plan.md` v2.3 | Marketing kickoff |

### Advanced-only

| Asset | Role |
|-------|------|
| `stack-commerce`, catalog + commerce-security rules | Shop stack |
| Epic + commerce skills listed above | Delivery |
| `START-NEW-SHOP.md`, `AGENTS-commerce.md` | Entrypoints |
| Backend profile docs (Firebase default / Supabase optional) | Avoid mid-build swaps |

---

## 8. Workflows and documentation

### Workflows to capture

1. **Basic site workflow**  
   Kickoff → Playwright → industry-refs → design-system → build-page (band by band) → design-qa → Pre-ship

2. **Advanced shop workflow**  
   Kickoff-commerce → backend choice → scaffold → epic-1…8 (one epic per branch/PR) → MoSCoW polish → launch checklist

3. **Production hardening workflow** (from epic-3 / epic-6)  
   Emulators → seed → verify → Vercel preview → watch Admin SDK bundling, indexes, session cookies

4. **Emulator → deploy sequence** (Firebase Advanced)  
   `dev:emulators` → seed → verify-catalog / rules tests → deploy rules/indexes/functions → Vercel env (no emulator hosts)

### Documentation to include in kits

| Doc | Basic | Advanced |
|-----|-------|----------|
| `plan.md` / `plan-commerce.md` | Yes | Yes |
| `DESIGN.md` | Yes | Yes (marketing surfaces) |
| `AGENTS.md` | Yes | Yes (`AGENTS-commerce`) |
| `LESSONS.md` | Yes | Yes (plus Vercel/Firebase hard lessons) |
| Launch / deploy / QA / backups | Light Pre-ship | Full epic-8 pack as templates |
| Branching / epic map | Light | Full epic → MoSCoW map |

---

## 9. MCP setup

### Shared

| MCP | When |
|-----|------|
| **Playwright** | Design research, screenshots, clone QA; also commerce QA screenshots on Advanced |
| **Chrome DevTools** | Lighthouse / traces before handoff |
| **shadcn** | Registry components |
| **Context7** | Next / Tailwind / framework docs |

**Rule:** ask once, wait for yes before connecting (keep kit `mcp.mdc` behavior).

### Basic-only

| MCP | When |
|-----|------|
| Sanity | After content model confirmed |
| Cloudflare Docs / API / Builds | Deploy / DNS |

### Advanced-only

| MCP | When |
|-----|------|
| Context7 (Firebase or Supabase docs) | After backend chosen |
| Optional future Firebase/Supabase MCP | Ask first; never invent mid-build |
| Sanity MCP | **Not default** unless content strategy explicitly chooses Sanity |

### Phase defaults

| Phase | Use | Skip |
|-------|-----|------|
| Kickoff | none | all |
| Industry research | Playwright → peers | Backend create, deploy |
| Design system | Context7 | Deploy |
| Build (Basic) | shadcn + Playwright clone-diff | Lighthouse every section |
| Build (Advanced epics) | Playwright QA screenshots; Context7 for backend APIs | Sanity create (unless chosen) |
| Design / launch QA | Playwright + Chrome DevTools | Design-ref MCPs |

---

## 10. Firebase and Supabase integration

### Current state

- **Firebase** is the live Advanced stack across epic-1…8 (Auth, Firestore, Storage, Functions, emulators, custom claims, Admin uploads)
- **Supabase** does not exist in any branch
- Website kit uses **Sanity**, not either

### Firebase needs (Advanced kit — document and stabilize)

| Need | Why (from branches) |
|------|---------------------|
| Locked env matrix | Client + Admin + emulator hosts; never set emulator vars on Vercel (epic-8 docs) |
| Rules + indexes as first-class | epic-2 model; epic-3 index-building failures |
| Cloud Functions contract | Variant aggregate trigger (epic-2) |
| Admin SDK / bundling rules | epic-3 Vercel catalog breaks; epic-6 Auth session / jose fixes |
| Storage policy | Client deny-all; Admin SDK uploads (epic-7) |
| Auth session pattern | Cookie + middleware (epic-6); CSP allows Google scripts (epic-8) |
| Emulator workflow skill | `dev:emulators` → seed → verify-catalog / rules tests |
| Deploy docs | Vercel app + Firebase rules/indexes/functions + Cloudflare DNS |
| Optional MCP / Context7 | Firebase Web / Admin / Security Rules docs — ask before connect |

### Supabase needs (only if Advanced offers it as an alternative)

Treat as a **parallel backend profile**, not a silent swap:

| Need | Mapping from Firebase lessons |
|------|-------------------------------|
| Kickoff field: `backend: firebase \| supabase` | Prevent agent stack fights |
| Auth | Supabase Auth ≈ Firebase Auth; session strategy for Next middleware must be specified |
| DB | Postgres + RLS ≈ Firestore rules; rewrite catalog/orders/cart schemas (Zod stays; queries change) |
| Storage | Supabase Storage ≈ Firebase Storage; replace Admin SDK upload path |
| Server logic | Edge Functions / DB triggers ≈ `onVariantWrite` aggregates |
| Local dev | Supabase CLI vs Firebase emulators — different skill |
| Roles / admin | JWT / `app_metadata` ≈ Firebase custom claims + `admin:set` |
| Realtime (optional) | Not used today; only if plan asks |
| Migration skill | Do not port Firebase Admin patterns blindly; use adapters (`CatalogRepo`, `OrderRepo`, `AuthSession`) |
| MCP | Official Supabase MCP / Context7 — ask once; never with Sanity CMS assumption |
| Docs | Separate `docs/deploy-supabase.md` template |

### Backend recommendation for the kits

| Plan | Backend |
|------|---------|
| **Basic** | Sanity (no Firebase/Supabase required) |
| **Advanced default** | **Firebase** (proven end-to-end across all branches) |
| **Advanced optional** | Supabase path with explicit adapter + RLS/Auth/Storage skills — do not invent mid-build |
| **Never** | Mix Sanity-as-commerce-DB with Firebase/Supabase without a written content-strategy field in the plan |

---

## 11. Final recommended structure

Keep **two plans** that share design DNA; do not merge stacks blindly.

```text
website-kit/                          # Basic source (evolve from website-plan.zip)
├── README.md
├── START-NEW-SITE.md
├── plan.md                           # Plan type: Basic
├── DESIGN.md
├── AGENTS.md
├── LESSONS.md
├── docs/                             # light launch / Pre-ship
└── .cursor/
    ├── rules/                        # shared design + Basic stack/Sanity/MCP
    └── skills/                       # kickoff-site → industry-refs → … → design-qa

commerce-kit/                         # Advanced overlay (new; extract from Shendetperdite)
├── README.md
├── START-NEW-SHOP.md
├── plan-commerce.md                  # Plan type: Advanced; backend: firebase|supabase
├── DESIGN.md                         # marketing surfaces
├── AGENTS-commerce.md
├── LESSONS.md                        # include Vercel/Firebase hard lessons
├── docs/
│   ├── qa-checklist.md
│   ├── launch.md
│   ├── deploy-firebase.md            # default
│   ├── deploy-supabase.md            # optional profile
│   └── backups.md
└── .cursor/
    ├── rules/
    │   ├── (shared design/clone rules)
    │   ├── stack-commerce.mdc
    │   ├── catalog-conventions.mdc
    │   └── commerce-security.mdc
    └── skills/
        ├── kickoff-commerce/
        ├── scaffold-epic/
        ├── build-catalog/
        ├── build-cart-checkout/
        ├── build-admin/
        ├── commerce-qa/
        ├── launch-ecommerce/
        └── (shared: industry-refs, design-system, build-page, design-qa)
```

### How to choose

| If the client needs… | Use |
|----------------------|-----|
| Multi-page brochure / lead-gen / booking / contact | **Basic Plan** (website kit) |
| Catalog, cart, checkout, accounts, admin | **Advanced Plan** (commerce kit) |
| Design quality / clone fidelity | Shared rules + skills in both |

### Practical framing

| | Basic Plan | Advanced E-commerce Plan |
|--|------------|---------------------------|
| **Start from** | `website-plan.zip` as-is | New overlay; extract Shendetperdite branch patterns + shared design rules |
| **Primary artifact** | Confirmed `plan.md` + Clone Blueprint | Confirmed `plan-commerce.md` + epic backlog |
| **Success** | Multi-page conversion site, clone QA pass | Browse → cart → COD → admin → launch checklist |
| **Backend** | Sanity | Firebase default; Supabase optional |
| **Do not merge blindly** | Don’t import Firebase/cart into Basic | Don’t force Sanity/OpenNext if Firebase+Vercel is chosen |

---

## Bottom line

Across **all** branches, Shendetperdite is a complete Advanced ecommerce reference (Firebase + Vercel) delivered as a linear epic → MoSCoW pipeline. The website zip is a complete Basic marketing/design OS (Sanity + Cloudflare).

What’s missing is packaging:

1. Keep the zip as **Basic** source of truth  
2. Productize an **Advanced** overlay from the full branch map  
3. Share design/clone rules and a **plan-type router**  
4. Document **Firebase (default)** vs **Supabase (optional)** explicitly  

This document is analysis only. No rules, skills, or other project files were created or modified except this Markdown file.
