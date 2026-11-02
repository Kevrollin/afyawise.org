import { getCollection } from 'astro:content';
import { useStrings, type Locale } from '../i18n/index.ts';
import { isVisible } from './visibility.ts';

export interface NavItem {
  label: string;
  href: string;
}

// Story files present at build time (files starting with "_" are notes, not stories).
const storyFiles = import.meta.glob('../content/stories/**/[!_]*.md');

/** Stories that may be shown (confirmed, or any in preview builds). */
export async function publishedStories() {
  if (!Object.keys(storyFiles).length) return [];
  const all = await getCollection('stories');
  return all.filter((s) => isVisible(s.data)).sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
}

/** Primary navigation (6 items, +Stories only when real stories exist). Donate is a separate button. */
export async function primaryNav(locale: Locale = 'en'): Promise<NavItem[]> {
  const t = useStrings(locale).nav;
  const items: NavItem[] = [
    { label: t.programs, href: '/programs' },
    { label: t.impact, href: '/impact' },
    { label: t.about, href: '/about' },
    { label: t.partner, href: '/partner' },
    { label: t.getInvolved, href: '/get-involved' },
    { label: t.contact, href: '/contact' },
  ];
  if ((await publishedStories()).length) items.splice(2, 0, { label: t.stories, href: '/stories' });
  return items;
}

/** True when `href` is the current page or a parent section of it. */
export function isCurrent(href: string, pathname: string) {
  const path = pathname.replace(/\/$/, '') || '/';
  return href === '/' ? path === '/' : path === href || path.startsWith(href + '/');
}
