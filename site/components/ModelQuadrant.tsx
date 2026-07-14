/**
 * Kosten-vs-Fähigkeit-Quadrant (inline SVG, 1d-Stil, server-rendered).
 * Position NUR aus Anbieter-Positionierung + Preis-Tier (Quellen in vergleiche.json),
 * keine eigenen Benchmark-Urteile. tier: 1 (niedrig) … 3 (hoch), halbstufig erlaubt.
 */
export type QuadrantModel = {
  name: string;
  anbieter: string;
  kostenTier: number; // 1 günstig … 3 teuer
  capTier: number; // 1 Einstieg … 3 Spitze
};

const PROVIDER_COLORS: Record<string, string> = {
  Anthropic: 'var(--lime)',
  OpenAI: 'var(--blue)',
  Google: 'var(--yellow)',
  xAI: 'var(--pink)',
};

export default function ModelQuadrant({
  title,
  xLow,
  xHigh,
  yLow,
  yHigh,
  models,
}: {
  title: string;
  xLow: string;
  xHigh: string;
  yLow: string;
  yHigh: string;
  models: QuadrantModel[];
}) {
  const W = 760;
  const H = 460;
  const PAD = { l: 70, r: 30, t: 46, b: 52 };
  const px = (t: number) => PAD.l + ((t - 0.5) / 3) * (W - PAD.l - PAD.r);
  const py = (t: number) => H - PAD.b - ((t - 0.5) / 3) * (H - PAD.t - PAD.b);

  // Einfache Kollision-Vermeidung: gleiche Position → vertikal staffeln
  const seen = new Map<string, number>();
  const placed = models.map((m) => {
    const key = `${m.kostenTier}:${m.capTier}`;
    const n = seen.get(key) ?? 0;
    seen.set(key, n + 1);
    return { ...m, x: px(m.kostenTier), y: py(m.capTier) + n * 30 };
  });

  return (
    <div className="card" style={{ padding: '18px 22px', marginBottom: 26, background: '#fff', boxShadow: '4px 4px 0 var(--ink)', overflowX: 'auto' }}>
      <svg viewBox={`0 0 ${W} ${H}`} style={{ display: 'block', width: '100%', minWidth: 520, height: 'auto' }} role="img" aria-label={title}>
        <text x={W / 2} y={26} textAnchor="middle" fontSize={19} fontWeight={800} fill="var(--ink)">{title}</text>
        {/* Achsen */}
        <line x1={PAD.l} y1={H - PAD.b} x2={W - PAD.r} y2={H - PAD.b} stroke="var(--ink)" strokeWidth={3} />
        <line x1={PAD.l} y1={H - PAD.b} x2={PAD.l} y2={PAD.t} stroke="var(--ink)" strokeWidth={3} />
        {/* Gitter-Mitte */}
        <line x1={px(2)} y1={PAD.t} x2={px(2)} y2={H - PAD.b} stroke="var(--muted)" strokeWidth={1.5} strokeDasharray="6 6" opacity={0.4} />
        <line x1={PAD.l} y1={py(2)} x2={W - PAD.r} y2={py(2)} stroke="var(--muted)" strokeWidth={1.5} strokeDasharray="6 6" opacity={0.4} />
        {/* Achsen-Labels */}
        <text x={PAD.l} y={H - 18} fontSize={13} fontWeight={700} fill="var(--muted)">{xLow}</text>
        <text x={W - PAD.r} y={H - 18} textAnchor="end" fontSize={13} fontWeight={700} fill="var(--muted)">{xHigh}</text>
        <text x={PAD.l - 10} y={H - PAD.b} textAnchor="end" fontSize={13} fontWeight={700} fill="var(--muted)" transform={`rotate(-90 ${PAD.l - 10} ${H - PAD.b})`}>{yLow}</text>
        <text x={PAD.l - 10} y={PAD.t + 4} textAnchor="end" fontSize={13} fontWeight={700} fill="var(--muted)" transform={`rotate(-90 ${PAD.l - 10} ${PAD.t + 4})`} style={{ display: 'none' }}>{yHigh}</text>
        <text x={PAD.l - 44} y={PAD.t + 8} fontSize={13} fontWeight={700} fill="var(--muted)" writing-mode="tb" style={{ writingMode: 'vertical-rl' }}>{yHigh}</text>
        {/* Punkte */}
        {placed.map((m) => (
          <g key={m.name}>
            <circle cx={m.x} cy={m.y} r={9} fill={PROVIDER_COLORS[m.anbieter] ?? '#fff'} stroke="var(--ink)" strokeWidth={3} />
            <text x={m.x + 14} y={m.y + 5} fontSize={13.5} fontWeight={700} fill="var(--ink)">{m.name}</text>
          </g>
        ))}
      </svg>
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 8 }}>
        {[...new Set(models.map((m) => m.anbieter))].map((a) => (
          <span key={a} className="mono" style={{ fontSize: 11.5, display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            <span style={{ width: 12, height: 12, borderRadius: 99, background: PROVIDER_COLORS[a] ?? '#fff', border: '2px solid var(--ink)', display: 'inline-block' }} />
            {a}
          </span>
        ))}
      </div>
    </div>
  );
}
