# AfyaWise website audit (Phase 1)

**Site audited:** https://www.afyawise.org/ (live, 2 November 2026)
**Method:** Every route rendered in Chromium (Playwright 1.64) after network idle and a full scroll, at 1440×900 and 390×844. Verbatim text, rendered DOM, links, images, forms, meta, rendered fonts (via Chrome DevTools Protocol), colour contrast, console errors and network requests were saved per page. Every visible button and link was clicked, with all non-GET requests blocked so nothing reached AfyaWise's inbox. axe-core 4.14 (WCAG 2.2 AA + best practice) and Lighthouse 13.6 (mobile and desktop) were run on every route. DNS, TLS, registry (RDAP) and HTTP headers were checked from the command line.

**Where things are:**

| Output | Path |
|---|---|
| Verbatim page text | [`audit/content/<route>.md`](content/) |
| Rendered DOM | [`audit/dom/`](dom/) |
| Per-page data (links, images, forms, meta, fonts, contrast, axe, requests) | [`audit/data/pages/`](data/pages/) |
| CTA click-test | [`audit/data/cta-results.md`](data/cta-results.md) |
| Screenshots (390 px and 1440 px) | [`audit/screenshots/`](screenshots/) |
| Downloaded assets + manifest | [`audit/assets/`](assets/) ([manifest](assets/manifest.md), [contact sheet](assets/contact-sheet.png)) |
| Lighthouse reports | [`audit/lighthouse/`](lighthouse/) |
| HTTP headers | [`audit/data/http-headers.txt`](data/http-headers.txt) |
| Scripts that produced all of the above | [`scripts/audit/`](../scripts/audit/) |

---

## 1. Summary: the ten findings that matter most

1. **The contact form cannot work.** It POSTs to `https://api.afyawise.org/api/contact/`, and `api.afyawise.org` does not exist in DNS (NXDOMAIN via Google Public DNS). Every message a funder or volunteer sends is lost. The same dead API feeds Blog, Wellness Clubs and Our Impact, which is why those pages are empty and log `ERR_NAME_NOT_RESOLVED`.
2. **Every "act now" path except Donate is dead.** On `/support`, five buttons do nothing: *Volunteer*, *Partner With Us*, the *Get Started* buttons on the Volunteer and Partner cards, and *Join the Movement*. The home page's *Get Involved* section is a bullet list with no links.
3. **The main hero CTA leads to an empty page.** *Join the Wellness club* goes to `/wellness`, which shows "No all clubs added yet".
4. **4 of 10 nav items are empty pages:** Blog ("All blogs are not currently available"), Shop and Services ("Coming Soon… Phase Two"), Our Impact (a heading and one line).
5. **Search engines see nothing.** The HTML shell is 455 bytes with an empty `<div id="root">`. Every page is titled "Afyawise", with no meta description, Open Graph, canonical or structured data. `robots.txt`, `sitemap.xml` and unknown URLs all return the app shell with status 200 (soft 404s).
6. **The numbers contradict each other.** `/support` claims "1,000+ Lives Impacted", "200+ Health Workers Trained", "95% Satisfaction Rate" and "thousands of supporters". The home and about pages say "hundreds of community members", and the stated target is to train 100 CHVs in year one. None has a date, source or method.
7. **No funder-grade trust signals:** no named leaders, registration number, financials, annual report, safeguarding policy, partners, or MEAL/impact method.
8. **No real photography.** The three "photos" and all illustrations look AI-generated (square 1120 px or 1024×1536 renders, idealised faces, uniform palette), and none can be verified as AfyaWise fieldwork. The "Our Team" image is an illustration of generic doctors.
9. **Heavy and slow.** `/about` transfers 8.25 MB and `/work` 7.07 MB, mostly 2 MB PNG illustrations shown at 109–200 px. The JS bundle is 188 KB compressed (592 KB raw), the unsubset Inter TTF is 455 KB compressed, and all 46 images total 15.95 MB. (Lighthouse results in §9.)
10. **Accessibility failures:** brand greens and orange fail contrast (2.0–2.45:1); the mobile menu toggle is an `<img>` that keyboard users cannot reach; there's no skip link or `<header>` landmark; the footer brand is an `<h1>` on every page; 2 of every 3 images lack alt text on several pages.

