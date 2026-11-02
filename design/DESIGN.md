# AfyaWise design system (Phase 4)

Source of truth: [`src/styles/tokens.css`](../src/styles/tokens.css). Tailwind utilities are generated from those tokens ([`src/styles/global.css`](../src/styles/global.css)), with Tailwind's default palettes, fonts and type sizes removed, so only brand values can be used.

**Principles**
- **Specific beats decorative.** Real places, real numbers with sources, real people (with consent) or nothing.
- **Calm and warm.** Deep green for trust, the logo's orange for warmth and giving, generous white space.
- **Built for slow networks.** One font file (28 KB), no image-heavy decoration, a few KB of JavaScript.
- **Accessible by default.** Every text colour pair passes WCAG 2.2 AA; focus is always visible; targets are ≥ 44 px.

---

## Colour

All tokens use the `--af-` prefix. Measured with WCAG 2.x relative luminance.

### Brand green (primary)

| Token | Hex | On white | Use |
|---|---|---:|---|
| `--af-green-50` | `#F0F8EE` | — | Tinted surfaces, hover fills |
| `--af-green-100` | `#DDF0D8` | — | Badges, icon tiles, text on dark (12.4:1 on green-950) |
| `--af-green-200` | `#BCE2B3` | — | Links on dark sections (10.4:1 on green-950) |
| `--af-green-300` | `#8FD083` | — | Decorative (dividers, hover borders) |
| `--af-green-400` | `#5FBE4F` | 2.34:1 | **Decorative only** |
| `--af-green-500` | `#44BD32` | 2.45:1 | **Heritage green: decorative only** (logo, glows) |
| `--af-green-600` | `#2E9A28` | 3.64:1 | Graphics and large text only |
| **`--af-green-700`** | **`#1F7A2E`** | **5.41:1** | **Primary: buttons (white text 5.41:1), links, headings accents** |
| `--af-green-800` | `#196428` | 7.25:1 | Hover state, big numbers, wordmark "Afya" |
| `--af-green-900` | `#144D21` | 9.94:1 | Text on light green |
| `--af-green-950` | `#0C2E15` | 14.82:1 | Dark sections and footer (white text 14.8:1) |

### Warm accent (donate)

| Token | Hex | Contrast | Use |
|---|---|---:|---|
| `--af-orange-100` | `#FFEDD5` | — | "Target" badge background |
| `--af-orange-300` | `#FDBA6B` | 8.76:1 on green-950 | Eyebrows and icons on dark |
| **`--af-orange-400`** | **`#F7931E`** | **7.31:1 with ink text** | **Donate buttons only** (the logo orange, with dark text) |
| `--af-orange-500` | `#E57F0A` | 5.89:1 with ink text | Donate hover |
| `--af-orange-700` | `#A85508` | 5.29:1 on white | Small accent text (labels), wordmark "Wise" |

White text on orange fails (2.30:1), so donate buttons use **dark text on the logo orange**. That keeps the brand colour bright and accessible.

### Neutrals and semantics

| Token | Hex | On white | Use |
|---|---|---:|---|
| `--af-ink` | `#14201A` | 16.78:1 | Body text, headings |
| `--af-ink-muted` | `#3F4D45` | 8.90:1 | Secondary text |
| `--af-ink-subtle` | `#5A6862` | 5.85:1 | Captions, sources, hints |
| `--af-line` | `#D5DED8` | — | Card borders, dividers |
| `--af-line-strong` | `#7C8A83` | 3.61:1 | Form control borders (WCAG 1.4.11) |
| `--af-surface` / `--af-surface-tint` | `#F4F8F2` / `#E7F2E3` | — | Alternating sections |
| `--af-focus` | `#0B57D0` | 6.39:1 | Focus ring (orange-300 on dark sections) |
| `--af-error` / `--af-warning` / `--af-info` | `#B42318` / `#8A5300` / `#17629A` | 6.57 / 6.33 / 6.46 | States |
| `--af-blue-500` | `#1E88C8` | 3.88:1 | **Logo only** |

