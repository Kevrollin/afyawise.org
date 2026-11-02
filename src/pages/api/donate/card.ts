import type { APIRoute } from 'astro';
import { z } from 'astro/zod';
import { cardEnabled, CURRENCIES, initializeCardDonation, type Currency } from '../../../lib/payments/paystack.ts';
import { allow } from '../../../lib/rate-limit.ts';

export const prerender = false;

const schema = z
  .object({
    amount: z.coerce.number().positive(),
    currency: z.enum(['KES', 'USD']),
    email: z.string().trim().pipe(z.email()),
    designation: z.string().trim().max(80).optional().default('Where most needed'),
  })
  .refine((d) => d.amount >= CURRENCIES[d.currency as Currency].min, { message: 'Amount below minimum.' });

const json = (request: Request) => (request.headers.get('accept') ?? '').includes('application/json');

export const POST: APIRoute = async (ctx) => {
  const { request, url } = ctx;
  const back = (reason: string) =>
    json(request)
      ? Response.json({ ok: false, code: reason }, { status: reason === 'unavailable' ? 503 : 422 })
      : Response.redirect(new URL(`/donate?card=${reason}#card`, url), 303);

  if (!cardEnabled()) return back('unavailable');
  const client = request.headers.get('x-real-ip') ?? request.headers.get('x-forwarded-for') ?? 'unknown';
  if (!(await allow('donate-card', client, 20))) return back('rate_limited');

  const parsed = schema.safeParse(Object.fromEntries(await request.formData()));
  if (!parsed.success) return back('invalid');

  try {
    const checkout = await initializeCardDonation({
      ...parsed.data,
      currency: parsed.data.currency as Currency,
      callbackUrl: new URL('/donate/thank-you', url).href,
    });
    return json(request) ? Response.json({ ok: true, url: checkout }) : Response.redirect(checkout, 303);
  } catch (err) {
    console.error('[donate:card]', err instanceof Error ? err.message : err);
    return back('error');
  }
};