---

## 2. Infrastructure, DNS and domain

| Check | Finding |
|---|---|
| Hosting | Vercel (`Server: Vercel`, `X-Vercel-Cache: HIT`). Static Vite build, React SPA with client routing. |
| Canonical host | `https://www.afyawise.org/`. Apex `afyawise.org` and `http://` both 308 to `https://www.afyawise.org/`. Correct. |
| HTTPS / TLS | Let's Encrypt certificate for `www.afyawise.org`, valid 2 Nov 2026 to 31 Jan 2027 (auto-renewed by Vercel). |
| HSTS | `max-age=63072000` (2 years), but no `includeSubDomains` or `preload`. |
| Other security headers | **None:** no CSP, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy` or `X-Frame-Options`/`frame-ancestors`. |
| DNS | Registrar and DNS at **Namecheap** (`dns1/dns2.registrar-servers.com`). Apex `A 216.198.79.1` (Vercel); `www CNAME …vercel-dns-017.com`. |
| Email | MX = Namecheap **email forwarding** (`eforward1–5.registrar-servers.com`); SPF `v=spf1 include:spf.efwd.registrar-servers.com ~all`. **No DMARC record.** Forwarding-only mail can't send *as* `@afyawise.org`, which matters for form auto-replies. |
| `api.afyawise.org` | **NXDOMAIN.** The SPA's API host does not exist (§1.1). |
| Domain registration | RDAP (`.org` registry): **created 2026-11-02T09:38Z, status "add period"**, expires 2027-11-02, registrar NameCheap. The Wayback Machine has the site in July 2025, so the domain appears to have **lapsed and been re-registered today**. `TODO_CONFIRM`: registrant is AfyaWise CBO, auto-renew on, registrar account held by an officer. |
| Name collisions | `afyawise.vercel.app` and `afyawise.com` belong to an unrelated "Afyawise — Digital Technology Solutions" company (Yemen/Arab region). Titles must say "AfyaWise CBO" and "Meru" to disambiguate in search. |
| Search visibility | Practically none: no title or description variety, no sitemap, an empty HTML shell, and a domain that is days old in the registry. |
| Third parties | None on page load. Chatbase (`www.chatbase.co`, `backend.chatbase.co`) loads **only after** clicking *Chat with us*. |

---

## 3. Routes and navigation

**Routes defined in the JS bundle:** `/`, `/about`, `/work`, `/services`, `/our-impact`, `/our-impact/:id`, `/team`, `/contact`, `/support`, `/donate`, `/blog`, `/blog/:id`, `/shop`, `/wellness`, `/wellness/:id`, `*` (catch-all). No other routes were discovered from links. The dynamic routes depend on the dead API.

**Header nav (10 items, same on mobile):** Home · Blog · Shop · Support Us · About us · Our Work · Services · Our Impact · Our Team · Contact Us. There is **no Donate button in the header**.

| Route | Words | Status | Verdict |
|---|---:|---|---|
| `/` | 434 | Content | Rewrite |
| `/about` | 381 | Content | Rewrite + merge |
| `/work` | 496 | Content (programs, future plans) | Rewrite → `/programs` |
| `/team` | 281 | Governance only, no people | Rewrite → `/about#leadership` |
| `/support` | 232 | 5 dead buttons, unverified stats | Rewrite → `/partner` + `/get-involved` |
| `/donate` | 140 | Bank transfer only; two "COMING SOON" methods | Rewrite |
| `/contact` | 107 | Broken form | Rewrite |
| `/our-impact` | 58 | **Empty** ("Impact in Action" + one line) | Drop → `/impact` |
| `/blog` | 83 | **Empty** ("All blogs are not currently available") | Drop until real posts → `/stories` |
| `/services` | 63 | **Placeholder** ("Coming Soon… Phase Two") | Drop + redirect |
| `/shop` | 63 | **Placeholder** ("Coming Soon… Phase Two") | Drop + redirect |
| `/wellness` | 87 | **Empty** ("No all clubs added yet") | Drop + redirect |

---

## 4. CTA click-test

Full table: [`data/cta-results.md`](data/cta-results.md). 50 distinct elements tested; header/footer once, page body on every route.

