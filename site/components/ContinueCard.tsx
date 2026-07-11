'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import type { Lang } from '@/lib/i18n';
import { loadProgress } from '@/lib/progress';

const LABEL: Record<Lang, string> = {
  de: 'Weiterlernen, wo du warst:',
  en: 'Continue where you left off:',
  es: 'Continúa donde lo dejaste:',
  fr: 'Reprends là où tu t’es arrêté :',
  zh: '从上次的地方继续：',
};

type Chapter = { slug: string; title: string };

/**
 * Zeigt Rückkehrern das nächste offene Lernpfad-Kapitel (localStorage).
 * Rendert nichts für Erstbesucher (nichts abgeschlossen) oder wenn alles fertig ist.
 */
export default function ContinueCard({ lang, chapters }: { lang: Lang; chapters: Chapter[] }) {
  const [next, setNext] = useState<Chapter | null>(null);

  useEffect(() => {
    const completed = loadProgress().completed;
    if (completed.length === 0) return;
    const candidate = chapters.find((c) => !completed.includes(c.slug));
    if (candidate) setNext(candidate);
  }, [chapters]);

  if (!next) return null;

  return (
    <div style={{ textAlign: 'center', paddingBottom: 24 }}>
      <Link
        href={`/${lang}/lexikon/${next.slug}/`}
        className="chip"
        style={{ background: 'var(--lime)', fontSize: 14, padding: '10px 20px' }}
      >
        ▶ {LABEL[lang]} <b>{next.title}</b>
      </Link>
    </div>
  );
}
