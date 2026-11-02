# AfyaWise research (Phase 2)

Compiled 2 November 2026. Every claim carries its source URL. Where only secondary reporting exists, it's marked **(secondary)** and isn't published on the site unless the AfyaWise team confirms it. Numbers used on the website live in `src/content/` with their source beside them.

---

## 1. Context and need

### 1.1 Where AfyaWise works

| Fact | Value | Source |
|---|---|---|
| Karama Ward is one of five county assembly wards in **Tigania East** constituency (with Thangatha, Mikinduri, Kiguchwa, Muthara) | — | https://en.wikipedia.org/wiki/Tigania_East_Constituency · https://meru.go.ke/128/tigania-east |
| Karama Ward population and area | ≈25,060 people; 130.5 km² (ward code 0275). **Single source; not published** | https://tigania-east.ngcdf.go.ke/?p=93 |
| Meru County population (2019 census) | **1,545,714** (767,698 male, 777,975 female) | Meru CIDP 2023–2027 p. 32, citing KPHC 2019 · https://maarifa.cog.go.ke/sites/default/files/2024-06/MERU%20CIDP%202023-2027.pdf |
| Tigania East sub-county population (2019) | **72,549**, the least-populated of Meru's sub-counties; 507.9 km² | Meru CIDP 2023–2027 pp. 33–34 (same URL) |
| Meru County administrative units | 45 wards, 425 villages | Meru CIDP 2023–2027 p. 29 |

### 1.2 Maternal and child health, WASH: Meru vs Kenya (KDHS 2022)

Source for every row: KNBS, Ministry of Health and ICF, *Kenya Demographic and Health Survey 2022*, retrieved from the DHS Program API, which publishes the survey's county tables: https://api.dhsprogram.com/rest/dhs/data?countryIds=KE&surveyIds=KE2022DHS&breakdown=subnational. Report listing: https://www.rhsupplies.org/activities-resources/publications/kenya-demographic-and-health-survey-volume-1-2022-8827/. Machine-readable extract: [`data/kdhs2022-meru-vs-kenya.csv`](data/kdhs2022-meru-vs-kenya.csv).

| Indicator (KDHS 2022) | Meru | Kenya | Read |
|---|---:|---:|---|
| Children under 5 who are **stunted** | **25.2%** | 17.6% | 1 in 4 Meru children; worse than national |
| Children under 5 who are wasted | 6.0% | 4.9% | Worse |
| Women with **4+ antenatal visits** (last birth, 2 yrs) | **45%** | 66% | Fewer than half complete ANC |
| Mother's **postnatal check within 2 days** | **58.7%** | 77.6% | 4 in 10 mothers missed |
| Births assisted by a skilled provider (2 yrs) | 90.9% | 89.3% | Facility births are high; the gap is before and after birth |
| Births in a health facility (2 yrs) | 92.1% | 88.1% | As above |
| Children 12–23 months fully vaccinated (8 basic antigens) | 81.9% (n=55, small sample) | 80.1% | Near national; small sample |
| Children with diarrhoea in last 2 weeks (5 yrs) | 16.1% | 14.3% | Worse |
| …of whom given **ORS** | **36.7%** | 48.3% | Worse |
| Households with an **improved sanitation** facility | **62.4%** | 71.8% | Worse |
| Households with basic handwashing (soap + water) | 52.9% | 53.5% | About half lack it |
| Households using an improved water source | 82.4% | 80.4% | Similar |
| Under-5 mortality (10 yrs, per 1,000) | 35 (CI 18–52) | 43 | Wide CI; **don't publish** as a Meru claim |

**What this says:** Meru mothers reach facilities to give birth, but miss care **before** (ANC4+) and **after** (postnatal check). Child stunting, sanitation and diarrhoea treatment lag the national average. Household-level, community-delivered work (home visits, referral and follow-up, nutrition, WASH behaviour change) addresses exactly these gaps.

### 1.3 Mental health

