/**
 * Visualisierungen für /addons (Marvin-Regel 13.07): Graphify-Prinzip + Obsidian↔Claude.
 * Inline-SVG im 1d-Design, kein Client-JS. Muster wie LoopDiagram.tsx.
 * Mobil (≤760px): statt Horizontal-Scroll ein vertikal gestapelter Fluss
 * (Boxen untereinander mit ↓/↕-Pfeilen) — alles auf einen Blick (Marvin 23.07).
 */

export type AddonDiagramLabels = {
  graphifyTitle: string;
  gSrc: string; gSrcSub: string;
  gParse: string; gParseSub: string;
  gGraph: string; gGraphSub: string;
  gAgent: string; gAgentSub: string;
  gNote: string;
  obsTitle: string;
  oVault: string; oVaultSub: string;
  oPlugin: string; oPluginSub: string;
  oClaude: string; oClaudeSub: string;
  oArrow1: string; oArrow2: string;
};

function Box({
  x, y, w, h, fill, title, sub,
}: { x: number; y: number; w: number; h: number; fill: string; title: string; sub: string }) {
  return (
    <g>
      <rect x={x + 4} y={y + 4} width={w} height={h} rx={12} fill="#1e1a16" />
      <rect x={x} y={y} width={w} height={h} rx={12} fill={fill} stroke="#1e1a16" strokeWidth={2.5} />
      <text x={x + w / 2} y={y + h / 2 - 5} textAnchor="middle" fontWeight={800} fontSize={14.5} fill="#1e1a16">
        {title}
      </text>
      <text x={x + w / 2} y={y + h / 2 + 14} textAnchor="middle" fontSize={10.5} fill="#1e1a16" opacity={0.75}>
        {sub}
      </text>
    </g>
  );
}

const Arrow = ({ x1, y1, x2, y2, dashed = false }: { x1: number; y1: number; x2: number; y2: number; dashed?: boolean }) => (
  <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#1e1a16" strokeWidth={2.5} markerEnd="url(#aarr)" strokeDasharray={dashed ? '7 5' : undefined} />
);

/** Vertikaler Mobil-Fluss: Boxen untereinander, Pfeil je Lücke (↓ oder ↕). */
type FlowStep = { emoji: string; title: string; sub?: string; fill: string; connector?: '↓' | '↕'; connectorLabel?: string };

function MobileFlow({ steps, note }: { steps: FlowStep[]; note?: string }) {
  return (
    <div className="show-mobile" style={{ padding: '2px 16px 16px' }}>
      {steps.map((s, i) => (
        <div key={s.title}>
          <div style={{ border: '2.5px solid #1e1a16', borderRadius: 12, background: s.fill, boxShadow: '3px 3px 0 #1e1a16', padding: '10px 14px' }}>
            <div style={{ fontWeight: 800, fontSize: 14.5, color: '#1e1a16' }}>{s.emoji} {s.title}</div>
            {s.sub && <div style={{ fontSize: 11.5, opacity: 0.75, color: '#1e1a16', marginTop: 2 }}>{s.sub}</div>}
          </div>
          {i < steps.length - 1 && (
            <div aria-hidden="true" style={{ textAlign: 'center', fontSize: 20, lineHeight: '24px', color: '#1e1a16' }}>
              {s.connector ?? '↓'}
              {s.connectorLabel && <span style={{ fontSize: 11, fontStyle: 'italic', marginLeft: 6 }}>{s.connectorLabel}</span>}
            </div>
          )}
        </div>
      ))}
      {note && <p style={{ fontStyle: 'italic', fontSize: 12, textAlign: 'center', margin: '10px 0 0', color: '#1e1a16' }}>{note}</p>}
    </div>
  );
}

