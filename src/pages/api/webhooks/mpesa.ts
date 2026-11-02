import type { APIRoute } from 'astro';
import { callbackTokenValid } from '../../../lib/payments/mpesa.ts';
import { sendMail } from '../../../lib/mail.ts';
import { inboxFor } from '../../../lib/forms/routing.ts';

export const prerender = false;

type Item = { Name: string; Value?: string | number };

/** Daraja STK callback (URL carries a secret token). Tells finance about completed gifts. */
export const POST: APIRoute = async ({ request, url }) => {
  if (!callbackTokenValid(url.searchParams.get('token'))) return new Response('forbidden', { status: 403 });
  const body = (await request.json().catch(() => null)) as {
    Body?: { stkCallback?: { ResultCode: number; ResultDesc: string; CallbackMetadata?: { Item: Item[] } } };
  } | null;
  const cb = body?.Body?.stkCallback;
  if (cb && cb.ResultCode === 0) {
    const meta = Object.fromEntries((cb.CallbackMetadata?.Item ?? []).map((i) => [i.Name, i.Value]));
    const phone = String(meta.PhoneNumber ?? '');
    await sendMail({
      to: inboxFor('donate'),
      subject: `[Website · M-Pesa gift] KES ${meta.Amount ?? '?'}`,
      text: [
        `Amount: KES ${meta.Amount ?? '-'}`,
        `M-Pesa receipt: ${meta.MpesaReceiptNumber ?? '-'}`,
        `Phone: ${phone ? phone.slice(0, 6) + '***' + phone.slice(-2) : '-'}`,
        `Date: ${meta.TransactionDate ?? '-'}`,
      ].join('\n'),
    }).catch((err) => console.error('[webhook:mpesa] mail failed', err));
  }
  return Response.json({ ResultCode: 0, ResultDesc: 'Accepted' });
};
