import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { T, type Lang } from './theme';

/**
 * Tages-Challenge-Demo (R8): nachgebaute Challenge-Karte im 1d-Stil — Frage erscheint,
 * Auswahl wandert auf die richtige Antwort, „Prüfen", grünes Feedback + XP, Serien-Flamme.
 * Fakten = echte Frage aus dem Kapitel „MCP" (quiz.de.json-Pool).
 */
const dict: Record<Lang, {
  title: string; kicker: string; question: string; options: [string, string, string];
  check: string; correct: string; explain: string; streak: string;
}> = {
  de: {
    title: 'Jeden Tag 5 Fragen: die Tages-Challenge',
    kicker: 'FRAGE 1 VON 5',
    question: 'Wofür steht MCP?',
    options: ['Model Context Protocol', 'Master Control Program', 'Multi Core Processing'],
    check: 'Prüfen',
    correct: 'Richtig! +5 XP ⚡',
    explain: 'Ein offener Standard, der KI-Werkzeuge verbindet.',
    streak: '🔥 Serie: 4 Tage',
  },
  en: {
    title: 'Five questions a day: the daily challenge',
    kicker: 'QUESTION 1 OF 5',
    question: 'What does MCP stand for?',
    options: ['Model Context Protocol', 'Master Control Program', 'Multi Core Processing'],
    check: 'Check',
    correct: 'Correct! +5 XP ⚡',
    explain: 'An open standard that connects AI tools.',
    streak: '🔥 Streak: 4 days',
  },
  es: {
    title: 'Cinco preguntas al día: el reto diario',
    kicker: 'PREGUNTA 1 DE 5',
    question: '¿Qué significa MCP?',
    options: ['Model Context Protocol', 'Master Control Program', 'Multi Core Processing'],
    check: 'Comprobar',
    correct: '¡Correcto! +5 XP ⚡',
    explain: 'Un estándar abierto que conecta herramientas de IA.',
    streak: '🔥 Racha: 4 días',
  },
  fr: {
    title: 'Cinq questions par jour : le défi du jour',
    kicker: 'QUESTION 1 SUR 5',
    question: 'Que signifie MCP ?',
    options: ['Model Context Protocol', 'Master Control Program', 'Multi Core Processing'],
    check: 'Vérifier',
    correct: 'Correct ! +5 XP ⚡',
    explain: 'Un standard ouvert qui connecte les outils IA.',
    streak: '🔥 Série : 4 jours',
  },
  zh: {
    title: '每天 5 道题：每日挑战',
    kicker: '第 1 题，共 5 题',
    question: 'MCP 是什么的缩写？',
    options: ['Model Context Protocol', 'Master Control Program', 'Multi Core Processing'],
    check: '检查',
    correct: '答对了！+5 XP ⚡',
    explain: '一个连接 AI 工具的开放标准。',
    streak: '🔥 连续：4 天',
  },
};

const CORRECT = 0;

