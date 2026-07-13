import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig, Easing } from 'remotion';
import { T, card, type Lang } from './theme';

const dict: Record<Lang, { title: string; think: string; act: string; check: string; done: string; loop: string; finish: string }> = {
  de: { title: 'So arbeitet eine Agenten-Loop', think: 'Denken', act: 'Handeln', check: 'Prüfen', done: 'Fertig?', loop: 'nein → nochmal', finish: '✓ Fertig!' },
  en: { title: 'How an agent loop works', think: 'Think', act: 'Act', check: 'Verify', done: 'Done?', loop: 'no → again', finish: '✓ Done!' },
  es: { title: 'Así trabaja un loop de agente', think: 'Pensar', act: 'Actuar', check: 'Verificar', done: '¿Listo?', loop: 'no → otra vez', finish: '✓ ¡Listo!' },
  fr: { title: 'Comment travaille une boucle d’agent', think: 'Penser', act: 'Agir', check: 'Vérifier', done: 'Fini ?', loop: 'non → encore', finish: '✓ Fini !' },
  zh: { title: '智能体循环是这样工作的', think: '思考', act: '行动', check: '检查', done: '完成了吗？', loop: '没有 → 再来', finish: '✓ 完成！' },
};

const BOX_W = 240;
const BOX_H = 150;
const XS = [140, 520, 900]; // x der 3 Boxen
const Y = 250;

export const LoopZyklus = ({ lang }: { lang: Lang }) => {
  const t = dict[lang];
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleIn = spring({ frame, fps, config: { damping: 200 } });

  // Boxen erscheinen gestaffelt ab Frame 40
  const boxIn = (i: number) => spring({ frame: frame - 40 - i * 18, fps, config: { damping: 14, stiffness: 160 } });

  // Highlight wandert 2 volle Runden über die 3 Boxen: Frames 120–330, 35 Frames pro Station
  const STATION = 35;
  const cyclePos = Math.floor((frame - 120) / STATION);
  const active = frame >= 120 && frame < 330 ? ((cyclePos % 3) + 3) % 3 : -1;

  // Rückschleifen-Pfeil (unten herum) sichtbar, wenn Highlight von Prüfen zurück zu Denken springt
  const loopFlash = frame >= 120 && frame < 330 && cyclePos % 3 === 2
    ? interpolate((frame - 120) % STATION, [20, 34], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
    : 0;

  // Finale: „Fertig?" + Häkchen ab Frame 340
  const doneIn = spring({ frame: frame - 340, fps, config: { damping: 200 } });
  const finishIn = spring({ frame: frame - 385, fps, config: { damping: 10 } });

  const emojis = ['🧠', '🔨', '✅'];
  const labels = [t.think, t.act, t.check];
  const colors = [T.yellow, T.blue, T.lime];

  return (
    <AbsoluteFill style={{ background: T.bg, fontFamily: T.font }}>
      <div
        style={{
          position: 'absolute', top: 60, width: '100%', textAlign: 'center',
          fontSize: 52, fontWeight: 800, color: T.ink, letterSpacing: '-0.02em',
          opacity: titleIn, transform: `translateY(${(1 - titleIn) * -30}px)`,
        }}
      >
        {t.title}
      </div>

      {/* Pfeile zwischen den Boxen */}
      {[0, 1].map((i) => {
        const show = boxIn(i + 1);
        return (
          <div key={i} style={{ position: 'absolute', left: XS[i] + BOX_W + 10, top: Y + BOX_H / 2 - 24, fontSize: 56, color: T.ink, opacity: show }}>
            →
          </div>
        );
      })}

      {/* Die 3 Boxen */}
      {[0, 1, 2].map((i) => {
        const s = boxIn(i);
        const isActive = active === i;
        return (
          <div
            key={i}
            style={{
              ...card(colors[i]),
              position: 'absolute', left: XS[i], top: Y, width: BOX_W, height: BOX_H,
              transform: `scale(${s * (isActive ? 1.08 : 1)}) rotate(${i === 1 ? 1 : -1}deg)`,
              boxShadow: isActive ? `10px 10px 0 ${T.accent}` : `8px 8px 0 ${T.ink}`,
            }}
          >
            <div style={{ fontSize: 54 }}>{emojis[i]}</div>
            <div style={{ fontSize: 32, fontWeight: 800, color: T.ink }}>{labels[i]}</div>
          </div>
        );
      })}

      {/* Rückschleife unten */}
      <svg style={{ position: 'absolute', left: 0, top: 0 }} width={1280} height={720}>
        <path
          d={`M ${XS[2] + BOX_W / 2} ${Y + BOX_H + 12} C ${XS[2] + BOX_W / 2} ${Y + BOX_H + 130}, ${XS[0] + BOX_W / 2} ${Y + BOX_H + 130}, ${XS[0] + BOX_W / 2} ${Y + BOX_H + 12}`}
          fill="none"
          stroke={loopFlash > 0 ? T.accent : T.muted}
          strokeWidth={loopFlash > 0 ? 7 : 4}
          strokeDasharray="14 10"
          strokeDashoffset={-frame * 2}
          opacity={boxIn(2)}
        />
      </svg>
      <div
        style={{
          position: 'absolute', left: 480, top: Y + BOX_H + 100, width: 320, textAlign: 'center',
          fontSize: 26, fontWeight: 700, color: loopFlash > 0 ? T.accent : T.muted, opacity: boxIn(2),
        }}
      >
        ↺ {t.done} {t.loop}
      </div>

      {/* Finale */}
      <div
        style={{
          ...card('#fff'),
          position: 'absolute', left: 490, top: 560, width: 300, height: 100,
          opacity: doneIn, transform: `scale(${0.6 + finishIn * 0.4}) rotate(1deg)`,
          flexDirection: 'row', gap: 12,
        }}
      >
        <div style={{ fontSize: 40, fontWeight: 800, color: finishIn > 0.3 ? '#1c5c2e' : T.ink }}>{finishIn > 0.3 ? t.finish : t.done}</div>
      </div>
    </AbsoluteFill>
  );
};