**Rules**
1. One accent: orange means *give*. Don't use it for anything else.
2. Heritage greens (`400`, `500`) never carry text.
3. Dark sections use `.on-dark`, which inverts text, links and focus colours automatically.

---

## Typography

- **Inter**, self-hosted as a **subset variable WOFF2**: 221 characters (Basic Latin, Latin-1, typographic punctuation, arrows, ≤ ≥, enough for English and Kiswahili), weight axis 400–800, **28.4 KB**. The old site shipped an 875 KB TTF. Built by `npm run fonts`; licence `src/assets/fonts/Inter-OFL.txt`.
- Loaded with Astro's Fonts API: `font-display: swap`, preloaded, plus a **metric-matched fallback** (`size-adjust`) so the swap causes no layout shift.
- Stack: `Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica Neue, Arial, sans-serif`. Form controls inherit it. **No serif fallback can appear.**

Fluid scale (`clamp()`, 360 px → 1280 px viewport):

| Step | Size | Used for |
|---|---|---|
| `--af-step--1` | 14 → 15 px | Small text, labels |
| `--af-step-0` | 16 → 17 px | Body |
| `--af-step-1` | 18 → 20 px | Lead paragraphs |
| `--af-step-2` | 20 → 24 px | H3, card titles |
| `--af-step-3` | 24 → 30 px | Section sub-heads |
| `--af-step-4` | 30 → 40 px | H2 |
| `--af-step-5` | 36 → 56 px | H1 |
| `--af-step-6` | 40 → 64 px | Statistic numbers |

Line height 1.6 for body, 1.12 for headings; headings use `letter-spacing: -0.022em` and `text-wrap: balance`. Body text is capped at **65ch** (`.measure`, `.prose`), leads at 40ch.

---

## Space and layout

- **8 px grid:** `--af-space-1` (8 px) … `--af-space-12` (96 px); 4 px half-step only for tight UI. In Tailwind, use even steps (`p-2` = 8 px, `p-4` = 16 px, `p-6` = 24 px…).
- **Container:** 1200 px content width, fluid side padding 16 → 32 px (`.container-site`).
- **Grid:** 12 columns (`.grid-12` or Tailwind `lg:grid-cols-12`), gap 16 → 24 px.
- **Section rhythm:** `--af-section-y` = 56 → 96 px; sections alternate white, `surface` and `tint`, and every page closes with the dark CTA band and footer.
- Radii 6 / 12 / 16 / 24 px and pill; three soft shadows (`sm`, `md`, `lg`).

---

## Icons

One set, **Lucide** (`@lucide/astro`), stroke **1.75**, rendered to inline SVG at build time (zero JS). Decorative icons are `aria-hidden`; icons that stand alone get a label. Sizes 16–26 px; icons sit in a 48 px `icon-tile` on cards. The old mix of 512 px colour PNGs, black line PNGs and emoji-style SVGs is gone.

---

## Imagery

**Policy: real AfyaWise fieldwork only, with recorded consent.**
- The audit found no verifiable AfyaWise photos. The live "photos" look AI-generated, so none are reused.
- Until consented photos arrive, the hero and *Where we work* use a **map** (Kenya → Meru County → Karama). It's specific, true and only 3.6 KB. Built from public-domain boundaries (`npm run map`).
- When photos arrive, store them in `src/assets/photos/` and render with `astro:assets` `<Image>`/`<Picture>` (AVIF/WebP, responsive `srcset`, explicit dimensions, `loading="lazy"` below the fold, `fetchpriority="high"` for the hero).
- **Crops:** hero 4:3 (desktop) and 1:1 (mobile art direction), cards 3:2, portraits 1:1. **Grade:** warm and natural; no heavy filters or overlays on faces.
- **Never:** stock clichés (stethoscopes, hands holding globes), AI-generated people presented as beneficiaries, patients during care, children without a guardian's written consent.
- **Alt text** says what the photo shows and why it matters ("Community Health Promoter Jane weighing a baby during a home visit in Karama"), never "image of".

