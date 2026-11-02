import type { SiteContent } from '../content/index.ts';

export const SITE_URL = 'https://www.afyawise.org';

export const absolute = (path: string) => new URL(path, SITE_URL).href;

/** NGO / Organization JSON-LD, used on every page. Only confirmed facts. */
export function organizationLd(c: SiteContent) {
  const { org } = c;
  const ld: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'NGO',
    '@id': `${SITE_URL}/#organization`,
    name: org.name,
    legalName: org.legalName,
    alternateName: [org.shortName, 'AfyaWise Community Based Organization (CBO)'],
    url: SITE_URL,
    logo: absolute('/brand/afyawise-logo.svg'),
    image: absolute('/icon-512.png'),
    description: org.tagline,
    email: org.email.general,
    telephone: org.phone.href.replace('tel:', ''),
    address: {
      '@type': 'PostalAddress',
      addressLocality: `${org.location.ward}, ${org.location.subCounty}`,
      addressRegion: org.location.county,
      addressCountry: org.location.countryCode,
    },
    location: {
      '@type': 'Place',
      name: org.location.full,
      geo: { '@type': 'GeoCoordinates', latitude: org.location.geo.lat, longitude: org.location.geo.lon },
    },
    areaServed: [
      { '@type': 'AdministrativeArea', name: 'Meru County', containedInPlace: { '@type': 'Country', name: 'Kenya' } },
      { '@type': 'AdministrativeArea', name: 'Karama Ward, Tigania East' },
    ],
    knowsAbout: c.programs.map((p) => p.title),
    contactPoint: [
      {
        '@type': 'ContactPoint',
        contactType: 'general enquiries',
        email: org.email.general,
        telephone: org.phone.href.replace('tel:', ''),
      },
      { '@type': 'ContactPoint', contactType: 'partnerships and funding', email: org.email.executive },
      { '@type': 'ContactPoint', contactType: 'donations', email: org.email.finance },
      { '@type': 'ContactPoint', contactType: 'programs and volunteering', email: org.email.programs },
    ],
  };
  if (org.registration.status === 'confirmed' && org.registration.number) {
    ld.identifier = {
      '@type': 'PropertyValue',
      name: org.registration.body ?? 'Registration number',
      value: org.registration.number,
    };
  }
  if (org.founded.status === 'confirmed' && org.founded.year) ld.foundingDate = org.founded.year;
  if (org.socials.length) ld.sameAs = org.socials.map((s) => s.href);
  return ld;
}

export function websiteLd(c: SiteContent) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${SITE_URL}/#website`,
    name: c.org.name,
    url: SITE_URL,
    inLanguage: 'en',
    publisher: { '@id': `${SITE_URL}/#organization` },
  };
}

export function faqLd(faqs: { question: string; answer: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: { '@type': 'Answer', text: f.answer },
    })),
  };
}

export function breadcrumbLd(items: { name: string; href: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: it.name,
      item: absolute(it.href),
    })),
  };
}
