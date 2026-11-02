// Lighthouse runner used for the Phase 1 baseline (live site) and Phase 6/7 QA (new build).
// Mobile = Lighthouse default (Moto G Power, simulated slow 4G); desktop = desktop preset.
// Usage: node scripts/audit/lighthouse.mjs --base https://www.afyawise.org --out audit/lighthouse [--desktop] [routes...]
import lighthouse from 'lighthouse';
import desktopConfig from 'lighthouse/core/config/desktop-config.js';
import * as chromeLauncher from 'chrome-launcher';
import { chromium } from 'playwright';
import fs from 'node:fs/promises';
import path from 'node:path';

const args = process.argv.slice(2);
const opt = (name, fallback) => {
  const i = args.indexOf(name);
  return i === -1 ? fallback : args.splice(i, 2)[1];
};
const flag = (name) => {
  const i = args.indexOf(name);
  return i === -1 ? false : (args.splice(i, 1), true);
};
const base = opt('--base', 'https://www.afyawise.org').replace(/\/$/, '');
const outDir = path.resolve(opt('--out', 'audit/lighthouse'));
const presets = flag('--desktop-only') ? ['desktop'] : flag('--desktop') ? ['mobile', 'desktop'] : ['mobile'];
const routes = args.length ? args : ['/'];
const slugOf = (r) => (r === '/' ? 'home' : r.replace(/^\/+|\/+$/g, '').replace(/\//g, '__'));

await fs.mkdir(outDir, { recursive: true });
const rows = [];
for (const route of routes) {
  for (const preset of presets) {
    // Fresh Chrome per run so caches and service workers never leak between runs.
    const chrome = await chromeLauncher.launch({
      chromePath: chromium.executablePath(),
      chromeFlags: ['--headless=new', '--no-first-run', '--disable-extensions'],
    });
    try {
      const result = await lighthouse(
        base + route,
        { port: chrome.port, output: ['json', 'html'], logLevel: 'error' },
        preset === 'desktop' ? desktopConfig : undefined,
      );
      const lhr = result.lhr;
      const file = path.join(outDir, `${slugOf(route)}.${preset}`);
      await fs.writeFile(`${file}.report.json`, result.report[0]);
      await fs.writeFile(`${file}.report.html`, result.report[1]);
      const a = lhr.audits;
      const items = a['resource-summary']?.details?.items ?? [];
      const kb = (type) => Math.round((items.find((i) => i.resourceType === type)?.transferSize ?? 0) / 1024);
      const row = {
        route,
        preset,
        performance: Math.round((lhr.categories.performance?.score ?? 0) * 100),
        accessibility: Math.round((lhr.categories.accessibility?.score ?? 0) * 100),
        bestPractices: Math.round((lhr.categories['best-practices']?.score ?? 0) * 100),
        seo: Math.round((lhr.categories.seo?.score ?? 0) * 100),
        fcp: a['first-contentful-paint']?.displayValue,
        lcp: a['largest-contentful-paint']?.displayValue,
        tbt: a['total-blocking-time']?.displayValue,
        cls: a['cumulative-layout-shift']?.displayValue,
        si: a['speed-index']?.displayValue,
        totalKB: kb('total'),
        scriptKB: kb('script'),
        imageKB: kb('image'),
        fontKB: kb('font'),
        requests: items.find((i) => i.resourceType === 'total')?.requestCount ?? null,
        runtimeError: lhr.runtimeError?.code ?? null,
      };
      rows.push(row);
      console.log(
        `${route} [${preset}] perf ${row.performance} a11y ${row.accessibility} bp ${row.bestPractices} seo ${row.seo} | LCP ${row.lcp} CLS ${row.cls} TBT ${row.tbt} | ${row.totalKB} KB`,
      );
    } catch (e) {
      console.log(`${route} [${preset}] FAILED: ${e.message}`);
      rows.push({ route, preset, error: e.message });
    } finally {
      await chrome.kill();
    }
  }
}

// Merge with any earlier summary in the same folder (so runs can be split up).
const summaryFile = path.join(outDir, 'summary.json');
const prev = JSON.parse(await fs.readFile(summaryFile, 'utf8').catch(() => '[]'));
const key = (r) => `${r.route}|${r.preset}`;
const merged = [...prev.filter((p) => !rows.some((r) => key(r) === key(p))), ...rows];
await fs.writeFile(summaryFile, JSON.stringify(merged, null, 2) + '\n');
const md = [
  '| Route | Preset | Perf | A11y | Best pr. | SEO | FCP | LCP | TBT | CLS | Speed Index | Total KB | JS KB | Img KB | Requests |',
  '|---|---|---:|---:|---:|---:|---|---|---|---|---|---:|---:|---:|---:|',
  ...merged.map((r) =>
    r.error
      ? `| \`${r.route}\` | ${r.preset} | error: ${r.error} |`
      : `| \`${r.route}\` | ${r.preset} | ${r.performance} | ${r.accessibility} | ${r.bestPractices} | ${r.seo} | ${r.fcp} | ${r.lcp} | ${r.tbt} | ${r.cls} | ${r.si} | ${r.totalKB} | ${r.scriptKB} | ${r.imageKB} | ${r.requests} |`,
  ),
].join('\n');
await fs.writeFile(path.join(outDir, 'summary.md'), md + '\n');