| Fact | Value | Source |
|---|---|---|
| People in Kenya with a common mental disorder | **1 in 10**; 1 in 4 among routine outpatients | Ministry of Health, *Taskforce on Mental Health* report launch, 7 July 2020 · https://mental.health.go.ke/?p=288 |
| Treatment gap | ~75% untreated / 25% access **(secondary)**: press summaries of the same report and later MoH statements | https://www.capitalfm.co.ke/news/2025/10/kenyas-silent-mental-health-crisis-and-the-push-for-reform-are-we-doing-enough/ · https://www.the-star.co.ke/news/2021-03-09-mental-health-services-badly-in-need-of-adequate-funding |
| Psychiatrists | 0.18 per 100,000 **(secondary)** | https://www.standardmedia.co.ke/evewoman/health/article/2001389597/worldmentalhealthday-what-is-the-state-of-mental-health-care-in-kenya |
| Meru County mental-health targets 2023–27 | Cases identified and started on treatment: 50% → **85%**; awareness 20% → 100%; 5 regional mental, neurological and substance-use centres | Meru CIDP 2023–2027 pp. 142, 299 |

### 1.4 Disability

| Fact | Value | Source |
|---|---|---|
| National prevalence (2019 census, ages 5+, Washington Group short set) | **2.2%**, about **0.9 million** people; mobility most common (42%) | Development Initiatives, 6 May 2020 · https://devinit.github.io/resources/status-disability-kenya-statistics-2019-census/ |
| Meru domain rates (2019) | Seeing 1.4%, mobility 1.4%, cognition 1.0%, hearing 0.7%, self-care 0.6%, communication 0.4% | Same, Table A1 |
| Meru: highest absolute number of persons with disability in Kenya, ≈49,815 **(secondary; another report says 48,815)** | — | https://www.standardmedia.co.ke/amp/article/2001361380/918-270-people-living-with-disabilities · KNBS table: https://census.ke/dataset/0b7bbf69-62c9-4795-a78f-863cf26b0c85 |

### 1.5 Health workforce and community health

| Fact | Value | Source |
|---|---|---|
| Kenya doctors + nurses + clinical officers per 10,000 people (2020) | **30.14**, about 68% of the WHO 44.5 threshold (which excludes clinical officers) | Okoroafor et al., *BMJ Global Health* 2022 · https://pmc.ncbi.nlm.nih.gov/articles/PMC9422806/ |
| Community Health Promoters (CHPs) nationally | **107,000+** with stipends, devices and kits | https://newsroom.amref.org/blog/2025/06/built-from-the-ground-up-how-107000-community-health-promoters-are-changing-the-face-of-health-care-in-kenya/amp/ |
| CHP stipend | **KSh 5,000/month**: counties pay KSh 2,500 and national government the other half (Amref, 19 Feb 2024). Nairobi and Kisumu reportedly pay KSh 6,000 **(secondary)** | https://newsroom.amref.org/blog/2024/02/the-government-of-kenya-releases-ksh-3-billion-for-community-health-promoters-stipend/ · (secondary, bot-blocked when checked) https://nation.africa/kenya/health/state-to-roll-out-premium-health-cover-for-107-000-community-health-promoters-5346246 |
| First national stipend payment | KSh 3 billion, 16 Feb 2024 | https://newsroom.amref.org/blog/2024/02/the-government-of-kenya-releases-ksh-3-billion-for-community-health-promoters-stipend/ |
| SHA health cover for CHPs and families | KSh 396 million released (FY 2026/27) | https://www.standardmedia.co.ke/health-science/article/2001556612/government-releases-sh396-million-to-provide-health-cover-for-chps |
| eCHIS | Each CHP kit includes an Android phone preloaded with eCHIS (household registration, maternal-child tracking); July 2026 presidential directive to replace phones | https://peopledaily.digital/news/ruto-promises-new-smartphones-and-stipend-increase-for-community-health-promoters |
| Stipend delays | Reported arrears in some counties | https://www.thestandard.ke/business/amp/health-science/article/2001548454/kajiado-community-health-promoters-decry-months-of-unpaid-stipends |
| Meru: CHVs recruited / on stipend (previous CIDP period) | **3,294 recruited; 2,000 enrolled for stipends** | Meru CIDP 2023–2027 p. 50 |
| Meru plan 2023–27 | **40 primary care networks**; **500 more CHVs** with an integrated training kit; villages declared open-defecation-free 10% → **75%**; pregnant women on IFAS ≥90 days 25% → 60% | Meru CIDP 2023–2027 pp. 139, 142, 306 |
| Kenya's health system levels | Level 1 = **Community Health Services**; Level 2 dispensary/clinic; Level 3 health centre; Level 4 hospital. Primary Care Networks "link facility-based health services to the community" | Ministry of Health, *Primary Health Care FAQs* (2024) · https://www.health.go.ke/sites/default/files/2024-01/PRIMARY%20HEALTH%20CARE%20AWARENESS%20FAQS.pdf |

