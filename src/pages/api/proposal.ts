import type { APIRoute } from 'astro';
import { handleForm, lines } from '../../lib/forms/handle.ts';
import { proposalSchema } from '../../lib/forms/schemas.ts';
import { budgetRanges, labelOf, proposalInterests } from '../../lib/forms/options.ts';
import { inboxFor } from '../../lib/forms/routing.ts';
import { getContent } from '../../content/index.ts';

export const prerender = false;

export const POST: APIRoute = (ctx) =>
  handleForm(ctx, {
    form: 'proposal',
    schema: proposalSchema,
    compose: (d, meta) => {
      const project =
        getContent().projects.find((p) => p.slug === d.project)?.title ??
        (d.project === 'not-sure' ? 'Not sure yet' : '');
      const program = getContent().programs.find((p) => p.slug === d.program)?.title ?? '';
      const isPartnership = ['program-partnership', 'corporate', 'in-kind'].includes(d.interest);
      return {
        to: inboxFor(isPartnership ? 'partner' : 'fund'),
        replyTo: d.email,
        subject: `[Website · Proposal request] ${d.organisation}${project ? ` · ${project}` : ''}`,
        text: [
          lines([
            ['Interest', labelOf(proposalInterests, d.interest)],
            ['Program', program],
            ['Project', project],
            ['Budget range', labelOf(budgetRanges, d.budget)],
            ['Timeline', d.timeline],
            ['Name', d.name],
            ['Organisation', d.organisation],
            ['Country', d.country],
            ['Email', d.email],
            ['Phone', d.phone],
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
      };
    },
  });
