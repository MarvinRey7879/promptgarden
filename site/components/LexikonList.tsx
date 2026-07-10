'use client';

import Link from 'next/link';
import { useMemo, useState, useEffect } from 'react';
import type { Entry } from '@/lib/content';
import { type Lang, ui } from '@/lib/i18n';
import { loadProgress, PROGRESS_EVENT } from '@/lib/progress';

function dots(d: number): string {
  return '●'.repeat(d) + '○'.repeat(3 - d);
}

export default function LexikonList({ lang, entries }: { lang: Lang; entries: Entry[] }) {
  const t = ui[lang];
  const [q, setQ] = useState('');
  const [cat, setCat] = useState<string>('');
  const [completed, setCompleted] = useState<string[]>([]);

  useEffect(() => {
    // ?cat= aus URL lesen (static export → client-side)
    const p = new URLSearchParams(window.location.search).get('cat');
    if (p) setCat(p);
    setCompleted(loadProgress().completed);
    const onChange = () => setCompleted(loadProgress().completed);
    window.addEventListener(PROGRESS_EVENT, onChange);
    return () => window.removeEventListener(PROGRESS_EVENT, onChange);
  }, []);

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return entries.filter((e) => {
      if (cat && e.category !== cat) return false;
      if (!needle) return true;
      return (
        e.title.toLowerCase().includes(needle) ||
        e.teaser.toLowerCase().includes(needle) ||
        e.slug.includes(needle)
      );
    });
  }, [entries, q, cat]);

  const cats = Object.entries(t.categories);

  return (
    <div>
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', margin: '18px 0' }}>
        <input
          className="field"
          style={{ maxWidth: 340 }}
          placeholder={t.search}
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center' }}>
          {cats.map(([key, label]) => (
            <button
              key={key}
              className={`pill${cat === key ? ' active' : ''}`}
              style={{ cursor: 'pointer', background: cat === key ? '#fff' : 'transparent', fontFamily: 'inherit' }}
              onClick={() => setCat(cat === key ? '' : key)}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="card" style={{ overflow: 'hidden' }}>
        <div
          className="mono"
          style={{
            display: 'grid',
            gridTemplateColumns: '56px 1fr 150px 90px',
            padding: '12px 22px',
            fontSize: 11,
            color: 'var(--muted)',
            letterSpacing: '.08em',
            borderBottom: '2px solid var(--ink)',
          }}
        >
          <span>{t.colNr}</span>
          <span>{t.colEntry}</span>
          <span className="hide-mobile">{t.colCategory}</span>
          <span>{t.colLevel}</span>
        </div>
        {filtered.map((e, i) => (
          <Link
            key={e.slug}
            href={`/${lang}/lexikon/${e.slug}/`}
            style={{
              display: 'grid',
              gridTemplateColumns: '56px 1fr 150px 90px',
              alignItems: 'baseline',
              padding: '16px 22px',
              borderBottom: i === filtered.length - 1 ? 'none' : '1px solid rgba(43,33,24,.18)',
              background: completed.includes(e.slug) ? 'rgba(201,226,101,.35)' : undefined,
            }}
          >
            <span className="mono" style={{ fontSize: 12 }}>
              {String(i + 1).padStart(3, '0')}
            </span>
            <span style={{ fontSize: 19, fontWeight: 800, letterSpacing: '-.02em' }}>
              {completed.includes(e.slug) && '✓ '}
              {e.title}
            </span>
            <span className="hide-mobile" style={{ fontSize: 13, fontWeight: 600, color: 'var(--muted)' }}>
              {t.categories[e.category]}
            </span>
            <span className="dots" style={{ fontWeight: 600 }}>
              {dots(e.difficulty)}
            </span>
          </Link>
        ))}
        <div
          className="mono"
          style={{
            padding: '13px 22px',
            fontSize: 12,
            color: 'var(--muted)',
            borderTop: '2px solid var(--ink)',
            display: 'flex',
            justifyContent: 'space-between',
            gap: 10,
            flexWrap: 'wrap',
          }}
        >
          <span>{t.showing(filtered.length, entries.length)}</span>
          {completed.length > 0 && (
            <span style={{ fontWeight: 700, color: 'var(--ink)' }}>
              ✓ {entries.filter((e) => completed.includes(e.slug)).length}/{entries.length}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
