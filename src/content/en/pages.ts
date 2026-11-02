import type { Faq } from '../types.ts';

/** Page copy. Field names drive the copy linter (see types.ts). */

export const home = {
  meta: {
    title: 'AfyaWise CBO | Community health in Meru County, Kenya',
    description:
      'AfyaWise trains Community Health Promoters in Karama Ward, Meru County, to reach families at home and link them to care. Fund or partner with us.',
  },
  hero: {
    headline: 'Healthier Meru, one household at a time.',
    intro:
      'We train Community Health Promoters in Karama Ward, Meru County, to reach families at home and link them to care.',
    primary: { label: 'Fund our work', href: '/partner' },
    secondary: { label: 'Partner with us', href: '/partner#request' },
    mapLabel: 'Karama Ward, Tigania East, Meru County, Kenya',
  },
  proof: {
    eyebrow: 'Results',
    headline: 'Our results so far',
  },
  need: {
    eyebrow: 'The need',
    headline: 'The gaps we work to close',
    intro:
      'Meru mothers reach facilities to give birth. Care before and after birth, nutrition and sanitation lag behind.',
  },
  programs: {
    eyebrow: 'What we do',
    headline: 'Five programs, one community model',
    intro: 'Each program runs through promoters who know the households they serve.',
    cta: { label: 'See all programs', href: '/programs' },
  },
  how: {
    eyebrow: 'How we work',
    headline: 'Train, reach, refer and follow up',
    steps: [
      { title: 'Train promoters', text: 'Community Health Promoters get training, kits, mentoring and supervision.' },
      {
        title: 'Reach households',
        text: 'Promoters visit families with health education, screening and support at home.',
      },
      {
        title: 'Refer and follow up',
        text: 'People who need care are referred to health facilities and followed up at home.',
      },
    ],
    meal: 'Monitoring, evaluation, accountability and learning (MEAL) is a named role in our team.',
    cta: { label: 'How we measure', href: '/impact#measure' },
  },
  projects: {
    eyebrow: 'Fund a project',
    headline: 'Five projects ready to scope with you',
    intro: 'Pick a project and request a concept note. We will agree the budget, targets and reporting with you.',
  },
  accountability: {
    eyebrow: 'Accountability',
    headline: 'How we stay accountable',
    intro: 'Elected leadership, published targets, and work aligned with national and county plans.',
  },
  partners: {
    eyebrow: 'Partners',
    headline: 'Who we work with',
  },
  cta: {
    headline: 'Help Meru families get care sooner',
    intro: 'Fund a project, partner with us or give today.',
  },
};

export const programsPage = {
  meta: {
    title: 'Programs | AfyaWise CBO, Meru County',
    description:
      'Maternal and child health, water and sanitation, mental health and disability, health education and Community Health Promoters in Meru County, Kenya.',
  },
  headline: 'Our programs',
  intro: 'Five programs, delivered through Community Health Promoters in Karama Ward, Meru County.',
};

export const programPage = {
  needHeadline: 'Why it matters',
  goalHeadline: 'Our goal',
  activitiesHeadline: 'What we do',
  targetsHeadline: 'Targets',
  targetsIntro: 'These are targets, not results. We publish progress once it is verified.',
  progressHeadline: 'Progress',
  storiesHeadline: 'Stories',
  otherHeadline: 'Other programs',
  ctaHeadline: 'Fund this program',
  ctaIntro: 'Request a concept note and budget, or give to support the work now.',
};

export const impactPage = {
  meta: {
    title: 'Impact and accountability | AfyaWise CBO',
    description:
      'AfyaWise targets, how we measure progress, and how our work aligns with Kenya’s Primary Health Care Act, Meru’s county plan and SDGs 3 and 6.',
  },
  headline: 'What we measure and report',
  intro: 'Our targets, how we measure progress, and how our work fits national and county plans.',
  results: { headline: 'Verified results' },
  targets: {
    headline: 'Our targets',
    intro: 'These are commitments, not results. We report progress once it is verified.',
  },
  measure: {
    headline: 'How we measure',
    intro: 'Four rules apply to every number we publish.',
  },
  alignment: {
    headline: 'Aligned with national and county plans',
    intro: 'Our programs support public priorities, so results add to the health system, not around it.',
  },
  evidence: {
    headline: 'The evidence behind our programs',
    intro: 'Public data from national surveys, the Ministry of Health and Meru’s county plan.',
  },
  reports: { headline: 'Reports and financials' },
};