| Page | Element | Where it goes |
|---|---|---|
| `/` | **Join the Wellness club** (hero, primary) | `/wellness`, an **empty page** |
| `/` | Support Our Work | `/support` |
| `/` | Explore All Projects | `/work` |
| `/` | Chat with us (every page) | Opens Chatbase iframe |
| `/` | *Get Involved* (Volunteer / Partner / Donate) | **Plain text, not links** |
| `/support` | Donate Now · Get Started (Donate card) | `/donate` |
| `/support` | **Volunteer** | **DEAD** |
| `/support` | **Partner With Us** | **DEAD** |
| `/support` | **Get Started** (Volunteer card) | **DEAD** |
| `/support` | **Get Started** (Partner card) | **DEAD** |
| `/support` | **Join the Movement** | **DEAD** |
| `/contact` | **Send Message** | POST `https://api.afyawise.org/api/contact/`, a **host that does not exist** |
| `/blog` | Category filters | Re-query the dead API; "All" does nothing |
| `/blog` | Donate Now | `/Donate` (capital D: a duplicate URL that only works because routing is case-insensitive) |
| `/wellness` | Filter | Re-queries the dead API |
| footer | `mailto:info@…`, `tel:+254798724766` | Work |

The mobile menu toggle is `<img id="menu" alt="" onClick>` with `tabIndex -1`: invisible to screen readers and unreachable by keyboard.

---

## 5. Content inventory

Verbatim text for every page is in [`content/`](content/). **Keep** = reuse the facts as-is. **Rewrite** = keep the substance, new copy. **Merge** = fold into another page or section. **Drop** = remove.

### Home (`/`)
| Item | Decision | Notes |
|---|---|---|
| H1 "Empowering Communities for Health and Wellness" | Rewrite | Banned word ("empowering"); doesn't say what or where. |
| Subhead "Sustainable care, education and wellness for all" | Rewrite | Generic; no place, no audience. |
| CTA "Join the Wellness club" | Drop | Dead end. Replace with *Fund our work* / *Partner with us*. |
| Hero photo `/hero.jpg` | Drop | Likely AI-generated; can't be presented as fieldwork (§8). |
| Vision | Keep | Fix "County's"; wording awkward; board to approve any rewording (`TODO_CONFIRM`). |
| Mission (heading spelled "Mision") | Keep | Fix the typo. |
| Support Our Work button | Merge | Into the funder path (`/partner`). |
| Our Impact Areas (4 cards) | Rewrite | Cards: icon, 3–4 word title, one line. |
| Explore All Projects button | Keep | As "See all programs" → `/programs`. |
| Community Impact ("hundreds of community members") | Drop | Unverified and conflicting; replace with a proof band hidden until metrics are confirmed. |
| Our Future Plans (6 items) | Rewrite | As fundable project cards (need, plan, outcome, budget `TODO_CONFIRM`). |
| Our Partners (text only) | Drop | Hidden until real partners and logo permissions exist. |
| Get Involved (unlinked bullets) | Rewrite | Closing CTA band: Fund · Partner · Donate. |
| Chat with us (Chatbase) | Keep (conditional) | Only if owners want it; keep click-to-load and its privacy notice. |
| Footer tagline "Promoting community health and well-being" | Rewrite | Keep the idea; add registration number, legal links, current year (live shows © 2025). |

### About (`/about`)
| Item | Decision | Notes |
|---|---|---|
| Who we are | Rewrite | 60 words to ≤40; drop "empowering". Keep facts: grassroots CBO, Meru County, focus areas. |
| Vision / Mission | Keep | Fix "County s". |
| Core values (5) | Keep | Fix spacing ("Transparency:Operating"). |
| Objectives (5) | Keep as **targets** | Label as targets. Need start date and baseline (`TODO_CONFIRM`). |
| Programs & Activities (7) | Merge | Into `/programs`. "Environmental Health Advocacy" appears only here (`TODO_CONFIRM` that it is active). |
| Our Impact paragraph | Drop | Unverified. |
| 7 illustrations (2 MB PNGs) | Drop | AI-style illustrations; 8.25 MB page. |

