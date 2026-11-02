# Deploying afyawise.org

## Where it runs today

| | Now (verified 2 Nov 2026) |
|---|---|
| Hosting | **Vercel** (the old React app) |
| DNS + registrar | **Namecheap** (`dns1/dns2.registrar-servers.com`) |
| Apex `afyawise.org` | `A 216.198.79.1` (Vercel) → 308 to `https://www.afyawise.org/` |
| `www.afyawise.org` | `CNAME …vercel-dns-017.com` (Vercel) |
| Email | Namecheap email forwarding (MX `eforward1–5.registrar-servers.com`, SPF set, **no DMARC**) |
| Canonical host | `https://www.afyawise.org` (kept) |

The new site stays on Vercel, so **no DNS change is needed** for the website itself.

---

## 1. Vercel project

1. Push this repository to GitHub (or GitLab/Bitbucket).
2. In Vercel, either **import it into the existing project** that serves `afyawise.org` (Settings → Git → connect repository), or create a new project and later move the two domains to it (step 4).
3. Settings → General: **Framework preset Astro**, **Node.js 22.x or 24.x**. Build and install commands come from `vercel.json` (`npm run build`, `npm ci`).
4. Settings → Domains: `www.afyawise.org` as the primary domain; `afyawise.org` redirects to it (308). If you created a new project, remove both domains from the old project first, then add them here. No Namecheap change is needed while the records above stay as they are.

`npm run build` builds with the Vercel adapter on Vercel (`VERCEL=1`), then `scripts/postbuild.mjs` adds the security headers to `.vercel/output/config.json`.

## 2. Environment variables

Set in Vercel → Settings → Environment Variables. Full list with comments: [`.env.example`](.env.example).

| Variable | Production | Preview |
|---|---|---|
| `PUBLIC_SHOW_UNCONFIRMED` | `false` | `true` (team reviews TODO_CONFIRM items in place) |
| `MAIL_PROVIDER` | `resend` (or `postmark`) | `resend` or `log` |
| `MAIL_API_KEY` | provider key | provider key |
| `MAIL_FROM` | `AfyaWise website <website@afyawise.org>` | same |
| `CONTACT_TO`, `MAIL_ROUTE_*` | optional overrides | optional |
| `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN` | recommended (rate limit across instances; free tier is enough) | optional |
| `RATE_LIMIT_PER_HOUR` | `5` | `5` |
| `PUBLIC_DONATE_MPESA`, `PUBLIC_MPESA_PAYBILL`, `PUBLIC_MPESA_ACCOUNT` | when the Pay Bill exists | same |
| `MPESA_*` | only for STK Push (see §6) | sandbox values |
| `PUBLIC_DONATE_CARD`, `PAYSTACK_SECRET_KEY` | when Paystack is approved | Paystack **test** key |
| `PUBLIC_ANALYTICS_PROVIDER`, `PUBLIC_ANALYTICS_DOMAIN` | when chosen | `none` |
| `PUBLIC_CHATBASE_ID` | only if the team keeps the chatbot | same |

`PUBLIC_*` values are compiled into the pages: **redeploy after changing them.** In Vercel Production, `MAIL_PROVIDER=log` is refused, so forms fail loudly rather than dropping messages.

## 3. Email sending (needed for the forms)

1. Create a **Resend** account (or Postmark) and add the domain `afyawise.org`.
2. Add the provider's DNS records in **Namecheap → Advanced DNS** (usually a `TXT` on a `send`/`bounces` subdomain for SPF and `CNAME`/`TXT` records for DKIM). **Keep** the existing forwarding MX and SPF records; if the provider asks for SPF on the root, merge it into the existing `v=spf1 …` record rather than adding a second one.
3. Add **DMARC**: `TXT _dmarc.afyawise.org` = `v=DMARC1; p=none; rua=mailto:info@afyawise.org`. Move to `p=quarantine` after a few clean weeks.
4. Set `MAIL_PROVIDER`, `MAIL_API_KEY`, `MAIL_FROM` in Vercel and redeploy.
5. Send a test from each form (Contact, Fund & partner, Get involved) and confirm it reaches the right inbox: Fund/Partner/Media → executive@, Volunteer → programs@, Donate → finance@, Other → info@.

## 4. Redirects from the old site

Built in and covered by tests (`tests/e2e/redirects.spec.ts`):