export const partnerPage = {
  meta: {
    title: 'Fund or partner with AfyaWise | Community health in Meru',
    description:
      'Fund a community health project in Meru County, Kenya. Request a concept note and budget, see our governance and how we report.',
  },
  headline: 'Fund community health in Meru',
  intro:
    'Back a community-governed organisation aligned with county targets. Choose a project or fund our core programs.',
  why: {
    headline: 'Why fund AfyaWise',
    points: [
      {
        title: 'Based where the need is',
        text: 'We work in Karama Ward, Tigania East, through local promoters, mental health leaders and WASH champions.',
      },
      {
        title: 'Aligned with the county',
        text: 'Our programs support Meru’s 2023–2027 targets for promoters, open-defecation-free villages and mental health care.',
      },
      {
        title: 'Governed by members',
        text: 'Members elect our Executive Committee. A joint committee with government and the Ministry of Health advises us.',
      },
    ],
  },
  projects: {
    headline: 'Projects to fund',
    intro: 'Each project can be scoped to your budget and timeline.',
  },
  expect: {
    headline: 'What you can expect',
    items: [
      'A concept note and budget for the project you choose',
      'Targets, timelines and a reporting schedule agreed with you',
      'Reports that show the date, source and method of every figure',
      'A visit to Karama Ward, on request',
    ],
  },
  core: {
    headline: 'Prefer flexible funding?',
    text: 'Core funding trains and supervises promoters across all five programs.',
  },
  faqHeadline: 'Questions funders ask',
  form: {
    headline: 'Request a proposal',
    intro: 'Tell us what you would like to fund. We will reply with a concept note or a call.',
  },
};

export const donatePage = {
  meta: {
    title: 'Donate | AfyaWise CBO, Meru County, Kenya',
    description:
      'Give to community health work in Karama Ward, Meru County: bank transfer to AfyaWise at KCB Maua branch, M-Pesa and card.',
  },
  headline: 'Donate to AfyaWise',
  intro: 'Your gift funds community health work in Karama Ward, Meru County.',
  methodsHeadline: 'Ways to give',
  bank: {
    title: 'Bank transfer',
    text: 'Add your name as the payment reference so we can thank you.',
  },
  mpesa: {
    title: 'M-Pesa',
    text: 'Pay from your phone with M-Pesa.',
    stkText: 'Enter your Safaricom number. You will get a prompt to enter your M-Pesa PIN.',
    paybillText: 'Use Lipa na M-Pesa, Pay Bill, with these details.',
    requestText: 'Email us and we will send our M-Pesa details.',
    requestLabel: 'Request M-Pesa details',
  },
  card: {
    title: 'Card',
    text: 'Give by Visa or Mastercard through Paystack’s secure checkout.',
  },
  supports: {
    headline: 'What your gift supports',
    intro: 'Gifts fund our five programs. To fund a specific project, request a proposal.',
  },
  bigger: {
    headline: 'Giving as an organisation?',
    intro: 'Foundations and companies can fund a project and receive reports against agreed targets.',
  },
  thanks: {
    headline: 'Thank you for your gift',
    intro: 'Your payment is being confirmed. You will get a receipt by email (card) or SMS (M-Pesa).',
  },
};

export const getInvolvedPage = {
  meta: {
    title: 'Volunteer and get involved | AfyaWise CBO',
    description:
      'Volunteer with AfyaWise in Meru County: health education, administration, data, communications and more. Or fund, partner or donate.',
  },
  headline: 'Get involved',
  intro: 'Volunteer your skills, partner with us or give.',
  volunteer: {
    headline: 'Volunteer with us',
    intro: 'From health education to administrative support, tell us how you can help.',
  },
  other: {
    headline: 'Other ways to help',
    items: [
      {
        title: 'Fund or partner',
        text: 'Organisations can fund a project or partner on delivery.',
        href: '/partner',
        label: 'Fund or partner',
      },
      {
        title: 'Donate',
        text: 'Give by bank transfer today and support all five programs.',
        href: '/donate',
        label: 'Donate',
      },
    ],
  },
};

export const contactPage = {
  meta: {
    title: 'Contact | AfyaWise CBO, Karama Ward, Meru County',
    description:
      'Contact AfyaWise about funding, partnerships, volunteering, donations or media. Email info@afyawise.org or call +254 798 724 766.',
  },
  headline: 'Contact us',
  intro: 'Choose a reason so your message reaches the right person.',
  departmentsHeadline: 'Email a team directly',
  departments: [
    { label: 'General enquiries', key: 'general' },
    { label: 'Programs and volunteering', key: 'programs' },
    { label: 'Donations and finance', key: 'finance' },
    { label: 'Partnerships, funding and media', key: 'executive' },
  ] as const,
  visitHeadline: 'Where we are',
};