### Our Work (`/work`)
| Item | Decision | Notes |
|---|---|---|
| Intro paragraph | Rewrite | Generic ("impactful", "long term sustainable"). |
| 6 programs: goal + 4 activities | Keep facts, Rewrite copy | **Maternal & Child Health activities are a copy of Community Wellness's.** The home page's MCH description (education, nutrition, immunization, safe motherhood) is the best existing source; the correct list is `TODO_CONFIRM`. |
| Future plans (6) | Merge | Into "Fund a project" (`/partner`, home). |

### Our Team (`/team`)
| Item | Decision | Notes |
|---|---|---|
| Governance structure (5 bodies) | Keep | Becomes an SVG diagram. Fix "Nutritionz", "Activitiesz", "CHVsz". Run-on role lists need line breaks. |
| Leadership Commitment paragraph | Drop | Generic; replace with named leaders (`TODO_CONFIRM`). |
| Team illustration | Drop | Generic doctors, not the team. |

### Support Us (`/support`)
| Item | Decision | Notes |
|---|---|---|
| Hero + three buttons | Rewrite | Two dead buttons; becomes `/partner` and `/get-involved`. |
| "Why Support AfyaWise?" (2 paragraphs) | Rewrite | Banned/generic words ("innovative", "tirelessly"). |
| Stats 1,000+ / 2 / 200+ / 95% | Drop until confirmed | Conflicting, undated, no method (`TODO_CONFIRM`). |
| Ways you can help (3 cards) | Merge | Into Partner / Donate / Volunteer paths. |
| "Join thousands of supporters" | Drop | Unverified; contradicts "hundreds". |

### Donate (`/donate`)
| Item | Decision | Notes |
|---|---|---|
| Bank transfer: **Bank: KCB · Account: AfyaWise · Number: 1343270596 · Branch: Maua** | Keep exactly | Finance must confirm, plus SWIFT and branch code for international transfers (`TODO_CONFIRM`). |
| M-Pesa Till "COMING SOON", PayPal "COMING SOON" | Drop | Show only live methods. |
| What your donation supports (4) | Rewrite | "Train 100+ CHVs" conflicts with the target of 100; "Mobile Health Clinics" is a *future* plan, not a current service. |

### Contact (`/contact`)
| Item | Decision | Notes |
|---|---|---|
| Form: Full Name, Email, Phone, Subject, Organization (optional), Reason (Partner/Volunteer/Donate/Other), Message | Rewrite | No field is `required`; no server; dead API. Reasons should add *Fund* and *Media*. |
| Contact info: info@, phone, "Location" | Keep | The "Location" value is **blank**; an `<img src="null">` is broken. |
| Other emails: programs@, finance@, executive@ | Keep | `TODO_CONFIRM` these forwarders exist (MX is forwarding-only). |

### Blog, Shop, Services, Our Impact, Wellness
All **Drop**: no content, and the API is dead. Redirect to the nearest live page (§13). Stories come back as `/stories` only when real posts exist.

---

## 6. Copy errors

| Error | Where | Fix |
|---|---|---|
| "Mision" | `/` (Our Purpose) | Mission |
| "County s" | `/about` (vision) | County's |
| "Nutritionz", "Activitiesz", "CHVsz" | `/team` (Secretariat, community structures) | Nutrition, Activities, CHVs (→ CHPs, §Research) |
| "Transparency:Operating", "Community-Centered:Prioritizing", etc. | `/about` values | Add spaces |
| MCH activity list = Community Wellness activity list | `/work` | Real MCH list `TODO_CONFIRM` |
| "No all clubs added yet" | `/wellness` | Page dropped |
| "Organization(optional):" | `/contact` | Page rewritten |
| `/Donate` vs `/donate` | `/blog` | One lowercase URL |
| Banned/generic words: "empowering" (×6), "impactful", "innovative", "holistic", "tirelessly", "transform lives" | Home, About, Work, Support | Rewritten (§Strategy copy rules) |
| "Afyawise" vs "AfyaWise" | Everywhere | One wordmark: **AfyaWise** |
| "© 2025" | Footer | Current year, generated at build time |

---

## 7. Trust gaps for funders

