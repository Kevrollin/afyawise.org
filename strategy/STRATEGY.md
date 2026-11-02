# AfyaWise website strategy (Phase 3)

Inputs: [`audit/AUDIT.md`](../audit/AUDIT.md) and [`research/RESEARCH.md`](../research/RESEARCH.md). Final copy lives in [`src/content/`](../src/content/); this document explains the decisions behind it.

---

## 1. Who the site is for

**Primary: social investors and funders.** International foundations, bilateral and multilateral partners, global health NGOs, corporate CSR/ESG teams, impact investors (income-generating and digital-health projects only), Meru County Government and MOH, diaspora and individual donors.
**Secondary:** volunteers, community members, media.

Every page answers a funder's three questions in 10 seconds:

| Question | Where the answer sits |
|---|---|
| What does AfyaWise do? | H1 + subhead on every page; the *What we do* cards |
| What proof and accountability is there? | Cited need, targets labelled as targets, governance, alignment, "date and source on every number", registration and reports once confirmed |
| How do I fund or partner? | *Fund our work* / *Partner with us* in the hero, a sticky *Donate* button, a closing CTA band on every page, `/partner` with a request form |

**Conversions, in priority order:** 1) request a proposal or concept note (`/partner`), 2) partnership enquiry (`/partner`, `/contact`), 3) donate (`/donate`), 4) volunteer (`/get-involved`).

---

## 2. Positioning

**Line:** *Community-led primary health care in Meru County.*

We say "in Meru County" (where we work) rather than "for Meru County" (which implies county-wide coverage). Delivery is in Karama Ward, Tigania East.

**Why it's defensible:**
- **Community-led** is structural, not a slogan: members elect the Executive Committee (General Assembly); delivery runs through local promoters, mental health leaders and WASH champions (live `/team`).
- **Primary health care** is now the legal frame: the Primary Health Care Act 2023 makes Community Health Promoters part of the PHC workforce, and MOH defines Level 1 as community health services (Research §2, §1.5).
- **Meru County** is specific and checkable, and the need is documented: stunting 25% vs 18% nationally, ANC4+ 45% vs 66% (KDHS 2022).

**Proof pillars** (what makes AfyaWise the obvious partner, without superlatives):
1. **Based where the need is:** Karama Ward, Tigania East, working household by household.
2. **Built into the public system:** works through Community Health Promoters, links households to facilities, supports Meru's CIDP 2023–2027 targets.
3. **Accountable by design:** elected governance, a MEAL role in the structure, targets published as targets, a date and source on every number.

**We never write** "#1", "leading", "largest", "first", "only", or any outcome AfyaWise hasn't measured and dated.

---

## 3. Voice

Plain, specific, warm, confident. Short sentences. Numbers over adjectives. Name places (Karama Ward, Meru County), roles (promoters, mothers, caregivers) and actions (train, visit, refer, follow up).

| Instead of | Write |
|---|---|
| "Empowering communities through holistic, innovative solutions" | "We train Community Health Promoters to reach families at home." |
| "Hundreds of lives transformed" | A dated, sourced number, or nothing |
| "Join the movement" | "Volunteer with us" |

**Terminology decisions**
- **Community Health Promoters (CHPs).** Kenya's PHC Act 2023 renamed Community Health Volunteers. The site says "Community Health Promoters (CHPs), formerly Community Health Volunteers" **once**, on the CHP program page, then "promoters" or "CHPs".
- **AfyaWise**, camel-case W, everywhere (never "Afyawise" or "AFYA WISE" in text). Full legal-style name: *AfyaWise Community Based Organization (CBO)*.
- **Place:** "Karama Ward, Tigania East, Meru County, Kenya" in full in the footer and contact pages; "Meru County" elsewhere.
- **British/Kenyan spelling** (programme names keep the US "program" used by the org; "immunisation", "organisation", "counselling"). *Assumption A9.*

---

## 4. Information architecture

