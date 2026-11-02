import type { Source, Status } from '../types.ts';

/** Organisation facts. Source unless noted: live afyawise.org, captured 2 Nov 2026 (audit/content/). */
export const org = {
  name: 'AfyaWise',
  legalName: 'AfyaWise Community Based Organization',
  shortName: 'AfyaWise CBO',
  positioning: 'Community-led primary health care in Meru County.',
  /** Footer line under the logo. */
  tagline: 'Community-led primary health care in Meru County, Kenya.',
  location: {
    ward: 'Karama Ward',
    subCounty: 'Tigania East',
    county: 'Meru County',
    country: 'Kenya',
    countryCode: 'KE',
    full: 'Karama Ward, Tigania East, Meru County, Kenya',
    /** OpenStreetMap: "KARAMA, Tigania East, Meru". © OpenStreetMap contributors. */
    geo: { lat: 0.2425229, lon: 37.828721 },
  },
  email: {
    general: 'info@afyawise.org',
    programs: 'programs@afyawise.org',
    finance: 'finance@afyawise.org',
    executive: 'executive@afyawise.org',
  },
  phone: { display: '+254\u00a0798\u00a0724\u00a0766', href: 'tel:+254798724766', whatsapp: null as string | null }, // non-breaking spaces: the number never wraps
  /** Board-approved statements, kept verbatim (typos fixed only). Rewording proposed in CONTENT_NEEDED.md. */
  official: {
    vision: 'A healthy and informed society empowered to support County’s sustainable Health Coverage.',
    mission:
      'To enhance health literacy, advocate for equitable healthcare access, and implement sustainable health solutions within communities.',
  },
  values: [
    { name: 'Inclusivity', text: 'Embracing diversity and ensuring no one is left behind.' },
    { name: 'Transparency', text: 'Operating with openness and accountability.' },
    { name: 'Community-centered', text: 'Prioritizing the needs of the community in all activities.' },
    { name: 'Sustainability', text: 'Promoting lasting solutions to healthcare challenges.' },
    { name: 'Collaboration', text: 'Building partnerships with stakeholders to maximize impact.' },
  ],
  registration: {
    number: null as string | null,
    body: null as string | null,
    year: null as string | null,
    status: 'TODO_CONFIRM' as Status,
  },
  /** Office of the Data Protection Commissioner registration (likely required; see research §2). */
  dataProtectionRegistration: { number: null as string | null, status: 'TODO_CONFIRM' as Status },
  founded: { year: null as string | null, status: 'TODO_CONFIRM' as Status },
  socials: [] as { label: string; href: string }[],
};

/** Copied exactly from live /donate (2 Nov 2026). Finance to re-confirm before launch. */
export const bank = {
  bank: 'KCB',
  bankFull: 'KCB Bank Kenya',
  accountName: 'AfyaWise',
  accountNumber: '1343270596',
  branch: 'Maua',
  swift: { value: null as string | null, status: 'TODO_CONFIRM' as Status },
  branchCode: { value: null as string | null, status: 'TODO_CONFIRM' as Status },
  status: 'confirmed' as Status,
};

/** Documents and policies funders ask for (research §3). None is public yet. */
export const accountability = {
  annualReport: { url: null as string | null, year: null as string | null, status: 'TODO_CONFIRM' as Status },
  financialStatements: {
    url: null as string | null,
    year: null as string | null,
    audited: null as boolean | null,
    status: 'TODO_CONFIRM' as Status,
  },
  safeguarding: {
    policyUrl: null as string | null,
    /** Where concerns go. Should not route only to the Executive Director. */
    reportEmail: null as string | null,
    status: 'TODO_CONFIRM' as Status,
  },
  alignment: [
    {
      label: 'Kenya Primary Health Care Act, 2023',
      text: 'Community Health Promoters are part of Kenya’s primary health care workforce.',
      source: {
        label: 'Kenya Law',
        url: 'https://new.kenyalaw.org/akn/ke/act/2023/13/eng@2023-11-24',
      } satisfies Source,
    },
    {
      label: 'Meru County Integrated Development Plan 2023–2027',
      text: 'Targets for promoters, open-defecation-free villages and mental health care.',
      source: {
        label: 'Meru County Government',
        url: 'https://maarifa.cog.go.ke/sites/default/files/2024-06/MERU%20CIDP%202023-2027.pdf',
      } satisfies Source,
    },
    {
      label: 'SDG 3: Good health and well-being',
      text: 'Maternal and child health, mental health and primary care.',
      source: { label: 'United Nations', url: 'https://sdgs.un.org/goals/goal3' } satisfies Source,
    },
    {
      label: 'SDG 6: Clean water and sanitation',
      text: 'Safe water, sanitation and hygiene at home and in schools.',
      source: { label: 'United Nations', url: 'https://sdgs.un.org/goals/goal6' } satisfies Source,
    },
  ],
  /** How we measure (proposed policy, assumption A7 — founders to approve before launch). */
  measurementRules: [
    { title: 'Baseline first', text: 'We record where things stand before a project starts.' },
    { title: 'Counted, not estimated', text: 'People reached come from registers and referral records.' },
    { title: 'Dated and sourced', text: 'Every number we publish shows its date, source and method.' },
    { title: 'Targets stay targets', text: 'We label targets as targets until results are verified.' },
  ],
};
