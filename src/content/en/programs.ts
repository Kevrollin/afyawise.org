import type { Program, Target } from '../types.ts';

/**
 * The five programs. Goals and activities are AfyaWise's own (live /work and home page, 2 Nov 2026),
 * edited for clarity. "Community Health Volunteers" are now Community Health Promoters (PHC Act 2023).
 */
export const programs: Program[] = [
  {
    slug: 'maternal-child-health',
    title: 'Maternal & child health',
    icon: 'baby',
    summary: 'Education, nutrition and immunisation support so mothers and babies get care before and after birth.',
    headline: 'Care for mothers and babies, on time',
    intro: 'Most Meru mothers give birth in a facility. Many miss the visits before and after. We help close that gap.',
    need: ['anc4', 'postnatal', 'stunting'],
    goal: 'Increase access to quality prenatal, antenatal and postnatal care by 40% within two years.',
    activities: [
      'Community education for mothers and families',
      'Nutrition programs for mothers and young children',
      'Immunisation campaigns',
      'Safe motherhood initiatives',
    ],
    activitiesNote:
      'Taken from the live home page description. The live /work list for this program was a copy of the Community Wellness list. Confirm.',
    targets: ['anc-pnc-access', 'childhood-illness'],
    status: 'confirmed',
  },
  {
    slug: 'water-sanitation-hygiene',
    title: 'Water, sanitation & hygiene',
    icon: 'droplets',
    summary:
      'Safe water, latrines and handwashing at home and in schools, to prevent diarrhoea and other waterborne disease.',
    headline: 'Safe water and sanitation, household by household',
    intro:
      'Nearly 4 in 10 Meru households lack improved sanitation. We work with families and schools on water, latrines and handwashing.',
    need: ['sanitation', 'handwashing', 'ors'],
    goal: 'Strengthen household and school hygiene practices.',
    activities: [
      'Hygiene education forums',
      'Water treatment supplies for households',
      'Safe water storage and sanitation promotion',
      'Support for handwashing stations and latrine construction',
    ],
    targets: ['wash-households'],
    status: 'confirmed',
  },
  {
    slug: 'mental-health-disability',
    title: 'Mental health & disability',
    icon: 'heart-handshake',
    summary: 'Anti-stigma forums, support groups and referral pathways for people with mental illness or disability.',
    headline: 'Mental health and disability support, close to home',
    intro:
      'One in ten people in Kenya lives with a common mental disorder. We bring support and referral into the community.',
    need: ['mentalHealth', 'disability', 'mentalHealthTarget'],
    goal: 'Enhance mental health services and support persons living with disabilities.',
    activities: [
      'Anti-stigma awareness forums',
      'Community support groups',
      'Mental health first aid training for caregivers, teachers and promoters',
      'Referral pathways to mental health services',
    ],
    targets: ['mh-support-groups'],
    status: 'confirmed',
  },
  {
    slug: 'health-education',
    title: 'Health education & wellness',
    icon: 'megaphone',
    summary: 'Health forums, screening days and radio talks with schools, churches and local leaders.',
    headline: 'Prevention starts with what people know',
    intro: 'Health forums, screening days and radio sessions help families prevent illness and seek care early.',
    need: ['ncdTarget', 'diarrhoea'],
    goal: 'Promote community wellness and preventive health care.',
    activities: [
      'Public health awareness forums',
      'Health screenings and community wellness days',
      'Health education with schools, churches and local leaders',
      'Radio and public forums for wide reach',
    ],
    targets: [],
    status: 'confirmed',
  },
  {
    slug: 'community-health-promoters',
    title: 'Community Health Promoters',
    icon: 'users',
    summary: 'Training, kits, mentoring and supervision for the promoters who visit households.',
    headline: 'Backing the promoters who visit households',
    intro:
      'Community Health Promoters (CHPs), formerly Community Health Volunteers, link Kenyan households to care. We train and support them.',
    need: ['workforce', 'chpsKenya', 'meruChpPlan'],
    goal: 'Build the skills of Community Health Promoters and local leaders.',
    activities: [
      'Training in integrated health promotion',
      'Reporting tools, kits and mentorship',
      'Regular refresher training',
      'Supervision and recognition systems',
    ],
    targets: ['train-chps'],
    status: 'confirmed',
  },
];

/**
 * AfyaWise's stated objectives (live /about, 2 Nov 2026), shown as TARGETS, never as results.
 * Start dates, baselines and progress are TODO_CONFIRM and stay hidden until supplied.
 */
export const targets: Target[] = [
  {
    id: 'anc-pnc-access',
    program: 'maternal-child-health',
    statement:
      'Increase access to quality prenatal, antenatal and postnatal care for women of reproductive age in target communities by 40%.',
    timeframe: 'Within two years',
    startDate: null,
    baseline: null,
    progress: null,
    status: 'confirmed',
  },
  {
    id: 'childhood-illness',
    program: 'maternal-child-health',
    statement:
      'Reduce common childhood illnesses (diarrhoea, pneumonia and malnutrition) by 30% through community nutrition and immunisation programs.',
    timeframe: 'Within 24 months',
    startDate: null,
    baseline: null,
    progress: null,
    status: 'confirmed',
  },
  {
    id: 'mh-support-groups',
    program: 'mental-health-disability',
    statement:
      'Set up and support at least five community mental health support groups, with referral systems for early diagnosis and treatment.',
    timeframe: 'Within one year',
    startDate: null,
    baseline: null,
    progress: null,
    status: 'confirmed',
  },
  {
    id: 'wash-households',
    program: 'water-sanitation-hygiene',
    statement:
      'Increase the share of households practising safe water handling, proper sanitation and handwashing with soap by 50% in project areas.',
    timeframe: 'Within 18 months',
    startDate: null,
    baseline: null,
    progress: null,
    status: 'confirmed',
  },
  {
    id: 'train-chps',
    program: 'community-health-promoters',
    statement:
      'Train 100 Community Health Promoters and local leaders in integrated health promotion: maternal, child and mental health, and WASH.',
    timeframe: 'By the end of the first project year',
    startDate: null,
    baseline: null,
    progress: null,
    status: 'confirmed',
  },
];

/**
 * Listed only on the live /about page, with no goal or activities (assumption A2). Not rendered.
 */
export const draftPrograms = [
  {
    title: 'Environmental health advocacy',
    status: 'TODO_CONFIRM' as const,
    note: 'Confirm goal, activities and whether this is active.',
  },
];

/** How AfyaWise works with partners (live /work "Partnerships & Resource Mobilization"; assumption A1). */
export const partnershipApproach = {
  title: 'How we work with partners',
  goal: 'Strengthen partnerships across sectors to sustain health programs.',
  activities: [
    'Engage government health officers and community leaders',
    'Partner with NGOs, CBOs, faith-based organisations and schools',
    'Bring in technical advisers and donors',
    'Form joint coordination committees',
  ],
};