export const ChallengeDemo = ({ lang }: { lang: Lang }) => {
  const t = dict[lang];
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleIn = spring({ frame, fps, config: { damping: 200 } });
  const cardIn = spring({ frame: frame - 20, fps, config: { damping: 14, stiffness: 120 } });
  // Cursor wandert: Option 2 (Frame 70) → Option 0 (Frame 110)
  const hover = frame < 70 ? -1 : frame < 110 ? 1 : CORRECT;
  // Prüfen-Klick bei Frame 160, Feedback danach
  const CHECK_AT = 160;
  const checked = frame >= CHECK_AT;
  const btnPress = frame >= CHECK_AT - 8 && frame < CHECK_AT ? 0.94 : 1;
  const feedbackIn = spring({ frame: frame - CHECK_AT, fps, config: { damping: 13, stiffness: 120 } });
  const streakIn = spring({ frame: frame - CHECK_AT - 45, fps, config: { damping: 11, stiffness: 100 } });
  const xpFloat = interpolate(frame, [CHECK_AT, CHECK_AT + 60], [0, -46], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const xpFade = interpolate(frame, [CHECK_AT + 40, CHECK_AT + 75], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill style={{ background: T.bg, fontFamily: T.font }}>
      <div style={{ position: 'absolute', top: 44, width: '100%', textAlign: 'center', fontSize: 44, fontWeight: 800, color: T.ink, letterSpacing: '-0.02em', opacity: titleIn, transform: `translateY(${(1 - titleIn) * -24}px)` }}>
        🎯 {t.title}
      </div>

      {/* Challenge-Karte */}
      <div
        style={{
          position: 'absolute', left: 250, top: 150, width: 780,
          background: T.yellow, border: `4px solid ${T.ink}`, borderRadius: 22,
          boxShadow: `9px 9px 0 ${T.ink}`, padding: '26px 32px',
          transform: `scale(${cardIn})`,
        }}
      >
        <div style={{ fontSize: 15, fontWeight: 800, color: T.muted, letterSpacing: '0.1em', marginBottom: 10 }}>
          {t.kicker} · {t.streak.replace('4', '3')}
        </div>
        <div style={{ fontSize: 32, fontWeight: 800, color: T.ink, letterSpacing: '-0.01em', marginBottom: 18 }}>{t.question}</div>

        {t.options.map((opt, i) => {
          let bg = '#fff';
          if (checked && i === CORRECT) bg = T.lime;
          else if (!checked && i === hover) bg = T.blue;
          return (
            <div
              key={opt}
              style={{
                border: `3px solid ${T.ink}`, borderRadius: 14, padding: '12px 18px', marginBottom: 10,
                fontSize: 22, fontWeight: 700, color: T.ink, background: bg,
                boxShadow: (!checked && i === hover) || (checked && i === CORRECT) ? `4px 4px 0 ${T.ink}` : 'none',
                transform: (!checked && i === hover) || (checked && i === CORRECT) ? 'translateX(5px)' : 'none',
              }}
            >
              {opt}
            </div>
          );
        })}

        {!checked ? (
          <div
            style={{
              display: 'inline-block', marginTop: 8, background: T.accent, color: '#fff',
              border: `3px solid ${T.ink}`, borderRadius: 99, padding: '10px 30px',
              fontSize: 21, fontWeight: 800, boxShadow: `4px 4px 0 ${T.ink}`,
              transform: `scale(${btnPress})`, opacity: hover === CORRECT ? 1 : 0.6,
            }}
          >
            {t.check}
          </div>
        ) : (
          <div style={{ marginTop: 8, opacity: feedbackIn, transform: `translateY(${(1 - feedbackIn) * 14}px)` }}>
            <span style={{ display: 'inline-block', background: T.lime, border: `3px solid ${T.ink}`, borderRadius: 99, padding: '10px 26px', fontSize: 21, fontWeight: 800, color: T.ink }}>
              ✅ {t.correct}
            </span>
            <div style={{ marginTop: 10, fontSize: 18, fontWeight: 600, color: T.ink }}>{t.explain}</div>
          </div>
        )}
      </div>

      {/* +5 XP schwebt nach oben */}
      {checked && (
        <div style={{ position: 'absolute', left: 940, top: 300 + xpFloat, fontSize: 40, fontWeight: 800, color: T.accent, opacity: xpFade, transform: 'rotate(6deg)' }}>
          +5 XP ⚡
        </div>
      )}

      {/* Serien-Badge nach Feedback */}
      <div
        style={{
          position: 'absolute', left: 460, top: 592, width: 360, textAlign: 'center',
          background: T.pink, border: `4px solid ${T.ink}`, borderRadius: 18,
          boxShadow: `7px 7px 0 ${T.ink}`, padding: '14px 20px',
          fontSize: 27, fontWeight: 800, color: T.ink,
          transform: `scale(${streakIn}) rotate(-1.2deg)`, opacity: streakIn,
        }}
      >
        {t.streak}
      </div>
    </AbsoluteFill>
  );
};