**Primary nav (6 items) + persistent Donate button:**
`Programs` · `Impact` · `About` · `Fund & partner` · `Get involved` · `Contact` · **[Donate]**

`Stories` is added automatically when the first real story is published (the nav entry is data-driven).

| Route | Purpose | Primary CTA |
|---|---|---|
| `/` | The whole story in 9 sections (§5) | Fund our work |
| `/programs` | The 5 programs at a glance | Fund this program |
| `/programs/[slug]` | Need (cited), goal, activities, targets, progress*, stories* | Fund this program |
| `/impact` | Targets vs progress*, how we measure (MEAL), alignment (PHC Act, CIDP, SDG 3 & 6), reports* | Request a proposal |
| `/partner` | **The funder page:** why AfyaWise, fundable projects, what funders get, accountability, FAQ, request form | Request a proposal |
| `/donate` | Live methods only: bank transfer now; M-Pesa and card when credentials exist | Donate |
| `/get-involved` | Volunteer form (skills, availability, location) + other ways to help | Volunteer |
| `/contact` | Form with reason routing + department emails | Send message |
| `/stories`, `/stories/[slug]` | Only if real posts exist (Markdown collection) | Fund / Donate |
| `/privacy`, `/terms` | Kenya DPA 2019 and GDPR-aware | — |
| `/404` | On-brand recovery | Home, Programs, Contact |

\*Rendered only when data exists.

**Five programs** (`/programs/[slug]`):
1. `maternal-child-health`: Maternal & child health
2. `water-sanitation-hygiene`: Water, sanitation & hygiene
3. `mental-health-disability`: Mental health & disability inclusion
4. `health-education`: Health education & wellness
5. `community-health-promoters`: Community Health Promoters

*Partnerships & resource mobilization* is how AfyaWise works, not something funders fund, so it moves to `/about#how-we-work` and `/partner` (*A1*). *Environmental Health Advocacy* (listed only on live `/about`, with no goal or activities) is held as `TODO_CONFIRM` and doesn't render (*A2*).

**301 redirects:** `/work`→`/programs` · `/our-impact`, `/our-impact/*`→`/impact` · `/team`→`/about#leadership` · `/support`→`/partner` · `/services`→`/programs` · `/shop`→`/donate` · `/wellness`, `/wellness/*`→`/get-involved` · `/blog`, `/blog/*`→`/impact` (switches to `/stories` once posts exist) · `/Donate`→`/donate`.

---

## 5. Home page, section by section (one idea each)

| # | Section | Content | Renders when |
|---|---|---|---|
| 1 | **Hero** | H1 **"Healthier Meru, one household at a time."** Subhead: *"We train Community Health Promoters in Karama Ward, Meru County, to reach families at home and link them to care."* CTAs **Fund our work** (primary → `/partner`) · **Partner with us** (secondary → `/partner#request`). Visual: a consented field photo when supplied; until then a map of Kenya → Meru County → Karama (true, specific, no stock people) (*A3*) | Always |
| 2 | **Proof band** | 3–4 verified metrics, each with an "as of" date and method | **Hidden.** All current figures are unverified and conflict (Audit §1.6) |
| 3 | **The need** | 25% of children under five stunted (vs 18%) · 45% of mothers complete four antenatal visits (vs 66%) · 38% of households lack improved sanitation (vs 28%). Source: KDHS 2022, linked | Always (cited) |
| 4 | **What we do** | 5 program cards: icon, 3–4 word title, one line → program page | Always |
| 5 | **How we work** | Train promoters → Reach households → Refer and follow up. MEAL line | Always (*A4*) |
| 6 | **Fund a project** | 5 cards: need · plan · outcome · budget · **Request proposal** | Always; budget line only when confirmed, else "Budget and concept note on request" (*A5*) |
| 7 | **Accountability** | Governance at a glance, alignment (PHC Act 2023, Meru CIDP 2023–27, SDG 3 & 6), registration no.*, annual report*, safeguarding* | Governance + alignment always; *items when confirmed |
| 8 | **Partners** | Real logos with permission | **Hidden** (none confirmed) |
| 9 | **Closing CTA band** | Fund · Partner · Donate | Always |

