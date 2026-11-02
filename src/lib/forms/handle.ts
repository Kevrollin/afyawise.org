/**
 * Shared POST handler for the website forms: spam traps, rate limit, server-side validation,
 * delivery, and the right response for both fetch (JSON) and plain HTML form posts (303 redirect).
 */
import type { APIContext } from 'astro';
import type { z } from 'astro/zod';
import { sendMail, MailNotConfiguredError, type Mail } from '../mail.ts';
import { allow } from '../rate-limit.ts';
import { getContent } from '../../content/index.ts';

const MIN_FILL_MS = 2500;

interface Options<S extends z.ZodType> {
  form: 'contact' | 'proposal' | 'volunteer';
  schema: S;
  /** Fields that can appear more than once (checkbox groups). */
  multi?: string[];
  compose: (data: z.infer<S>, meta: { page: string; when: string }) => Mail;
}

const wantsJson = (request: Request) => (request.headers.get('accept') ?? '').includes('application/json');

function respond(request: Request, status: number, body: Record<string, unknown>, redirectTo: string) {
  if (wantsJson(request)) return Response.json(body, { status, headers: { 'Cache-Control': 'no-store' } });
  return new Response(null, { status: 303, headers: { Location: redirectTo, 'Cache-Control': 'no-store' } });
}

export async function handleForm<S extends z.ZodType>(ctx: APIContext, opts: Options<S>): Promise<Response> {
  const { request } = ctx;
  const ok = `/thanks?form=${opts.form}`;
  const fail = `/form-error?form=${opts.form}`;
  const { org } = getContent();

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return respond(request, 400, { ok: false, message: 'Invalid form submission.' }, fail);
  }

  // Spam traps: a filled honeypot or an impossibly fast submission gets a quiet "success".
  const honeypot = String(form.get('website') ?? '');
  const started = Number(form.get('ts') ?? 0);
  if (honeypot || (started && Date.now() - started < MIN_FILL_MS)) {
    return respond(request, 200, { ok: true }, ok);
  }

  const client =
    request.headers.get('x-real-ip') ??
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    (() => {
      try {
        return ctx.clientAddress;
      } catch {
        return 'unknown';
      }
    })();
  if (!(await allow(opts.form, client))) {
    return respond(
      request,
      429,
      { ok: false, code: 'rate_limited', message: `Too many messages. Please email ${org.email.general}.` },
      fail,
    );
  }

  const raw: Record<string, unknown> = {};
  for (const key of new Set(form.keys())) {
    if (key === 'website' || key === 'ts') continue;
    raw[key] = opts.multi?.includes(key) ? form.getAll(key).map(String) : String(form.get(key) ?? '');
  }
  for (const key of opts.multi ?? []) raw[key] ??= [];

  const parsed = opts.schema.safeParse(raw);
  if (!parsed.success) {
    const errors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const field = String(issue.path[0] ?? 'form');
      errors[field] ??= issue.message;
    }
    return respond(request, 422, { ok: false, code: 'invalid', errors }, fail);
  }

  try {
    const page = request.headers.get('referer') ?? '';
    const when = new Date().toISOString();
    await sendMail(opts.compose(parsed.data, { page, when }));
  } catch (err) {
    console.error(`[forms:${opts.form}]`, err instanceof Error ? err.message : err);
    const status = err instanceof MailNotConfiguredError ? 503 : 502;
    return respond(
      request,
      status,
      { ok: false, code: 'delivery_failed', message: `Please email ${org.email.general}.` },
      fail,
    );
  }
  return respond(request, 200, { ok: true }, ok);
}

/** Plain-text email body: one "Label: value" line per field. */
export function lines(entries: [string, string | string[] | number | undefined][]) {
  return entries
    .filter(([, v]) => v !== undefined && v !== '' && !(Array.isArray(v) && !v.length))
    .map(([k, v]) => `${k}: ${Array.isArray(v) ? v.join(', ') : v}`)
    .join('\n');
}
