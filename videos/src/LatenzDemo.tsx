import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { T, type Lang } from './theme';

/**
 * Latenz-Demo (R13): die Hebel gegen Antwortzeit in der Reihenfolge ihrer Wirkung,
 * wie im Kapitel latenz-optimieren beschrieben. Nur EINE harte Zahl im Clip —
 * die 85 % beim Prompt-Caching, belegt durch anthropic.com/news/prompt-caching.
 * Alle anderen Balken zeigen die Rangfolge, nicht erfundene Prozentwerte.
 */
const dict: Record<Lang, { title: string; sub: string; steps: string[]; notes: string[]; footer: string }> = {
  de: {
    title: 'Antwortzeit senken: was wirkt am stärksten?',
    sub: 'Reihenfolge nach Wirkung',
    steps: ['Schnelleres Modell', 'Kürzerer Prompt', 'Prompt-Caching', 'Thinking-Budget', 'Streaming'],
    notes: ['größter Sprung', 'jedes Token zählt', 'bis 85 % bei langen Prompts', 'nur wo nötig denken', 'nur gefühlt schneller'],
    footer: 'Streaming ändert die Wahrnehmung, nicht die Gesamtdauer.',
  },
  en: {
    title: 'Cutting response time: what helps most?',
    sub: 'Ranked by impact',
    steps: ['Faster model', 'Shorter prompt', 'Prompt caching', 'Thinking budget', 'Streaming'],
    notes: ['biggest jump', 'every token counts', 'up to 85% on long prompts', 'think only where needed', 'only feels faster'],
    footer: 'Streaming changes perception, not total duration.',
  },
  es: {
    title: 'Reducir el tiempo de respuesta: ¿qué ayuda más?',
    sub: 'Ordenado por impacto',
    steps: ['Modelo más rápido', 'Prompt más corto', 'Prompt caching', 'Presupuesto de razonamiento', 'Streaming'],
    notes: ['el mayor salto', 'cada token cuenta', 'hasta 85 % en prompts largos', 'pensar solo si hace falta', 'solo se siente más rápido'],
    footer: 'El streaming cambia la percepción, no la duración total.',
  },
  fr: {
    title: 'Réduire le temps de réponse : qu’est-ce qui aide le plus ?',
    sub: 'Classé par impact',
    steps: ['Modèle plus rapide', 'Prompt plus court', 'Prompt caching', 'Budget de réflexion', 'Streaming'],
    notes: ['le plus grand gain', 'chaque token compte', 'jusqu’à 85 % sur prompts longs', 'réfléchir là où il faut', 'seulement ressenti'],
    footer: 'Le streaming change la perception, pas la durée totale.',
  },
  zh: {
    title: '降低响应时间：什么最有效？',
    sub: '按效果排序',
    steps: ['更快的模型', '更短的提示词', '提示缓存', '思考预算', '流式输出'],
    notes: ['提升最大', '每个 token 都算数', '长提示词最高降 85%', '只在需要时思考', '只是感觉更快'],
    footer: '流式输出改变的是感受，而不是总时长。',
  },
};

// Balkenlänge = Rangfolge aus dem Kapitel, nicht gemessene Prozentwerte
const BARS = [0.95, 0.78, 0.62, 0.42, 0.24];
const COLORS = [T.lime, T.lime, T.accent, T.blue, T.pink];

export const LatenzDemo = ({ lang }: { lang: Lang }) => {
  const t = dict[lang];
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleIn = spring({ frame, fps, config: { damping: 200 } });
  const subIn = spring({ frame: frame - 14, fps, config: { damping: 200 } });

  const LEFT = 118;
  const LABEL_W = 330;
  const BAR_X = LEFT + LABEL_W;
  const BAR_MAX = 560;
  const TOP = 228;
  const ROW_H = 74;
  const START = 40;
  const STEP = 34;

  const footerIn = spring({ frame: frame - (START + 5 * STEP + 40), fps, config: { damping: 14, stiffness: 120 } });

  return (
    <AbsoluteFill style={{ background: T.bg, fontFamily: T.font }}>
      <div style={{ position: 'absolute', top: 48, width: '100%', textAlign: 'center', fontSize: 42, fontWeight: 800, color: T.ink, letterSpacing: '-0.02em', opacity: titleIn, transform: `translateY(${(1 - titleIn) * -22}px)` }}>
        ⚡ {t.title}
      </div>
      <div style={{ position: 'absolute', top: 122, width: '100%', textAlign: 'center', fontSize: 22, fontWeight: 700, color: T.muted, opacity: subIn }}>
        {t.sub} ↓
      </div>

      {t.steps.map((label, i) => {
        const appear = spring({ frame: frame - START - i * STEP, fps, config: { damping: 15, stiffness: 130 } });
        const grow = interpolate(frame, [START + i * STEP + 6, START + i * STEP + 30], [0, 1], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        });
        const y = TOP + i * ROW_H;
        return (
          <div key={label}>
            <div
              style={{
                position: 'absolute', left: LEFT, top: y + 12, width: LABEL_W - 24,
                fontSize: 23, fontWeight: 800, color: T.ink, textAlign: 'right',
                opacity: appear, transform: `translateX(${(1 - appear) * -30}px)`,
              }}
            >
              {label}
            </div>
            <div
              style={{
                position: 'absolute', left: BAR_X, top: y, height: 52,
                width: BAR_MAX * BARS[i] * grow,
                background: COLORS[i], border: `3px solid ${T.ink}`, borderRadius: 10,
                boxShadow: `4px 4px 0 ${T.ink}`, opacity: appear,
              }}
            />
            {/* Kurze Balken tragen ihren Text daneben statt darin — sonst läuft er über den Rand. */}
            <div
              style={{
                position: 'absolute',
                left: BARS[i] < 0.35 ? BAR_X + BAR_MAX * BARS[i] + 16 : BAR_X + 14,
                top: y + 13,
                fontSize: 19,
                fontWeight: 800,
                color: BARS[i] < 0.35 ? T.muted : T.ink,
                opacity: grow > 0.55 ? 1 : 0,
                whiteSpace: 'nowrap',
              }}
            >
              {t.notes[i]}
            </div>
          </div>
        );
      })}

      <div
        style={{
          position: 'absolute', left: 118, right: 118, bottom: 28,
          background: '#fff', border: `3px dashed ${T.muted}`, borderRadius: 14,
          padding: '13px 22px', fontSize: 20, fontWeight: 700, color: T.ink, textAlign: 'center',
          opacity: footerIn, transform: `scale(${0.96 + footerIn * 0.04})`,
        }}
      >
        {t.footer}
      </div>
    </AbsoluteFill>
  );
};
