import type { Project } from '../types.ts';
import { sources } from './need.ts';

/**
 * Fundable projects: AfyaWise's stated future plans (live home and /work, 2 Nov 2026), framed for funders.
 * Needs are tied to cited data where one exists; outcomes are qualitative; no budget is invented.
 * "Stronger partnerships with international organisations" is a goal, not a project (assumption A5).
 */
export const projects: Project[] = [
  {
    slug: 'learning-centre',
    title: 'Community health learning centre',
    icon: 'building',
    need: 'Meru plans to recruit and train 500 more Community Health Promoters by 2027. Training needs a local base.',
    needSource: { ...sources.cidp, locator: 'p. 306' },
    plan: 'A centre to train promoters, caregivers and youth, with counselling space and safe storage for health supplies.',
    outcome: 'Promoters trained close to home, counselling within reach, and supplies stored safely.',
    budget: { amountKES: null, status: 'TODO_CONFIRM' },
    note: 'Confirm location, size, build vs rent, running costs and budget.',
    status: 'confirmed',
  },
  {
    slug: 'promoter-income',
    title: 'Income projects for promoters',
    icon: 'sprout',
    need: 'Promoters receive a KSh 5,000 monthly stipend, shared by national and county government.',
    needSource: sources.stipend,
    plan: 'Small enterprises run by promoters: poultry, beekeeping, kitchen gardens and sanitary pad production.',
    outcome: 'Extra household income that helps promoters keep serving their villages.',
    budget: { amountKES: null, status: 'TODO_CONFIRM' },
    note: 'Confirm who owns the enterprises and where income goes. AfyaWise cannot offer equity or financial returns.',
    status: 'confirmed',
  },
  {
    slug: 'health-reporting-app',
    title: 'Health reporting app',
    icon: 'smartphone',
    need: 'Promoters need fast ways to report disease, refer patients and confirm they reached care.',
    plan: 'A mobile tool for disease reporting and referral follow-up that works alongside Kenya’s national eCHIS, in line with the Digital Health Act 2023.',
    outcome: 'Faster referrals, fewer lost follow-ups and better data for county planning.',
    budget: { amountKES: null, status: 'TODO_CONFIRM' },
    note: 'Confirm scope against eCHIS (Ministry of Health) to avoid a parallel system; confirm data-protection approach.',
    status: 'confirmed',
  },
  {
    slug: 'mobile-clinics',
    title: 'Mobile health clinics',
    icon: 'truck',
    need: '41% of Meru mothers get no postnatal check in the two days after birth.',
    needSource: sources.kdhs,
    plan: 'Outreach clinics that bring screening, antenatal, postnatal and child health checks to remote villages.',
    outcome: 'More mothers and children checked on time, closer to home.',
    budget: { amountKES: null, status: 'TODO_CONFIRM' },
    note: 'Confirm clinical partner (county health team or licensed provider), staffing and vehicle plan.',
    status: 'confirmed',
  },
  {
    slug: 'school-youth-health',
    title: 'School and youth health education',
    icon: 'graduation-cap',
    need: 'Meru’s county plan names teenage pregnancy, HIV and gender-based violence as a “triple threat”.',
    needSource: { ...sources.cidp, locator: 'p. 139' },
    plan: 'Health sessions in schools and youth groups on prevention, nutrition and hygiene.',
    outcome: 'Young people who know how to protect their health and where to get care.',
    budget: { amountKES: null, status: 'TODO_CONFIRM' },
    note: 'Confirm schools reached and session plan.',
    status: 'confirmed',
  },
];
