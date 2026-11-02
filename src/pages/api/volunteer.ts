import type { APIRoute } from 'astro';
import { handleForm, lines } from '../../lib/forms/handle.ts';
import { volunteerSchema } from '../../lib/forms/schemas.ts';
import { availabilityOptions, labelOf, volunteerSkills } from '../../lib/forms/options.ts';
import { inboxFor } from '../../lib/forms/routing.ts';

export const prerender = false;

export const POST: APIRoute = (ctx) =>
  handleForm(ctx, {
    form: 'volunteer',
    schema: volunteerSchema,
    multi: ['skills'],
    compose: (d, meta) => ({
      to: inboxFor('volunteer'),
      replyTo: d.email,
      subject: `[Website · Volunteer] ${d.name}, ${d.location}`,
      text: [
        lines([
          ['Name', d.name],
          ['Email', d.email],
          ['Phone', d.phone],
          ['Location', d.location],
          ['Skills', d.skills.map((s) => labelOf(volunteerSkills, s))],
          ['Availability', labelOf(availabilityOptions, d.availability)],
          ['Hours per month', d.hours === '' ? undefined : d.hours],
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
