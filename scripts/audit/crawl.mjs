// Phase 1 audit crawler for the live afyawise.org (a client-rendered Vite SPA).
// For every route (desktop 1440px and mobile 390px) it saves: verbatim visible text as
// markdown, the rendered DOM, links, buttons, images, forms, meta tags, headings, the fonts
// Chromium actually rendered, text colours + contrast, console errors, network requests,
// axe-core results and full-page screenshots.
// Usage: node scripts/audit/crawl.mjs
import { chromium } from 'playwright';
import AxeBuilder from '@axe-core/playwright';
import path from 'node:path';
import {
  BASE,
  OUT,
  SEED_ROUTES,
  slugOf,
  load,
  autoScroll,
  writeJson,
  writeText,
  parseRgb,
  contrast,
  toHex,
} from './lib.mjs';

const VIEWPORTS = {
  desktop: { viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 },
  mobile: {
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 1,
    isMobile: true,
    hasTouch: true,
    userAgent:
      'Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Mobile Safari/537.36',
  },
};

// ---------- in-page collectors (run inside the browser) ----------
function collectPage() {
  const PRIMARY =
    'h1,h2,h3,h4,h5,h6,p,li,blockquote,figcaption,label,td,th,dt,dd,button,summary,legend,option,[role=button]';
  const SKIP = new Set(['SCRIPT', 'STYLE', 'NOSCRIPT', 'TEMPLATE', 'SVG', 'IFRAME', 'PATH']);
  const norm = (s) => (s || '').replace(/\s+/g, ' ').trim();
  const lines = [];
  let loose = [];
  const flushLoose = () => {
    const t = norm(loose.join(' '));
    if (t) lines.push(t);
    loose = [];
  };
  const hidden = (el) => {
    const cs = getComputedStyle(el);
    return cs.display === 'none' || cs.visibility === 'hidden';
  };
  const label = (el) =>
    norm(el.innerText) ||
    norm(el.getAttribute('aria-label')) ||
    norm(el.getAttribute('title')) ||
    (el.querySelector('img') ? `(image: ${el.querySelector('img').getAttribute('alt') ?? 'no alt'})` : '') ||
    (el.querySelector('svg') ? '(icon only)' : '');
  const emitImg = (img) => {
    const alt = img.getAttribute('alt');
    lines.push(`![${alt === null ? 'NO ALT ATTRIBUTE' : alt === '' ? 'EMPTY ALT' : alt}](${img.getAttribute('src')})`);
  };
  const emitField = (el) => {
    const id = el.id && document.querySelector(`label[for="${CSS.escape(el.id)}"]`);
    const lab = norm(id?.innerText || el.closest('label')?.innerText || el.getAttribute('aria-label'));
    lines.push(
      `[field ${el.tagName.toLowerCase()}${el.type ? ` type=${el.type}` : ''}${el.name ? ` name=${el.name}` : ''}${
        el.placeholder ? ` placeholder="${el.placeholder}"` : ''
      }${el.required ? ' required' : ''}${lab ? ` label="${lab}"` : ' (no label)'}]`,
    );
  };
  const emitBlock = (el) => {
    const t = el.tagName;
    const text = label(el);
    if (!text && !el.querySelector('img')) return;
    let prefix = '';
    if (/^H[1-6]$/.test(t)) prefix = '#'.repeat(+t[1]) + ' ';
    else if (t === 'LI') prefix = '- ';
    else if (t === 'BLOCKQUOTE') prefix = '> ';
    else if (t === 'BUTTON' || el.getAttribute('role') === 'button') prefix = '[button] ';
    else if (t === 'LABEL') prefix = '[label] ';
    else if (t === 'TD' || t === 'TH') prefix = '| ';
    const links = [...el.querySelectorAll('a[href]')]
      .map((a) => `${norm(a.innerText) || '(no text)'} -> ${a.getAttribute('href')}`)
      .filter(Boolean);
    const linkedSelf = el.closest('a[href]');
    let line = prefix + text;
    if (links.length) line += `  _(links: ${links.join('; ')})_`;
    else if (linkedSelf && t !== 'A') line += `  _(inside link -> ${linkedSelf.getAttribute('href')})_`;
    lines.push(line);
    el.querySelectorAll('img').forEach(emitImg);
  };
  const walk = (node) => {
    for (const child of node.childNodes) {
      if (child.nodeType === 3) {
        const t = norm(child.textContent);
        if (t) loose.push(t);
        continue;
      }
      if (child.nodeType !== 1) continue;
      const el = child;
      const tag = el.tagName.toUpperCase();
      if (SKIP.has(tag) || hidden(el)) continue;
      if (tag === 'IMG') { flushLoose(); emitImg(el); continue; }
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') { flushLoose(); emitField(el); continue; }
      if (el.matches(PRIMARY)) { flushLoose(); emitBlock(el); continue; }
      if (tag === 'A') {
        flushLoose();
        const hasBlocks = el.querySelector(PRIMARY + ',img,div');
        if (hasBlocks) {
          lines.push(`[link block -> ${el.getAttribute('href')}]`);
          walk(el);
          flushLoose();
        } else {
          lines.push(`[link] [${label(el)}](${el.getAttribute('href') ?? 'NO HREF'})`);
        }
        continue;
      }
      walk(el);
      if (getComputedStyle(el).display !== 'inline') flushLoose();
    }
  };
  walk(document.body);
  flushLoose();
  const markdown = lines.filter((l, i) => l !== lines[i - 1]).join('\n\n');

  const region = (el) =>
    el.closest('header, nav') ? 'header' : el.closest('footer') ? 'footer' : 'main';
  const isVisible = (el) => {
    const r = el.getBoundingClientRect();
    return r.width > 0 && r.height > 0 && !hidden(el);
  };

  const links = [...document.querySelectorAll('a')].map((a) => ({
    text: label(a),
    href: a.getAttribute('href'),
    resolved: a.href || null,
    target: a.getAttribute('target'),
    rel: a.getAttribute('rel'),
    region: region(a),
    visible: isVisible(a),
  }));
  const buttons = [...document.querySelectorAll('button, [role=button], input[type=submit], input[type=button]')].map(
    (b) => ({
      text: label(b),
      type: b.getAttribute('type'),
      ariaLabel: b.getAttribute('aria-label'),
      inForm: !!b.closest('form'),
      insideLink: b.closest('a')?.getAttribute('href') ?? null,
      region: region(b),
      visible: isVisible(b),
    }),
  );
  const images = [...document.querySelectorAll('img')].map((img) => ({
    src: img.getAttribute('src'),
    currentSrc: img.currentSrc,
    alt: img.getAttribute('alt'),
    naturalWidth: img.naturalWidth,
    naturalHeight: img.naturalHeight,
    renderedWidth: Math.round(img.getBoundingClientRect().width),
    renderedHeight: Math.round(img.getBoundingClientRect().height),
    loading: img.getAttribute('loading'),
    widthAttr: img.getAttribute('width'),
    heightAttr: img.getAttribute('height'),
    region: region(img),
  }));
  const bgImages = [];
  document.querySelectorAll('body *').forEach((el) => {
    const bg = getComputedStyle(el).backgroundImage;
    if (bg && bg.includes('url(')) {
      const r = el.getBoundingClientRect();
      bgImages.push({ value: bg, renderedWidth: Math.round(r.width), renderedHeight: Math.round(r.height) });
    }
  });
  const forms = [...document.querySelectorAll('form')].map((f) => ({
    action: f.getAttribute('action'),
    method: f.getAttribute('method'),
    fields: [...f.querySelectorAll('input, select, textarea')].map((el) => {
      const lab = el.id && document.querySelector(`label[for="${CSS.escape(el.id)}"]`);
      return {
        tag: el.tagName.toLowerCase(),
        type: el.getAttribute('type'),
        name: el.getAttribute('name'),
        id: el.id || null,
        placeholder: el.getAttribute('placeholder'),
        required: el.required,
        autocomplete: el.getAttribute('autocomplete'),
        label: norm(lab?.innerText || el.closest('label')?.innerText) || null,
        ariaLabel: el.getAttribute('aria-label'),
      };
    }),
    submit: [...f.querySelectorAll('button, input[type=submit]')].map((b) => label(b)),
  }));
  const orphanFields = [...document.querySelectorAll('input, select, textarea')]
    .filter((el) => !el.closest('form'))
    .map((el) => ({ tag: el.tagName.toLowerCase(), type: el.type, name: el.name, placeholder: el.placeholder }));
  const headings = [...document.querySelectorAll('h1,h2,h3,h4,h5,h6')].map((h) => ({
    level: +h.tagName[1],
    text: norm(h.innerText),
    visible: isVisible(h),
  }));
  const meta = {
    title: document.title,
    lang: document.documentElement.lang,
    metas: [...document.querySelectorAll('meta')].map((m) => ({
      name: m.getAttribute('name'),
      property: m.getAttribute('property'),
      content: m.getAttribute('content'),
      charset: m.getAttribute('charset'),
    })),
    linkTags: [...document.querySelectorAll('link')].map((l) => ({
      rel: l.getAttribute('rel'),
      href: l.getAttribute('href'),
      type: l.getAttribute('type'),
    })),
    canonical: document.querySelector('link[rel=canonical]')?.href ?? null,
    jsonLd: [...document.querySelectorAll('script[type="application/ld+json"]')].map((s) => s.textContent),
    scripts: [...document.querySelectorAll('script[src]')].map((s) => s.src),
    iframes: [...document.querySelectorAll('iframe')].map((f) => f.src),
    landmarks: {
      header: document.querySelectorAll('header').length,
      nav: document.querySelectorAll('nav').length,
      main: document.querySelectorAll('main').length,
      footer: document.querySelectorAll('footer').length,
      skipLink: !!document.querySelector('a[href^="#main"], a[href="#content"], .skip-link'),
    },
  };

  // Text colour / effective background pairs for every visible element with its own text.
  const effBg = (el) => {
    let e = el;
    while (e) {
      const cs = getComputedStyle(e);
      const bg = cs.backgroundColor;
      if (cs.backgroundImage && cs.backgroundImage !== 'none') return { bg: 'IMAGE/GRADIENT', from: e.tagName };
      if (bg && bg !== 'rgba(0, 0, 0, 0)' && bg !== 'transparent') return { bg, from: e.tagName };
      e = e.parentElement;
    }
    return { bg: 'rgb(255, 255, 255)', from: 'default' };
  };
  const colorSamples = [];
  document.querySelectorAll('body *').forEach((el) => {
    if (SKIP.has(el.tagName.toUpperCase()) || !isVisible(el)) return;
    const ownText = [...el.childNodes].filter((n) => n.nodeType === 3).map((n) => n.textContent).join('').trim();
    if (!ownText) return;
    const cs = getComputedStyle(el);
    const { bg } = effBg(el);
    colorSamples.push({
      tag: el.tagName.toLowerCase(),
      text: ownText.slice(0, 60),
      color: cs.color,
      bg,
      fontSize: parseFloat(cs.fontSize),
      fontWeight: +cs.fontWeight || 400,
      fontFamily: cs.fontFamily,
      interactive: !!el.closest('a,button,[role=button]'),
    });
  });

  const layout = {
    scrollWidth: document.documentElement.scrollWidth,
    innerWidth: window.innerWidth,
    horizontalOverflow: document.documentElement.scrollWidth > window.innerWidth + 1,
    pageHeight: document.documentElement.scrollHeight,
    smallTouchTargets: [...document.querySelectorAll('a, button, [role=button], input, select, textarea')]
      .filter(isVisible)
      .map((el) => ({ el, r: el.getBoundingClientRect() }))
      .filter(({ r }) => r.width < 44 || r.height < 44)
      .map(({ el, r }) => ({ text: label(el).slice(0, 40), w: Math.round(r.width), h: Math.round(r.height) })),
  };
  const fontFaces = [...document.fonts].map((f) => ({ family: f.family, weight: f.weight, style: f.style, status: f.status }));

  return {
    markdown,
    innerText: document.body.innerText,
    links,
    buttons,
    images,
    bgImages,
    forms,
    orphanFields,
    headings,
    meta,
    colorSamples,
    layout,
    fontFaces,
  };
}

