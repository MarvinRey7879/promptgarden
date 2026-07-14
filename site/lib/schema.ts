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
