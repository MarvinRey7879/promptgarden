import type { Lang } from './i18n';

const BASE = 'https://promptgarten.com';

/**
 * BreadcrumbList-JSON-LD (SEO-Phase 3, It. 85) — Google unterstützt Breadcrumb-Rich-Results aktiv.
 * items: Pfad-Kette OHNE Home (wird automatisch vorangestellt); path relativ zu /<lang>/.
 */
export function breadcrumbLd(lang: Lang, items: { name: string; path: string }[]): object {
  const all = [{ name: 'promptgarten', path: '' }, ...items];
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: all.map((it, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: it.name,
      item: `${BASE}/${lang}/${it.path}`,
    })),
  };
}

/**
 * TechArticle-JSON-LD für Befehls-Detailseiten (SEO — Publikum kommt via Google-
 * Suche, top_ref www.google.com). Additiv, ergänzt die Breadcrumb-LD. Autor/
 * Publisher = Organisation promptgarten (keine Personen-Identität, konform mit
 * „keine KI-Autorschaft"). headline kurz halten (<110 Zeichen, Google-Limit).
 */
export function techArticleLd(
  lang: Lang,
  opts: { headline: string; description: string; path: string },
): object {
  const url = `${BASE}/${lang}/${opts.path}`;
  const org = { '@type': 'Organization', name: 'promptgarten', url: BASE };
  return {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    headline: opts.headline.slice(0, 110),
    description: opts.description,
    inLanguage: lang,
    url,
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    author: org,
    publisher: org,
    isAccessibleForFree: true,
  };
}
