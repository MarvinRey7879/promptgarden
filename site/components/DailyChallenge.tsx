'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { type Lang, ui } from '@/lib/i18n';
import { completeEntry } from '@/lib/progress';

type Q = { q: string; o: string[]; c: number; x: string; slug: string; t: string };

const N = 5;
const XP_PER_CORRECT = 5;
const STORE_KEY = 'pg_challenge_v1';

function today(): string {
  return new Date().toISOString().slice(0, 10);
}

/** Deterministischer Seed aus dem Datum: alle Besucher sehen am selben Tag dieselben Fragen. */
function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function hashDate(d: string): number {
  let h = 2166136261;
  for (let i = 0; i < d.length; i++) {
    h ^= d.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function pickIndices(poolSize: number, date: string): number[] {
  const rnd = mulberry32(hashDate(date));
  const idx = Array.from({ length: poolSize }, (_, i) => i);
  for (let i = idx.length - 1; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1));
    [idx[i], idx[j]] = [idx[j], idx[i]];
  }
  return idx.slice(0, Math.min(N, poolSize));
}

type Results = Record<string, number>; // YYYY-MM-DD -> Punkte

function loadResults(): Results {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (!raw) return {};
    const r = JSON.parse(raw);
    return r && typeof r === 'object' ? r : {};
  } catch {
    return {};
  }
}

function challengeStreak(results: Results, t: string): number {
  let streak = 0;
  const d = new Date(`${t}T00:00:00Z`);
  // Heute noch nicht gespielt → Serie ab gestern zählen (sie ist noch nicht gerissen).
  if (results[t] === undefined) d.setUTCDate(d.getUTCDate() - 1);
  while (results[d.toISOString().slice(0, 10)] !== undefined) {
    streak++;
    d.setUTCDate(d.getUTCDate() - 1);
  }
  return streak;
}

export default function DailyChallenge({ lang }: { lang: Lang }) {
  const t = ui[lang];
  const [pool, setPool] = useState<Q[] | null>(null);
  const [step, setStep] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [checked, setChecked] = useState(false);
  const [score, setScore] = useState(0);
  const [prevResult, setPrevResult] = useState<number | null>(null);
  const [streak, setStreak] = useState(0);
  const [finished, setFinished] = useState(false);
  const date = today();

  useEffect(() => {
    const results = loadResults();
    if (results[date] !== undefined) {
      setPrevResult(results[date]);
      setFinished(true);
    }
    setStreak(challengeStreak(results, date));
    fetch(`/challenge/quiz.${lang}.json`)
      .then((r) => r.json())
      .then(setPool)
      .catch(() => setPool([]));
  }, [lang, date]);

  if (pool === null) return <p style={{ color: 'var(--muted)' }}>…</p>;
  if (!pool.length) return null;

  const indices = pickIndices(pool.length, date);
  const questions = indices.map((i) => pool[i]);

  const finish = (finalScore: number) => {
    const results = loadResults();
    results[date] = finalScore;
    try {
      localStorage.setItem(STORE_KEY, JSON.stringify(results));
    } catch {
      /* Gamification ist optional */
    }
    if (finalScore > 0) completeEntry(`challenge:${date}`, finalScore * XP_PER_CORRECT);
    setStreak(challengeStreak(results, date));
    setFinished(true);
  };

  if (finished) {
    const shown = prevResult ?? score;
    return (
      <div className="card" style={{ padding: '26px 30px', background: 'var(--lime)', boxShadow: '6px 6px 0 var(--ink)' }}>
        <p className="kicker" style={{ color: 'var(--ink)' }}>
          {prevResult !== null ? t.challengeDoneToday : '🎉'}
        </p>
        <p style={{ margin: '0 0 6px', fontSize: 32, fontWeight: 800, letterSpacing: '-.02em' }}>
          {t.challengeScore(shown, N)}
        </p>
        <p style={{ margin: '0 0 4px', fontWeight: 700 }}>
          🔥 {t.challengeStreakLabel}: {t.streakDays(streak)}
        </p>
        <p style={{ margin: 0, color: '#2b2118', fontSize: 14.5 }}>{t.challengeAgain}</p>
      </div>
    );
  }

  const q = questions[step];
  const isLast = step === questions.length - 1;

  return (
    <div className="card" style={{ padding: '24px 28px', background: 'var(--yellow)', boxShadow: '6px 6px 0 var(--ink)' }}>
      <p className="kicker" style={{ color: 'var(--ink)' }}>
        {t.challengeQof(step + 1, questions.length)} · 🔥 {t.streakDays(streak)}
      </p>
      <p style={{ margin: '0 0 4px', fontWeight: 800, fontSize: 18.5, lineHeight: 1.35 }}>{q.q}</p>
      <p style={{ margin: '0 0 14px', fontSize: 12.5, color: 'var(--muted)' }}>
        <Link href={`/${lang}/lexikon/${q.slug}/`} style={{ textDecoration: 'underline', textUnderlineOffset: 3 }}>
          📖 {q.t}
        </Link>
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {q.o.map((opt, i) => {
          let bg = '#fff';
          if (checked && i === q.c) bg = 'var(--lime)';
          else if (checked && i === picked && i !== q.c) bg = 'var(--pink)';
          else if (!checked && i === picked) bg = 'var(--blue)';
          return (
            <button
              key={i}
              onClick={() => !checked && setPicked(i)}
              style={{
                textAlign: 'left',
                background: bg,
                border: '2px solid var(--ink)',
                borderRadius: 12,
                padding: '10px 14px',
                fontFamily: 'inherit',
                fontSize: 14.5,
                fontWeight: 600,
                cursor: checked ? 'default' : 'pointer',
              }}
            >
              {opt}
            </button>
          );
        })}
      </div>
      {!checked ? (
        <button
          className="btn"
          style={{ marginTop: 14 }}
          disabled={picked === null}
          onClick={() => {
            setChecked(true);
            if (picked === q.c) setScore((s) => s + 1);
          }}
        >
          {t.quizCheck}
        </button>
      ) : (
        <>
          <p style={{ margin: '14px 0 0', fontWeight: 700, fontSize: 14.5 }}>
            {picked === q.c ? `${t.quizCorrect} ` : `${t.quizWrong} `}
            <span style={{ fontWeight: 500 }}>{q.x}</span>
          </p>
          <button
            className="btn"
            style={{ marginTop: 14 }}
            onClick={() => {
              const finalScore = score;
              if (isLast) {
                finish(finalScore);
              } else {
                setStep((s) => s + 1);
                setPicked(null);
                setChecked(false);
              }
            }}
          >
            {isLast ? t.challengeScore(score, N) + ' →' : t.challengeNext}
          </button>
        </>
      )}
    </div>
  );
}
