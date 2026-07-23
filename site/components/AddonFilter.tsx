'use client';

/**
 * Kategorie-Filter für die Addon-Übersicht (Marvin 23.07, Usability): seit die
 * Liste auf 16 Addons in 8 Kategorien wuchs (u.a. 4× Obsidian), hilft ein
 * Chip-Filter, schnell z.B. „nur Obsidian" oder „nur MCP" zu zeigen. Muster wie
 * der Fehler-Katalog. Rein client-seitig, kein Tracking.
 */
import Link from 'next/link';
import { useMemo, useState } from 'react';
import type { Lang } from '@/lib/i18n';

type Addon = {
  id: string;
  name: string;
  category: string;
  official: boolean;
  stars: string | null;
  what: string;
  why: string;
  source: { title: string; url: string };
  detail?: unknown;
};

const CAT_COLORS: Record<string, string> = {
  MCP: 'var(--yellow)',
  Obsidian: '#e0d4f7',
  Editor: 'var(--blue)',
  Browser: 'var(--pink)',
};

// Addons mit lokalem Logo/Favicon unter /public/addon-icons/<id>.png.
const ADDON_ICONS = new Set([
  'graphify', 'mcp-servers', 'claude-flow', 'context7', 'playwright-mcp', 'github-mcp',
  'claude-code-vscode', 'claude-chrome', 'obsidian-local-rest', 'obsidian-copilot',
  'obsidian-smart-connections', 'obsidian-graph-context', 'superpowers', 'serena', 'cline', 'repomix',
]);

const DICT: Record<Lang, { all: string; hits: string; details: string }> = {
  de: { all: 'Alle', hits: 'Treffer', details: '→ Details' },
  en: { all: 'All', hits: 'matches', details: '→ Details' },
  es: { all: 'Todos', hits: 'resultados', details: '→ Detalles' },
  fr: { all: 'Tous', hits: 'résultats', details: '→ Détails' },
  zh: { all: '全部', hits: '条', details: '→ 详情' },
};

export default function AddonFilter({
  items,
  lang,
  officialLabel,
}: {
  items: Addon[];
  lang: Lang;
  officialLabel: string;
}) {
  const t = DICT[lang];
  const [cat, setCat] = useState<string | null>(null);

  // Kategorien in Reihenfolge ihres ersten Vorkommens
  const cats = useMemo(() => {
    const seen: string[] = [];
    for (const a of items) if (!seen.includes(a.category)) seen.push(a.category);
    return seen;
  }, [items]);

  const filtered = useMemo(() => (cat ? items.filter((a) => a.category === cat) : items), [cat, items]);

  return (
    <>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', margin: '0 0 20px', alignItems: 'center' }}>
        <button
          onClick={() => setCat(null)}
          className="chip"
          style={{ cursor: 'pointer', fontFamily: 'inherit', background: cat === null ? 'var(--ink)' : 'transparent', color: cat === null ? 'var(--bg)' : 'inherit', border: '2.5px solid var(--ink)', fontWeight: cat === null ? 800 : 600 }}
        >
          {t.all}
        </button>
        {cats.map((k) => (
          <button
            key={k}
            onClick={() => setCat(cat === k ? null : k)}
            className="chip"
            style={{ cursor: 'pointer', fontFamily: 'inherit', background: cat === k ? (CAT_COLORS[k] ?? 'var(--lime)') : 'transparent', border: '2.5px solid var(--ink)', fontWeight: cat === k ? 800 : 600 }}
          >
            {k}
          </button>
        ))}
        <span className="chip mono" style={{ fontSize: 12, opacity: 0.75 }}>
          {filtered.length} {t.hits}
        </span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 18 }}>
        {filtered.map((a, i) => (
          <article
            key={a.id}
            className="card"
            style={{
              padding: '18px 20px',
              transform: `rotate(${i % 2 === 0 ? '-.25' : '.25'}deg)`,
              boxShadow: '4px 4px 0 var(--ink)',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <div style={{ display: 'flex', gap: 6, alignItems: 'center', flexWrap: 'wrap', marginBottom: 8 }}>
              <span
                style={{
                  background: CAT_COLORS[a.category] ?? 'var(--lime)',
                  border: '2px solid var(--ink)',
                  borderRadius: 8,
                  padding: '1px 8px',
                  fontSize: 11,
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  letterSpacing: '.05em',
                }}
              >
                {a.category}
              </span>
              {a.official && (
                <span className="chip" style={{ fontSize: 11, fontWeight: 800 }}>
                  ✓ {officialLabel}
                </span>
              )}
              {a.stars && (
                <span className="mono" style={{ fontSize: 11.5, color: 'var(--muted)' }}>
                  ★ {a.stars}
                </span>
              )}
            </div>
            <div style={{ display: 'flex', gap: 10, alignItems: 'center', margin: '0 0 8px' }}>
              {ADDON_ICONS.has(a.id) && (
                <img
                  src={`/addon-icons/${a.id}.png`}
                  alt=""
                  width={30}
                  height={30}
                  loading="lazy"
                  style={{ flexShrink: 0, borderRadius: 7, border: '1.5px solid var(--ink)', background: '#fff' }}
                />
              )}
              <h2 style={{ margin: 0, fontSize: 20, fontWeight: 800, letterSpacing: '-.02em', lineHeight: 1.2 }}>
                {a.name}
              </h2>
            </div>
            <p style={{ margin: '0 0 8px', fontSize: 14, lineHeight: 1.55 }}>{a.what}</p>
            <p style={{ margin: '0 0 12px', fontSize: 13.5, lineHeight: 1.55, color: 'var(--muted)' }}>{a.why}</p>
            <p style={{ margin: 'auto 0 0', fontSize: 12.5, display: 'flex', gap: 14, flexWrap: 'wrap' }}>
              {a.detail != null && (
                <Link href={`/${lang}/addons/${a.id}/`} style={{ fontWeight: 800, textDecoration: 'underline', textUnderlineOffset: 3 }}>
                  {t.details}
                </Link>
              )}
              <a
                href={a.source.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{ textDecoration: 'underline', textUnderlineOffset: 3 }}
              >
                {a.source.title} ↗
              </a>
            </p>
          </article>
        ))}
      </div>
    </>
  );
}
