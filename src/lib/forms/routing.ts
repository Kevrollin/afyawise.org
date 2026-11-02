/**
 * Which inbox each enquiry goes to (strategy assumption A6). Defaults use the department addresses
 * AfyaWise already publishes; override any of them with MAIL_ROUTE_* env vars.
 */
import {
  CONTACT_TO,
  MAIL_ROUTE_DONATE,
  MAIL_ROUTE_FUND,
  MAIL_ROUTE_MEDIA,
  MAIL_ROUTE_OTHER,
  MAIL_ROUTE_PARTNER,
  MAIL_ROUTE_VOLUNTEER,
} from 'astro:env/server';
import { getContent } from '../../content/index.ts';

export type Route = 'fund' | 'partner' | 'volunteer' | 'donate' | 'media' | 'other';

export function inboxFor(route: Route): string {
  const { email } = getContent().org;
  const routes: Record<Route, string | undefined> = {
    fund: MAIL_ROUTE_FUND ?? email.executive,
    partner: MAIL_ROUTE_PARTNER ?? email.executive,
    volunteer: MAIL_ROUTE_VOLUNTEER ?? email.programs,
    donate: MAIL_ROUTE_DONATE ?? email.finance,
    media: MAIL_ROUTE_MEDIA ?? email.executive,
    other: MAIL_ROUTE_OTHER ?? email.general,
  };
  return routes[route] ?? CONTACT_TO;
}
