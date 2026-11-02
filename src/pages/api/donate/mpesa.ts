import type { APIRoute } from 'astro';
import { z } from 'astro/zod';
import { normaliseKenyanPhone, stkEnabled, stkPush } from '../../../lib/payments/mpesa.ts';
import { allow } from '../../../lib/rate-limit.ts';

export const prerender = false;

const schema = z.object({
  phone: z.string().trim().min(9).max(20),
  amount: z.coerce.number().int().min(10).max(150000),
});

const wantsJson = (request: Request) => (request.headers.get('accept') ?? '').includes('application/json');

export const POST: APIRoute = async ({ request, url }) => {
  const reply = (status: number, body: Record<string, unknown>, redirect: string) =>
    wantsJson(request) ? Response.json(body, { status }) : Response.redirect(new URL(redirect, url), 303);

  if (!stkEnabled()) return reply(503, { ok: false, code: 'unavailable' }, '/donate?mpesa=unavailable#mpesa');
  const client = request.headers.get('x-real-ip') ?? request.headers.get('x-forwarded-for') ?? 'unknown';
  if (!(await allow('donate-mpesa', client, 10)))
    return reply(429, { ok: false, code: 'rate_limited' }, '/donate?mpesa=rate_limited#mpesa');

  const parsed = schema.safeParse(Object.fromEntries(await request.formData()));
  const phone = parsed.success ? normaliseKenyanPhone(parsed.data.phone) : null;
  if (!parsed.success || !phone) return reply(422, { ok: false, code: 'invalid' }, '/donate?mpesa=invalid#mpesa');

  try {
    await stkPush({ phone, amount: parsed.data.amount, callbackBase: url.origin });
    return reply(
      200,
      { ok: true, message: 'Check your phone and enter your M-Pesa PIN to complete the gift.' },
      '/donate/thank-you?method=mpesa',
    );
  } catch (err) {
    console.error('[donate:mpesa]', err instanceof Error ? err.message : err);
    return reply(502, { ok: false, code: 'error' }, '/donate?mpesa=error#mpesa');
  }
};
