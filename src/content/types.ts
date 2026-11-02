/**
 * Content types for the AfyaWise site.
 *
 * Truth rules (strategy §7):
 * - Every item that states a fact about AfyaWise carries a `status`.
 *   'confirmed'    = published by AfyaWise (live site, 2 Nov 2026) or verified with the team.
 *   'TODO_CONFIRM' = not yet verified. Never rendered in production; shown with a badge in preview
 *                    builds (PUBLIC_SHOW_UNCONFIRMED=true).
 * - Every external statistic carries its `source` (name + URL) next to the value.
 *
 * Copy rules are enforced by `npm run lint:copy`, based on field names:
 *   headline / title / question            ≤ 8 words
 *   intro / subhead / summary / lead / label ≤ 20 words
 *   body / text / answer / plan / need / outcome / description / statement ≤ 40 words
 * Fields named `official` hold AfyaWise's board-approved statements verbatim and skip the length
 * check (banned words still apply).
 */

export type Status = 'confirmed' | 'TODO_CONFIRM';

export interface Source {
  label: string;
  url: string;
  /** Page, table or section within the source, if useful. */
  locator?: string;
}

/** An external, cited statistic (the need). */
export interface Stat {
  id: string;
  value: string;
  label: string;
  comparison?: string;
  /** Unrounded figures as published, for the record. */
  exact: string;
  year: string;
  source: Source;
  status: Status;
}

/** AfyaWise's own results (proof band). Hidden until confirmed, dated and sourced. */
export interface Metric {
  id: string;
  value: number | null;
  /** Suffix shown after the number, e.g. "+" or "%". */
  suffix?: string;
  label: string;
  asOf: string | null;
  method: string | null;
  status: Status;
  note?: string;
}

export type ProgramSlug =
  | 'maternal-child-health'
  | 'water-sanitation-hygiene'
  | 'mental-health-disability'
  | 'health-education'
  | 'community-health-promoters';

/** Icon names from Lucide (https://lucide.dev), rendered at build time by @lucide/astro. */
export type IconName =
  | 'baby'
  | 'droplets'
  | 'heart-handshake'
  | 'megaphone'
  | 'users'
  | 'school'
  | 'building'
  | 'sprout'
  | 'smartphone'
  | 'truck'
  | 'graduation-cap'
  | 'shield-check'
  | 'landmark'
  | 'scale'
  | 'file-text'
  | 'hand-coins'
  | 'handshake'
  | 'map-pin';

export interface Target {
  id: string;
  program: ProgramSlug;
  statement: string;
  timeframe: string;
  /** Start date, baseline and progress are unknown until the team supplies them. */
  startDate: string | null;
  baseline: string | null;
  progress: { value: string; asOf: string; method: string } | null;
  status: Status;
}

export interface Program {
  slug: ProgramSlug;
  title: string;
  icon: IconName;
  summary: string;
  headline: string;
  intro: string;
  /** Stat ids (from need.ts) that show why the program exists. */
  need: string[];
  goal: string;
  activities: string[];
  /** Where the activities come from, for the founders' review. Not rendered. */
  activitiesNote?: string;
  targets: string[];
  status: Status;
}

export interface Project {
  slug: string;
  title: string;
  icon: IconName;
  need: string;
  needSource?: Source;
  plan: string;
  outcome: string;
  budget: { amountKES: number | null; status: Status };
  /** Questions for the founders. Not rendered. */
  note?: string;
  status: Status;
}

export interface Person {
  name: string | null;
  role: string;
  bio: string | null;
  /** Path under src/assets/people/, with consent recorded. */
  photo: string | null;
  status: Status;
}

export interface Partner {
  name: string;
  url: string;
  /** Path under src/assets/partners/. Only with written permission to show the logo. */
  logo: string;
  logoPermission: boolean;
  status: Status;
}

export interface Faq {
  question: string;
  answer: string;
  status: Status;
}

export interface Link {
  label: string;
  href: string;
}