| Funders look for | Live site |
|---|---|
| Legal registration (number, registering body) | Missing |
| Named leadership with roles and bios | Missing (governance chart only) |
| Board / governance | Described, nobody named |
| Audited accounts / annual report | Missing |
| Safeguarding / PSEA / whistleblowing | Missing |
| Impact method (MEAL), baselines, targets vs results | Targets on `/about` only; results unverified |
| Partners (names, logos with permission) | One sentence, nobody named |
| Online giving for international donors | Missing (PayPal "coming soon") |
| Data protection / privacy notice | Missing (the form collects names, emails, phones) |
| A working way to contact or partner | Broken (§1.1, §1.2) |

---

## 8. Design

**Colour.** Main colours from the shipped CSS: `#44BD32` and `#4CD137` (greens), `#FFA726`, `#F7931E`, `#FB8C00`, `#FBBC04` (oranges/yellows), `#16A34A`, and a deep `#007F5F` used 3 times. Measured contrast on the live pages:

| Pair | Ratio | Needs | Used for |
|---|---:|---:|---|
| `#44BD32` on white | 2.45:1 | 3 (large) / 4.5 | Section headings ("WHO WE ARE", "OUR IMPACT AREAS") |
| `#44BD32` on `#E1DEDE` | 1.83:1 | 3 | "COMMUNITY IMPACT" |
| `#4CD137` on white | 2.0:1 | 3 | H1 "Impact in Action" |
| white on `#4CD137` | 2.0:1 | 4.5 | Hero CTA "Join the Wellness club" |
| white on `#FFA726` | 1.94:1 | 4.5 | "Donate Now" |
| white on `#FBBC04` | 1.71:1 | 4.5 | "Join the Movement" |
| white on `#45BD32` | 2.45:1 | 4.5 | Blog filter "All" |

`#007F5F` reaches about 5:1 on white, so the brand already contains an accessible deep green.

**Type.** Inter ships as a **full variable TTF** (875 KB raw / 455 KB compressed, all glyphs and both axes). Chromium also rendered **Segoe UI** and **Arial** (form controls, some components; `font-family: Segoe UI` and `Arial` are declared), **Consolas** on `/contact`, and **Times New Roman on `/work`** (456 glyphs, an element without a font-family). The brief listed Team and Contact; the live serif fallback is on Work.

**Icons.** Three styles mixed: colourful 512 px PNG tiles (home impact areas), black line PNGs, and green line SVGs (future plans, donate). Several emoji-style SVGs (world, target).

**Imagery** (see [contact sheet](assets/contact-sheet.png)):

| Asset | Assessment |
|---|---|
| `hero.jpg`, `hero2.jpg`, `donate-hero.jpg` (1120×1120) | **Likely AI-generated.** Photoreal but idealised; square generator size; no verifiable AfyaWise people, places or branding. Must not be presented as beneficiaries. |
| `assets/*-program.*`, `vision`, `mission`, `core-values`, `impact`, `who-we-are`, `team`, `programs_activities` (1024×1536 PNG / 1120 JPG) | AI-style flat illustrations in one mint palette. Generic. 1.5–2.2 MB each, shown at 109–200 px. |
| `agent.jpg` (1120×1120, 389 KB) | 3D cartoon avatar used as a 56 px chat icon (20× oversized). |
| `blogImg/img3.jpg` | Generic stethoscope image. |
| `logo.jpg` (500×500, 34 KB) | The real mark: three figures (blue, green, orange) around a drop-and-leaf with an orange cross, held by two hands; arched "AFYA WISE"; tagline "Save a life". No vector exists. Favicon points at this JPG (`type="image/svg+xml"` mislabelled). |

**No real AfyaWise field photo exists on the site.** A consented real photo is the single highest-value asset the team can supply (`CONTENT_NEEDED.md`).

**Layout.** Centred grey boxes, all-caps green section labels, inconsistent card styles, 10-item nav. Footer copyright © 2025.

---

## 9. Performance baseline (Lighthouse 13.6)

Run 2 Nov 2026 against the live site. Mobile = Lighthouse default (Moto G Power emulation, simulated slow 4G, 4× CPU slowdown). Full HTML/JSON reports: [`lighthouse/`](lighthouse/). Summary: [`lighthouse/summary.md`](lighthouse/summary.md).