---

## 2. Policy tailwinds (verified)

| Policy | What it does | Why it matters for AfyaWise | Source |
|---|---|---|---|
| **Primary Health Care Act, 2023** (Act No. 13 of 2023) | Defines the community health promoter (selected and appointed under the Act), community health units and officers; counts CHPs in the PHC workforce; sets up primary care networks | AfyaWise's model (train, supervise and back community health workers; link households to facilities) is now law-backed national policy | https://new.kenyalaw.org/akn/ke/act/2023/13/eng@2023-11-24 |
| **CHV → CHP renaming** | Under the PHC Act, "Community Health Volunteers" became **"Community Health Promoters"** | **Decision:** the site uses "Community Health Promoters (CHPs)" and mentions "formerly Community Health Volunteers (CHVs)" once | Same Act; https://newsroom.amref.org/?p=32237 |
| **Social Health Insurance Act, 2023**; **Social Health Authority (SHA)** live 1 Oct 2024 | Replaced NHIF. Three funds: **Primary Healthcare Fund** (s.20), SHIF (s.25, levels 4–6), Emergency, Chronic & Critical Illness Fund (s.28). 2.75% contribution on gross income | Households must register with SHA to use the PHC fund; CHPs and CBOs help households register and use it. Supports the vision "sustainable health coverage" | https://bowmanslaw.com/insights/kenya-transition-to-the-social-health-insurance-fund-shif/ · https://www.the-star.co.ke/news/realtime/2024-09-17-explainer-all-you-need-to-know-about-the-new-health-fund-to-replace-nhif |
| **Digital Health Act, 2023** (Act No. 15 of 2023) | Creates the Digital Health Agency and an integrated digital health information system; data governance, privacy, exchange. Implementing regulations drafted Nov 2024 | The planned **mobile health reporting app** must integrate with or defer to eCHIS and meet Act standards. Pitch it as complementing eCHIS, not a parallel system | https://new.kenyalaw.org/akn/ke/act/2023/15/eng@2023-11-24 · https://www.kelinkenya.org/patient-empowerment-innovation-interoperability-and-privacy-the-core-of-the-digital-health-bill-2023/ |
| **Data Protection Act, 2019** + Registration Regulations (LN 265 of 2021, in force 14 Jul 2022) | Data controllers and processors must register with the ODPC unless exempt; the turnover exemption (<KSh 5m) **doesn't apply** to Third Schedule purposes, which per Bowmans include **health administration and provision of patient care** | AfyaWise likely must register with the ODPC (`TODO_CONFIRM` with counsel). Site forms need a privacy notice, purpose limitation and consent; health data must never go through web forms | https://new.kenyalaw.org/akn/ke/act/ln/2021/265/eng@2022-12-31 · https://www.odpc.go.ke/faqs/ · https://bowmanslaw.com/insights/kenya-data-protection-getting-ready-for-registration/ |
| **Community Groups Registration Act, 2022** | Governs registration of community groups and CBOs (application, constitution, member IDs, fee); non-compliant groups risk deregistration | Funders ask for a **valid, current registration certificate**. Publish the number and registering body (`TODO_CONFIRM`) | https://new.kenyalaw.org/akn/ke/act/2022/30/eng@2022-12-31 · https://socialprotection.go.ke/services-group-registration · https://www.kenyanews.go.ke/csos-familiarize-with-the-community-groups-registration-act-2022/ |

