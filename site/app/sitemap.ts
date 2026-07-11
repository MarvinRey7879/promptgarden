import type { MetadataRoute } from 'next';
import { LANGS } from '@/lib/i18n';
import { getEntries } from '@/lib/content';

export const dynamic = 'force-static';

// TODO: auf echte Domain umstellen sobald Marvin gekauft hat (dann auch noindex raus + hreflang)
const BASE = 'https://promptgarden.pages.dev';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const urls: MetadataRoute.Sitemap = [];

  for (const lang of LANGS) {
    for (const path of ['', 'lexikon/', 'lernpfade/', 'feed/', 'start/', 'vergleiche/', 'loops/', 'benchmarks/']) {
      urls.push({ url: `${BASE}/${lang}/${path}`, lastModified: now });
    }
    for (const e of getEntries(lang)) {
      urls.push({ url: `${BASE}/${lang}/lexikon/${e.slug}/`, lastModified: now });
    }
  }
  return urls;
}
