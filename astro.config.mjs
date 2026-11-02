// @ts-check
import { defineConfig, envField, fontProviders } from 'astro/config';
import node from '@astrojs/node';
import sitemap from '@astrojs/sitemap';
import vercel from '@astrojs/vercel';
import tailwindcss from '@tailwindcss/vite';
import { redirects } from './src/config/redirects.mjs';

const SITE = 'https://www.afyawise.org';

// Vercel in production; Node standalone for local preview and the Playwright/Lighthouse QA runs.
const adapterName = process.env.ASTRO_ADAPTER ?? (process.env.VERCEL ? 'vercel' : 'node');

// Third-party origins are only allowed in the CSP when the matching feature is switched on.
const chatbotOn = Boolean(process.env.PUBLIC_CHATBASE_ID);
const analytics = process.env.PUBLIC_ANALYTICS_PROVIDER ?? 'none';
const analyticsOrigin =
  analytics === 'plausible' || analytics === 'umami'
    ? new URL(process.env.PUBLIC_ANALYTICS_SRC || 'https://plausible.io/js/script.js').origin
    : null;
const cardCheckoutOn = process.env.PUBLIC_DONATE_CARD === 'paystack';

export default defineConfig({
  site: SITE,
  output: 'static',
  trailingSlash: 'never',
  adapter: adapterName === 'vercel' ? vercel({ staticHeaders: true, maxDuration: 15 }) : node({ mode: 'standalone' }),
  integrations: [
    sitemap({
      filter: (page) => !/\/(thanks|donate\/thank-you)(\/|$)/.test(page),
    }),
  ],
  redirects,
  markdown: {
    // Stories are plain prose; Shiki's inline styles would also conflict with the CSP.
    syntaxHighlight: false,
  },
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
    routing: { prefixDefaultLocale: false },
  },
  build: {
    // Small, critical CSS: inlining saves a render-blocking round trip on slow mobile networks.
    inlineStylesheets: 'always',
  },
  image: {
    layout: 'constrained',
    responsiveStyles: true,
  },
  fonts: [
    {
      provider: fontProviders.local(),
      name: 'Inter',
      cssVariable: '--font-inter',
      fallbacks: ['ui-sans-serif', 'system-ui', 'sans-serif'],
      options: {
        variants: [
          {
            src: ['./src/assets/fonts/inter-latin-var.woff2'],
            weight: '400 800',
            style: 'normal',
            display: 'swap',
          },
        ],
      },
    },
  ],
  security: {
    checkOrigin: true,
    csp: {
      directives: [
        "default-src 'self'",
        "img-src 'self' data:",
        "font-src 'self'",
        `connect-src 'self'${analyticsOrigin ? ' ' + analyticsOrigin : ''}`,
        `frame-src ${chatbotOn ? 'https://www.chatbase.co' : "'none'"}`,
        `form-action 'self'${cardCheckoutOn ? ' https://checkout.paystack.com' : ''}`,
        "base-uri 'self'",
        "object-src 'none'",
        // Only enforceable as a header (Vercel staticHeaders); in a <meta> tag browsers ignore it and warn.
        ...(adapterName === 'vercel' ? /** @type {const} */ (["frame-ancestors 'none'"]) : []),
        'upgrade-insecure-requests',
      ],
      scriptDirective: {
        resources: ["'self'", ...(analyticsOrigin ? [analyticsOrigin] : [])],
      },
    },
  },
  env: {
    schema: {
      // --- Public, build-time flags -------------------------------------------------------------
      PUBLIC_SHOW_UNCONFIRMED: envField.boolean({ context: 'client', access: 'public', default: false }),
      PUBLIC_ANALYTICS_PROVIDER: envField.enum({
        context: 'client',
        access: 'public',
        values: ['none', 'plausible', 'umami', 'vercel'],
        default: 'none',
      }),
      PUBLIC_ANALYTICS_DOMAIN: envField.string({ context: 'client', access: 'public', optional: true }),
      PUBLIC_ANALYTICS_SRC: envField.string({ context: 'client', access: 'public', optional: true }),
      PUBLIC_UMAMI_WEBSITE_ID: envField.string({ context: 'client', access: 'public', optional: true }),
      PUBLIC_CHATBASE_ID: envField.string({ context: 'client', access: 'public', optional: true }),
      PUBLIC_DONATE_CARD: envField.enum({
        context: 'client',
        access: 'public',
        values: ['off', 'paystack'],
        default: 'off',
      }),
      PUBLIC_DONATE_MPESA: envField.enum({
        context: 'client',
        access: 'public',
        values: ['off', 'paybill', 'stk'],
        default: 'off',
      }),
      PUBLIC_MPESA_PAYBILL: envField.string({ context: 'client', access: 'public', optional: true }),
      PUBLIC_MPESA_ACCOUNT: envField.string({ context: 'client', access: 'public', optional: true }),
      // --- Server: email delivery ----------------------------------------------------------------
      MAIL_PROVIDER: envField.enum({
        context: 'server',
        access: 'secret',
        values: ['log', 'resend', 'postmark'],
        default: 'log',
      }),
      MAIL_API_KEY: envField.string({ context: 'server', access: 'secret', optional: true }),
      MAIL_FROM: envField.string({
        context: 'server',
        access: 'secret',
        default: 'AfyaWise website <website@afyawise.org>',
      }),
      CONTACT_TO: envField.string({ context: 'server', access: 'secret', default: 'info@afyawise.org' }),
      MAIL_ROUTE_FUND: envField.string({ context: 'server', access: 'secret', optional: true }),
      MAIL_ROUTE_PARTNER: envField.string({ context: 'server', access: 'secret', optional: true }),
      MAIL_ROUTE_VOLUNTEER: envField.string({ context: 'server', access: 'secret', optional: true }),
      MAIL_ROUTE_DONATE: envField.string({ context: 'server', access: 'secret', optional: true }),
      MAIL_ROUTE_MEDIA: envField.string({ context: 'server', access: 'secret', optional: true }),
      MAIL_ROUTE_OTHER: envField.string({ context: 'server', access: 'secret', optional: true }),
      // --- Server: abuse protection ---------------------------------------------------------------
      RATE_LIMIT_PER_HOUR: envField.number({ context: 'server', access: 'secret', default: 5 }),
      UPSTASH_REDIS_REST_URL: envField.string({ context: 'server', access: 'secret', optional: true }),
      UPSTASH_REDIS_REST_TOKEN: envField.string({ context: 'server', access: 'secret', optional: true }),
      // --- Server: donations ----------------------------------------------------------------------
      PAYSTACK_SECRET_KEY: envField.string({ context: 'server', access: 'secret', optional: true }),
      MPESA_ENV: envField.enum({
        context: 'server',
        access: 'secret',
        values: ['sandbox', 'production'],
        default: 'sandbox',
      }),
      MPESA_CONSUMER_KEY: envField.string({ context: 'server', access: 'secret', optional: true }),
      MPESA_CONSUMER_SECRET: envField.string({ context: 'server', access: 'secret', optional: true }),
      MPESA_SHORTCODE: envField.string({ context: 'server', access: 'secret', optional: true }),
      MPESA_PASSKEY: envField.string({ context: 'server', access: 'secret', optional: true }),
      MPESA_CALLBACK_TOKEN: envField.string({ context: 'server', access: 'secret', optional: true }),
    },
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