### Funding climate shift (context, not a tailwind)

- USAID was dismantled in 2025. On **4 Dec 2025** the US and Kenya signed a five-year Health Cooperation Framework (≈US$1.6bn US share; Kenya to raise domestic health spending and take on salaries and commodities by 2030). It favours **government-to-government** channels over NGOs: https://www.devex.com/news/the-us-signs-first-bilateral-health-deal-with-kenya-for-1-6-billion-111510/amp · https://www.bloomberg.com/news/articles/2025-12-04/us-signs-1-6-billion-kenya-health-deal-as-it-phases-out-aid
- A later headline reports the deal "frozen" (body not verified): https://www.theeastafrican.co.ke/tea/sustainability/health/trumps-health-funding-model-as-kenya-deal-frozen-5296436
- **Implication:** community organisations that visibly work *within* county and MOH systems (PHC Act, CHPs, eCHIS, CIDP targets) and diversify to foundations, local philanthropy, CSR and diaspora giving are better placed. The site must make that alignment explicit.

---

## 3. Funding landscape: who is likely to back a Meru CBO, and what they require

| Funder / route | Fit with AfyaWise | Access | What they ask for | Source |
|---|---|---|---|---|
| **Meru County Government (Health Services)** | CIDP targets: CHVs/CHPs, ODF villages, mental-health case finding, IFAS, PCNs | Partnership MoU, joint work plans | Registration, alignment with CIDP, reporting into county systems | CIDP (above) |
| **Embassy of Japan, Grant Assistance for Grassroots Projects (GGP)** | Non-profit community projects incl. **health and water/sanitation**; 10–15 projects a year in Kenya; NGOs and CBOs funded since 1989 | Application to Embassy GGP Section; guideline dated **Aug 2026** | Registration, required documents list in guideline, quotations for equipment/works | https://www.ke.emb-japan.go.jp/files/101079865.pdf |
| **Canada Fund for Local Initiatives (CFLI)** | Small, high-impact local projects; local CSOs eligible | Annual call (2026–27 deadlines were Mar–Apr 2026; next cycle `TODO_CONFIRM`) | Proof of legal registration, active local bank account | https://www.international.gc.ca/world-monde/funding-financement/cfli-fcil/index.aspx?lang=eng · https://www.advance-africa.com/Canada-Fund-for-Local-Initiatives.html |
| **Rotary Foundation Global Grants** (with a host club, e.g. Rotary Club of Meru) | Areas of focus incl. **water and sanitation** and **maternal and child health** | Two sponsoring clubs (host + international); Rotarian-led | Min. US$30,000 budget; **community needs assessment**; measurable results; sustainability | https://rotary5280.org/Page/grants (district guide, secondary; verify on rotary.org) |
| **GlobalGiving** | Online giving platform with a Kenya team; US/UK tax-deductible gifts | Apply and pass due diligence | Registered nonprofit (or fiscal sponsor), track record, legal docs, compliance review. Fee 5–12% + 3% processing; no application fee | https://www.globalgiving.org/aboutus/how-it-works/vetting/ · https://www.globalgiving.org/nonprofits/ |
| **Segal Family Foundation** | Locally led East African organisations; Kenya a core hub | **No unsolicited proposals**: referral via grantees, peer funders, fellows | Local leadership, track record, referrals | https://www.segalfamilyfoundation.org/contact-us/ · https://www.devex.com/news/how-the-segal-family-foundation-became-a-top-funder-in-africa-105517 |
| **Global Fund for Children** | Flexible grants to grassroots groups serving children and youth; Kenya among countries | Inquiry; GFC follows up if aligned | Community leadership; registration requirements vary by source | https://globalfundforchildren.org/wp-content/uploads/2024/10/Grassroots-Grantmaking-at-Global-Fund-for-Children-October-2024-1-1.pdf |
| **Kenya Community Development Foundation (KCDF)** | Kenyan community foundation; calls for county-based CBOs and CSOs (e.g. Giving for Change); matching grants | Open calls | County-based organisation, M&E capacity, sometimes 1:1 match | https://kcdf.or.ke/wp-content/uploads/2026/06/Guidlines-for-NCO-2026-Call-for-Proposal.pdf · https://www2.fundsforngos.org/latest-funds-for-ngos/kcdf-giving-for-change-programme-in-kenya/ |
| **Safaricom Foundation** | Health incl. **RMNCAH** and water | Calls for proposals / EOIs | Registered community groups and NGOs in Kenya | https://khusoko.com/2023/01/11/safaricom-foundation-invites-proposals-for-sustainable-development-partnerships/ |
| **UNICEF Kenya** (CSO partnerships) | MCH, nutrition, WASH | Register on the **UN Partner Portal** | Valid registration certificate, Partner Declaration (core values incl. **PSEA**), sanctions/reputational screening, re-verified every 5 years | https://supportagency.unpartnerportal.org/hc/en-us/articles/360021828133-Supplementary-Guidance-on-UNICEF-Due-Diligence-Verification-of-Civil-Society-Implementing-Partners |
| **The Pollination Project** | Seed grants (≈US$500) for grassroots changemakers; rolling | Online application | No registration required **(secondary)** | https://opportunitiesforyouth.org/2026/07/24/the-pollination-project-seed-grant-2026-apply-for-up-to-500-in-rolling-funding-for-grassroots-changemakers-worldwide/ |
| **Impact investors** (CHP income-generating activities, health app) | Possible only through a **separate legal vehicle**: a CBO can't issue equity or promise returns | — | Business plan, revenue model, legal entity | `TODO_CONFIRM` with founders (site describes these as fundable projects only) |