// ---------- fonts actually rendered (CDP), catches serif fallbacks ----------
async function renderedFonts(page) {
  const cdp = await page.context().newCDPSession(page);
  await cdp.send('DOM.enable');
  await cdp.send('CSS.enable');
  const { root } = await cdp.send('DOM.getDocument', { depth: -1 });
  const { nodeIds } = await cdp.send('DOM.querySelectorAll', {
    nodeId: root.nodeId,
    selector: 'h1,h2,h3,h4,h5,h6,p,a,button,label,li,span,input,textarea,select,td,th',
  });
  const usage = {};
  for (const nodeId of nodeIds.slice(0, 600)) {
    try {
      const { fonts } = await cdp.send('CSS.getPlatformFontsForNode', { nodeId });
      for (const f of fonts) usage[f.familyName] = (usage[f.familyName] || 0) + f.glyphCount;
    } catch {
      /* node without layout */
    }
  }
  await cdp.detach();
  return usage;
}

function summariseContrast(samples) {
  const pairs = new Map();
  for (const s of samples) {
    if (s.bg === 'IMAGE/GRADIENT') continue;
    const fg = parseRgb(s.color);
    const bg = parseRgb(s.bg);
    if (!fg || !bg) continue;
    const large = s.fontSize >= 24 || (s.fontSize >= 18.66 && s.fontWeight >= 700);
    const ratio = contrast(fg, bg);
    const need = large ? 3 : 4.5;
    const key = `${toHex(fg)} on ${toHex(bg)}`;
    const cur = pairs.get(key) || { pair: key, ratio: +ratio.toFixed(2), count: 0, failures: 0, examples: [] };
    cur.count++;
    if (ratio < need) {
      cur.failures++;
      if (cur.examples.length < 4) cur.examples.push(`${s.tag}: "${s.text}" (${s.fontSize}px/${s.fontWeight})`);
    }
    pairs.set(key, cur);
  }
  return [...pairs.values()].sort((a, b) => b.failures - a.failures || b.count - a.count);
}