| Route | Mobile Perf | Mobile LCP | Mobile TBT | Mobile CLS | Desktop Perf | A11y | Best pr. | SEO |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| `/` | **51** | 6.7 s | 900 ms | 0.003 | 76 | 95 | 100 | 83 |
| `/about` | 63 | 1.9 s | 750 ms | 0.176 | 60 | 95 | 100 | 83 |
| `/work` | 64 | 2.7 s | 810 ms | 0.062 | 54 | 95 | 100 | 83 |
| `/team` | 71 | 1.4 s | 660 ms | 0.238 | 95 | 95 | 100 | 83 |
| `/contact` | 61 | 5.2 s | 700 ms | 0.014 | 52 | 94 | 100 | 83 |
| `/support` | 63 | 5.2 s | 630 ms | 0 | 96 | 93 | 100 | 83 |
| `/donate` | 54 | 5.2 s | 1,190 ms | 0.002 | 91 | 97 | 100 | 83 |
| `/services` | 52 | 6.8 s | 600 ms | 0.175 | 96 | 100 | 100 | 83 |
| `/our-impact` | 89 | 0.8 s | 420 ms | 0.002 | 98 | 92 | 96 | 83 |
| `/blog` | **46** | 4.4 s | 720 ms | **0.419** | 84 | 93 | 96 | 83 |
| `/shop` | 64 | 4.2 s | 550 ms | 0.175 | 98 | 100 | 100 | 83 |
| `/wellness` | 78 | 0.8 s | 960 ms | 0.016 | 100 | 85 | 96 | 83 |

What drives the scores:
- **TBT 420–1,190 ms on every mobile page** comes from the single 188 KB (compressed) React + Framer Motion + react-markdown bundle, which must download, parse and run before anything renders.
- **LCP 4–7 s on mobile** comes from the JS-gated render, then 600 KB+ hero JPGs. Where LCP looks fast (`/our-impact`, `/wellness`), the page is nearly empty.
- **CLS up to 0.42** comes from images without dimensions and content that appears after the dead API calls fail.
- **SEO 83 everywhere** is the missing meta description plus the shared title. Lighthouse's SEO score also can't see that real content needs JavaScript.
- **Lighthouse accessibility (85–100) is kinder than reality.** axe found 72 contrast failures and a critical unlabeled select, and the keyboard-inaccessible menu and heading misuse aren't scored at all (§10).

**Page weight from the crawl** (desktop, all requests, transfer size): `/` 1.86 MB · `/about` 8.25 MB · `/work` 7.07 MB · `/team` 1.43 MB · `/contact` 1.32 MB · `/support` 1.32 MB · `/donate` 1.30 MB · `/services`, `/shop` 1.07 MB · `/blog` 0.99 MB · `/our-impact`, `/wellness` 0.68 MB.

| Asset | Compressed transfer |
|---|---:|
| JS bundle `index-niwIgGm5.js` (React, React Router, Framer Motion, react-markdown) | 188 KB (592 KB raw) |
| CSS `index-BJ8jT5Er.css` | 5.4 KB |
| Font `Inter-VariableFont_opsz,wght.ttf` | 455 KB (875 KB raw) |
| All 46 images | 15.95 MB |

Largest images: `impact-B-jiAYnh.png` 2.18 MB (1024×1536 shown at 200 px), `mission` 2.12 MB, `core-values` 2.03 MB, `capacity building` 1.82 MB (shown at 109 px). Full list: [`assets/manifest.md`](assets/manifest.md).

---

## 10. Accessibility (axe-core 4.14, WCAG 2.2 AA + best practice)

| Rule | Impact | Nodes (all page-views) | Where |
|---|---|---:|---|
| `color-contrast` | serious | 72 | 9 of 12 pages, both viewports |
| `select-name` | **critical** | 2 | `/wellness` club filter has no label |
| `region` | moderate | 24 | Content outside landmarks, every page |
| `heading-order` | moderate | 4 | `/about`, `/team` |