### What the requirements tell us the site must show (trust signals)

| Signal | Required or expected by | On the new site |
|---|---|---|
| Registration number + registering body + certificate on request | All of the above | Footer + `/about#accountability` (`TODO_CONFIRM`) |
| Governance: board/committee, named leaders, constitution | UNICEF, GlobalGiving, CGR Act | `/about` governance diagram + leadership cards (`TODO_CONFIRM` names) |
| Financial statements / audited accounts / annual report | GlobalGiving, larger grants, KCDF matching | `/impact#reports` download (`TODO_CONFIRM`) |
| Bank account in the organisation's name | CFLI, GlobalGiving | `/donate` (KCB, account name AfyaWise) |
| Safeguarding / PSEA / whistleblowing | UNICEF core values; peers (Amref Ethics Hotline, Living Goods Integrity Line, GiveDirectly) | `/about#safeguarding` + "Report a concern" email (`TODO_CONFIRM` policy) |
| MEAL framework: baselines, targets, measurable results | Rotary, CFLI, KCDF | `/impact`: targets labelled as targets; method; "as of" dates |
| Community needs assessment | Rotary | `/impact` + program pages cite KDHS/CIDP need |
| Alignment with county and national policy | County, UNICEF, post-2025 funding climate | "Aligned with" panel: PHC Act 2023, Meru CIDP, SDG 3 and 6 |
| Data-protection compliance | Kenyan law | `/privacy` + ODPC registration (`TODO_CONFIRM`) |
| Track record: real photos, stories, references | GlobalGiving, GFC, Segal (referrals) | `/stories` when real; consented field photos |

---

## 4. Peer benchmarks (homepages reviewed 2 Nov 2026)