async function capture(browser, route, vpName) {
  const ctx = await browser.newContext({ ...VIEWPORTS[vpName], ignoreHTTPSErrors: false });
  const page = await ctx.newPage();
  const consoleMsgs = [];
  const requests = [];
  page.on('console', (m) => {
    if (['error', 'warning'].includes(m.type())) consoleMsgs.push({ type: m.type(), text: m.text().slice(0, 500) });
  });
  page.on('pageerror', (e) => consoleMsgs.push({ type: 'pageerror', text: String(e).slice(0, 500) }));
  page.on('requestfinished', async (req) => {
    const res = await req.response().catch(() => null);
    const sizes = await req.sizes().catch(() => null);
    requests.push({
      url: req.url(),
      method: req.method(),
      type: req.resourceType(),
      status: res?.status() ?? null,
      contentType: res?.headers()['content-type'] ?? null,
      bodyBytes: sizes?.responseBodySize ?? null,
      transferBytes: sizes ? sizes.responseBodySize + sizes.responseHeadersSize : null,
    });
  });
  page.on('requestfailed', (req) =>
    requests.push({ url: req.url(), method: req.method(), type: req.resourceType(), failed: req.failure()?.errorText }),
  );

  const resp = await load(page, route);
  await autoScroll(page);
  const data = await page.evaluate(collectPage);
  const fonts = await renderedFonts(page).catch((e) => ({ error: String(e) }));
  const axe = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice'])
    .analyze()
    .catch((e) => ({ error: String(e) }));
  const slug = slugOf(route);
  await page.screenshot({ path: path.join(OUT, 'screenshots', `${slug}-${vpName === 'desktop' ? 1440 : 390}.png`), fullPage: true });

  // Mobile menu: open the hamburger on the mobile home page and record what it shows.
  let mobileMenu = null;
  if (vpName === 'mobile' && route === '/') {
    const toggle = page.locator('header button, nav button').first();
    if (await toggle.count()) {
      await toggle.click({ timeout: 5000 }).catch(() => {});
      await page.waitForTimeout(800);
      mobileMenu = await page.evaluate(() =>
        [...document.querySelectorAll('header a, nav a, header button, nav button')]
          .filter((el) => el.getBoundingClientRect().height > 0)
          .map((el) => ({ text: el.innerText.trim(), href: el.getAttribute('href') })),
      );
      await page.screenshot({ path: path.join(OUT, 'screenshots', `home-390-menu-open.png`) });
    }
  }
  const dom = await page.content();
  await ctx.close();

  return {
    route,
    url: BASE + route,
    finalUrl: page.url(),
    status: resp?.status() ?? null,
    viewport: vpName,
    capturedAt: new Date().toISOString(),
    ...data,
    contrastPairs: summariseContrast(data.colorSamples),
    renderedFonts: fonts,
    axe: axe.error
      ? axe
      : {
          violations: axe.violations.map((v) => ({
            id: v.id,
            impact: v.impact,
            help: v.help,
            nodes: v.nodes.length,
            examples: v.nodes.slice(0, 4).map((n) => ({ target: n.target.join(' '), summary: n.failureSummary?.slice(0, 300) })),
          })),
          passes: axe.passes.length,
          incomplete: axe.incomplete.map((v) => ({ id: v.id, nodes: v.nodes.length })),
        },
    console: consoleMsgs,
    requests,
    mobileMenu,
    dom,
  };
}