**Hero H1 choice:** *"Healthier Meru, one household at a time."* beat *"Community health, led by community."* because it names the place, the unit of work (the household) and the outcome in 6 words. The positioning line sits in the meta description and the About page.

---

## 6. Conversion design

| Form | Fields | Routes to |
|---|---|---|
| **Proposal / concept-note request** (`/partner`) | Name, organisation, email, phone (opt.), country, interest (fund a project / fund core programs / program partnership / corporate or CSR / in-kind / other), project (5 + "not sure"), budget range (opt.), timeline (opt.), message, consent | `executive@afyawise.org` (*A6*) |
| **Contact** (`/contact`) | Name, email, phone (opt.), organisation (opt.), reason (Fund / Partner / Volunteer / Donate / Media / Other), subject, message, consent | Fund→executive@ · Partner→executive@ · Volunteer→programs@ · Donate→finance@ · Media→executive@ · Other→info@ (*A6*) |
| **Volunteer** (`/get-involved`) | Name, email, phone, location, skills (multi), availability, hours/month (opt.), message, consent | `programs@afyawise.org` |
| **Card donation** (`/donate`, when enabled) | Amount + currency (KES/USD), email | Paystack hosted checkout |
| **M-Pesa STK** (`/donate`, when enabled) | Phone, amount | Safaricom Daraja |

All forms: server-side validation (Zod), honeypot + minimum-time trap, rate limit (Upstash if configured, else per-instance memory), clear inline success/error states with JS, full no-JS fallback (native POST → result page). Routing addresses are env-overridable. **Zero dead CTAs:** a Playwright test clicks every link and button.

**Analytics (cookieless, env-flagged):** events `Fund` (proposal submit), `Partner` (partner-reason submit), `Donate` (donate CTA / checkout start), `Volunteer` (volunteer submit), plus outbound clicks on primary CTAs.

---

## 7. Content and truth rules (enforced in code)

**Copy limits:** headlines ≤ 8 words · subheads ≤ 20 words · paragraphs ≤ 40 words. Banned: empowering, transformative, holistic, innovative, impactful, tirelessly, world-class, cutting-edge, seamless, leverage, synergy, game-changing. **`npm run lint:copy` checks every string in `src/content/` against these rules** and fails the build if one breaks.

**Truth rules**
1. Nothing invented: no metrics, beneficiaries, names, partners, quotes, testimonials, awards, press or budgets.
2. Objectives are shown as **targets** and labelled "Target", never as results.
3. The conflicting impact numbers (1,000+ / "hundreds" / 200+ / 95% / "thousands") are all stored as `TODO_CONFIRM`; none is published.
4. Every external statistic carries `source` (name + URL) next to the value in the content file and on the page.
5. **Anything `TODO_CONFIRM` doesn't render in production.** Preview builds (`PUBLIC_SHOW_UNCONFIRMED=true`) show it with a visible amber "TODO_CONFIRM" badge so the founders can review in place.
6. Sections and nav items with no data don't render: no empty Blog, Shop, Services or Wellness, no "coming soon", no lorem ipsum, no fake logos.
7. Photos: only real AfyaWise photos with recorded consent (`consent: true`, date, who gave it). None exist yet, so no photos of people ship.

---

## 8. i18n

English ships first. All UI strings live in `src/i18n/en.ts`, all page content in `src/content/en/`. Astro i18n routing is configured (`defaultLocale: 'en'`, no prefix). Adding Kiswahili means adding `sw.ts` and `src/content/sw/`, enabling the `sw` locale (served at `/sw/…`) and switching on `hreflang` alternates, which the layout already supports.

---

## 9. Assumptions (decisions made without the founders; all listed in `CONTENT_NEEDED.md` for sign-off)

