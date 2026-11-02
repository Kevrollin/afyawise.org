import type { APIRoute } from 'astro';
import { handleForm, lines } from '../../lib/forms/handle.ts';
import { contactSchema } from '../../lib/forms/schemas.ts';
import { contactReasons, labelOf } from '../../lib/forms/options.ts';
import { inboxFor } from '../../lib/forms/routing.ts';

export const prerender = false;

export const POST: APIRoute = (ctx) =>
  handleForm(ctx, {
    form: 'contact',
    schema: contactSchema,
    compose: (d, meta) => ({
      to: inboxFor(d.reason),
      replyTo: d.email,
      subject: `[Website · ${labelOf(contactReasons, d.reason)}] ${d.subject}`,
      text: [
        lines([
          ['Reason', labelOf(contactReasons, d.reason)],
          ['Name', d.name],
          ['Email', d.email],
          ['Phone', d.phone],
          ['Organisation', d.organisation],
          ['Subject', d.subject],
        ]),
        '',
        d.message,
        '',
        lines([
          ['Sent from', meta.page],
          ['Received', meta.when],
          ['Consent to reply', 'yes'],
        ]),
      ].join('\n'),
    }),
  });