function toContentMarkdown(d) {
  return [
    '---',
    `route: "${d.route}"`,
    `url: "${d.url}"`,
    `title: "${d.meta.title}"`,
    `captured: "${d.capturedAt}"`,
    `viewport: "1440x900 desktop, rendered in Chromium after network idle + full scroll"`,
    '---',
    '',
    `<!-- Verbatim visible text of the rendered page, in DOM order. Typos are the live site's, not ours. -->`,
    '',
    d.markdown,
    '',
  ].join('\n');
}

async function main() {
  const only = process.argv.slice(2);
  const queue = only.length ? [...only] : [...SEED_ROUTES];
  const seen = new Set(queue);
  const summary = [];
  while (queue.length) {
    const route = queue.shift();
    const slug = slugOf(route);
    process.stdout.write(`crawl ${route} ... `);
    // A fresh browser per route (with one retry) so a renderer crash can't cascade.
    const captureFresh = async (vp) => {
      for (let attempt = 1; ; attempt++) {
        const browser = await chromium.launch();
        try {
          return await capture(browser, route, vp);
        } catch (e) {
          if (attempt >= 2) throw e;
          process.stdout.write(`(retry ${vp}: ${e.message.split('\n')[0]}) `);
        } finally {
          await browser.close().catch(() => {});
        }
      }
    };
    try {
      const desktop = await captureFresh('desktop');
      const mobile = await captureFresh('mobile');
      const { dom: domD, ...restD } = desktop;
      const { dom: _domM, ...restM } = mobile;
      await writeText(path.join(OUT, 'dom', `${slug}.html`), domD);
      await writeText(path.join(OUT, 'content', `${slug}.md`), toContentMarkdown(desktop));
      await writeJson(path.join(OUT, 'data', 'pages', `${slug}.desktop.json`), restD);
      await writeJson(path.join(OUT, 'data', 'pages', `${slug}.mobile.json`), { ...restM, markdown: undefined, innerText: undefined });
      // Discover more internal routes from links (full runs only).
      if (only.length) { summary.push({ route }); console.log("ok"); continue; }
      for (const l of desktop.links.concat(mobile.links)) {
        if (!l.resolved) continue;
        const u = new URL(l.resolved);
        if (!['www.afyawise.org', 'afyawise.org'].includes(u.hostname)) continue;
        const r = u.pathname.replace(/\/+$/, '') || '/';
        if (!seen.has(r) && !/\.(jpg|jpeg|png|webp|svg|pdf|ico)$/i.test(r)) {
          seen.add(r);
          queue.push(r);
        }
      }
      summary.push({
        route,
        title: desktop.meta.title,
        h1: desktop.headings.filter((h) => h.level === 1).map((h) => h.text),
        words: desktop.innerText.split(/\s+/).filter(Boolean).length,
        images: desktop.images.length,
        imagesNoAlt: desktop.images.filter((i) => i.alt === null || i.alt === '').length,
        axeViolationsDesktop: desktop.axe.violations?.length ?? null,
        axeViolationsMobile: mobile.axe.violations?.length ?? null,
        consoleErrors: desktop.console.filter((c) => c.type !== 'warning').length,
        requests: desktop.requests.length,
        transferKB: Math.round(desktop.requests.reduce((s, r) => s + (r.transferBytes || 0), 0) / 1024),
        mobileOverflow: mobile.layout.horizontalOverflow,
      });
      console.log('ok');
    } catch (e) {
      console.log('FAILED', e.message);
      summary.push({ route, error: e.message });
    }
  }
  if (!only.length) await writeJson(path.join(OUT, 'data', 'crawl-summary.json'), summary);
  console.table(summary.map(({ route, title, words, images, imagesNoAlt, axeViolationsDesktop, transferKB, consoleErrors }) => ({
    route, title, words, images, imagesNoAlt, axeViolationsDesktop, transferKB, consoleErrors,
  })));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
