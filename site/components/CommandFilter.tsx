'use client';

/**
 * Instant-Filter für die Befehlsliste einer Plattform (Marvin 23.07, Usability):
 * bei 30–100+ Befehlen war „einen bestimmten finden" nur Scrollen. Der Filter
 * blendet nicht passende Karten live aus (Name + Kurzbeschreibung, case-insensitiv).
 * Rein client-seitig, kein Tracking.
 */
import Link from 'next/link';
import { useMemo, useState } from 'react';
import type { Lang } from '@/lib/i18n';

type Cmd = { slug: string; name: string; summary: string };

const TXT: Record<Lang, { placeholder: string; empty: string; count: (n: number, total: number) => string }> = {
  de: { placeholder: 'Befehl filtern …', empty: 'Kein Befehl passt — anders schreiben?', count: (n, t) => `${n} von ${t}` },
  en: { placeholder: 'Filter commands …', empty: 'No command matches — try other words?', count: (n, t) => `${n} of ${t}` },
  es: { placeholder: 'Filtrar comandos …', empty: 'Ningún comando coincide — ¿otras palabras?', count: (n, t) => `${n} de ${t}` },
  fr: { placeholder: 'Filtrer les commandes …', empty: 'Aucune commande ne correspond — d’autres mots ?', count: (n, t) => `${n} sur ${t}` },
  zh: { placeholder: '筛选命令 …', empty: '没有匹配的命令——换个词试试？', count: (n, t) => `${n} / ${t}` },
};

export default function CommandFilter({
  commands,
  lang,
  platform,
}: {
  commands: Cmd[];
  lang: Lang;
  platform: string;
}) {
  const t = TXT[lang];
  const [q, setQ] = useState('');
  const query = q.trim().toLowerCase();

  const filtered = useMemo(() => {
    if (!query) return commands;
    return commands.filter(
      (c) => c.name.toLowerCase().includes(query) || c.summary.toLowerCase().includes(query),
    );
  }, [query, commands]);

  return (
    <>
      <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap', margin: '0 0 14px' }}>
        <input
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder={t.placeholder}
          aria-label={t.placeholder}
          className="field"
          style={{ flex: '1 1 220px', fontSize: 15 }}
        />
        {query && (
          <span className="mono" style={{ fontSize: 12.5, color: 'var(--muted)' }}>
            {t.count(filtered.length, commands.length)}
          </span>
        )}
      </div>

      {filtered.length === 0 ? (
        <p style={{ margin: '8px 0 0', fontSize: 14.5, color: 'var(--muted)' }}>{t.empty}</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {filtered.map((c) => (
            <Link
              key={c.slug}
              href={`/${lang}/befehle/${platform}/${c.slug}/`}
              className="card"
              style={{ padding: '14px 18px', textDecoration: 'none', color: 'inherit', boxShadow: '3px 3px 0 var(--ink)' }}
            >
              <span className="mono" style={{ fontWeight: 800, fontSize: 16 }}>{c.name}</span>
              <span style={{ marginLeft: 12, fontSize: 14, color: 'var(--muted)' }}>{c.summary}</span>
            </Link>
          ))}
        </div>
      )}
    </>
  );
}
