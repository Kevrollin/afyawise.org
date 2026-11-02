# afyawise.org: before and after

**Before:** live site, audited 2 Nov 2026 ([`AUDIT.md`](AUDIT.md)). **After:** this rebuild, measured 3 Nov 2026 on the production build. Lighthouse 13.6 used the same mobile preset (simulated slow 4G, 4× CPU) and desktop preset for both. Reports: [`audit/lighthouse/`](lighthouse/) (before) and [`qa/lighthouse/`](../qa/lighthouse/) (after).

> The "after" numbers were measured locally on a static server that compresses like Vercel (`scripts/qa/static-server.mjs`). Re-run `npm run qa:lighthouse` with `--base https://www.afyawise.org` after launch to confirm on the live network.

## Scores

| | Before (12 routes) | After (15 routes) |
|---|---|---|
| **Mobile performance** | **63** average (46–89) | **99.6** average (97–100) |
| Desktop performance | 83 average (52–100) | **100** on every route |
| Accessibility | 95 (85–100) | **100** on every route |
| Best practices | 99 (96–100) | **100** on every route |
| SEO | **83** on every route | **100** on every route |
| Average page weight | **2,253 KB** | **46 KB** |
| axe-core violations | 4 rule types, **102 nodes** (contrast ×72, unlabeled select, landmarks, heading order) | **0** (19 routes × 2 viewports, plus open-menu and form-error states) |

### Old page → new page (mobile)

| Old → new | Performance | LCP | TBT | CLS | SEO | Weight |
|---|---|---|---|---|---|---|
| `/` → `/` | 51 → **98** | 6.7 s → **1.2 s** | 900 → **140 ms** | 0.003 → **0** | 83 → **100** | 1,859 → **50 KB** |
| `/about` → `/about` | 63 → **100** | 1.9 s → **0.9 s** | 750 → **20 ms** | 0.176 → **0** | 83 → **100** | 8,250 → **48 KB** |
| `/work` → `/programs` | 64 → **100** | 2.7 s → **1.0 s** | 810 → **40 ms** | 0.062 → **0** | 83 → **100** | 7,074 → **45 KB** |
| `/our-impact` → `/impact` | 89 → **100** | 0.8 s → 0.9 s | 420 → **20 ms** | 0.002 → **0** | 83 → **100** | 676 → **46 KB** |
| `/support` → `/partner` | 63 → **97** | 5.2 s → **1.3 s** | 630 → **200 ms** | 0 → 0 | 83 → **100** | 1,323 → **50 KB** |
| `/donate` → `/donate` | 54 → **100** | 5.2 s → **0.8 s** | 1,190 → **0 ms** | 0.002 → **0** | 83 → **100** | 1,304 → **45 KB** |
| `/contact` → `/contact` | 61 → **100** | 5.2 s → **0.9 s** | 700 → **0 ms** | 0.014 → **0** | 83 → **100** | 1,319 → **48 KB** |
| `/team` → `/about#leadership` | 71 → **100** | 1.4 s → **0.9 s** | 660 → **20 ms** | 0.238 → **0** | 83 → **100** | 1,428 → **48 KB** |

The old `/our-impact` looked fast only because it was empty. The new `/impact` carries targets, measurement rules, alignment and nine cited statistics in the same weight.

### What makes up a page now

