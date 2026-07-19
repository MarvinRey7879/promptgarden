'use client';

import { useMemo, useState } from 'react';

export type FeedItem = {
  id: string;
  date: string;
  tag: string;
  title: string;
  summary: string;
  sources: { title: string; url: string }[];
};

const TAG_COLORS: Record<string, string> = {
  modelle: 'var(--lime)',
  tools: 'var(--blue)',
  mcp: 'var(--yellow)',
  security: 'var(--pink)',
  papers: '#e0d4f7',
};

/**
 * Der Feed war auf dem Handy knapp 20 000 px lang — wer nach einem Thema
 * suchte, musste alles durchscrollen. Die Filterleiste zeigt, wie viele
 * Meldungen je Rubrik vorliegen, und blendet den Rest aus.
 *
 * Ohne JavaScript bleiben alle Meldungen sichtbar, weil der Startzustand
 * "alle" ist und serverseitig gerendert wird.
 */
export default function FeedListe({
  items,
  tagLabels,
  alleLabel,
}: {
  items: FeedItem[];
  tagLabels: Record<string, string>;
  alleLabel: string;
}) {
  const [aktiv, setAktiv] = useState<string | null>(null);

  const rubriken = useMemo(() => {
    const zaehler = new Map<string, number>();
    for (const i of items) zaehler.set(i.tag, (zaehler.get(i.tag) ?? 0) + 1);
    return [...zaehler.entries()].sort((a, b) => b[1] - a[1]);
  }, [items]);

  const sichtbar = aktiv ? items.filter((i) => i.tag === aktiv) : items;

  return (
    <>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 24 }}>
        <FilterKnopf
          label={`${alleLabel} (${items.length})`}
          aktiv={aktiv === null}
          farbe="#fff"
          onClick={() => setAktiv(null)}
        />
        {rubriken.map(([tag, n]) => (
          <FilterKnopf
            key={tag}
            label={`${tagLabels[tag] ?? tag} (${n})`}
            aktiv={aktiv === tag}
            farbe={TAG_COLORS[tag] ?? '#fff'}
            onClick={() => setAktiv(aktiv === tag ? null : tag)}
          />
        ))}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        {sichtbar.map((item, i) => (
          <article
            key={item.id}
            id={item.id}
            className="card"
            style={{
              padding: '20px 24px',
              transform: `rotate(${i % 2 === 0 ? '-.25' : '.25'}deg)`,
              boxShadow: '4px 4px 0 var(--ink)',
            }}
          >
            <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
              <span
                style={{
                  background: TAG_COLORS[item.tag] ?? '#fff',
                  border: '2px solid var(--ink)',
                  borderRadius: 8,
                  padding: '2px 10px',
                  fontSize: 11.5,
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  letterSpacing: '.06em',
                }}
              >
                {tagLabels[item.tag] ?? item.tag}
              </span>
              <span className="mono" style={{ fontSize: 13, color: 'var(--muted)' }}>
                {item.date}
              </span>
            </div>
            <h2 style={{ margin: '12px 0 8px', fontSize: 21, fontWeight: 800, letterSpacing: '-.02em', lineHeight: 1.25 }}>
              {item.title}
            </h2>
            <p style={{ margin: 0, fontSize: 15, lineHeight: 1.6 }}>{item.summary}</p>
            <p style={{ margin: '12px 0 0', fontSize: 14 }}>
              {item.sources.map((s, j) => (
                <span key={s.url}>
                  {j > 0 && ' · '}
                  <a
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ textDecoration: 'underline', textUnderlineOffset: 3, color: 'var(--muted)' }}
                  >
                    {s.title} ↗
                  </a>
                </span>
              ))}
            </p>
          </article>
        ))}
      </div>
    </>
  );
}

function FilterKnopf({
  label,
  aktiv,
  farbe,
  onClick,
}: {
  label: string;
  aktiv: boolean;
  farbe: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      aria-pressed={aktiv}
      style={{
        minHeight: 38,
        padding: '7px 14px',
        background: aktiv ? 'var(--ink)' : farbe,
        color: aktiv ? '#fff' : 'var(--ink)',
        border: '2px solid var(--ink)',
        borderRadius: 99,
        fontFamily: 'inherit',
        fontSize: 13,
        fontWeight: 800,
        textTransform: 'uppercase',
        letterSpacing: '.05em',
        cursor: 'pointer',
        boxShadow: aktiv ? 'none' : '2px 2px 0 var(--ink)',
      }}
    >
      {label}
    </button>
  );
}
