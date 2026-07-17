import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { T, type Lang } from './theme';

/**
 * Vergleiche-Demo (R10): Mini-Version des Intelligenz-pro-Dollar-Scatters —
 * Punkte fliegen ein, Zonen-Chips erscheinen, Sweet-Spot wird markiert.
 * Werte = echte Daten aus vergleiche.json (Stand 17.07.2026).
 */
const dict: Record<Lang, { title: string; x: string; y: string; frontier: string; preis: string; budget: string; sweet: string }> = {
  de: { title: 'Welches Modell lohnt sich? Intelligenz pro Dollar', x: 'Preis (log)', y: 'Intelligenz-Index', frontier: 'Frontier', preis: 'Preis-Leistung', budget: 'Budget', sweet: '★ Sweet Spot' },
  en: { title: 'Which model is worth it? Intelligence per dollar', x: 'Price (log)', y: 'Intelligence index', frontier: 'Frontier', preis: 'Value', budget: 'Budget', sweet: '★ Sweet spot' },
  es: { title: '¿Qué modelo vale la pena? Inteligencia por dólar', x: 'Precio (log)', y: 'Índice de inteligencia', frontier: 'Frontier', preis: 'Calidad-precio', budget: 'Budget', sweet: '★ Punto óptimo' },
  fr: { title: 'Quel modèle vaut le coup ? Intelligence par dollar', x: 'Prix (log)', y: "Indice d'intelligence", frontier: 'Frontier', preis: 'Rapport qualité-prix', budget: 'Budget', sweet: '★ Sweet spot' },
  zh: { title: '哪个模型划算？每美元的智能', x: '价格（对数）', y: '智能指数', frontier: '前沿', preis: '性价比', budget: '经济', sweet: '★ 最佳选择' },
};

// Echte Werte (blended $, AA-Index) — Teilmenge für den Clip
const POINTS = [
  { name: 'Fable 5', blended: 20, index: 59.86, cluster: 'frontier' },
  { name: 'GPT-5.6 Sol', blended: 11.25, index: 58.89, cluster: 'frontier' },
  { name: 'Kimi K3', blended: 6, index: 57.11, cluster: 'frontier' },
  { name: 'Grok 4.5', blended: 3, index: 53.83, cluster: 'preis' },
  { name: 'Sonnet 5', blended: 4, index: 53.35, cluster: 'preis' },
  { name: 'DeepSeek-V4-Pro', blended: 0.54, index: 44.27, cluster: 'budget', star: true },
  { name: 'GLM-4.7', blended: 1, index: 33.7, cluster: 'budget' },
] as const;

const CLUSTER_COLORS: Record<string, string> = { frontier: T.pink, preis: T.lime, budget: T.blue };

export const CompareDemo = ({ lang }: { lang: Lang }) => {
  const t = dict[lang];
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const W = 1280;
  const PAD = { l: 150, r: 120, t: 150, b: 140 };
  const XMIN = Math.log10(0.4);
  const XMAX = Math.log10(25);
  const px = (b: number) => PAD.l + ((Math.log10(b) - XMIN) / (XMAX - XMIN)) * (W - PAD.l - PAD.r);
  const py = (i: number) => 720 - PAD.b - ((i - 25) / (63 - 25)) * (720 - PAD.t - PAD.b);

  const titleIn = spring({ frame, fps, config: { damping: 200 } });
  const axesIn = spring({ frame: frame - 12, fps, config: { damping: 200 } });
  const chipAt = 40 + POINTS.length * 18 + 10; // nach allen Punkten
  const sweetIn = spring({ frame: frame - chipAt - 55, fps, config: { damping: 10, stiffness: 120 } });

  return (
    <AbsoluteFill style={{ background: T.bg, fontFamily: T.font }}>
      <div style={{ position: 'absolute', top: 42, width: '100%', textAlign: 'center', fontSize: 42, fontWeight: 800, color: T.ink, letterSpacing: '-0.02em', opacity: titleIn, transform: `translateY(${(1 - titleIn) * -22}px)` }}>
        📊 {t.title}
      </div>

      {/* Achsen */}
      <div style={{ position: 'absolute', left: PAD.l, top: PAD.t, width: W - PAD.l - PAD.r, height: 720 - PAD.t - PAD.b, borderLeft: `4px solid ${T.ink}`, borderBottom: `4px solid ${T.ink}`, opacity: axesIn }} />
      <div style={{ position: 'absolute', left: PAD.l, bottom: 96, width: W - PAD.l - PAD.r, textAlign: 'center', fontSize: 17, fontWeight: 700, color: T.muted, opacity: axesIn }}>{t.x} →</div>
      <div style={{ position: 'absolute', left: 86, top: 340, fontSize: 17, fontWeight: 700, color: T.muted, transform: 'rotate(-90deg)', transformOrigin: 'left top', opacity: axesIn }}>{t.y} →</div>

      {/* Punkte fliegen ein */}
      {POINTS.map((p, i) => {
        const s = spring({ frame: frame - 40 - i * 18, fps, config: { damping: 11, stiffness: 140 } });
        const x = px(p.blended);
        const y = py(p.index);
        return (
          <div key={p.name} style={{ position: 'absolute', left: x - 15, top: y - 15, transform: `scale(${s})`, opacity: s }}>
            <div style={{ width: 30, height: 30, borderRadius: '50%', background: CLUSTER_COLORS[p.cluster], border: `4px solid ${T.ink}`, boxShadow: `3px 3px 0 ${T.ink}` }} />
            <div style={{ position: 'absolute', left: 38, top: 3, fontSize: 18, fontWeight: 800, color: T.ink, whiteSpace: 'nowrap' }}>{p.name}</div>
          </div>
        );
      })}

      {/* Zonen-Chips */}
      {(['frontier', 'preis', 'budget'] as const).map((c, i) => {
        const s = spring({ frame: frame - chipAt - i * 12, fps, config: { damping: 12, stiffness: 130 } });
        return (
          <div key={c} style={{ position: 'absolute', left: 190 + i * 300, bottom: 34, background: CLUSTER_COLORS[c], border: `3px solid ${T.ink}`, borderRadius: 99, padding: '8px 24px', fontSize: 21, fontWeight: 800, color: T.ink, transform: `scale(${s})`, opacity: s, boxShadow: `4px 4px 0 ${T.ink}` }}>
            {t[c]}
          </div>
        );
      })}

      {/* Sweet-Spot-Marker auf DeepSeek */}
      <div
        style={{
          position: 'absolute', left: px(0.54) - 46, top: py(44.27) - 46, width: 92, height: 92,
          border: `5px dashed ${T.accent}`, borderRadius: '50%',
          transform: `scale(${sweetIn})`, opacity: sweetIn,
        }}
      />
      <div style={{ position: 'absolute', left: px(0.54) - 30, top: py(44.27) + 54, fontSize: 22, fontWeight: 800, color: T.accent, transform: `scale(${sweetIn})`, opacity: sweetIn }}>
        {t.sweet}
      </div>
    </AbsoluteFill>
  );
};