Not caught by axe but confirmed manually:
- Mobile menu toggle is a non-focusable `<img>` (WCAG 2.1.1 Keyboard, 4.1.2 Name/Role/Value).
- No skip link; no `<header>` element (nav only).
- **The footer brand "Afyawise" is an `<h1>` on every page**; `/about`, `/work`, `/team`, `/contact` and `/blog` have no other h1.
- Images without meaningful alt: `/work` 14 of 19, `/contact` 9 of 13, `/donate` 9 of 13, `/` 10 of 20.
- `<img src="null">` on `/contact`.
- Small touch targets on mobile: 7–14 per page under 44×44 px.
- No horizontal overflow at 390 px (good).

---

## 11. SEO

| Check | Live |
|---|---|
| Unique `<title>` | **No**: "Afyawise" on all 12 routes |
| Meta description | None |
| Open Graph / Twitter | None |
| Canonical | None |
| JSON-LD | None |
| `robots.txt` / `sitemap.xml` | Return the HTML app shell (status 200) |
| 404 handling | Soft 404 (200 + app shell) |
| Server-rendered content | None (455-byte shell) |
| `lang` | `en` (good) |
| Favicon | `logo.jpg` declared as `image/svg+xml` |

---

## 12. Forms and data

`/contact`: seven fields, none required, no `action`. JavaScript POSTs JSON to the non-existent API. No honeypot, rate limit, consent text or privacy notice, though name, email and phone are collected. The *Reason* options (Partner, Volunteer, Donate, Other) don't route anywhere.

Chatbase (assistant "Afyawise Assistant", bot `5ZAehRlPhzYA_DLa0CLb7`): click-to-load iframe. Its own notice reads: *"⚠️ Please don't share sensitive or personal information. This chatbot is for general support only and may not always give accurate responses."* Keep that notice if the chatbot stays.

---

## 13. Redirect map for the rebuild

| Old | New | Code |
|---|---|---|
| `/work` | `/programs` | 301 |
| `/our-impact`, `/our-impact/:id` | `/impact` | 301 |
| `/team` | `/about#leadership` | 301 |
| `/support` | `/partner` | 301 |
| `/services` | `/programs` | 301 |
| `/shop` | `/donate` | 301 |
| `/wellness`, `/wellness/:id` | `/get-involved` | 301 |
| `/blog`, `/blog/:id` | `/stories` if posts exist, else `/impact` | 301 |
| `/Donate` (case variant) | Not redirected: on Vercel a `^/Donate$` route could also match `/donate` and loop. It was only linked from the old (now removed) blog page; it shows the 404 page, which links to Donate | 404 |

---

## 14. Where the live site differs from the brief (live site wins)

| Brief said | Live site shows |
|---|---|
| 10 nav items, 5 lead to empty pages incl. Wellness Club | 10 nav items, **4** empty (Blog, Shop, Services, Our Impact). Wellness isn't in the nav; it's reached from the hero CTA. |
| Times New Roman fallbacks on Team and Contact | Times New Roman renders on **/work**. Team/Contact show Segoe UI, Arial and Consolas fallbacks. |
| A Chatbase widget loads on the home page | The widget is **click-to-load**; nothing from Chatbase loads until clicked. The cost is the 389 KB avatar icon on every page. |
| Volunteer and Partner buttons do nothing; check the others | Confirmed, plus *Get Started* (Volunteer card), *Get Started* (Partner card) and *Join the Movement* are dead. *Support Our Work*, *Explore All Projects* and *Get Started* (Donate) work. |
| (not in brief) | The contact form and all dynamic content depend on `api.afyawise.org`, which **does not resolve**. |
| (not in brief) | The domain shows a **2 Nov 2026 creation date** in the .org registry (re-registered). |
| (not in brief) | No Donate button in the header; the `/donate` page has no SWIFT code for international transfers. |

---

## 15. Assets worth carrying forward

| Asset | Use |
|---|---|
| `logo.jpg` | Reference for the rebuilt SVG mark (§Design). Not shipped. |
| Brand colours | Green, orange and the logo blue, rebuilt as an accessible token scale; `#007F5F` shows a compliant deep green already exists. |
| Bank details | Copied exactly (finance to confirm). |
| Vision, mission, values, objectives, governance, program goals/activities, future plans | Facts reused; copy rewritten. |
| Photos and illustrations | **Not reused** (unverifiable, likely AI-generated). Replace with consented field photos (`CONTENT_NEEDED.md`). |
