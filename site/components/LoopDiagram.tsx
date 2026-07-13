/**
 * Visualisierungen für die Loop-Galerie (Marvin-Regel 13.07: verständlich + hochwertig).
 * Reines Inline-SVG im 1d-Design (dicke Border, harte Schatten, Palette) — kein Client-JS.
 */

export type LoopDiagramLabels = {
  cycleTitle: string;
  think: string;
  thinkSub: string;
  act: string;
  actSub: string;
  check: string;
  checkSub: string;
  done: string;
  exit: string;
  again: string;
  vsTitle: string;
  good: string;
  goodPoints: string[];
  bad: string;
  badPoints: string[];
};

function Box({
  x, y, w, h, fill, title, sub,
}: { x: number; y: number; w: number; h: number; fill: string; title: string; sub: string }) {
  return (
    <g>
      <rect x={x + 4} y={y + 4} width={w} height={h} rx={12} fill="#1e1a16" />
      <rect x={x} y={y} width={w} height={h} rx={12} fill={fill} stroke="#1e1a16" strokeWidth={2.5} />
      <text x={x + w / 2} y={y + h / 2 - 6} textAnchor="middle" fontWeight={800} fontSize={17} fill="#1e1a16">
        {title}
      </text>
      <text x={x + w / 2} y={y + h / 2 + 14} textAnchor="middle" fontSize={11.5} fill="#1e1a16" opacity={0.75}>
        {sub}
      </text>
    </g>
  );
}

export function LoopCycleDiagram({ t }: { t: LoopDiagramLabels }) {
  return (
    <figure style={{ margin: '26px 0' }} className="card" role="img" aria-label={t.cycleTitle}>
      <div style={{ padding: '16px 18px 6px' }}>
        <p className="kicker" style={{ margin: 0 }}>🔄 {t.cycleTitle.toUpperCase()}</p>
      </div>
      <div style={{ overflowX: 'auto' }}>
        <svg viewBox="0 0 640 250" style={{ display: 'block', width: '100%', minWidth: 520, height: 'auto' }} fontFamily="inherit">
          <defs>
            <marker id="arr" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#1e1a16" />
            </marker>
          </defs>

          <Box x={30} y={40} w={150} h={64} fill="var(--blue, #bcd8f0)" title={`1 · ${t.think}`} sub={t.thinkSub} />
          <Box x={245} y={40} w={150} h={64} fill="var(--yellow, #f5d76e)" title={`2 · ${t.act}`} sub={t.actSub} />
          <Box x={460} y={40} w={150} h={64} fill="var(--lime, #cde8a5)" title={`3 · ${t.check}`} sub={t.checkSub} />

          {/* Pfeile vorwärts */}
          <line x1={182} y1={72} x2={240} y2={72} stroke="#1e1a16" strokeWidth={2.5} markerEnd="url(#arr)" />
          <line x1={397} y1={72} x2={455} y2={72} stroke="#1e1a16" strokeWidth={2.5} markerEnd="url(#arr)" />

          {/* Entscheidung */}
          <g>
            <rect x={489} y={144} width={96} height={40} rx={20} fill="#fff" stroke="#1e1a16" strokeWidth={2.5} />
            <text x={537} y={169} textAnchor="middle" fontWeight={800} fontSize={14} fill="#1e1a16">{t.done}</text>
          </g>
          <line x1={535} y1={106} x2={536} y2={140} stroke="#1e1a16" strokeWidth={2.5} markerEnd="url(#arr)" />

          {/* Exit rechts */}
          <text x={537} y={215} textAnchor="middle" fontSize={13} fontWeight={700} fill="#1e6b34">{t.exit}</text>
          <line x1={537} y1={186} x2={537} y2={200} stroke="#1e6b34" strokeWidth={2.5} markerEnd="url(#arr)" />

          {/* Rückschleife */}
          <path d="M 485 164 C 300 164 130 164 105 164 C 80 164 80 140 80 120 L 80 110" fill="none" stroke="#1e1a16" strokeWidth={2.5} strokeDasharray="7 5" markerEnd="url(#arr)" />
          <text x={280} y={155} textAnchor="middle" fontSize={12.5} fontStyle="italic" fill="#1e1a16">{t.again}</text>
        </svg>
      </div>
    </figure>
  );
}

export function GoodBadLoopDiagram({ t }: { t: LoopDiagramLabels }) {
  const row = (points: string[], x: number, color: string, mark: string) =>
    points.map((p, i) => (
      <g key={i}>
        <text x={x} y={112 + i * 34} fontSize={13.5} fill="#1e1a16">
          <tspan fontWeight={800} fill={color}>{mark} </tspan>
          {p}
        </text>
      </g>
    ));
  return (
    <figure style={{ margin: '26px 0' }} className="card" role="img" aria-label={t.vsTitle}>
      <div style={{ padding: '16px 18px 6px' }}>
        <p className="kicker" style={{ margin: 0 }}>⚖️ {t.vsTitle.toUpperCase()}</p>
      </div>
      <div style={{ overflowX: 'auto' }}>
        <svg viewBox="0 0 640 240" style={{ display: 'block', width: '100%', minWidth: 520, height: 'auto' }} fontFamily="inherit">
          {/* Gute Loop */}
          <rect x={24} y={34} width={288} height={182} rx={14} fill="var(--lime, #cde8a5)" stroke="#1e1a16" strokeWidth={2.5} />
          <rect x={40} y={50} width={130} height={30} rx={8} fill="#1e1a16" />
          <text x={105} y={70} textAnchor="middle" fontWeight={800} fontSize={13} fill="#fff">✅ {t.good}</text>
          {row(t.goodPoints, 44, '#1e6b34', '✓')}

          {/* Kaputte Loop */}
          <rect x={328} y={34} width={288} height={182} rx={14} fill="var(--pink, #f3c1c1)" stroke="#1e1a16" strokeWidth={2.5} />
          <rect x={344} y={50} width={150} height={30} rx={8} fill="#1e1a16" />
          <text x={419} y={70} textAnchor="middle" fontWeight={800} fontSize={13} fill="#fff">⛔ {t.bad}</text>
          {row(t.badPoints, 348, '#a03030', '✗')}
        </svg>
      </div>
    </figure>
  );
}
