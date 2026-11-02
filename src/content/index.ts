import * as en from './en/index.ts';
import type { Locale } from '../i18n/index.ts';

const content = { en } as const;

/** All site content for a locale. Add `sw` here when the Kiswahili content exists. */
export function getContent(locale: Locale = 'en') {
  return content[locale];
}

export type SiteContent = ReturnType<typeof getContent>;
