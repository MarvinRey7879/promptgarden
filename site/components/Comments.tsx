'use client';

import { useEffect, useRef } from 'react';
import type { Lang } from '@/lib/i18n';

/**
 * giscus-Kommentare (GitHub Discussions) unter jedem Eintrag.
 * Aktiv erst wenn NEXT_PUBLIC_GISCUS=on (giscus-App muss auf dem Repo installiert sein —
 * 1-Klick durch Marvin: https://github.com/apps/giscus).
 * Repo: MarvinRey7879/promptgarden · Kategorie: General
 */
const GISCUS_LANG: Record<Lang, string> = { de: 'de', en: 'en', es: 'es', fr: 'fr', zh: 'zh-CN' };

export default function Comments({ lang }: { lang: Lang }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (process.env.NEXT_PUBLIC_GISCUS !== 'on') return;
    const el = ref.current;
    if (!el || el.hasChildNodes()) return;
    const s = document.createElement('script');
    s.src = 'https://giscus.app/client.js';
    s.async = true;
    s.crossOrigin = 'anonymous';
    s.setAttribute('data-repo', 'MarvinRey7879/promptgarden');
    s.setAttribute('data-repo-id', 'R_kgDOTVWuTw');
    s.setAttribute('data-category', 'General');
    s.setAttribute('data-category-id', 'DIC_kwDOTVWuT84DA-LF');
    s.setAttribute('data-mapping', 'pathname');
    s.setAttribute('data-strict', '0');
    s.setAttribute('data-reactions-enabled', '1');
    s.setAttribute('data-emit-metadata', '0');
    s.setAttribute('data-input-position', 'top');
    s.setAttribute('data-theme', 'light');
    s.setAttribute('data-lang', GISCUS_LANG[lang]);
    s.setAttribute('data-loading', 'lazy');
    el.appendChild(s);
  }, [lang]);

  if (process.env.NEXT_PUBLIC_GISCUS !== 'on') return null;

  return <div ref={ref} style={{ marginTop: 40 }} />;
}
