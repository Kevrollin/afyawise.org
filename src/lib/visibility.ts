import { PUBLIC_SHOW_UNCONFIRMED } from 'astro:env/client';
import type { Status } from '../content/types.ts';

/**
 * Preview builds (PUBLIC_SHOW_UNCONFIRMED=true) render TODO_CONFIRM content with a badge so the team
 * can review it in place. Production builds never render it.
 */
export const showUnconfirmed: boolean = PUBLIC_SHOW_UNCONFIRMED;

export function isVisible(item: { status: Status } | null | undefined): boolean {
  if (!item) return false;
  return item.status === 'confirmed' || showUnconfirmed;
}

export function visible<T extends { status: Status }>(items: readonly T[]): T[] {
  return items.filter(isVisible);
}

export const isTodo = (item: { status: Status } | null | undefined) => item?.status === 'TODO_CONFIRM';
