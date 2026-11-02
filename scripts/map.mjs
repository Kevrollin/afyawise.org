// Builds the small SVG path data for the "where we work" locator map (Kenya → Meru County → Karama).
// Boundaries: geoBoundaries gbOpen KEN ADM0/ADM1 (source RCMRD GeoPortal, public domain).
// Karama point: OpenStreetMap Nominatim ("KARAMA, Tigania East, Meru"), © OpenStreetMap contributors.
// Output is committed; re-run only to change simplification.  Usage: npm run map
import fs from 'node:fs/promises';
import path from 'node:path';

const CACHE = path.resolve('node_modules/.cache/geo');
const SOURCES = {
  adm0: 'https://github.com/wmgeolab/geoBoundaries/raw/main/releaseData/gbOpen/KEN/ADM0/geoBoundaries-KEN-ADM0_simplified.geojson',
  adm1: 'https://github.com/wmgeolab/geoBoundaries/raw/main/releaseData/gbOpen/KEN/ADM1/geoBoundaries-KEN-ADM1_simplified.geojson',
};
const KARAMA = { lat: 0.2425229, lon: 37.828721 };
const OUT = 'src/assets/geo/locator.json';

async function load(name) {
  const file = path.join(CACHE, `${name}.geojson`);
  try {
    return JSON.parse(await fs.readFile(file, 'utf8'));
  } catch {
    const res = await fetch(SOURCES[name]);
    if (!res.ok) throw new Error(`${name}: HTTP ${res.status}`);
    const text = await res.text();
    await fs.mkdir(CACHE, { recursive: true });
    await fs.writeFile(file, text);
    return JSON.parse(text);
  }
}

const ringsOf = (geom) =>
  geom.type === 'Polygon' ? geom.coordinates : geom.type === 'MultiPolygon' ? geom.coordinates.flat() : [];

// Douglas–Peucker simplification on [lon, lat] points.
function simplify(points, tol) {
  if (points.length < 3) return points;
  const sq = tol * tol;
  const keep = new Uint8Array(points.length);
  keep[0] = keep[points.length - 1] = 1;
  const stack = [[0, points.length - 1]];
  while (stack.length) {
    const [a, b] = stack.pop();
    const [ax, ay] = points[a];
    const [bx, by] = points[b];
    let maxD = 0;
    let idx = -1;
    for (let i = a + 1; i < b; i++) {
      const [px, py] = points[i];
      const dx = bx - ax;
      const dy = by - ay;
      const t = dx || dy ? Math.max(0, Math.min(1, ((px - ax) * dx + (py - ay) * dy) / (dx * dx + dy * dy))) : 0;
      const ex = ax + t * dx - px;
      const ey = ay + t * dy - py;
      const d = ex * ex + ey * ey;
      if (d > maxD) [maxD, idx] = [d, i];
    }
    if (maxD > sq) {
      keep[idx] = 1;
      stack.push([a, idx], [idx, b]);
    }
  }
  return points.filter((_, i) => keep[i]);
}

function projector(bbox, width, pad) {
  const [minLon, minLat, maxLon, maxLat] = bbox;
  const k = (width - 2 * pad) / (maxLon - minLon); // equirectangular; Kenya straddles the equator
  const height = Math.round((maxLat - minLat) * k + 2 * pad);
  return {
    width,
    height,
    xy: ([lon, lat]) => [+(pad + (lon - minLon) * k).toFixed(1), +(pad + (maxLat - lat) * k).toFixed(1)],
  };
}

function bboxOf(rings) {
  const b = [Infinity, Infinity, -Infinity, -Infinity];
  for (const r of rings)
    for (const [x, y] of r) {
      b[0] = Math.min(b[0], x);
      b[1] = Math.min(b[1], y);
      b[2] = Math.max(b[2], x);
      b[3] = Math.max(b[3], y);
    }
  return b;
}

const toPath = (rings, proj, tol) =>
  rings
    .map((r) => simplify(r, tol))
    .filter((r) => r.length > 3)
    .map((r) => 'M' + r.map((p) => proj.xy(p).join(' ')).join('L') + 'Z')
    .join('');

const adm0 = await load('adm0');
const adm1 = await load('adm1');
const kenyaRings = adm0.features.flatMap((f) => ringsOf(f.geometry));
const meru = adm1.features.find((f) => f.properties.shapeName === 'Meru');
const meruRings = ringsOf(meru.geometry);

// Kenya inset with Meru highlighted.
const kenyaProj = projector(bboxOf(kenyaRings), 240, 6);
// Zoomed Meru with the Karama pin.
const meruProj = projector(bboxOf(meruRings), 480, 16);

const result = {
  attribution:
    'Boundaries: geoBoundaries (RCMRD GeoPortal), public domain. Karama location: © OpenStreetMap contributors.',
  kenya: {
    width: kenyaProj.width,
    height: kenyaProj.height,
    outline: toPath(kenyaRings, kenyaProj, 0.03),
    meru: toPath(meruRings, kenyaProj, 0.03),
  },
  meru: {
    width: meruProj.width,
    height: meruProj.height,
    outline: toPath(meruRings, meruProj, 0.004),
    karama: meruProj.xy([KARAMA.lon, KARAMA.lat]),
  },
};
await fs.mkdir(path.dirname(OUT), { recursive: true });
await fs.writeFile(OUT, JSON.stringify(result) + '\n');
const kb = (Buffer.byteLength(JSON.stringify(result)) / 1024).toFixed(1);
console.log(
  `${OUT}: ${kb} KB (kenya ${result.kenya.width}x${result.kenya.height}, meru ${result.meru.width}x${result.meru.height}, karama ${result.meru.karama})`,
);
