import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig, Easing } from 'remotion';
import { T, type Lang } from './theme';

const dict: Record<Lang, { title: string; total: string; segs: string[]; warn: string; compact: string }> = {
  de: { title: 'So füllt sich ein Context Window', total: '200k Token gesamt', segs: ['System-Prompt', 'Regeln', 'Chat-Verlauf', 'Tool-Ergebnisse'], warn: 'fast voll!', compact: 'kompaktieren → wieder Platz' },
  en: { title: 'How a context window fills up', total: '200k tokens total', segs: ['System prompt', 'Rules', 'Chat history', 'Tool results'], warn: 'almost full!', compact: 'compact → space again' },
  es: { title: 'Así se llena un context window', total: '200k tokens en total', segs: ['System prompt', 'Reglas', 'Historial', 'Resultados de tools'], warn: '¡casi llena!', compact: 'compactar → espacio otra vez' },
  fr: { title: 'Comment se remplit un context window', total: '200k tokens au total', segs: ['System prompt', 'Règles', 'Historique', 'Résultats des tools'], warn: 'presque pleine !', compact: 'compacter → de la place à nouveau' },
  zh: { title: '上下文窗口是这样被填满的', total: '共 200k Token', segs: ['系统提示词', '规则', '对话历史', '工具结果'], warn: '快满了！', compact: '压缩 → 又有空间' },
};

const BAR_X = 120;
const BAR_Y = 300;
const BAR_W = 1040;
const BAR_H = 120;
// Zielbreiten der 4 Segmente (Anteile), zusammen 0.95 (=fast voll)
const SHARES = [0.12, 0.14, 0.42, 0.27];
const COLORS = [T.yellow, T.pink, T.blue, '#e8d9c3'];
// Wachstums-Zeitfenster pro Segment (Frames)
const GROW: [number, number][] = [[60, 105], [110, 155], [160, 240], [245, 315]];

export const ContextWindow = ({ lang }: { lang: Lang }) => {
  const t = dict[lang];
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleIn = spring({ frame, fps, config: { damping: 200 } });
  const frameIn = spring({ frame: frame - 20, fps, config: { damping: 16, stiffness: 140 } });

  // Segmentbreiten
  const widths = SHARES.map((share, i) => {
    const p = interpolate(frame, GROW[i], [0, 1], { easing: Easing.inOut(Easing.quad), extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
    return share * (BAR_W - 8) * p;
  });
  const filled = widths.reduce((a, b) => a + b, 0);
  const fillRatio = filled / (BAR_W - 8);

  // Warnung ab ~85% Füllstand, blinkend
  const warnOn = fillRatio > 0.85 && frame < 380;
  const blink = warnOn ? (Math.floor(frame / 8) % 2 === 0 ? 1 : 0.25) : 0;

  // Kompaktierung ab Frame 380: Verlauf+Tools schrumpfen auf die Hälfte
  const compactP = interpolate(frame, [380, 425], [0, 1], { easing: Easing.inOut(Easing.quad), extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const finalWidths = widths.map((w, i) => (i >= 2 ? w * (1 - 0.5 * compactP) : w));

  let x = BAR_X + 4;
  const rects = finalWidths.map((w, i) => {
    const r = { x, w, color: COLORS[i], label: t.segs[i] };
    x += w;
    return r;
  });

  return (
    <AbsoluteFill style={{ background: T.bg, fontFamily: T.font }}>
      <div
        style={{
          position: 'absolute', top: 70, width: '100%', textAlign: 'center',
          fontSize: 52, fontWeight: 800, color: T.ink, letterSpacing: '-0.02em',
          opacity: titleIn, transform: `translateY(${(1 - titleIn) * -30}px)`,
        }}
      >
        {t.title}
      </div>
      <div style={{ position: 'absolute', top: 200, width: '100%', textAlign: 'center', fontSize: 28, fontWeight: 700, color: T.muted, opacity: frameIn }}>
        {t.total}
      </div>

      {/* Fenster-Rahmen */}
      <div
        style={{
          position: 'absolute', left: BAR_X, top: BAR_Y, width: BAR_W, height: BAR_H,
          border: `5px solid ${T.ink}`, borderRadius: 20, background: '#fff',
          boxShadow: `8px 8px 0 ${T.ink}`, transform: `scale(${frameIn})`,
        }}
      />

      {/* Segmente */}
      {rects.map((r, i) => (
        <div key={i} style={{ position: 'absolute', left: r.x, top: BAR_Y + 8, width: Math.max(0, r.w - 6), height: BAR_H - 26, background: r.color, border: `3px solid ${T.ink}`, borderRadius: 12 }} />
      ))}

      {/* Labels unter der Bar */}
      {rects.map((r, i) => (
        <div
          key={i}
          style={{
            position: 'absolute', left: r.x - 60 + (r.w - 6) / 2, top: BAR_Y + BAR_H + 18 + (i % 2) * 40, width: 120,
            textAlign: 'center', fontSize: 22, fontWeight: 800, color: T.ink,
            opacity: interpolate(frame, [GROW[i][0] + 10, GROW[i][0] + 25], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
          }}
        >
          {r.label}
        </div>
      ))}

      {/* Warn-Marker bei 90% */}
      <div style={{ position: 'absolute', left: BAR_X + BAR_W * 0.9, top: BAR_Y - 16, width: 5, height: BAR_H + 32, background: T.accent, opacity: frameIn * 0.9 }} />
      <div
        style={{
          position: 'absolute', left: BAR_X + BAR_W * 0.9 - 140, top: BAR_Y - 80, width: 280, textAlign: 'center',
          fontSize: 34, fontWeight: 800, color: T.accent, opacity: blink,
        }}
      >
        ⚠ {t.warn}
      </div>

      {/* Kompaktierungs-Botschaft */}
      <div
        style={{
          position: 'absolute', top: 580, width: '100%', textAlign: 'center',
          fontSize: 36, fontWeight: 800, color: '#1c5c2e',
          opacity: compactP, transform: `scale(${0.8 + compactP * 0.2})`,
        }}
      >
        🧹 {t.compact}
      </div>
    </AbsoluteFill>
  );
};
