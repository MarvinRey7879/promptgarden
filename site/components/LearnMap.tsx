'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { loadProgress, PROGRESS_EVENT } from '@/lib/progress';

/**
 * Lern-Landkarte (Marvin-Ideen-Wahl #4): SVG-Karte aller Welten im 1d-Stil.
 * Jedes Kapitel = Knoten auf einem geschwungenen Pfad; erledigte Kapitel
 * (localStorage-Progress, completed[]) füllen sich lime mit Häkchen.
 * Rein client-seitig, kein Tracking — identische Datenbasis wie die Pfad-Boards darunter.
 */
type MapChapter = { slug: string; title: string; category: string };
export type MapWorld = { name: string; chapters: MapChapter[] };

const CAT_EMOJI: Record<string, string> = { begriff: '📖', konzept: '💡', guide: '🛠️', 'prompt-pattern': '✍️' };
const ISLAND_COLORS = ['var(--yellow)', 'var(--lime)', 'var(--blue)', 'var(--pink)'];

const TXT: Record<string, { kicker: string; done: string }> = {
  de: { kicker: '🗺️ DEINE LERN-LANDKARTE — ERLEDIGTES FÄRBT SICH', done: 'erledigt' },
  en: { kicker: '🗺️ YOUR LEARNING MAP — COMPLETED CHAPTERS LIGHT UP', done: 'done' },
  es: { kicker: '🗺️ TU MAPA DE APRENDIZAJE — LO COMPLETADO SE ILUMINA', done: 'hecho' },
  fr: { kicker: '🗺️ TA CARTE D’APPRENTISSAGE — LE TERMINÉ S’ALLUME', done: 'terminé' },
  zh: { kicker: '🗺️ 你的学习地图——完成的章节会点亮', done: '已完成' },
};

const STEP = 84;
const ISLAND_H = 150;
const GAP = 26;
const PAD_X = 46;

export default function LearnMap({ lang, worlds }: { lang: string; worlds: MapWorld[] }) {
  const t = TXT[lang] ?? TXT.de;
  const [completed, setCompleted] = useState<string[]>([]);

  useEffect(() => {
    const sync = () => setCompleted(loadProgress().completed);
    sync();
    window.addEventListener(PROGRESS_EVENT, sync);
    return () => window.removeEventListener(PROGRESS_EVENT, sync);
  }, []);

  const maxN = Math.max(...worlds.map((w) => w.chapters.length));
  const W = PAD_X * 2 + (maxN - 1) * STEP + 40;
  const H = worlds.length * (ISLAND_H + GAP) + 10;

  return (
    <div className="card" style={{ padding: '18px 20px', margin: '22px 0 8px', background: '#fff', boxShadow: '5px 5px 0 var(--ink)' }}>
      <p className="kicker" style={{ color: 'var(--ink)', marginBottom: 10 }}>{t.kicker}</p>
      <div style={{ overflowX: 'auto' }}>
        <svg viewBox={`0 0 ${W} ${H}`} style={{ display: 'block', minWidth: Math.min(W, 900), width: '100%', height: 'auto' }} role="img" aria-label={t.kicker}>
          {worlds.map((w, wi) => {
            const top = wi * (ISLAND_H + GAP);
            const cy = top + ISLAND_H / 2 + 14;
            const islandW = PAD_X * 2 + (w.chapters.length - 1) * STEP + 20;
            const doneCount = w.chapters.filter((c) => completed.includes(c.slug)).length;
            const pts = w.chapters.map((c, i) => ({
              x: PAD_X + 10 + i * STEP,
              y: cy + Math.sin(i * 1.15 + wi) * 22,
              c,
            }));
            const path = pts.map((p, i) => (i === 0 ? `M ${p.x} ${p.y}` : `S ${p.x - STEP / 2} ${p.y}, ${p.x} ${p.y}`)).join(' ');
            return (
              <g key={w.name}>
                {/* Insel */}
                <rect x={8} y={top + 8} width={islandW} height={ISLAND_H - 8} rx={26} fill={ISLAND_COLORS[wi % 4]} stroke="var(--ink)" strokeWidth={3.5} opacity={0.55} />
                <text x={24} y={top + 34} fontSize={15} fontWeight={800} fill="var(--ink)">{w.name}</text>
                <text x={islandW - 14} y={top + 34} textAnchor="end" fontSize={12.5} fontWeight={700} fill="var(--ink)" fontFamily="monospace">
                  {doneCount}/{w.chapters.length} {t.done} · {Math.round((doneCount / w.chapters.length) * 100)}%
                </text>
                {/* Pfad */}
                <path d={path} fill="none" stroke="var(--ink)" strokeWidth={3} strokeDasharray="7 7" opacity={0.55} />
                {/* Knoten */}
                {pts.map(({ x, y, c }) => {
                  const isDone = completed.includes(c.slug);
                  return (
                    <Link key={c.slug} href={`/${lang}/lexikon/${c.slug}/`}>
                      <g style={{ cursor: 'pointer' }}>
                        <title>{c.title}</title>
                        {/* Unsichtbare, größere Tap-Fläche: die sichtbaren Knoten (r17)
                            schrumpfen auf Mobil auf ~11px und lagen unter dem 24px-
                            WCAG-Mindest-Tap-Target. r38 < STEP(84) → keine Überlappung. */}
                        <circle cx={x} cy={y} r={38} fill="transparent" />
                        <circle cx={x} cy={y} r={17} fill={isDone ? 'var(--lime)' : '#fff'} stroke="var(--ink)" strokeWidth={3} />
                        {isDone ? (
                          <text x={x} y={y + 6} textAnchor="middle" fontSize={17} fontWeight={800} fill="var(--ink)">✓</text>
                        ) : (
                          <text x={x} y={y + 5.5} textAnchor="middle" fontSize={14}>{CAT_EMOJI[c.category] ?? '•'}</text>
                        )}
                      </g>
                    </Link>
                  );
                })}
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}
