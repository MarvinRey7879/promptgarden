'use client';

import { useEffect, useState } from 'react';
import { type Lang, ui } from '@/lib/i18n';
import { completeEntry, isCompleted } from '@/lib/progress';

type QuizData = { question: string; options: string[]; correct: number; explain: string };

export default function Quiz({
  lang,
  slug,
  xp,
  quiz,
}: {
  lang: Lang;
  slug: string;
  xp: number;
  quiz: QuizData;
}) {
  const t = ui[lang];
  const [picked, setPicked] = useState<number | null>(null);
  const [checked, setChecked] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    setDone(isCompleted(slug));
  }, [slug]);

  const check = () => {
    if (picked === null) return;
    setChecked(true);
    if (picked === quiz.correct) {
      completeEntry(slug, xp);
      setDone(true);
    }
  };

  const correct = checked && picked === quiz.correct;

  return (
    <div
      className="card"
      style={{ padding: '22px 26px', marginTop: 34, background: 'var(--yellow)' }}
    >
      <p className="kicker" style={{ color: 'var(--ink)' }}>
        {t.quizTitle.toUpperCase()} {done && '· ✓'}
      </p>
      <p style={{ margin: '0 0 14px', fontWeight: 700, fontSize: 16.5 }}>{quiz.question}</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {quiz.options.map((opt, i) => {
          let bg = '#fff';
          if (checked && i === quiz.correct) bg = 'var(--lime)';
          else if (checked && i === picked && i !== quiz.correct) bg = 'var(--pink)';
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
        <button className="btn" style={{ marginTop: 14 }} onClick={check} disabled={picked === null}>
          {t.quizCheck}
        </button>
      ) : (
        <p style={{ margin: '14px 0 0', fontWeight: 700, fontSize: 14.5 }}>
          {correct ? `${t.quizCorrect} +${xp} ${t.xp} ⚡ ` : `${t.quizWrong} `}
          <span style={{ fontWeight: 500 }}>{quiz.explain}</span>
        </p>
      )}
    </div>
  );
}