---

## Logo

- **Mark** (`src/assets/brand/mark.svg`): the original three figures (blue, green, orange) ringed around a water drop with a cross, **redrawn as clean geometric SVG** so it stays crisp from 16 px to billboard size. The original's hands and tagline are dropped from the digital mark for legibility at small sizes. The 500 px JPG remains the reference (`TODO_CONFIRM`: founders approve the redraw).
- **Wordmark:** "**AfyaWise**", camel-case W, Inter ExtraBold, **outlined to paths** (never depends on a font). "Afya" in `green-800`, "Wise" in `orange-700`: the original's two-tone idea at legible contrast. White variant: white + `orange-300`.
- **Files:** `public/brand/afyawise-logo.svg`, `afyawise-logo-white.svg`, `afyawise-mark.svg`; favicons `favicon.svg`, `favicon.ico` (16/32/48), `apple-touch-icon.png` (180), `icon-192.png`, `icon-512.png`, `icon-maskable-512.png`; per-page **1200×630 OG images** in `public/og/`. Rebuild everything with `npm run brand` and `npm run og`.
- **Clear space:** the height of one head circle on every side. **Minimum size:** 24 px (mark), 96 px wide (full logo).

---

## Motion

CSS-first, 150–300 ms (`--af-duration-fast/base/slow`), easing `--af-ease-out`.

| Pattern | How | JS |
|---|---|---|
| Fade-up on scroll | `.reveal` with CSS scroll-driven animation (`animation-timeline: view()`); content is simply visible where unsupported | none |
| Hover | Buttons lift 1 px; cards raise their shadow and border; arrows nudge 3 px | none |
| Header | Compacts after scrolling (one IntersectionObserver) | ~0.4 KB |
| Mobile drawer | Slides in (Popover API + `@starting-style`) | none to open; ~0.5 KB to sync `aria-expanded`/focus |
| Metric count-up | Final number always in the HTML; counts up once when visible | ~0.4 KB, only when the band renders |
| Map pin | Two pulses (4.8 s), then still (WCAG 2.2.2: no motion past 5 s) | none |

`prefers-reduced-motion: reduce` sets every duration to 0, disables reveals, smooth scrolling, the pulse and the count-up.

---

## Components

`Header` (sticky, compacting, Donate always visible, Popover drawer) · `Footer` (sitemap, contact, legal, registration when confirmed, current year) · `PageHero` · `Section` / `SectionHeader` · `LocatorMap` · `StatList` (cited need) · `MetricBand` (proof, hidden until verified) · `ProgramCards` · `Steps` · `ProjectCards` (need · plan · outcome · budget · request) · `TargetList` (always badged *Target*) · `GovernanceDiagram` (HTML boxes + SVG connectors: reflows on mobile and reads as a list) · `TeamCards` · `LogoWall` (permission required) · `Faq` (`<details>`) · `CtaBand` · `BankDetails` (copy buttons) · `AlignmentList` · forms (`FormShell`, `Field`, `Select`, `TextArea`, `CheckboxGroup`) · `ChatFacade` (click-to-load) · `Analytics` (cookieless, opt-in) · `TodoBadge` (preview builds only).

**Implementation note:** Astro's scoped `<style>` is unlayered, so it overrides Tailwind's layered utilities whatever the specificity. Don't set a property in scoped CSS that a utility on the same element also controls (for example `display` with `lg:hidden`).

---

## Accessibility rules (WCAG 2.2 AA)

- Focus ring: 3 px `--af-focus`, 2 px offset, always visible on keyboard focus.
- Targets ≥ 44 × 44 px (`--af-tap`), including footer links and copy buttons.
- One `<h1>` per page; headings in order; landmarks `header`/`nav`/`main`/`footer`; skip link.
- Forms: visible labels, "(optional)" marked, errors in text linked with `aria-describedby`, a summary announced with `role="alert"`, focus moved to the first problem.
- Statistics: number + plain-language label + comparison + linked source, never colour alone.