| Organisation | Does well | Watch out for | URL |
|---|---|---|---|
| **Last Mile Health** | 3 metrics with a **dated footnote** (1 Jul 2025 to 30 Jun 2026) and a **methodology PDF** for "lives saved"; "Reports & Financials" in the nav; prize in a banner | No explicit "Partner with us"; some path inconsistencies | https://lastmilehealth.org/ |
| **Living Goods** | Two RCTs cited; quarterly impact reports (PDF); **Integrity Line** (KE/UG/US); ratings and awards; "Partner With Us" route | Impact counters render **0** without JS; unreconciled people-reached figures | https://livinggoods.org/ |
| **Lwala Community Alliance** | Positioning "When communities lead, change is lasting"; **annual report as a hero CTA**; partner logos incl. **Kenya MoH**; "Report a Concern" | Metrics have no date or source | https://lwala.org/ |
| **SHOFCO** | "Partner With Us" and **Donor Hub** pages; clear "Get Involved" | **Lorem ipsum on the live homepage**; no metrics | https://www.shofco.org/ |
| **charity: water** | "Give water. Get proof.": **GPS + photos** for every project; 100% model; financials; routing cards for every way to give | People-served figure is a projection ("will be served") | https://www.charitywater.org/ |
| **Amref Health Africa** | Annual report download; **Ethics Hotline**; country sites; Expression of Interest route | No metrics on homepage; cluttered | https://amref.org/ |
| **GiveDirectly** | **Transparency:** financials, "Yes, we have costs", research, risks/fraud report, whistleblowing, consent policy, scam warning, donation widget in hero | Two conflicting cost-efficiency figures (85% vs >87%) | https://www.givedirectly.org/ |

