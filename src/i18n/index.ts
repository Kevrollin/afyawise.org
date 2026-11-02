import { en } from './en.ts';

export const locales = ['en'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'en';

const strings = { en } as const;

/** Interface strings for a locale. */
export function useStrings(locale: Locale = defaultLocale) {
  return strings[locale];
}

/** Replace {name} placeholders. */
export function fill(template: string, values: Record<string, string | number>) {
  return template.replace(/\{(\w+)\}/g, (_, key: string) => String(values[key] ?? `{${key}}`));
}