| # | Decision | Why |
|---|---|---|
| A1 | *Partnerships & resource mobilization* isn't a program page; its content moves to About and Partner | Funders fund outcomes, not fundraising; keeps 5 clean program pages |
| A2 | *Environmental Health Advocacy* is `TODO_CONFIRM` (not rendered) | Named only on live /about, with no goal or activities |
| A3 | Hero uses a map (Kenya → Meru → Karama) until a consented field photo exists | All live photos look AI-generated or stock and can't be presented as beneficiaries |
| A4 | "How we work" (train → reach → refer and follow up) is synthesised from the live activities (CHV training, kits, supervision; referral pathways; screening; follow-up) | The brief asks for a 3-step model; founders must confirm the wording |
| A5 | Fundable projects: 5 (resource and learning centre, CHP income-generating activities, health reporting app, mobile clinics, school and youth health education). "International partnerships" isn't a project, so it's dropped as a card. Needs are tied to cited data; outcomes are qualitative; budgets are `TODO_CONFIRM` | No invented numbers |
| A6 | Form routing: Fund/Partner/Media→executive@, Volunteer→programs@, Donate→finance@, Other→info@ | Uses the department emails already published; env-overridable |
| A7 | Funder commitments on `/partner` ("concept note and budget", "reporting against agreed targets with date and source", "site visit on request") and the measurement rules on `/impact` are proposed policies | The brief requires a funder path and MEAL method; founders must approve before launch |
| A8 | Maternal & child health activities come from the live **home page** description (education, nutrition, immunisation, safe motherhood) because the live `/work` list duplicates Community Wellness | Fixes the copy-paste error with the org's own words |
| A9 | Kenyan/British spelling in body copy; "program" kept in names | Matches the audience and the org's usage |
| A10 | Bank details shown exactly as live (KCB · AfyaWise · 1343270596 · Maua); SWIFT and branch code `TODO_CONFIRM` | Already public on the live site; finance to confirm |
| A11 | Chatbot off by default; enable with `PUBLIC_CHATBASE_ID` (the current bot is `5ZAehRlPhzYA_DLa0CLb7`); click-to-load facade, privacy notice kept | "Keep only if the owners want it" |
| A12 | Canonical host stays `https://www.afyawise.org` (matches the current Vercel setup) | No DNS change needed for the host |
| A13 | Card donations via Paystack, M-Pesa via Daraja STK, both env-flagged; until credentials exist: bank transfer + "Request M-Pesa details" mailto to finance@ | Research §5 |
| A14 | Vision kept verbatim (typo fixed); a clearer rewording is proposed in `CONTENT_NEEDED.md` but not published | It's a board-approved statement |
| A15 | Domain lapse risk flagged, not acted on | Registry shows creation 2 Nov 2026 (Audit §2) |
| A16 | Analytics: Plausible-compatible, cookieless, off unless `PUBLIC_ANALYTICS_PROVIDER` is set | Privacy-first; no cookie banner needed |
| A17 | The old `/Donate` (capital D) URL isn't redirected; it shows the 404 page, which links to Donate | Vercel route matching may be case-insensitive, so a `/Donate` rule could loop onto `/donate`; it was only linked from the removed blog page |
| A18 | Paystack is the card provider, with M-Pesa via Daraja STK; if Safaricom requires fixed server IPs for production, use Paystack's M-Pesa channel instead | Vercel functions have no fixed IPs (`TODO_CONFIRM` with Safaricom) |
| A19 | Program and project pages use "promoters" / "CHPs" throughout and say "formerly Community Health Volunteers" once | PHC Act 2023 terminology |

---

## 10. Success measures for the site

- Proposal requests per month (primary), partner enquiries, donations started, volunteer sign-ups.
- Zero failed form deliveries (provider dashboard), zero dead links (CI link check).
- Search: "AfyaWise", "AfyaWise Meru", "community health Meru" indexed within 4 weeks of launch (Search Console).
- Lighthouse ≥ 95 in all categories on every route (CI).
