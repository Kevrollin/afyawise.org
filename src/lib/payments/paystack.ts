/**
 * Paystack (Kenya) for card donations: hosted checkout, so card data never touches this site.
 * Enabled only when PUBLIC_DONATE_CARD=paystack and PAYSTACK_SECRET_KEY is set.
 * Docs: https://paystack.com/docs/api/transaction/#initialize
 */
import { PAYSTACK_SECRET_KEY } from 'astro:env/server';
import { PUBLIC_DONATE_CARD } from 'astro:env/client';

export const cardEnabled = () => PUBLIC_DONATE_CARD === 'paystack' && Boolean(PAYSTACK_SECRET_KEY);

export const CURRENCIES = { KES: { min: 100 }, USD: { min: 5 } } as const;
export type Currency = keyof typeof CURRENCIES;

export async function initializeCardDonation(input: {
  email: string;
  amount: number;
  currency: Currency;
  designation: string;
  callbackUrl: string;
}): Promise<string> {
  const res = await fetch('https://api.paystack.co/transaction/initialize', {
    method: 'POST',
    headers: { Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: input.email,
      amount: Math.round(input.amount * 100), // subunits (cents)
      currency: input.currency,
      callback_url: input.callbackUrl,
      channels: ['card', 'apple_pay', 'mobile_money'],
      metadata: {
        designation: input.designation,
        custom_fields: [{ display_name: 'Designation', variable_name: 'designation', value: input.designation }],
      },
    }),
  });
  const json = (await res.json()) as { status: boolean; message: string; data?: { authorization_url: string } };
  if (!res.ok || !json.status || !json.data) throw new Error(`Paystack initialize failed: ${json.message}`);
  return json.data.authorization_url;
}

/** Verifies the x-paystack-signature header (HMAC-SHA512 of the raw body with the secret key). */
export async function verifyPaystackSignature(rawBody: string, signature: string | null): Promise<boolean> {
  if (!PAYSTACK_SECRET_KEY || !signature) return false;
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(PAYSTACK_SECRET_KEY),
    { name: 'HMAC', hash: 'SHA-512' },
    false,
    ['sign'],
  );
  const mac = new Uint8Array(await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(rawBody)));
  const hex = Array.from(mac, (b) => b.toString(16).padStart(2, '0')).join('');
  if (hex.length !== signature.length) return false;
  let diff = 0;
  for (let i = 0; i < hex.length; i++) diff |= hex.charCodeAt(i) ^ signature.charCodeAt(i);
  return diff === 0;
}
