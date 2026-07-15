import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { T, type Lang } from './theme';

/**
 * Landkarte-Demo (R9): nachgebaute Lern-Landkarte im 1d-Stil — Kapitel-Punkte einer
 * Welt-Insel färben sich nacheinander lime, der Fortschrittszähler läuft mit,
 * am Ende erscheinen Abschluss-Badge und Serien-Chip. Zahlen = echte Welt 1 (13 Kapitel).
 */
const dict: Record<Lang, { title: string; world: string; done: string; badge: string; streak: string }> = {
  de: {
    title: 'Deine Lern-Landkarte: Fortschritt, den man sieht',
    world: 'WELT 1 · GRUNDLAGEN',
    done: 'geschafft',
    badge: 'Welt geschafft! 🌱→🌳',
    streak: '🔥 Serie: 4 Tage',
  },
  en: {
    title: 'Your learning map: progress you can see',
    world: 'WORLD 1 · BASICS',
    done: 'done',
    badge: 'World complete! 🌱→🌳',
    streak: '🔥 Streak: 4 days',
  },
  es: {
    title: 'Tu mapa de aprendizaje: progreso que se ve',
    world: 'MUNDO 1 · FUNDAMENTOS',
    done: 'completado',
    badge: '¡Mundo completado! 🌱→🌳',
    streak: '🔥 Racha: 4 días',
  },
  fr: {
    title: "Ta carte d'apprentissage : un progrès qui se voit",
    world: 'MONDE 1 · BASES',
    done: 'terminé',
    badge: 'Monde terminé ! 🌱→🌳',
    streak: '🔥 Série : 4 jours',
  },
  zh: {
    title: '你的学习地图：看得见的进度',
    world: '第 1 世界 · 基础',
    done: '已完成',
    badge: '世界通关！🌱→🌳',
    streak: '🔥 连续：4 天',
  },
};

const N = 13; // Welt 1 hat real 13 Kapitel
const FILL_START = 55;
const FILL_STEP = 13;
const BADGE_AT = FILL_START + N * FILL_STEP + 15; // ~239

// Punkte auf sanftem Zickzack-Pfad über die Insel
const dotPos = (i: number) => {
  const x = 130 + i * 62;
  const y = 210 + Math.sin(i * 1.05) * 55;
  return { x, y };
};

export const MapDemo = ({ lang }: { lang: Lang }) => {
  const t = dict[lang];
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleIn = spring({ frame, fps, config: { damping: 200 } });
  const islandIn = spring({ frame: frame - 15, fps, config: { damping: 14, stiffness: 110 } });
  const filled = Math.max(0, Math.min(N, Math.floor((frame - FILL_START) / FILL_STEP) + 1));
  const badgeIn = spring({ frame: frame - BADGE_AT, fps, config: { damping: 11, stiffness: 100 } });
  const streakIn = spring({ frame: frame - BADGE_AT - 18, fps, config: { damping: 12, stiffness: 110 } });

  return (
    <AbsoluteFill style={{ background: T.bg, fontFamily: T.font }}>
      <div style={{ position: 'absolute', top: 46, width: '100%', textAlign: 'center', fontSize: 44, fontWeight: 800, color: T.ink, letterSpacing: '-0.02em', opacity: titleIn, transform: `translateY(${(1 - titleIn) * -24}px)` }}>
        🗺️ {t.title}
      </div>

      {/* Insel */}
      <div
        style={{
          position: 'absolute', left: 120, top: 170, width: 1040, height: 300,
          background: '#e8f4d4', border: `4px solid ${T.ink}`,
          borderRadius: '46% 54% 52% 48% / 58% 44% 56% 42%',
          boxShadow: `9px 9px 0 ${T.ink}`,
          transform: `scale(${islandIn})`,
        }}
      >
        <div style={{ position: 'absolute', top: 22, left: 46, fontSize: 17, fontWeight: 800, color: T.muted, letterSpacing: '0.12em' }}>
          {t.world}
        </div>
        {/* Fortschrittszähler */}
        <div
          style={{
            position: 'absolute', top: 14, right: 44,
            background: '#fff', border: `3px solid ${T.ink}`, borderRadius: 99,
            padding: '7px 20px', fontSize: 21, fontWeight: 800, color: T.ink,
          }}
        >
          {filled}/{N} {t.done}
        </div>

        {/* Pfad-Linien zwischen Punkten */}
        <svg width="1040" height="300" style={{ position: 'absolute', inset: 0 }}>
          {Array.from({ length: N - 1 }, (_, i) => {
            const a = dotPos(i);
            const b = dotPos(i + 1);
            return (
              <line
                key={i}
                x1={a.x - 120} y1={a.y - 170} x2={b.x - 120} y2={b.y - 170}
                stroke={i < filled - 1 ? '#7ab648' : T.muted}
                strokeWidth={i < filled - 1 ? 5 : 3}
                strokeDasharray={i < filled - 1 ? 'none' : '7 7'}
              />
            );
          })}
        </svg>

        {/* Kapitel-Punkte */}
        {Array.from({ length: N }, (_, i) => {
          const { x, y } = dotPos(i);
          const isFilled = i < filled;
          const pop = spring({ frame: frame - (FILL_START + i * FILL_STEP), fps, config: { damping: 10, stiffness: 160 } });
          const scale = isFilled ? 0.9 + pop * 0.35 : 1;
          return (
            <div
              key={i}
              style={{
                position: 'absolute', left: x - 120 - 21, top: y - 170 - 21, width: 42, height: 42,
                background: isFilled ? T.lime : '#fff',
                border: `3.5px solid ${T.ink}`, borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 19, fontWeight: 800, color: T.ink,
                boxShadow: isFilled ? `3px 3px 0 ${T.ink}` : 'none',
                transform: `scale(${scale})`,
              }}
            >
              {isFilled ? '✓' : i + 1}
            </div>
          );
        })}
      </div>

      {/* Abschluss-Badge */}
      <div
        style={{
          position: 'absolute', left: 400, top: 520, width: 480, textAlign: 'center',
          background: T.lime, border: `4px solid ${T.ink}`, borderRadius: 20,
          boxShadow: `8px 8px 0 ${T.ink}`, padding: '18px 26px',
          fontSize: 30, fontWeight: 800, color: T.ink,
          transform: `scale(${badgeIn}) rotate(-1deg)`, opacity: badgeIn,
        }}
      >
        {t.badge}
      </div>

      {/* Serien-Chip */}
      <div
        style={{
          position: 'absolute', left: 555, top: 620,
          background: T.pink, border: `3px solid ${T.ink}`, borderRadius: 99,
          padding: '8px 22px', fontSize: 20, fontWeight: 800, color: T.ink,
          transform: `scale(${streakIn}) rotate(1.2deg)`, opacity: streakIn,
        }}
      >
        {t.streak}
      </div>
    </AbsoluteFill>
  );
};
