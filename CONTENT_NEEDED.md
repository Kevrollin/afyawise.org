# Content needed from AfyaWise

The new website is built to **hide anything unconfirmed**. Sections without real data (results, leadership, partners, reports, registration number) don't appear on the live site until you supply them. To preview everything, including the hidden items marked with an amber **TODO_CONFIRM** badge, open a Preview deployment built with `PUBLIC_SHOW_UNCONFIRMED=true`.

Send items to the web team, or edit the file shown (instructions in `README.md`). Each item changes from `TODO_CONFIRM` to `confirmed` once supplied.

---

## A. Needed before launch

| # | Item | Why it matters | Where it goes |
|---|---|---|---|
| A1 | **Confirm the bank details** exactly: bank, account name, number, branch. Add the **SWIFT code** and **branch code** for international transfers | Wrong details lose gifts. The live site shows KCB · AfyaWise · 1343270596 · Maua | `src/content/en/org.ts` → `bank` |
| A2 | **Email inboxes work:** test info@, programs@, finance@ and executive@afyawise.org (they're Namecheap forwarders today). Choose who receives each form (defaults below) | Forms route by reason: Fund/Partner/Media → executive@, Volunteer → programs@, Donate → finance@, Other → info@ | Vercel env `MAIL_ROUTE_*` |
| A3 | **Email sending account:** create a Resend (or Postmark) account, verify `afyawise.org` (add their DNS records), and add a **DMARC** record | The old contact form sent to a server that doesn't exist; no message ever arrived | Vercel env `MAIL_PROVIDER`, `MAIL_API_KEY`, `MAIL_FROM`; DNS at Namecheap (see `DEPLOY.md`) |
| A4 | **Domain ownership:** the .org registry shows `afyawise.org` was (re-)registered on **2 Nov 2026**. Confirm the registrant is AfyaWise CBO, auto-renew is on, and an AfyaWise officer holds the Namecheap login | A lapsed domain takes the website and email down | Namecheap account |
| A5 | **Privacy policy review** by a Kenyan lawyer or data protection adviser, including retention periods | Forms collect personal data (Data Protection Act 2019) | `src/content/en/legal/privacy.md` |
| A6 | **ODPC registration:** check whether AfyaWise must register with the Office of the Data Protection Commissioner (health data is on the mandatory list) and send the registration number | Legal requirement; funders ask | `org.ts` → `dataProtectionRegistration` |
| A7 | **Approve the funder commitments** on the Fund & partner page ("concept note and budget", "targets and reporting schedule agreed with you", "date, source and method for every figure", "a visit to Karama Ward on request") and the four **measurement rules** on the Impact page | They're promises funders will hold you to | `src/content/en/pages.ts` → `partnerPage.expect`, `org.ts` → `accountability.measurementRules` |
| A8 | **Approve the "How we work" model:** Train promoters → Reach households → Refer and follow up | Summarises your activities; check it's accurate | `pages.ts` → `home.how` |
| A9 | **Maternal & child health activities:** the old Work page repeated the Community Wellness list here. We used the home page's wording: community education, nutrition programs, immunisation campaigns, safe motherhood initiatives. Confirm or correct | A visible copy-paste error funders would notice | `src/content/en/programs.ts` → `maternal-child-health.activities` |
| A10 | **Approve the redrawn logo** (mark + "AfyaWise" wordmark), or send the original vector files | The only logo is a 500 px JPG | `src/assets/brand/mark.svg`, then `npm run brand` |

## B. Unlocks the funder trust signals

| # | Item | Shown where, once confirmed | Where it goes |
|---|---|---|---|
| B1 | **CBO registration number**, registering body and year (and a scan of the certificate for funders who ask) | Footer, About › Accountability, home Accountability, JSON-LD | `org.ts` → `registration` |
| B2 | **Verified impact numbers.** The old site's figures conflict: "1,000+ lives impacted" vs "hundreds of community members"; "200+ health workers trained" vs a year-one target of 100; "95% satisfaction" has no survey; "thousands of supporters". For each number: value, **as-of date**, and **how it was counted** (registers, training attendance lists, survey) | Home proof band and Impact › Verified results (needs at least 3) | `src/content/en/governance.ts` → `metrics` |
| B3 | **Leadership:** names, roles, 2-line bios and a photo each (with written consent) for at least the Chair, Executive Director, Treasurer and MEAL Officer | About › Leadership | `governance.ts` → `people`; photos in `src/assets/people/` |
| B4 | **Latest annual report** (PDF) and **financial statements** (say whether audited) | Impact › Reports, home Accountability | `org.ts` → `accountability.annualReport`, `financialStatements`; files in `public/reports/` |
| B5 | **Safeguarding / PSEA policy** (PDF) and a **reporting contact** that isn't only the Executive Director | Footer "Report a concern", About › Accountability | `org.ts` → `accountability.safeguarding` |
| B6 | **Partners:** names, websites and **written permission** to show each logo (e.g. Meru County Department of Health, schools, churches) | Home › Partners logo wall | `governance.ts` → `partners`; logos in `src/assets/partners/` |
| B7 | **Project budgets** for the five fundable projects (total in KSh, duration, main cost lines) | "Budget" line on each project card (now "Budget and concept note on request") | `src/content/en/projects.ts` → `budget` |
| B8 | **Target start dates and baselines** for the five objectives (when did the "two years" start? what was the starting level?) | Impact › Targets, program pages | `programs.ts` → `targets[].startDate`, `baseline`; progress in `progress` |
| B9 | **Founding year** | About, structured data | `org.ts` → `founded` |

## C. Makes the site feel alive

| # | Item | Notes |
|---|---|---|
| C1 | **Field photos with written consent.** The current site's photos appear AI-generated and can't be shown as AfyaWise's work. Most useful: a promoter on a home visit; a training session; a handwashing station or latrine; a community health forum; the team (group portrait). Landscape, natural light, no patients during care, no identifiable children without a guardian's written consent | First real photo replaces the map in the home hero |
| C2 | **2–3 real stories** (who, where, what changed, date), e.g. the **Meru Marathon on 17 Oct 2026**: did it happen, how many took part, what did it raise? | `src/content/stories/` (template in `_README.md`). The Stories page and nav item appear automatically |
| C3 | **Programs:** is *Environmental health advocacy* an active program? If yes: goal and 4 activities | Hidden until confirmed (`programs.ts` → `draftPrograms`) |
| C4 | **Income projects for promoters:** who will own the enterprises and where income goes. AfyaWise can't offer equity or financial returns | `projects.ts` → `promoter-income.note` |
| C5 | **Health reporting app:** confirm it will complement the Ministry's eCHIS, not duplicate it, and who holds the data | `projects.ts` → `health-reporting-app` |
| C6 | **Mobile clinics:** clinical partner (county health team or licensed provider) | `projects.ts` → `mobile-clinics` |
| C7 | **Social media** accounts (if any) and a **WhatsApp** number | Footer, structured data (`org.ts` → `socials`, `phone.whatsapp`) |
| C8 | **Vision wording (optional, board decision).** Kept verbatim. A clearer option: *"A healthy, informed community that helps Meru County reach universal health coverage."* | `org.ts` → `official.vision` |

## D. Switch on when ready

| Feature | What's needed | Setting |
|---|---|---|
| M-Pesa (Pay Bill shown on the page) | Pay Bill (or Till) number and account name in AfyaWise's name | `PUBLIC_DONATE_MPESA=paybill`, `PUBLIC_MPESA_PAYBILL`, `PUBLIC_MPESA_ACCOUNT` |
| M-Pesa one-tap prompt (STK Push) | Daraja app on the Pay Bill, go-live approval, passkey | `PUBLIC_DONATE_MPESA=stk` + `MPESA_*` |
| Card donations | Paystack account (**confirm Paystack accepts a CBO**), secret key, webhook URL `https://www.afyawise.org/api/webhooks/paystack` | `PUBLIC_DONATE_CARD=paystack`, `PAYSTACK_SECRET_KEY` |
| Chatbot | Do you want to keep the Chatbase assistant? It loads only when someone clicks it, and shows a privacy warning | `PUBLIC_CHATBASE_ID=5ZAehRlPhzYA_DLa0CLb7` |
| Analytics | Choose Plausible, Umami or Vercel Analytics (all cookieless) | `PUBLIC_ANALYTICS_PROVIDER`, `PUBLIC_ANALYTICS_DOMAIN` |
| Kiswahili | Translations of `src/i18n/en.ts` and `src/content/en/` | See `README.md` › Kiswahili |
| GlobalGiving (later) | Registration, financials and track record documents for vetting | Research §5 |
