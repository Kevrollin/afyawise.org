import type { Partner, Person, Metric } from '../types.ts';

/** Governance structure as published on live /team (2 Nov 2026). Typos fixed ("Nutritionz", etc.). */
export const governance = {
  intro: 'Members elect the leadership. A secretariat runs programs. Government and health experts advise.',
  bodies: [
    {
      id: 'general-assembly',
      title: 'General Assembly',
      text: 'All registered members. Approves policies, budgets and reports, and elects the Executive Committee.',
      roles: [] as string[],
    },
    {
      id: 'executive-committee',
      title: 'Executive Committee',
      text: 'Strategic oversight and compliance. Sets policy, approves plans and supervises the Secretariat.',
      roles: [
        'Chairperson',
        'Vice-Chairperson',
        'Secretary',
        'Treasurer',
        'Legal representative',
        'Technical representative',
        'Community representative',
      ],
    },
    {
      id: 'secretariat',
      title: 'Secretariat',
      text: 'Led by the Executive Director. Runs daily management and program delivery.',
      roles: [
        'Executive Director',
        'Program Area Manager (Health and Nutrition)',
        'Program Coordinators (Nutrition and Health Activities)',
        'WASH Officer',
        'Mental Health and Persons Living with Disability Officer',
        'MEAL Officer (monitoring, evaluation, accountability and learning)',
        'Finance and Administration Officer',
        'Community Liaison Officer',
      ],
    },
    {
      id: 'community',
      title: 'Community structures',
      text: 'Mobilise households, deliver services and keep programs grounded in the community.',
      roles: ['Community Health Promoters', 'Mental Health Leaders', 'WASH Champions and Patrons'],
    },
  ],
  advisory: {
    id: 'joint-coordination-committee',
    title: 'Joint Coordination Committee',
    text: 'Co-opted advisers who give policy advice, support mobilisation and build community trust.',
    roles: ['Government representatives', 'Ministry of Health', 'Technical experts'],
  },
};

/**
 * Leadership. Names, bios and photos are TODO_CONFIRM: cards render only for confirmed people
 * (photos need written consent).
 */
export const people: Person[] = [
  { name: null, role: 'Chairperson', bio: null, photo: null, status: 'TODO_CONFIRM' },
  { name: null, role: 'Executive Director', bio: null, photo: null, status: 'TODO_CONFIRM' },
  { name: null, role: 'Treasurer', bio: null, photo: null, status: 'TODO_CONFIRM' },
  { name: null, role: 'MEAL Officer', bio: null, photo: null, status: 'TODO_CONFIRM' },
];

/** Partners render only with a confirmed name AND written permission to show the logo. None yet. */
export const partners: Partner[] = [];

/**
 * Impact figures from the live site. They conflict with each other ("1,000+ lives" vs "hundreds of
 * community members"; "200+ health workers trained" vs a target of 100 in year one; "thousands of
 * supporters") and have no date or method. All stay hidden until the team confirms them.
 */
export const metrics: Metric[] = [
  {
    id: 'people-reached',
    value: 1000,
    suffix: '+',
    label: 'people reached',
    asOf: null,
    method: null,
    status: 'TODO_CONFIRM',
    note: 'Live /support says "1,000+ Lives Impacted"; /about and / say "hundreds of community members". Confirm number, date and how counted.',
  },
  {
    id: 'communities',
    value: 2,
    label: 'communities served',
    asOf: null,
    method: null,
    status: 'TODO_CONFIRM',
    note: 'Live /support. Name the communities (villages or sub-locations).',
  },
  {
    id: 'trained',
    value: 200,
    suffix: '+',
    label: 'health workers trained',
    asOf: null,
    method: null,
    status: 'TODO_CONFIRM',
    note: 'Live /support. Conflicts with the year-one target of 100. Confirm who was trained, when, in what.',
  },
  {
    id: 'satisfaction',
    value: 95,
    suffix: '%',
    label: 'satisfaction rate',
    asOf: null,
    method: null,
    status: 'TODO_CONFIRM',
    note: 'Live /support. No survey method given; drop unless a dated survey exists.',
  },
];
