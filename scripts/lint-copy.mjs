// Enforces the copy rules (strategy §7) on every string in src/content/:
//   headline/title/question ≤ 8 words · intro/subhead/summary/lead/label ≤ 20 · body/text/answer/… ≤ 40
//   list items ≤ 20 words · banned words · no superlatives · no known typos from the old site
//   meta.title ≤ 60 characters · meta.description 70–160 characters
// Fields named official/note/activitiesNote/exact/url/href/locator are exempt from length checks.
// Usage: npm run lint:copy   (Node 24 runs the TypeScript content files directly)
const content = await import('../src/content/en/index.ts');
const { en: ui } = await import('../src/i18n/en.ts');

const LIMITS = {
  headline: 8,
  title: 8,
  question: 8,
  intro: 20,
  subhead: 20,
  summary: 20,
  lead: 20,
  label: 20,
  body: 40,
  text: 40,
  answer: 40,
  plan: 40,
  need: 40,
  outcome: 40,
  description: 40,
  statement: 40,
  goal: 40,
  meal: 40,
};
const EXEMPT = new Set(['official', 'note', 'activitiesNote', 'exact', 'url', 'href', 'locator', 'mapLabel']);
const BANNED =
  /\b(empowering|transformative|holistic|innovative|impactful|tirelessly|world[- ]class|cutting[- ]edge|seamless(?:ly)?|leverag(?:e|es|ed|ing)|synerg(?:y|ies|istic)|game[- ]changing)\b/i;
const SUPERLATIVE =
  /(#1\b|\bnumber one\b|\bleading\b|\blargest\b|\bbest[- ]in[- ]class\b|\bfirst[- ]ever\b|\bunique\b)/i;
const OLD_TYPOS = /\b(Mision|Nutritionz|Activitiesz|CHVsz|County s)\b/;

const problems = [];
const words = (s) =>
  s
    .trim()
    .split(/\s+/)
    .filter((w) => /[\p{L}\p{N}]/u.test(w)).length;

function check(value, path) {
  if (typeof value !== 'string' || !value.trim()) return;
  const key = path[path.length - 1];
  const parentKey = path.findLast((p) => typeof p === 'string' && !/^\d+$/.test(p));
  const where = path.join('.');
  const exempt = path.some((p) => EXEMPT.has(p));
  const isUrl = /^(https?:|mailto:|tel:|\/)/.test(value);

  if (!isUrl) {
    if (BANNED.test(value) && !path.includes('note'))
      problems.push(`${where}: banned word "${value.match(BANNED)[0]}"`);
    if (SUPERLATIVE.test(value) && !exempt)
      problems.push(`${where}: superlative "${value.match(SUPERLATIVE)[0]}" needs a citable source`);
    if (OLD_TYPOS.test(value)) problems.push(`${where}: old typo "${value.match(OLD_TYPOS)[0]}"`);
  }
  if (exempt || isUrl) return;

  if (path.includes('meta')) {
    if (key === 'title' && value.length > 60) problems.push(`${where}: SEO title ${value.length} chars (max 60)`);
    if (key === 'description' && (value.length < 70 || value.length > 160))
      problems.push(`${where}: meta description ${value.length} chars (70–160)`);
    return;
  }
  const limit = /^\d+$/.test(String(key)) ? (LIMITS[parentKey] ?? 20) : LIMITS[key];
  if (limit && words(value) > limit) problems.push(`${where}: ${words(value)} words (max ${limit}): "${value}"`);
}

function walk(node, path) {
  if (typeof node === 'string') return check(node, path);
  if (Array.isArray(node)) return node.forEach((v, i) => walk(v, [...path, String(i)]));
  if (node && typeof node === 'object') for (const [k, v] of Object.entries(node)) walk(v, [...path, k]);
}

for (const [name, value] of Object.entries(content)) walk(value, [name]);
// Interface strings: banned words and typos only.
(function walkUi(node, path) {
  if (typeof node === 'string') {
    if (BANNED.test(node)) problems.push(`ui.${path.join('.')}: banned word "${node.match(BANNED)[0]}"`);
  } else if (node && typeof node === 'object') for (const [k, v] of Object.entries(node)) walkUi(v, [...path, k]);
})(ui, []);

if (problems.length) {
  console.error(`Copy lint: ${problems.length} problem(s)\n` + problems.map((p) => '  - ' + p).join('\n'));
  process.exit(1);
}
console.log('Copy lint: all strings pass (lengths, banned words, superlatives, typos, SEO lengths).');