### Lessons applied to AfyaWise
1. **Date every number and link its method** (Last Mile Health), or don't show it. Our proof band is hidden until verified, and every metric carries `asOf` + `source`.
2. **Render numbers in HTML**, never JS-only counters (Living Goods shows 0). Count-up is enhancement only.
3. **One number, one value**: no unreconciled figures (Living Goods, GiveDirectly). This is the CBO's main credibility risk today (§AUDIT 1.6).
4. **Integrity route on every page** (Amref, Living Goods, Lwala, GiveDirectly): footer "Report a concern".
5. **Show government partnership** (Lwala's MoH logo). For AfyaWise: name the county and MOH relationship only once confirmed.
6. **No placeholders, ever** (SHOFCO's lorem ipsum).
7. **A dedicated funder path** (SHOFCO Donor Hub, charity: water routing cards): `/partner` with a proposal request form.
8. **Proof over adjectives** (charity: water): field photos with consent, stories with dates and places.

---

## 5. Donations: options and recommendation

| Option | Donors served | Cost | Fit | Source |
|---|---|---|---|---|
| **Bank transfer (KCB Maua)** | Local + international (with SWIFT) | Bank fees | **Live today**; keep | Live `/donate` |
| **M-Pesa Paybill / Till** (manual) | Kenyan donors, diaspora via M-Pesa | Safaricom tariff | Essential locally; needs a Paybill/Till in the org's name (KYC by business type) | https://helloduty.com/blogs/request-for-an-m-pesa-paybill-or-buygoods |
| **M-Pesa Daraja STK Push** | Kenyan donors (one-tap prompt on the phone) | As above | Best local UX; needs Paybill + Daraja go-live (signed letter, IP whitelisting; 3 days to 6 weeks reported) | https://dev.to/msnmongare/how-to-go-live-on-the-m-pesa-daraja-api-1iip |
| **Paystack (Kenya)** | International + local cards, Apple Pay, M-Pesa | **M-Pesa 1.5%; local cards 2.9%; international cards 3.8%**; no monthly fee; settle KES or USD | Strong: live for all Kenyan merchants, hosted checkout (no PCI burden), recurring plans. **Confirm a CBO can onboard** (`TODO_CONFIRM`) | https://paystack.com/ke/pricing · https://paystack.com/blog/company-news/kenya |
| **Pesapal** | Cards + M-Pesa | ≈3–3.5% **(secondary estimates)** | Kenyan alternative if Paystack can't onboard a CBO | https://paybillke.com/paybill/pesapal |
| **PayPal** | Diaspora familiar with it | Up to ~4.4% + fixed fee **(secondary)**; withdrawals to M-Pesa via the M-Pesa app | Optional later; weaker brand control and no M-Pesa checkout | https://techcabal.com/2025/07/23/safaricom-adds-paypal-to-m-pesa-app/ · https://intasend.com/payments/paypal-to-m-pesa-to-kenya-challenges-best-new-paypal-alternative |
| **GlobalGiving** | US/UK donors wanting tax receipts; foundations that grant through it | 5–12% + 3% | Phase 2, after vetting; adds credibility | https://www.globalgiving.org/nonprofits/ |

**Recommendation**
- **International card donors: Paystack.** One hosted, mobile-friendly checkout for Visa/Mastercard and Apple Pay at published rates (3.8% international), settling to AfyaWise's Kenyan account in KES or USD, with monthly-giving plans. Built behind `DONATE_CARD_PROVIDER=paystack` + `PAYSTACK_SECRET_KEY`.
- **Local donors: M-Pesa Paybill with Daraja STK Push.** Built behind `MPESA_*` env flags. Until credentials exist the site shows **bank transfer only** plus a **"Request M-Pesa details"** email link, as the brief requires.
- **Later:** GlobalGiving listing for tax-deductible US/UK giving once registration, financials and track record documents are ready.

---

## 6. Stack (versions confirmed with `npm view` on 2 Nov 2026)

| Package | Version | Note |
|---|---|---|
| `astro` | 7.4.5 | Node ≥ 22.23.4. v7: Vite 8, Rust compiler (stricter HTML), `compressHTML: 'jsx'` default (watch inline whitespace), Markdown via Sätteri by default. https://docs.astro.build/en/guides/upgrade-to/v7/ |
| `@astrojs/vercel` | 11.0.18 | Static output + on-demand routes; `staticHeaders` writes CSP into Vercel config. https://docs.astro.build/en/guides/integrations-guide/vercel/ |
| `@astrojs/sitemap` | 3.7.4 | |
| `@astrojs/check` | 0.9.12 | Peer `typescript ^5 \|\| ^6` |
| `typescript` | **6.0.3** (not 7.0.2) | TS 7 (native) isn't yet supported by `@astrojs/check` or `typescript-eslint` (`<6.1.0`) |
| `tailwindcss` / `@tailwindcss/vite` | 4.3.3 | Vite 8 supported; CSS-first `@theme` wired to tokens |
| `@lucide/astro` | 1.66.0 | One line-icon set, build-time SVG, zero JS |
| `zod` | 4.6.7 | Server-side form validation |
| `resend` | 6.37.0 | Email delivery (provider-agnostic wrapper; any SMTP/API can replace it) |
| `@playwright/test` | 1.64.1 | E2E + screenshots |
| `@axe-core/playwright` | 4.14.0 | |
| `lighthouse` / `@lhci/cli` | 13.6.0 / 0.15.1 | |
| `eslint` / `eslint-plugin-astro` / `typescript-eslint` | 10.14.0 / 3.2.1 / 8.72.1 | |
| `prettier` / `prettier-plugin-astro` | 3.9.10 / 1.1.2 | |
| `subset-font` | 2.9.0 | Builds the subset variable Inter WOFF2 |
| `sharp` | 0.35.5 | Image pipeline for `astro:assets` |
| `linkinator`, `html-validate` | 8.1.0, 11.18.0 | Link check and HTML validation |

Astro features used: **Fonts API** (top-level `fonts`, local provider, variable weight range, auto fallback metrics, `<Font preload />`) https://docs.astro.build/en/guides/fonts/ · **`security.csp`** (since 6.0; hashes Astro's scripts and styles) and **`security.checkOrigin`** (CSRF, default on) https://docs.astro.build/en/reference/configuration-reference/ · **`redirects`** with real status codes through the adapter (same).
