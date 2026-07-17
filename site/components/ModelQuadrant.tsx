/**
 * Intelligenz-pro-Dollar-Scatter (v3, inline SVG, 1d-Stil, server-rendered).
 * x = Blended-Preis $/1M (3:1 Eingabe:Ausgabe) auf log10-Skala, y = Artificial-Analysis-
 * Intelligence-Index v4.1. Werte kommen 1:1 aus vergleiche.json (Quellen dort, Stand-Marker
 * im hinweis) — die Komponente rechnet nichts um außer der Achsen-Projektion.
 */
export type QuadrantModel = {
  name: string;
  anbieter: string;
  blended: number; // $ pro 1M Token, gemischt 3:1
  index: number; // AA Intelligence Index v4.1
  cluster: 'frontier' | 'preis' | 'budget';
  open: boolean;
  la?: 'l' | 'r' | 'b' | 't'; // Label-Anker gegen Kollisionen
  badge?: string;
  hinweis?: string;
};

export type QuadrantZone = { id: string; label: string; desc: string };

const CLUSTER_COLORS: Record<string, string> = {
  frontier: 'var(--pink)',
  preis: 'var(--lime)',
  budget: 'var(--blue)',
};

export default function ModelQuadrant({
  title,
  intro,
  xLabel,
  yLabel,
  hinweis,
  zones,
  openLabel,
  models,
}: {
  title: string;
  intro: string;
  xLabel: string;
  yLabel: string;
  hinweis: string;
  zones: QuadrantZone[];
  openLabel: string;
  models: QuadrantModel[];
}) {
  const W = 860;
  const H = 560;
  const PAD = { l: 64, r: 26, t: 20, b: 64 };
  // x: log10(Preis), Bereich 0,4 $ … 25 $
  const XMIN = Math.log10(0.4);
  const XMAX = Math.log10(25);
  const YMIN = 20;
  const YMAX = 63;
  const px = (blended: number) => PAD.l + ((Math.log10(blended) - XMIN) / (XMAX - XMIN)) * (W - PAD.l - PAD.r);
  const py = (idx: number) => H - PAD.b - ((idx - YMIN) / (YMAX - YMIN)) * (H - PAD.t - PAD.b);
  const TICKS = [0.5, 1, 2, 5, 10, 20];
  const YTICKS = [25, 35, 45, 55];

  const label = (m: QuadrantModel) => {
    const x = px(m.blended);
    const y = py(m.index);
    switch (m.la ?? 'r') {
      case 'l': return { x: x - 13, y: y + 4.5, anchor: 'end' as const };
      case 'b': return { x, y: y + 22, anchor: 'middle' as const };
      case 't': return { x, y: y - 14, anchor: 'middle' as const };
      default: return { x: x + 13, y: y + 4.5, anchor: 'start' as const };
    }
  };

  return (
    <div className="card" style={{ padding: '18px 22px', marginBottom: 26, background: '#fff', boxShadow: '4px 4px 0 var(--ink)' }}>
      <h3 style={{ margin: '4px 0 6px', fontSize: 20, fontWeight: 800, letterSpacing: '-.02em' }}>{title}</h3>
      <p style={{ margin: '0 0 12px', fontSize: 14, color: 'var(--muted)', lineHeight: 1.5 }}>{intro}</p>
      <div style={{ overflowX: 'auto' }}>
        <svg viewBox={`0 0 ${W} ${H}`} style={{ display: 'block', width: '100%', minWidth: 640, height: 'auto' }} role="img" aria-label={title}>
          {/* Gitter */}
          {TICKS.map((t) => (
            <g key={t}>
              <line x1={px(t)} y1={PAD.t} x2={px(t)} y2={H - PAD.b} stroke="var(--muted)" strokeWidth={1} strokeDasharray="4 6" opacity={0.35} />
              <text x={px(t)} y={H - PAD.b + 20} textAnchor="middle" fontSize={12.5} fontWeight={700} fill="var(--muted)">{t} $</text>
            </g>
          ))}
          {YTICKS.map((t) => (
            <g key={t}>
              <line x1={PAD.l} y1={py(t)} x2={W - PAD.r} y2={py(t)} stroke="var(--muted)" strokeWidth={1} strokeDasharray="4 6" opacity={0.35} />
              <text x={PAD.l - 8} y={py(t) + 4} textAnchor="end" fontSize={12.5} fontWeight={700} fill="var(--muted)">{t}</text>
            </g>
          ))}
          {/* Achsen */}
          <line x1={PAD.l} y1={H - PAD.b} x2={W - PAD.r} y2={H - PAD.b} stroke="var(--ink)" strokeWidth={3} />
          <line x1={PAD.l} y1={H - PAD.b} x2={PAD.l} y2={PAD.t} stroke="var(--ink)" strokeWidth={3} />
          <text x={(PAD.l + W - PAD.r) / 2} y={H - 14} textAnchor="middle" fontSize={13} fontWeight={700} fill="var(--muted)">{xLabel}</text>
          <text x={16} y={(PAD.t + H - PAD.b) / 2} fontSize={13} fontWeight={700} fill="var(--muted)" style={{ writingMode: 'vertical-rl' }}>{yLabel}</text>
          {/* Punkte */}
          {models.map((m) => {
            const x = px(m.blended);
            const y = py(m.index);
            const l = label(m);
            return (
              <g key={m.name}>
                {m.open && <circle cx={x} cy={y} r={14} fill="none" stroke="var(--ink)" strokeWidth={1.8} strokeDasharray="3 3" />}
                <circle cx={x} cy={y} r={9} fill={CLUSTER_COLORS[m.cluster]} stroke="var(--ink)" strokeWidth={3} />
                <text x={l.x} y={l.y} textAnchor={l.anchor} fontSize={13} fontWeight={700} fill="var(--ink)">{m.name}</text>
                {m.badge && (
                  <text x={l.anchor === 'end' ? l.x : l.x} y={l.y + 14} textAnchor={l.anchor} fontSize={10.5} fontWeight={800} fill="var(--accent)">
                    ★ {m.badge}
                  </text>
                )}
              </g>
            );
          })}
        </svg>
      </div>
      {/* Zonen-Legende: wann nimmst du was */}
      <div className="quadrant-zones" style={{ display: 'grid', gap: 10, marginTop: 14 }}>
        {zones.map((z) => (
          <div key={z.id} style={{ border: '2.5px solid var(--ink)', borderRadius: 14, padding: '10px 14px', background: CLUSTER_COLORS[z.id] }}>
            <span style={{ fontWeight: 800, fontSize: 14 }}>{z.label}</span>
            <span style={{ fontSize: 13.5, marginLeft: 8 }}>{z.desc}</span>
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', marginTop: 12, alignItems: 'center' }}>
        <span className="mono" style={{ fontSize: 11.5, display: 'inline-flex', alignItems: 'center', gap: 6 }}>
          <span style={{ width: 14, height: 14, borderRadius: 99, border: '2px dashed var(--ink)', display: 'inline-block' }} />
          {openLabel}
        </span>
      </div>
      <p style={{ margin: '12px 0 0', fontSize: 12, color: 'var(--muted)', lineHeight: 1.5 }}>{hinweis}</p>
    </div>
  );
}
