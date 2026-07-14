'use client';

import Link from 'next/link';
import { useState } from 'react';
import { type Lang, ui } from '@/lib/i18n';

const CARD_COLORS = ['var(--lime)', 'var(--blue)', 'var(--pink)', 'var(--yellow)', '#e8d9c3'];

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

// Tool-Frage (4. Schritt, unbewertet): Index → Ziel-Link
const TOOL_TARGET: ((lang: Lang) => string)[] = [
  (lang) => `/${lang}/befehle/claude-code/`,
  (lang) => `/${lang}/befehle/cursor-cli/`,
  (lang) => `/${lang}/befehle/aider/`,
  (lang) => `/${lang}/befehle/codex-cli/`,
  (lang) => `/${lang}/lexikon/claude-code-installieren/`,
];

export default function Wizard({ lang }: { lang: Lang }) {
  const t = ui[lang];
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [tool, setTool] = useState<number | null>(null);

  const totalSteps = t.wizardQ.length + 1; // 3 bewertete Fragen + Tool-Frage
  const done = step >= totalSteps;
  const score = answers.reduce((a, b) => a + b, 0);
  const level = levelFor(score);
  const isToolStep = step === t.wizardQ.length;

  const finish = (nextAnswers: number[], pickedTool: number) => {
    try {
      localStorage.setItem(
        'pg_wizard',
        JSON.stringify({
          answers: nextAnswers,
          level: levelFor(nextAnswers.reduce((a, b) => a + b, 0)),
          tool: pickedTool,
          at: Date.now(),
        }),
      );
    } catch {
      /* optional */
    }
  };

  const pick = (i: number) => {
    if (isToolStep) {
      setTool(i);
      setStep(step + 1);
      finish(answers, i);
      return;
    }
    setAnswers([...answers, i]);
    setStep(step + 1);
  };

  if (done) {
    // 2-3 konkrete nächste Schritte statt eines einzelnen Links
    const steps: { label: string; href: string }[] = [
      { label: t.wizardNextPath, href: TARGET[level](lang) },
    ];
    if (tool !== null) {
      steps.push({
        label: tool === 4 ? t.wizardNextInstall : t.wizardNextTool,
        href: TOOL_TARGET[tool](lang),
      });
    }
    return (
      <div
        className="card"
        style={{ padding: '28px 30px', background: 'var(--yellow)', textAlign: 'center' }}
      >
        <p className="kicker" style={{ color: 'var(--ink)' }}>
          {t.wizardResultTitle.toUpperCase()}
        </p>
        <p style={{ fontSize: 18, fontWeight: 700, lineHeight: 1.5, margin: '10px 0 16px' }}>
          {t.wizardResults[level]}
        </p>
        <p className="kicker" style={{ color: 'var(--ink)', marginBottom: 10 }}>
          {t.wizardNextTitle.toUpperCase()}
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, alignItems: 'center', marginBottom: 16 }}>
          {steps.map((s, i) => (
            <Link
              key={s.href}
              href={s.href}
              className="btn"
              style={{ minWidth: 260, textAlign: 'center' }}
            >
              {i + 1}. {s.label} →
            </Link>
          ))}
        </div>
        <button
          className="btn secondary"
          onClick={() => {
            setStep(0);
            setAnswers([]);
            setTool(null);
          }}
        >
          {t.wizardRestart}
        </button>
      </div>
    );
  }

  const q = isToolStep ? t.wizardToolQ : t.wizardQ[step];
  return (
    <div>
      <p className="mono" style={{ fontSize: 12, color: 'var(--muted)', textAlign: 'center' }}>
        {step + 1} / {totalSteps}
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