| Old | New |
|---|---|
| `/work`, `/services` | `/programs` |
| `/our-impact`, `/our-impact/:id`, `/blog`, `/blog/:id` | `/impact` (point `/blog` at `/stories` once stories exist) |
| `/team` | `/about#leadership` |
| `/support` | `/partner` |
| `/shop` | `/donate` |
| `/wellness`, `/wellness/:id` | `/get-involved` |

All are **301**. Exact paths are in `src/config/redirects.mjs`; the `:id` variants are tiny serverless endpoints in `src/pages/<old>/[id].ts`. The old `/Donate` (capital D) link from the old blog page isn't redirected: Vercel route matching may be case-insensitive, so a redirect could loop onto `/donate`. It shows the 404 page, which links to Donate.

## 5. Security headers

Every response gets (from `scripts/postbuild.mjs` and Astro's CSP):

- `Content-Security-Policy`: per page, with SHA-256 hashes for Astro's inline scripts and styles, `default-src 'self'`, `object-src 'none'`, `frame-ancestors 'none'`. Third-party origins are added only when the matching feature is on (analytics, chatbot, Paystack checkout).
- `Strict-Transport-Security: max-age=63072000; includeSubDomains; preload`
- `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy` (camera, microphone, geolocation, payment… off), `X-Frame-Options: DENY`, `Cross-Origin-Opener-Policy: same-origin`
- `Cache-Control: no-store` and `X-Robots-Tag: noindex` on `/api/*`; immutable caching for `/_astro/*`.

HTTPS-only and the apex → www redirect are handled by Vercel's domain settings. The header carries `preload`, but **only submit the domain to hstspreload.org once you're sure every subdomain will always be HTTPS.**

## 6. Donations

- **Bank transfer** is always shown (details in `src/content/en/org.ts`).
- **M-Pesa (simple):** once AfyaWise has a Pay Bill or Till, set `PUBLIC_DONATE_MPESA=paybill` with the number and account and redeploy. Until then the page shows "Request M-Pesa details" (emails finance@).
- **M-Pesa STK Push (one-tap prompt):** register the Pay Bill on Safaricom Daraja, get go-live approval, set `PUBLIC_DONATE_MPESA=stk` and the `MPESA_*` variables (`MPESA_ENV=production`). Callback: `https://www.afyawise.org/api/webhooks/mpesa?token=<MPESA_CALLBACK_TOKEN>` (added automatically). `TODO_CONFIRM`: some guides say Safaricom whitelists server IPs for production, and Vercel functions don't have fixed IPs. If Safaricom requires that, use **Paystack's M-Pesa channel** instead (the card checkout already offers mobile money).
- **Cards (Paystack):** open a Paystack Kenya account (confirm it accepts a CBO), set `PUBLIC_DONATE_CARD=paystack` and `PAYSTACK_SECRET_KEY`, and add the webhook `https://www.afyawise.org/api/webhooks/paystack` in the Paystack dashboard. Card data never touches this site (hosted checkout).

## 7. After each production deploy

```bash
curl -sI https://www.afyawise.org/ | grep -iE "content-security|strict-transport|x-frame|x-content|referrer|permissions"
curl -sI https://www.afyawise.org/work        # 301 → /programs
curl -s  https://www.afyawise.org/robots.txt  # real robots file, sitemap link
curl -sI https://www.afyawise.org/nope        # 404
```

- Submit a test message through each form.
- **Google Search Console:** add the domain property (Namecheap TXT record) and submit `https://www.afyawise.org/sitemap-index.xml`. Do the same in Bing Webmaster Tools.
- **Local search:** create or claim a **Google Business Profile** for "AfyaWise Community Based Organization" (category: non-governmental organisation) at Karama, Tigania East, with the website, phone and the same name and address as the site footer. This is what people in Meru see in Maps.
- Run `npm run qa:lighthouse` against the live URL (`--base https://www.afyawise.org`) and compare with `qa/lighthouse/`.
- **Rollback:** Vercel → Deployments → previous deployment → *Promote to Production*.

## 8. Domain and email continuity

The `.org` registry shows `afyawise.org` was (re-)registered on **2 Nov 2026** (status "add period"), although the site existed in 2025. Make sure the registrant is AfyaWise CBO, **auto-renew is on**, the registrar login belongs to an AfyaWise officer (not an individual developer), and two people can access it. A lapsed domain takes down the website and every `@afyawise.org` address.

## 9. The old backend

The old React app called `https://api.afyawise.org`, which doesn't exist in DNS. The new site doesn't use it. Nothing to migrate.