export const aboutPage = {
  meta: {
    title: 'About | AfyaWise Community Based Organization, Meru County',
    description:
      'AfyaWise is a community-based organisation in Karama Ward, Meru County, Kenya. Vision, mission, values, governance and how we work.',
  },
  headline: 'About AfyaWise',
  intro: 'A community-based organisation in Karama Ward, Meru County, working for healthier households.',
  who: {
    headline: 'Who we are',
    body: 'AfyaWise is a grassroots Community Based Organization in Karama Ward, Tigania East. We work on maternal and child health, WASH, mental health and disability inclusion, and health education.',
  },
  where: {
    headline: 'Where we work',
    body: 'Karama is one of five wards in Tigania East, Meru County’s least populated sub-county, with 72,549 people in the 2019 census.',
  },
  statementsHeadline: 'Vision, mission and values',
  governance: { headline: 'Leadership and governance' },
  people: { headline: 'Our leadership' },
  partners: { headline: 'How we work with partners' },
  accountability: {
    headline: 'Accountability',
    intro: 'What we publish, and how to raise a concern.',
  },
};

export const legal = {
  privacy: {
    meta: {
      title: 'Privacy policy | AfyaWise CBO',
      description:
        'How AfyaWise collects, uses and protects personal data under Kenya’s Data Protection Act 2019 and the GDPR.',
    },
    headline: 'Privacy policy',
  },
  terms: {
    meta: {
      title: 'Terms of use | AfyaWise CBO',
      description: 'Terms for using the AfyaWise website, including content, donations and links.',
    },
    headline: 'Terms of use',
  },
};

export const notFoundPage = {
  meta: {
    title: 'Page not found | AfyaWise CBO',
    description:
      'This page does not exist or has moved. Find AfyaWise programs, impact, funding and contact details here.',
  },
  headline: 'We can’t find that page',
  intro: 'It may have moved when we rebuilt the site. These pages will help.',
};

export const thanksPage = {
  meta: {
    title: 'Thank you | AfyaWise CBO',
    description: 'Thank you for contacting AfyaWise. Your message has been sent to our team in Meru County, Kenya.',
  },
  headline: 'Thank you. Your message is on its way.',
  intro: 'We have received it and will reply by email.',
};

export const formErrorPage = {
  meta: {
    title: 'Please check the form | AfyaWise CBO',
    description: 'Some details in the form were missing or invalid. Go back, check each field and send it again.',
  },
  headline: 'Please check the form',
  intro: 'Some details were missing or invalid. Go back, check each field and send it again.',
};

export const faqs: Faq[] = [
  {
    question: 'Is AfyaWise a registered organisation?',
    answer:
      'Yes. AfyaWise is a registered Community Based Organization (CBO) in Kenya. We share our registration certificate with funders on request.',
    status: 'confirmed',
  },
  {
    question: 'Can we fund a specific project?',
    answer: 'Yes. Choose a project, request a concept note, and we will agree targets, budget and reporting with you.',
    status: 'confirmed',
  },
  {
    question: 'Do you accept flexible core funding?',
    answer: 'Yes. Core funding pays for training and supervising promoters across all five programs.',
    status: 'confirmed',
  },
  {
    question: 'How will we know what our money achieved?',
    answer: 'We report against the targets agreed in your grant, with the date, source and method for every figure.',
    status: 'confirmed',
  },
  {
    question: 'Can we visit the work?',
    answer:
      'Yes. Funders and partners can visit Karama Ward. Ask through the form and we will plan the visit with you.',
    status: 'confirmed',
  },
  {
    question: 'Do you offer equity or financial returns?',
    answer:
      'No. AfyaWise is a non-profit community organisation. We report social returns: what changed, for whom, and at what cost.',
    status: 'confirmed',
  },
  {
    question: 'Can companies partner with you?',
    answer:
      'Yes. Companies can fund projects, give in kind, or offer skilled volunteers. Use the form to start a conversation.',
    status: 'confirmed',
  },
  {
    question: 'How do you handle personal data?',
    answer: 'We follow Kenya’s Data Protection Act 2019. Our privacy policy explains what we collect and why.',
    status: 'confirmed',
  },
];
