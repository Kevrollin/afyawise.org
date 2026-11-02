/**
 * Fixed-window rate limit per client and form. Uses Upstash Redis (REST) when configured, so the
 * limit holds across serverless instances; otherwise falls back to per-instance memory (best effort).
 */
import { RATE_LIMIT_PER_HOUR, UPSTASH_REDIS_REST_TOKEN, UPSTASH_REDIS_REST_URL } from 'astro:env/server';

const WINDOW_SECONDS = 3600;
const memory = new Map<string, { count: number; resetAt: number }>();

async function hash(value: string) {
  const data = new TextEncoder().encode(value);
  const digest = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(digest).slice(0, 12), (b) => b.toString(16).padStart(2, '0')).join('');
}

/** Returns true when the request is allowed. Keys are hashed: no raw IPs are stored. */
export async function allow(form: string, clientId: string, limit = RATE_LIMIT_PER_HOUR): Promise<boolean> {
  const key = `rl:${form}:${await hash(clientId)}`;

  if (UPSTASH_REDIS_REST_URL && UPSTASH_REDIS_REST_TOKEN) {
    try {
      const res = await fetch(`${UPSTASH_REDIS_REST_URL}/pipeline`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${UPSTASH_REDIS_REST_TOKEN}` },
        body: JSON.stringify([
          ['INCR', key],
          ['EXPIRE', key, String(WINDOW_SECONDS), 'NX'],
        ]),
      });
      if (res.ok) {
        const [incr] = (await res.json()) as [{ result: number }];
        return incr.result <= limit;
      }
    } catch {
      // Fall through to memory if Redis is unreachable; never block genuine enquiries on an outage.
    }
  }

  const now = Date.now();
  const entry = memory.get(key);
  if (!entry || entry.resetAt < now) {
    memory.set(key, { count: 1, resetAt: now + WINDOW_SECONDS * 1000 });
    if (memory.size > 5000) for (const [k, v] of memory) if (v.resetAt < now) memory.delete(k);
    return true;
  }
  entry.count += 1;
  return entry.count <= limit;
}
