'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import type { Entry } from '@/lib/content';
import { type Lang, ui } from '@/lib/i18n';
import { loadProgress, PROGRESS_EVENT } from '@/lib/progress';

/**
 * Lernpfad Welt 1 — Konzept aus Design 1i (abgeschlossen ✓ / aktuell ▶ / gesperrt 🔒),
 * umgesetzt im hellen 1d-Look. Erstes nicht abgeschlossenes Kapitel = aktuell,
 * alles danach gesperrt.
 */
export default function PathBoard({ lang, chapters }: { lang: Lang; chapters: Entry[] }) {
  const t = ui[lang];
  const [completed, setCompleted] = useState<string[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setCompleted(loadProgress().completed);
    setMounted(true);
    const onChange = () => setCompleted(loadProgress().completed);
    window.addEventListener(PROGRESS_EVENT, onChange);
    return () => window.removeEventListener(PROGRESS_EVENT, onChange);
  }, []);

  const currentIdx = chapters.findIndex((c) => !completed.includes(c.slug));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 0, margin: '30px 0' }}>
      {chapters.map((c, i) => {
        const isDone = completed.includes(c.slug);
        const isCurrent = mounted ? i === currentIdx : i === 0;
        const isLocked = mounted ? currentIdx !== -1 && i > currentIdx : i > 0;

        const node = (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 18,
              padding: '16px 22px',
              background: isCurrent ? 'var(--lime)' : isDone ? '#fff' : 'rgba(255,255,255,.45)',
              border: '2.5px solid var(--ink)',
              borderRadius: 18,
              boxShadow: isCurrent ? '5px 5px 0 var(--ink)' : '3px 3px 0 var(--ink)',
              opacity: isLocked ? 0.55 : 1,
              transform: `rotate(${i % 2 === 0 ? '-.4' : '.4'}deg)`,
            }}
          >
            <div
              style={{
                width: 46,
                height: 46,
                borderRadius: '50%',
                flex: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: isDone ? 22 : 18,
                fontWeight: 800,
                border: '2.5px solid var(--ink)',
                background: isDone ? 'var(--lime)' : isCurrent ? 'var(--ink)' : '#fff',
                color: isDone ? 'var(--ink)' : isCurrent ? '#fff' : 'var(--muted)',
              }}
            >
              {isDone ? '✓' : isLocked ? '🔒' : '▶'}
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ margin: 0, fontWeight: 800, fontSize: 17 }}>
                {i + 1}. {c.title}
              </p>
              <p className="mono" style={{ margin: '3px 0 0', fontSize: 11.5, color: 'var(--muted)' }}>
                +{c.xp} XP · {c.minutes} {t.minutes} · {'●'.repeat(c.difficulty)}
                {'○'.repeat(3 - c.difficulty)}
              </p>
            </div>
            {isCurrent && (
              <span className="btn" style={{ flex: 'none' }}>
                {t.pathContinue}
              </span>
            )}
          </div>
        );

        return (
          <div key={c.slug}>
            {i > 0 && (
              <div
                style={{
                  width: 4,
                  height: 22,
                  background: i <= (currentIdx === -1 ? chapters.length : currentIdx) ? 'var(--accent)' : 'rgba(43,33,24,.25)',
                  margin: '0 auto',
                  borderRadius: 2,
                }}
              />
            )}
            {isLocked ? (
              <div title={t.locked}>{node}</div>
            ) : (
              <Link href={`/${lang}/lexikon/${c.slug}/`}>{node}</Link>
            )}
          </div>
        );
      })}
    </div>
  );
}