| | Before | After |
|---|---|---|
| JavaScript | 188 KB gzip on every page (React, Router, Framer Motion, react-markdown); nothing renders without it | **0.55 KB** gzip on the home page, **1.64 KB** on form pages; every page works without it |
| Font | Inter full variable TTF, 455 KB (875 KB raw) | Inter subset variable WOFF2, **28.4 KB**, preloaded, metric-matched fallback |
| Images | 46 files, **15.95 MB** (2 MB PNG illustrations shown at 109–200 px) | **0 raster images**: inline SVG logo, icons and map |
| HTML | 455-byte empty shell | 15–20 KB (Brotli) of real, pre-rendered content with inlined critical CSS |
| Requests per page | 10–24 | **4** |
| Third parties on load | none (but the API host didn't exist) | **none** |

## Dead ends removed

| Before | After |
|---|---|
| Hero CTA "Join the Wellness club" → empty page | Hero CTAs: **Fund our work** → `/partner`, **Partner with us** → `/partner#request` |
| 4 of 10 nav items led to empty or "Coming Soon" pages (Blog, Shop, Services, Our Impact) | 6 nav items + Donate button, every one a full page; old URLs **301** to the closest live page |
| 5 dead buttons on `/support` (Volunteer, Partner With Us, 2× Get Started, Join the Movement) | **Zero dead CTAs**: a Playwright test follows every link and anchor and checks every button on every page |
| Contact form posted to `api.afyawise.org`, which doesn't exist; every message was lost | Three working forms (contact with reason routing, funder proposal request, volunteer), server-side validation, honeypot + time trap, rate limiting, inline success and error states, no-JS fallback |
| "Get Involved" was an unlinked bullet list | `/get-involved` with a volunteer form; closing CTA band (Fund · Partner · Donate) on every page |
| No Donate button in the header | Donate always visible in the header, at every width |
| M-Pesa and PayPal "Coming soon" | Only live methods shown: bank transfer + "Request M-Pesa details"; M-Pesa and card checkout ready behind env flags |
| Blog, Wellness Clubs and Impact detail pages driven by the dead API | Removed; Stories appear automatically once a real story exists |
| Unknown URLs returned 200 with an empty app | Real **404** with recovery links |

## Copy fixes

- Typos fixed: "Mision", "County s", "Nutritionz", "Activitiesz", "CHVsz", missing spaces in the values.
- The Maternal & Child Health activity list (a copy of Community Wellness's) is replaced with the program's own activities from the home page (`TODO_CONFIRM` A9).
- Banned and generic words removed: "empowering" (×6), "innovative", "holistic", "impactful", "tirelessly", "transform lives". `npm run lint:copy` blocks them from coming back.
- Copy limits enforced in code: headlines ≤ 8 words, intros ≤ 20, paragraphs ≤ 40.
- **Conflicting numbers withheld:** "1,000+ lives", "200+ health workers", "95% satisfaction", "thousands of supporters" vs "hundreds of community members". None is published until confirmed, dated and sourced.
- **Objectives shown as targets**, each badged "Target", never as results.
- "Community Health Volunteers" updated to **Community Health Promoters** (Primary Health Care Act 2023), mentioned once as "formerly".
- One wordmark everywhere: **AfyaWise**.

## Trust signals added

| Signal | Status |
|---|---|
| The need, with sources: 9 statistics (KDHS 2022, MoH, 2019 census, BMJ Global Health, Meru CIDP), each linked to its source | Live |
| Governance diagram (General Assembly → Executive Committee → Secretariat → community structures; Joint Coordination Committee advising) | Live |
| Alignment: PHC Act 2023, Meru CIDP 2023–2027, SDG 3, SDG 6 | Live |
| Measurement rules (baseline first; counted, not estimated; dated and sourced; targets stay targets) | Live (`TODO_CONFIRM` A7) |
| Funder path: `/partner` with projects (need · plan · outcome · budget), what funders can expect, FAQ, proposal request form | Live |
| Five fundable projects with cited needs | Live; budgets `TODO_CONFIRM` |
| Privacy policy (Kenya DPA 2019 + GDPR) and terms (incl. not-medical-advice and emergency numbers) | Live (legal review `TODO_CONFIRM`) |
| Registration number, annual report, financials, safeguarding policy + "Report a concern", leadership, partner logos, verified results | **Built; hidden until AfyaWise supplies them** (`CONTENT_NEEDED.md`) |

## SEO

| | Before | After |
|---|---|---|
| Content in HTML | none (JS-only) | fully pre-rendered |
| Titles / descriptions | "Afyawise" on every page / none | unique per page (tested) |
| Canonical, Open Graph, Twitter | none | every page, with a per-page 1200×630 OG image |
| Structured data | none | NGO (address, geo, `areaServed` Meru County, contact points), WebSite, BreadcrumbList, FAQPage |
| `robots.txt` / sitemap | returned the app shell | real files; sitemap index with all 15 pages |
| Old URLs | — | 301 to new pages |

## Accessibility

Contrast now passes everywhere: primary green `#1F7A2E` is 5.41:1, and Donate uses dark text on the logo orange at 7.31:1. The old site's measured pairs, by contrast, ran from 1.71 to 2.45:1.

| Before | After |
|---|---|
| Mobile menu: an `<img>` keyboard users couldn't reach | Native button opening a Popover drawer: keyboard, Esc, focus management |
| No skip link, no `<header>`, footer brand as an `<h1>` on every page | Skip link, full landmarks, exactly one `<h1>` per page (tested) |
| 2 of 3 images without alt text on several pages | No content images without alt; icons hidden from screen readers |
| Unlabeled select; no field validation | Labelled fields, inline errors linked to inputs, error summary announced |
| Touch targets under 44 px on every page | ≥ 44 px (tested on mobile) |

## Security

| Header | Before | After |
|---|---|---|
| Content-Security-Policy | none | hash-based, per page, no `unsafe-inline` or `unsafe-eval`, `frame-ancestors 'none'` |
| Strict-Transport-Security | `max-age=63072000` | + `includeSubDomains; preload` |
| X-Content-Type-Options, Referrer-Policy, Permissions-Policy, X-Frame-Options, COOP | none | all set |
| Forms | none working | CSRF origin check, server validation, honeypot, rate limit |
