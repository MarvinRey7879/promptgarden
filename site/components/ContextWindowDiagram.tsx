import type { Lang } from '@/lib/i18n';

/**
 * Visualisierung Batch 3 (Marvin-Direktive „Visualisierungen"): Was füllt ein Context Window?
 * Inline-SVG im 1d-Stil (dicke Border, harte Schatten, Palette), kein Client-JS.
 * Rendert auf den Lexikon-Einträgen token + context-window.
 */
type D = {
  title: string;
  total: string;
  system: string;
  rules: string;
  history: string;
  tools: string;
  free: string;
  warn: string;
  caption: string;
};

const dict: Record<Lang, D> = {
  de: {
    title: 'SO FÜLLT SICH EIN CONTEXT WINDOW',
    total: 'Gesamtes Context Window (z. B. 200k Token)',
    system: 'System-Prompt',
    rules: 'Regeln (CLAUDE.md)',
    history: 'Chat-Verlauf',
    tools: 'Tool-Ergebnisse',
    free: 'frei für Antwort',
    warn: 'fast voll → Qualität sinkt, kompaktieren!',
    caption: 'Alles zusammen muss ins Fenster passen — wird es eng, fliegt Altes raus oder wird zusammengefasst.',
  },
  en: {
    title: 'HOW A CONTEXT WINDOW FILLS UP',
    total: 'Entire context window (e.g. 200k tokens)',
    system: 'System prompt',
    rules: 'Rules (CLAUDE.md)',
    history: 'Chat history',
    tools: 'Tool results',
    free: 'free for the answer',
    warn: 'almost full → quality drops, compact!',
    caption: 'Everything has to fit inside the window — when it gets tight, old content is dropped or summarized.',
  },
  es: {
    title: 'ASÍ SE LLENA UN CONTEXT WINDOW',
    total: 'Ventana de contexto completa (p. ej. 200k tokens)',
    system: 'System prompt',
    rules: 'Reglas (CLAUDE.md)',
    history: 'Historial del chat',
    tools: 'Resultados de tools',
    free: 'libre para la respuesta',
    warn: 'casi llena → baja la calidad, ¡compactar!',
    caption: 'Todo debe caber en la ventana — cuando falta espacio, lo antiguo se elimina o se resume.',
  },
  fr: {
    title: 'COMMENT SE REMPLIT UN CONTEXT WINDOW',
    total: 'Fenêtre de contexte entière (p. ex. 200k tokens)',
    system: 'System prompt',
    rules: 'Règles (CLAUDE.md)',
    history: 'Historique du chat',
    tools: 'Résultats des tools',
    free: 'libre pour la réponse',
    warn: 'presque pleine → la qualité baisse, compacter !',
    caption: 'Tout doit tenir dans la fenêtre — quand ça devient serré, l’ancien contenu est supprimé ou résumé.',
  },
  zh: {
    title: '上下文窗口是这样被填满的',
    total: '整个上下文窗口（例如 200k Token）',
    system: '系统提示词',
    rules: '规则（CLAUDE.md）',
    history: '对话历史',
    tools: '工具结果',
    free: '留给回答的空间',
    warn: '快满了 → 质量下降，该压缩了！',
    caption: '所有内容都必须装进窗口——空间不够时，旧内容会被丢弃或被总结。',
  },
};

// Segmente: x-Position + Breite in einem 640er-Koordinatensystem (Bar von 20 bis 620)
const SEGS = [
  { key: 'system', x: 20, w: 66, fill: 'var(--yellow)' },
  { key: 'rules', x: 86, w: 78, fill: 'var(--pink)' },
  { key: 'history', x: 164, w: 210, fill: 'var(--blue)' },
  { key: 'tools', x: 374, w: 156, fill: '#e8d9c3' },
  { key: 'free', x: 530, w: 90, fill: 'var(--lime)' },
] as const;

export default function ContextWindowDiagram({ lang }: { lang: Lang }) {
  const t = dict[lang];
  return (
    <div className="card" style={{ padding: '18px 22px', marginTop: 26, boxShadow: '4px 4px 0 var(--ink)', background: '#fff' }}>
      <p className="kicker" style={{ color: 'var(--ink)' }}>📐 {t.title}</p>
      <div style={{ overflowX: 'auto' }}>
        <svg
          viewBox="0 0 640 190"
          role="img"
          aria-label={t.title}
          style={{ minWidth: 560, width: '100%', display: 'block' }}
        >
          {/* Klammer: gesamtes Fenster */}
          <text x="320" y="16" textAnchor="middle" fontSize="12.5" fontWeight="700" fill="var(--muted)" fontFamily="inherit">
            {t.total}
          </text>
          <path d="M20 26 L20 34 L620 34 L620 26" fill="none" stroke="var(--ink)" strokeWidth="2" />

          {/* Segment-Bar */}
          {SEGS.map((s) => (
            <g key={s.key}>
              <rect x={s.x} y={44} width={s.w} height={54} fill={s.fill} stroke="var(--ink)" strokeWidth="2.5" rx="6" />
            </g>
          ))}

          {/* Labels unter den Segmenten, versetzt in 2 Reihen gegen Überlappung */}
          {SEGS.map((s, i) => {
            const cx = s.x + s.w / 2;
            const y1 = i % 2 === 0 ? 118 : 142;
            return (
              <g key={s.key}>
                <line x1={cx} y1={98} x2={cx} y2={y1 - 10} stroke="var(--ink)" strokeWidth="1.5" strokeDasharray="3 3" />
                <text x={cx} y={y1} textAnchor="middle" fontSize="12" fontWeight="800" fill="var(--ink)" fontFamily="inherit">
                  {t[s.key]}
                </text>
              </g>
            );
          })}

          {/* Warn-Marker bei ~90% */}
          <line x1={556} y1={38} x2={556} y2={104} stroke="var(--accent)" strokeWidth="3" strokeDasharray="5 4" />
          <text x={556} y={170} textAnchor="middle" fontSize="11.5" fontWeight="800" fill="var(--accent)" fontFamily="inherit">
            ⚠ {t.warn}
          </text>
        </svg>
      </div>
      <p style={{ margin: '10px 0 0', fontSize: 13, lineHeight: 1.55, color: 'var(--muted)' }}>{t.caption}</p>
    </div>
  );
}