export function GraphifyDiagram({ t }: { t: AddonDiagramLabels }) {
  const steps: FlowStep[] = [
    { emoji: '📁', title: t.gSrc, sub: t.gSrcSub, fill: '#fff', connector: '↓' },
    { emoji: '🌳', title: t.gParse, sub: t.gParseSub, fill: 'var(--blue, #bcd8f0)', connector: '↓' },
    { emoji: '🕸️', title: t.gGraph, sub: t.gGraphSub, fill: 'var(--yellow, #f5d76e)', connector: '↕' },
    { emoji: '🤖', title: t.gAgent, fill: 'var(--lime, #cde8a5)' },
  ];
  return (
    <figure style={{ margin: '0 0 18px' }} className="card" role="img" aria-label={t.graphifyTitle}>
      <div style={{ padding: '16px 18px 4px' }}>
        <p className="kicker" style={{ margin: 0 }}>🕸️ {t.graphifyTitle.toUpperCase()}</p>
      </div>
      <div className="hide-mobile" style={{ overflowX: 'auto' }}>
        <svg viewBox="0 0 720 170" style={{ display: 'block', width: '100%', minWidth: 600, height: 'auto' }} fontFamily="inherit">
          <defs>
            <marker id="aarr" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#1e1a16" />
            </marker>
          </defs>
          <Box x={20} y={40} w={150} h={62} fill="#fff" title={`📁 ${t.gSrc}`} sub={t.gSrcSub} />
          <Box x={205} y={40} w={150} h={62} fill="var(--blue, #bcd8f0)" title={`🌳 ${t.gParse}`} sub={t.gParseSub} />
          <Box x={390} y={40} w={150} h={62} fill="var(--yellow, #f5d76e)" title={`🕸️ ${t.gGraph}`} sub={t.gGraphSub} />
          <Box x={575} y={40} w={125} h={62} fill="var(--lime, #cde8a5)" title={`🤖 ${t.gAgent}`} sub={''} />
          <Arrow x1={172} y1={71} x2={200} y2={71} />
          <Arrow x1={357} y1={71} x2={385} y2={71} />
          {/* Agent fragt Graph: Doppelpfeil */}
          <Arrow x1={572} y1={62} x2={544} y2={62} />
          <Arrow x1={544} y1={80} x2={572} y2={80} />
          <text x={360} y={135} textAnchor="middle" fontSize={12} fontStyle="italic" fill="#1e1a16">
            {t.gAgentSub} · {t.gNote}
          </text>
        </svg>
      </div>
      <MobileFlow steps={steps} note={`${t.gAgentSub} · ${t.gNote}`} />
    </figure>
  );
}

export function ObsidianClaudeDiagram({ t }: { t: AddonDiagramLabels }) {
  const steps: FlowStep[] = [
    { emoji: '🗂️', title: t.oVault, sub: t.oVaultSub, fill: '#e0d4f7', connector: '↕', connectorLabel: t.oArrow1 },
    { emoji: '🔌', title: t.oPlugin, sub: t.oPluginSub, fill: '#fff', connector: '↕', connectorLabel: t.oArrow2 },
    { emoji: '✳️', title: t.oClaude, sub: t.oClaudeSub, fill: 'var(--pink, #f3c1c1)' },
  ];
  return (
    <figure style={{ margin: '0 0 26px' }} className="card" role="img" aria-label={t.obsTitle}>
      <div style={{ padding: '16px 18px 4px' }}>
        <p className="kicker" style={{ margin: 0 }}>🔮 {t.obsTitle.toUpperCase()}</p>
      </div>
      <div className="hide-mobile" style={{ overflowX: 'auto' }}>
        <svg viewBox="0 0 720 150" style={{ display: 'block', width: '100%', minWidth: 600, height: 'auto' }} fontFamily="inherit">
          <defs>
            <marker id="aarr2" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#1e1a16" />
            </marker>
          </defs>
          <Box x={30} y={35} w={175} h={62} fill="#e0d4f7" title={`🗂️ ${t.oVault}`} sub={t.oVaultSub} />
          <Box x={270} y={35} w={180} h={62} fill="#fff" title={`🔌 ${t.oPlugin}`} sub={t.oPluginSub} />
          <Box x={515} y={35} w={185} h={62} fill="var(--pink, #f3c1c1)" title={`✳️ ${t.oClaude}`} sub={t.oClaudeSub} />
          {/* Doppelpfeile */}
          <line x1={207} y1={58} x2={265} y2={58} stroke="#1e1a16" strokeWidth={2.5} markerEnd="url(#aarr2)" />
          <line x1={265} y1={76} x2={207} y2={76} stroke="#1e1a16" strokeWidth={2.5} markerEnd="url(#aarr2)" />
          <line x1={452} y1={58} x2={510} y2={58} stroke="#1e1a16" strokeWidth={2.5} markerEnd="url(#aarr2)" />
          <line x1={510} y1={76} x2={452} y2={76} stroke="#1e1a16" strokeWidth={2.5} markerEnd="url(#aarr2)" />
          <text x={236} y={122} textAnchor="middle" fontSize={11.5} fontStyle="italic" fill="#1e1a16">{t.oArrow1}</text>
          <text x={481} y={122} textAnchor="middle" fontSize={11.5} fontStyle="italic" fill="#1e1a16">{t.oArrow2}</text>
        </svg>
      </div>
      <MobileFlow steps={steps} />
    </figure>
  );
}
