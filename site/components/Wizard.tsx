'use client';

import Link from 'next/link';
import { useState } from 'react';
import { type Lang, ui } from '@/lib/i18n';

const CARD_COLORS = ['var(--lime)', 'var(--blue)', 'var(--pink)'];

type Level = 'beginner' | 'intermediate' | 'pro';

function levelFor(score: number): Level {
  if (score <= 1) return 'beginner';
  if (score <= 4) return 'intermediate';
  return 'pro';
}

const TARGET: Record<Level, (lang: Lang) => string> = {
  beginner: (lang) => `/${lang}/lernpfade/`,
  intermediate: (lang) => `/${lang}/lernpfade/`,
  pro: (lang) => `/${lang}/lexikon/`,
};

export default function Wizard({ lang }: { lang: Lang }) {
  const t = ui[lang];
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);

  const done = step >= t.wizardQ.length;
  const score = answers.reduce((a, b) => a + b, 0);
  const level = levelFor(score);

  const pick = (i: number) => {
    const next = [...answers, i];
    setAnswers(next);
    setStep(step + 1);
    if (step + 1 >= t.wizardQ.length) {
      try {
        localStorage.setItem(
          'pg_wizard',
          JSON.stringify({ answers: next, level: levelFor(next.reduce((a, b) => a + b, 0)), at: Date.now() }),
        );
      } catch {
        /* optional */
      }
    }
  };

  if (done) {
    return (
      <div
        className="card"
        style={{ padding: '28px 30px', background: 'var(--yellow)', textAlign: 'center' }}
      >
        <p className="kicker" style={{ color: 'var(--ink)' }}>
          {t.wizardResultTitle.toUpperCase()}
        </p>
        <p style={{ fontSize: 18, fontWeight: 700, lineHeight: 1.5, margin: '10px 0 20px' }}>
          {t.wizardResults[level]}
        </p>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href={TARGET[level](lang)} className="btn">
            {t.wizardGo}
          </Link>
          <button
            className="btn secondary"
            onClick={() => {
              setStep(0);
              setAnswers([]);
            }}
          >
            {t.wizardRestart}
          </button>
        </div>
      </div>
    );
  }

  const q = t.wizardQ[step];
  return (
    <div>
      <p className="mono" style={{ fontSize: 12, color: 'var(--muted)', textAlign: 'center' }}>
        {step + 1} / {t.wizardQ.length}
      </p>
      <div
        className="card"
        style={{
          padding: '26px 30px',
          transform: `rotate(${step % 2 === 0 ? '-.4' : '.4'}deg)`,
        }}
      >
        <h2 style={{ margin: '0 0 18px', fontSize: 22, fontWeight: 800, letterSpacing: '-.02em' }}>
          {q.q}
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {q.options.map((opt, i) => (
            <button
              key={i}
              onClick={() => pick(i)}
              style={{
                textAlign: 'left',
                background: CARD_COLORS[i],
                border: '2.5px solid var(--ink)',
                borderRadius: 14,
                padding: '13px 16px',
                fontFamily: 'inherit',
                fontSize: 15.5,
                fontWeight: 700,
                cursor: 'pointer',
                boxShadow: '3px 3px 0 var(--ink)',
              }}
            >
              {opt}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
