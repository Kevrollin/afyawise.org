/**
 * Provider-agnostic email delivery for the website forms.
 * MAIL_PROVIDER=resend | postmark | log. "log" prints the message (development and tests) and is
 * refused on Vercel production so real enquiries can never be silently dropped.
 */
import { MAIL_PROVIDER, MAIL_API_KEY, MAIL_FROM } from 'astro:env/server';

export interface Mail {
  to: string;
  subject: string;
  text: string;
  replyTo?: string | undefined;
}

export class MailNotConfiguredError extends Error {}

export async function sendMail(mail: Mail): Promise<void> {
  const provider = MAIL_PROVIDER;
  if (provider === 'log') {
    if (process.env.VERCEL_ENV === 'production') {
      throw new MailNotConfiguredError('MAIL_PROVIDER=log is not allowed in production. Set resend or postmark.');
    }
    console.info(`[mail:log] to=${mail.to} reply-to=${mail.replyTo ?? '-'} subject=${mail.subject}\n${mail.text}`);
    return;
  }
  if (!MAIL_API_KEY) throw new MailNotConfiguredError(`MAIL_API_KEY is missing for ${provider}.`);

  const res =
    provider === 'resend'
      ? await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: { Authorization: `Bearer ${MAIL_API_KEY}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({
            from: MAIL_FROM,
            to: [mail.to],
            subject: mail.subject,
            text: mail.text,
            ...(mail.replyTo ? { reply_to: mail.replyTo } : {}),
          }),
        })
      : await fetch('https://api.postmarkapp.com/email', {
          method: 'POST',
          headers: {
            'X-Postmark-Server-Token': MAIL_API_KEY,
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          body: JSON.stringify({
            From: MAIL_FROM,
            To: mail.to,
            Subject: mail.subject,
            TextBody: mail.text,
            MessageStream: 'outbound',
            ...(mail.replyTo ? { ReplyTo: mail.replyTo } : {}),
          }),
        });
  if (!res.ok) {
    const body = await res.text().catch(() => '');
    throw new Error(`${provider} responded ${res.status}: ${body.slice(0, 300)}`);
  }
}
