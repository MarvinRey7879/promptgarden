import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { T, type Lang } from './theme';

/**
 * MoE-Demo (R11): Mixture-of-Experts visualisiert — Tokens laufen durch den Router,
 * der pro Token nur 2 von 8 Experten aktiviert. Schlusschip: total vs. aktive Parameter
 * (Beispielwerte Kimi K3: 2,8T total, nur Bruchteil aktiv — Stand 07/2026).
 */
const dict: Record<Lang, { title: string; router: string; expert: string; token: string; chip: string }> = {
  de: { title: 'Mixture of Experts: 2 von 8 Experten pro Token', router: 'Router', expert: 'Experte', token: 'Token', chip: 'Riesig gespeichert, sparsam gerechnet — z. B. Kimi K3: 2,8 Bio. Parameter total, pro Token nur ein Bruchteil aktiv' },
  en: { title: 'Mixture of Experts: 2 of 8 experts per token', router: 'Router', expert: 'Expert', token: 'Token', chip: 'Huge storage, frugal compute — e.g. Kimi K3: 2.8T total parameters, only a fraction active per token' },
  es: { title: 'Mixture of Experts: 2 de 8 expertos por token', router: 'Router', expert: 'Experto', token: 'Token', chip: 'Almacena mucho, calcula poco — p. ej. Kimi K3: 2,8 billones de parámetros en total, solo una fracción activa por token' },
  fr: { title: 'Mixture of Experts : 2 experts sur 8 par token', router: 'Routeur', expert: 'Expert', token: 'Token', chip: 'Stockage énorme, calcul frugal — p. ex. Kimi K3 : 2,8 billions de paramètres au total, seule une fraction active par token' },
  zh: { title: '专家混合（MoE）：每个 Token 只激活 8 个专家中的 2 个', router: '路由器', expert: '专家', token: 'Token', chip: '存得多、算得省——例如 Kimi K3：共 2.8 万亿参数，每个 Token 只激活一小部分' },
};

// 3 Beispiel-Tokens, je mit den 2 aktivierten Experten-Indizes (0-7)
const TOKENS = [
  { label: 'def', experts: [1, 4] },
  { label: 'sort', experts: [0, 6] },
  { label: '(...)', experts: [3, 5] },
] as const;

const PHASE = 62; // Frames pro Token-Durchlauf

export const MoeDemo = ({ lang }: { lang: Lang }) => {
  const t = dict[lang];
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleIn = spring({ frame, fps, config: { damping: 200 } });
  const setupIn = spring({ frame: frame - 12, fps, config: { damping: 200 } });

  const ROUTER = { x: 300, y: 400 };
  const EXPERTS = Array.from({ length: 8 }, (_, i) => ({
    x: 640 + (i % 2) * 260,
    y: 180 + Math.floor(i / 2) * 118,
  }));

  const tokensStart = 45;
  const chipAt = tokensStart + TOKENS.length * PHASE + 12;
  const chipIn = spring({ frame: frame - chipAt, fps, config: { damping: 13, stiffness: 120 } });

  // Aktiver Token-Durchlauf
  const ti = Math.min(TOKENS.length - 1, Math.floor((frame - tokensStart) / PHASE));
  const tf = frame - tokensStart - ti * PHASE; // Frame innerhalb der Phase
  const inTokenPhase = frame >= tokensStart && frame < tokensStart + TOKENS.length * PHASE;
  const tok = TOKENS[Math.max(0, ti)];

  // Token fliegt von links zum Router (Frames 0-24 der Phase), Router "denkt" (24-34), Linien+Experten (34-62)
  const tokX = interpolate(tf, [0, 24], [40, ROUTER.x - 40], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const routerPulse = inTokenPhase && tf >= 24 && tf < 40 ? 1 + 0.12 * Math.sin(((tf - 24) / 16) * Math.PI) : 1;
  const lineIn = interpolate(tf, [34, 46], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const expertGlow = interpolate(tf, [38, 50], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill style={{ background: T.bg, fontFamily: T.font }}>
      <div style={{ position: 'absolute', top: 42, width: '100%', textAlign: 'center', fontSize: 40, fontWeight: 800, color: T.ink, letterSpacing: '-0.02em', opacity: titleIn, transform: `translateY(${(1 - titleIn) * -22}px)` }}>
        🧩 {t.title}
      </div>

      {/* Verbindungslinien Router -> aktive Experten */}
      {inTokenPhase && (
        <svg width={1280} height={720} style={{ position: 'absolute', inset: 0 }}>
          {tok.experts.map((ei) => {
            const e = EXPERTS[ei];
            const x2 = ROUTER.x + 70 + (e.x - ROUTER.x - 70) * lineIn;
            const y2 = ROUTER.y + (e.y + 44 - ROUTER.y) * lineIn;
            return (
              <line key={ei} x1={ROUTER.x + 70} y1={ROUTER.y} x2={x2} y2={y2} stroke={T.accent} strokeWidth={7} strokeLinecap="round" opacity={lineIn} />
            );
          })}
        </svg>
      )}

      {/* Router */}
      <div style={{ position: 'absolute', left: ROUTER.x - 70, top: ROUTER.y - 55, width: 140, height: 110, background: T.pink, border: `4px solid ${T.ink}`, borderRadius: 18, boxShadow: `5px 5px 0 ${T.ink}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, fontWeight: 800, color: T.ink, opacity: setupIn, transform: `scale(${setupIn * routerPulse})` }}>
        🔀 {t.router}
      </div>

      {/* 8 Experten */}
      {EXPERTS.map((e, i) => {
        const s = spring({ frame: frame - 16 - i * 3, fps, config: { damping: 14, stiffness: 150 } });
        const active = inTokenPhase && (tok.experts as readonly number[]).includes(i);
        const glow = active ? expertGlow : 0;
        const dim = inTokenPhase && tf >= 38 && !active ? 0.38 : 1;
        return (
          <div key={i} style={{ position: 'absolute', left: e.x, top: e.y, width: 220, height: 88, background: active ? T.lime : '#fff', border: `4px solid ${T.ink}`, borderRadius: 14, boxShadow: glow > 0.4 ? `6px 6px 0 ${T.ink}` : `3px 3px 0 ${T.ink}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 21, fontWeight: 800, color: T.ink, opacity: s * dim, transform: `scale(${s * (1 + glow * 0.06)})` }}>
            🧠 {t.expert} {i + 1}
          </div>
        );
      })}

      {/* Wandernder Token */}
      {inTokenPhase && tf < 34 && (
        <div style={{ position: 'absolute', left: tokX, top: ROUTER.y - 24, background: T.blue, border: `3px solid ${T.ink}`, borderRadius: 99, padding: '8px 20px', fontSize: 20, fontWeight: 800, color: T.ink, boxShadow: `3px 3px 0 ${T.ink}` }}>
          {t.token}: „{tok.label}"
        </div>
      )}

      {/* Schluss-Chip */}
      <div style={{ position: 'absolute', left: 120, right: 120, bottom: 30, background: T.accent, border: `4px solid ${T.ink}`, borderRadius: 16, padding: '14px 26px', fontSize: 21, fontWeight: 800, color: T.ink, textAlign: 'center', boxShadow: `5px 5px 0 ${T.ink}`, transform: `scale(${chipIn})`, opacity: chipIn }}>
        {t.chip}
      </div>
    </AbsoluteFill>
  );
};
