# afyawise.org

Website of **AfyaWise Community Based Organization**: community-led primary health care in Karama Ward, Meru County, Kenya.

Built with [Astro 7](https://astro.build) (static pages, a few serverless functions for forms and donations), TypeScript (strict) and Tailwind CSS 4 wired to the design tokens. JavaScript on a typical page: about 1 KB.

| Document | What it is |
|---|---|
| [`audit/AUDIT.md`](audit/AUDIT.md) | Audit of the old site (Phase 1) |
| [`research/RESEARCH.md`](research/RESEARCH.md) | Need, policy, funders, peers, payments, stack (with sources) |
| [`strategy/STRATEGY.md`](strategy/STRATEGY.md) | Positioning, information architecture, copy and truth rules, assumptions |
| [`design/DESIGN.md`](design/DESIGN.md) | Design system |
| [`CONTENT_NEEDED.md`](CONTENT_NEEDED.md) | What the AfyaWise team needs to supply or confirm |
| [`DEPLOY.md`](DEPLOY.md) | Hosting, environment variables, DNS, redirects |
| [`audit/BEFORE_AFTER.md`](audit/BEFORE_AFTER.md) | Old site vs new site |

---

## Quick start

Requires **Node.js 22.23.4+** (developed on Node 24).

```bash
npm ci
cp .env.example .env          # defaults are fine for local work
npm run dev                   # http://localhost:4321
```

Forms work locally: with `MAIL_PROVIDER=log` the message is printed in the terminal instead of emailed.

## Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Development server |
| `npm run build` | Production build (Node adapter locally, Vercel adapter on Vercel) + security headers for Vercel |
| `npm run preview` | Serve the production build at http://127.0.0.1:4321 |
| `npm run validate` | Copy rules + `astro check` + ESLint + Prettier check (run before every commit) |
| `npm run lint:copy` | Checks every string in `src/content/` against the copy rules |
| `npm run test:e2e` | Playwright: routes, CTAs, forms, redirects, accessibility (axe), budgets, mobile nav. Build first |
| `npm run qa:lighthouse` | Lighthouse (mobile + desktop) on every route of the running preview → `qa/lighthouse/` |
| `npm run qa:lhci` | Lighthouse CI with pass/fail assertions (`lighthouserc.cjs`) |
| `npm run qa:screens` | Screenshots of every page at 9 widths + landscape → `qa/screenshots/` |
| `npm run qa:links` | Link checker against the running preview |
| `npm run qa:html` | HTML validation of the build |
| `npm run og` · `brand` · `fonts` · `map` | Regenerate OG images, logo and favicons, the subset font, the locator map |
| `npm run audit:*` | Re-run the Phase 1 audit of the old live site |

## Project structure

```
src/
  content/
    en/            ← ALL site copy and facts (TypeScript), one file per area
      org.ts       organisation facts, bank details, accountability, alignment
      need.ts      cited statistics (each with its source)
      programs.ts  the 5 programs + targets (objectives)
      projects.ts  fundable projects
      governance.ts governance, leadership, partners, impact metrics
      pages.ts     page copy, FAQ
      legal/       privacy and terms (Markdown)
    stories/       real field stories (Markdown), see _README.md
    types.ts       content types and the truth rules
  i18n/en.ts       interface strings (buttons, labels, errors)
  components/      UI components (forms/ = form controls)
  layouts/         BaseLayout (SEO, header, footer), LegalLayout
  pages/           routes; pages/api/ = serverless endpoints
  lib/             visibility (TODO_CONFIRM), SEO/JSON-LD, mail, rate limit, forms, payments
  styles/          tokens.css (design tokens), global.css (Tailwind + base + components)
  assets/          font, brand (logo data), geo (map), partners/, people/, photos/
  config/redirects.mjs   301s from the old site's URLs
public/            favicons, brand SVGs, OG images, web manifest
scripts/           build helpers, copy linter, audit and QA scripts
tests/e2e/         Playwright tests
```

---

## Editing content

All words and facts live in **`src/content/en/`**. Edit the TypeScript files like a form: change the text between quotes, keep the commas.

### The truth rules (enforced in code)

1. **Nothing is invented.** No metric, name, partner, quote, budget or photo appears unless AfyaWise supplied it.
2. Every fact about AfyaWise has a `status`:
   - `'confirmed'`: shown on the live site.
   - `'TODO_CONFIRM'`: **hidden in production**; shown with an amber badge on Preview builds (`PUBLIC_SHOW_UNCONFIRMED=true`).
3. Every outside statistic has a `source` (name + link), displayed next to it.
4. Objectives are shown as **targets**. Results appear only with a date and method.
5. Copy limits: headlines ≤ 8 words, intros ≤ 20, paragraphs ≤ 40; no "empowering", "holistic", "innovative" and similar. `npm run lint:copy` checks this and fails the build check if a rule is broken.

### Common tasks

- **Confirm a fact** (e.g. the registration number): fill the value in `org.ts` and change `status: 'TODO_CONFIRM'` to `'confirmed'`.
- **Publish verified results:** in `governance.ts` → `metrics`, set `value`, `asOf` (e.g. `'2026-12-31'`), `method` (e.g. `'Training attendance registers'`) and `status: 'confirmed'`. The proof band appears on the home and Impact pages once **three** metrics are confirmed.
- **Add a leader:** in `governance.ts` → `people`, add name, role, bio, and a photo file in `src/assets/people/` (written consent on file), then `status: 'confirmed'`.
- **Add a partner:** put the logo in `src/assets/partners/`, add `{ name, url, logo: 'file.png', logoPermission: true, status: 'confirmed' }` to `partners`. No permission, no logo.
- **Add a project budget:** `projects.ts` → `budget: { amountKES: 2500000, status: 'confirmed' }`.
- **Add an annual report:** put the PDF in `public/reports/`, set `accountability.annualReport` to `{ url: '/reports/annual-report-2026.pdf', year: '2026', status: 'confirmed' }`.

### Adding a story

1. Create `src/content/stories/2026-11-my-story.md` using the template in [`src/content/stories/_README.md`](src/content/stories/_README.md).
2. Photos go next to it (e.g. `src/content/stories/images/`); a photo **requires** consent details and alt text, or the build fails.
3. Set `status: confirmed`. The **Stories** page and nav item appear automatically.
4. Point the `/blog` redirects in `src/config/redirects.mjs` at `/stories`.

### Adding photos

Put originals (≥ 2000 px wide, JPEG) in `src/assets/photos/` and use `<Image>` / `<Picture>` from `astro:assets`. Astro makes AVIF/WebP in several sizes. Follow the imagery policy in `design/DESIGN.md` (consent, crops, alt text).

## Switching features on

All through environment variables (see [`.env.example`](.env.example) and [`DEPLOY.md`](DEPLOY.md)):

| Feature | Variables |
|---|---|
| Email delivery | `MAIL_PROVIDER=resend`, `MAIL_API_KEY`, `MAIL_FROM` |
| M-Pesa on the donate page | `PUBLIC_DONATE_MPESA=paybill` + `PUBLIC_MPESA_PAYBILL`, `PUBLIC_MPESA_ACCOUNT` (or `stk` + `MPESA_*`) |
| Card donations | `PUBLIC_DONATE_CARD=paystack`, `PAYSTACK_SECRET_KEY` |
| Chatbot (click-to-load) | `PUBLIC_CHATBASE_ID` |
| Cookieless analytics | `PUBLIC_ANALYTICS_PROVIDER=plausible` (or `umami`/`vercel`), `PUBLIC_ANALYTICS_DOMAIN` |

`PUBLIC_*` values are built into the pages, so **redeploy after changing them**.

## Kiswahili

The site is ready for a second language:

1. Copy `src/i18n/en.ts` to `src/i18n/sw.ts` and translate the values; register it in `src/i18n/index.ts`.
2. Copy `src/content/en/` to `src/content/sw/` and translate; register it in `src/content/index.ts`.
3. Add `'sw'` to `i18n.locales` in `astro.config.mjs` and create `src/pages/sw/` routes (same components, `locale="sw"`). The layout then emits `hreflang` alternates automatically.

## Quality bar

Every change should pass: `npm run validate`, `npm run build`, `npm run test:e2e`. CI targets: Lighthouse ≥ 95 in every category, LCP < 1.8 s, CLS < 0.05, ≤ 30 KB JS and ≤ 500 KB per page, zero axe violations, zero dead links.

## Licences

Code © AfyaWise CBO. Inter font: SIL Open Font License (`src/assets/fonts/Inter-OFL.txt`). Icons: Lucide (ISC). Map boundaries: geoBoundaries / RCMRD (public domain); Karama location © OpenStreetMap contributors (ODbL).
