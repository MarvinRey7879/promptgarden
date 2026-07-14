'use client';

import Link from 'next/link';
import { useState } from 'react';

/**
 * „Was willst du tun?" — Szenario-Chips, Klick → glasklare Empfehlung (Tool + Modell + warum).
 * Inhalte kommen lokalisiert aus vergleiche.<lang>.json (szenarien).
 */
export type Szenario = {
  id: string;
  emoji: string;
  frage: string;
  tool: string;
  modell: string;
  warum: string;
  beispiel: string;
  link: string;
  linkLabel: string;
};

const CHIP_COLORS = ['var(--lime)', 'var(--pink)', 'var(--blue)', 'var(--yellow)', '#fff'];

export default function ScenarioPicker({
  kicker,
  toolLabel,
  modellLabel,
  szenarien,
  lang,
}: {
  kicker: string;
  toolLabel: string;
  modellLabel: string;
  szenarien: Szenario[];
  lang: string;
}) {
  const [active, setActive] = useState<string | null>(null);
  const sel = szenarien.find((s) => s.id === active) ?? null;

  return (
    <div className="card" style={{ padding: '22px 26px', marginBottom: 30, background: '#fff', boxShadow: '6px 6px 0 var(--ink)' }}>
      <p className="kicker" style={{ color: 'var(--ink)' }}>{kicker}</p>
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', margin: '12px 0 6px' }}>
        {szenarien.map((s, i) => (
          <button
            key={s.id}
            onClick={() => setActive(s.id === active ? null : s.id)}
            style={{
              background: s.id === active ? 'var(--ink)' : CHIP_COLORS[i % CHIP_COLORS.length],
              color: s.id === active ? 'var(--bg)' : 'var(--ink)',
              border: '2.5px solid var(--ink)',
              borderRadius: 99,
              padding: '10px 16px',
              fontFamily: 'inherit',
              fontSize: 14,
              fontWeight: 700,
              cursor: 'pointer',
              boxShadow: s.id === active ? 'none' : '3px 3px 0 var(--ink)',
            }}
          >
            {s.emoji} {s.frage}
          </button>
        ))}
      </div>

      {sel && (
        <div
          style={{
            marginTop: 14,
            border: '2.5px solid var(--ink)',
            borderRadius: 16,
            padding: '16px 20px',
            background: 'var(--yellow)',
          }}
        >
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 10 }}>
            <span className="chip" style={{ background: 'var(--ink)', color: 'var(--bg)', fontWeight: 800 }}>
              {toolLabel}: {sel.tool}
            </span>
            <span className="chip" style={{ background: '#fff', fontWeight: 800 }}>
              {modellLabel}: {sel.modell}
            </span>
          </div>
          <p style={{ margin: '0 0 10px', fontSize: 14.5, lineHeight: 1.55 }}>{sel.warum}</p>
          <p className="mono" style={{ margin: '0 0 12px', fontSize: 13, background: '#00000010', borderRadius: 10, padding: '10px 14px', whiteSpace: 'pre-wrap' }}>
            {sel.beispiel}
          </p>
          <Link href={`/${lang}/${sel.link}`} className="mono" style={{ fontSize: 13, fontWeight: 700, textDecoration: 'underline', textUnderlineOffset: 3 }}>
            → {sel.linkLabel}
          </Link>
        </div>
      )}
    </div>
  );
}
