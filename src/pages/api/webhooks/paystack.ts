import type { APIRoute } from 'astro';
import { verifyPaystackSignature } from '../../../lib/payments/paystack.ts';
import { sendMail } from '../../../lib/mail.ts';
import { inboxFor } from '../../../lib/forms/routing.ts';

export const prerender = false;

/** Paystack webhook: verifies the signature, then tells finance about successful gifts. */
export const POST: APIRoute = async ({ request }) => {
  const raw = await request.text();
  if (!(await verifyPaystackSignature(raw, request.headers.get('x-paystack-signature')))) {
    return new Response('invalid signature', { status: 401 });
  }
  const event = JSON.parse(raw) as {
    event: string;
    data: {
      reference: string;
      amount: number;
      currency: string;
      paid_at?: string;
      customer?: { email?: string };
      metadata?: { designation?: string };
    };
  };
  if (event.event === 'charge.success') {
    const d = event.data;
    await sendMail({
      to: inboxFor('donate'),
      subject: `[Website · Card gift] ${d.currency} ${(d.amount / 100).toLocaleString('en-KE')}`,
      text: [
        `Amount: ${d.currency} ${(d.amount / 100).toFixed(2)}`,
        `Donor email: ${d.customer?.email ?? '-'}`,
        `Designation: ${d.metadata?.designation ?? '-'}`,
        `Reference: ${d.reference}`,
        `Paid at: ${d.paid_at ?? '-'}`,
        '',
        'Verify in the Paystack dashboard before thanking the donor.',
      ].join('\n'),
    }).catch((err) => console.error('[webhook:paystack] mail failed', err));
  }
  return new Response('ok');
};
