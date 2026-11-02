import { z } from 'astro/zod';
import { en } from '../../i18n/en.ts';
import {
  availabilityOptions,
  budgetRanges,
  contactReasons,
  proposalInterests,
  values,
  volunteerSkills,
} from './options.ts';
import { getContent } from '../../content/index.ts';

const e = en.forms.errors;
const projectSlugs = getContent().projects.map((p) => p.slug);
const programSlugs = getContent().programs.map((p) => p.slug);

/** Limits here must match the maxlength/minlength/required attributes in the form markup. */
export const LIMITS = {
  name: 100,
  email: 200,
  phone: 30,
  org: 150,
  subject: 150,
  country: 80,
  location: 120,
  timeline: 80,
  messageMin: 10,
  message: 5000,
} as const;

/** HTML pattern for phone inputs (valid under the regex `v` flag browsers now use for `pattern`). */
export const PHONE_PATTERN = String.raw`\+?[0-9 \(\)\-]{7,}`;

const text = (max: number) => z.string().trim().min(1, e.required).max(max, e.tooLong);
const optionalText = (max: number) => z.string().trim().max(max, e.tooLong).optional().default('');
const email = z
  .string()
  .trim()
  .min(1, e.required)
  .max(LIMITS.email, e.tooLong)
  .pipe(z.email({ error: e.email }));
const phone = z
  .string()
  .trim()
  .min(1, e.required)
  .max(LIMITS.phone, e.tooLong)
  .regex(/^\+?[0-9 ()-]{7,}$/, e.phone);
const optionalPhone = z
  .union([z.literal(''), phone])
  .optional()
  .default('');
const consent = z.literal('yes', { error: e.consent });
const message = z.string().trim().min(LIMITS.messageMin, e.tooShort).max(LIMITS.message, e.tooLong);

export const contactSchema = z.object({
  name: text(LIMITS.name),
  email,
  phone: optionalPhone,
  organisation: optionalText(LIMITS.org),
  reason: z.enum(values(contactReasons), { error: e.choose }),
  subject: text(LIMITS.subject),
  message,
  consent,
});

export const proposalSchema = z.object({
  name: text(LIMITS.name),
  organisation: text(LIMITS.org),
  email,
  phone: optionalPhone,
  country: text(LIMITS.country),
  interest: z.enum(values(proposalInterests), { error: e.choose }),
  project: z
    .union([z.literal(''), z.literal('not-sure'), z.enum(projectSlugs as [string, ...string[]])])
    .optional()
    .default(''),
  program: z
    .union([z.literal(''), z.enum(programSlugs as [string, ...string[]])])
    .optional()
    .default(''),
  budget: z
    .union([z.literal(''), z.enum(values(budgetRanges))])
    .optional()
    .default(''),
  timeline: optionalText(LIMITS.timeline),
  message,
  consent,
});

export const volunteerSchema = z.object({
  name: text(LIMITS.name),
  email,
  phone,
  location: text(LIMITS.location),
  skills: z.array(z.enum(values(volunteerSkills))).min(1, e.choose),
  availability: z.enum(values(availabilityOptions), { error: e.choose }),
  hours: z
    .union([z.literal(''), z.coerce.number().int().min(1).max(200)])
    .optional()
    .default(''),
  message: z.string().trim().max(LIMITS.message, e.tooLong).optional().default(''),
  consent,
});

export type ContactData = z.infer<typeof contactSchema>;
export type ProposalData = z.infer<typeof proposalSchema>;
export type VolunteerData = z.infer<typeof volunteerSchema>;
