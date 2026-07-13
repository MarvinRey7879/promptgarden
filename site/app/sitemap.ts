import type { MetadataRoute } from 'next';
import { LANGS } from '@/lib/i18n';
import { getEntries } from '@/lib/content';
import { getCommands, getPlatforms } from '@/lib/commands';

export const dynamic = 'force-static';

// Kanonische Domain seit 13.07.2026
const BASE = 'https://promptgarten.com';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const urls: MetadataRoute.Sitemap = [];

  for (const lang of LANGS) {
    for (const path of ['', 'lexikon/', 'lernpfade/', 'feed/', 'start/', 'vergleiche/', 'loops/', 'benchmarks/', 'forum/', 'befehle/', 'addons/']) {
      urls.push({ url: `${BASE}/${lang}/${path}`, lastModified: now });
    }
    for (const e of getEntries(lang)) {
      urls.push({ url: `${BASE}/${lang}/lexikon/${e.slug}/`, lastModified: now });
    }
    for (const p of getPlatforms(lang)) {
      urls.push({ url: `${BASE}/${lang}/befehle/${p.id}/`, lastModified: now });
    }
    for (const c of getCommands(lang)) {
      urls.push({ url: `${BASE}/${lang}/befehle/${c.platform}/${c.slug}/`, lastModified: now });
    }
  }
  return urls;
}
