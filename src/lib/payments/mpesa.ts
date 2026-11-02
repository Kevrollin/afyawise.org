/**
 * M-Pesa Daraja STK Push ("Lipa na M-Pesa Online") for Kenyan donors.
 * Enabled only when PUBLIC_DONATE_MPESA=stk and all MPESA_* credentials are set.
 * Docs: https://developer.safaricom.co.ke/APIs/MpesaExpressSimulate
 */
import {
  MPESA_CALLBACK_TOKEN,
  MPESA_CONSUMER_KEY,
  MPESA_CONSUMER_SECRET,
  MPESA_ENV,
  MPESA_PASSKEY,
  MPESA_SHORTCODE,
} from 'astro:env/server';
import { PUBLIC_DONATE_MPESA } from 'astro:env/client';

const base = () => (MPESA_ENV === 'production' ? 'https://api.safaricom.co.ke' : 'https://sandbox.safaricom.co.ke');

export const stkEnabled = () =>
  PUBLIC_DONATE_MPESA === 'stk' &&
  Boolean(MPESA_CONSUMER_KEY && MPESA_CONSUMER_SECRET && MPESA_SHORTCODE && MPESA_PASSKEY && MPESA_CALLBACK_TOKEN);

/** Kenyan mobile number → 2547XXXXXXXX / 2541XXXXXXXX, or null if invalid. */
export function normaliseKenyanPhone(input: string): string | null {
  const digits = input.replace(/[^\d]/g, '');
  const local = digits.startsWith('254') ? digits.slice(3) : digits.startsWith('0') ? digits.slice(1) : digits;
  return /^(7|1)\d{8}$/.test(local) ? `254${local}` : null;
}

/** Daraja expects the timestamp in Kenyan time: YYYYMMDDHHmmss. */
function timestamp(date = new Date()) {
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat('en-GB', {
      timeZone: 'Africa/Nairobi',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hourCycle: 'h23',
    })
      .formatToParts(date)
      .map((p) => [p.type, p.value]),
  );
  return `${parts.year}${parts.month}${parts.day}${parts.hour}${parts.minute}${parts.second}`;
}

async function token(): Promise<string> {
  const auth = btoa(`${MPESA_CONSUMER_KEY}:${MPESA_CONSUMER_SECRET}`);
  const res = await fetch(`${base()}/oauth/v1/generate?grant_type=client_credentials`, {
    headers: { Authorization: `Basic ${auth}` },
  });
  const json = (await res.json()) as { access_token?: string };
  if (!res.ok || !json.access_token) throw new Error(`Daraja auth failed (${res.status})`);
  return json.access_token;
}

export async function stkPush(input: { phone: string; amount: number; callbackBase: string }) {
  const ts = timestamp();
  const password = btoa(`${MPESA_SHORTCODE}${MPESA_PASSKEY}${ts}`);
  const res = await fetch(`${base()}/mpesa/stkpush/v1/processrequest`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${await token()}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      BusinessShortCode: MPESA_SHORTCODE,
      Password: password,
      Timestamp: ts,
      TransactionType: 'CustomerPayBillOnline',
      Amount: Math.round(input.amount),
      PartyA: input.phone,
      PartyB: MPESA_SHORTCODE,
      PhoneNumber: input.phone,
      CallBackURL: `${input.callbackBase}/api/webhooks/mpesa?token=${encodeURIComponent(MPESA_CALLBACK_TOKEN ?? '')}`,
      AccountReference: 'AfyaWise',
      TransactionDesc: 'Donation',
    }),
  });
  const json = (await res.json()) as { ResponseCode?: string; CustomerMessage?: string; errorMessage?: string };
  if (!res.ok || json.ResponseCode !== '0') throw new Error(`STK push failed: ${json.errorMessage ?? res.status}`);
  return json;
}

export const callbackTokenValid = (provided: string | null) =>
  Boolean(MPESA_CALLBACK_TOKEN) && provided === MPESA_CALLBACK_TOKEN;
