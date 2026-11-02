/** Form choices: `value` is validated on the server, `label` is shown to people. */

export const contactReasons = [
  { value: 'fund', label: 'Fund our work' },
  { value: 'partner', label: 'Partner with us' },
  { value: 'volunteer', label: 'Volunteer' },
  { value: 'donate', label: 'Donate' },
  { value: 'media', label: 'Media' },
  { value: 'other', label: 'Something else' },
] as const;

export const proposalInterests = [
  { value: 'project', label: 'Fund a specific project' },
  { value: 'core', label: 'Fund our core programs' },
  { value: 'program-partnership', label: 'Partner on program delivery' },
  { value: 'corporate', label: 'Corporate or CSR partnership' },
  { value: 'in-kind', label: 'In-kind support (supplies, skills)' },
  { value: 'other', label: 'Something else' },
] as const;

export const budgetRanges = [
  { value: 'under-10k', label: 'Under US$10,000' },
  { value: '10k-50k', label: 'US$10,000 – 50,000' },
  { value: '50k-250k', label: 'US$50,000 – 250,000' },
  { value: 'over-250k', label: 'Over US$250,000' },
  { value: 'not-sure', label: 'Not sure yet' },
] as const;

export const volunteerSkills = [
  { value: 'health-education', label: 'Health education' },
  { value: 'clinical', label: 'Clinical or nursing' },
  { value: 'mental-health', label: 'Mental health and psychosocial support' },
  { value: 'wash', label: 'Water, sanitation and hygiene' },
  { value: 'admin', label: 'Administration' },
  { value: 'data-it', label: 'Data and IT' },
  { value: 'communications', label: 'Communications and photography' },
  { value: 'fundraising', label: 'Fundraising and grant writing' },
  { value: 'other', label: 'Other' },
] as const;

export const availabilityOptions = [
  { value: 'weekdays', label: 'Weekdays' },
  { value: 'weekends', label: 'Weekends' },
  { value: 'evenings', label: 'Evenings' },
  { value: 'remote', label: 'Remote only' },
  { value: 'full-time', label: 'Full-time for a set period' },
  { value: 'flexible', label: 'Flexible' },
] as const;

export const values = <T extends readonly { value: string }[]>(opts: T) =>
  opts.map((o) => o.value) as unknown as [T[number]['value'], ...T[number]['value'][]];

export const labelOf = (opts: readonly { value: string; label: string }[], value: string | undefined) =>
  opts.find((o) => o.value === value)?.label ?? value ?? '';
