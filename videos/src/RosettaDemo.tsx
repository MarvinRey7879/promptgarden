import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { T, type Lang } from './theme';

/**
 * Rosetta-Demo (R12): dieselbe Aufgabe, fünf Plattformen. Drei Zeilen laufen
 * nacheinander ein; pro Zeile leuchten die passenden Befehle auf, „—" bleibt blass.
 * Werte 1:1 aus site/content/rosetta.de.json (Stand 18.07.2026) — nichts erfunden.
 */
const dict: Record<Lang, { title: string; task: string; none: string; rows: string[] }> = {
  de: {
    title: 'Dieselbe Aufgabe, fünf Plattformen',
    task: 'Aufgabe',
    none: 'kein eigener Befehl',
    rows: ['Modell wechseln', 'Diff ansehen', 'Änderungen zurücknehmen'],
  },
  en: {
    title: 'Same task, five platforms',
    task: 'Task',
    none: 'no dedicated command',
    rows: ['Switch model', 'View diff', 'Undo changes'],
  },
  es: {
    title: 'La misma tarea, cinco plataformas',
    task: 'Tarea',
    none: 'sin comando propio',
    rows: ['Cambiar de modelo', 'Ver el diff', 'Deshacer cambios'],
  },
  fr: {
    title: 'La même tâche, cinq plateformes',
    task: 'Tâche',
    none: 'pas de commande dédiée',
    rows: ['Changer de modèle', 'Voir le diff', 'Annuler les modifications'],
  },
  zh: {
    title: '同一个任务，五个平台',
    task: '任务',
    none: '没有专门命令',
    rows: ['切换模型', '查看 diff', '撤销更改'],
  },
};

const PLATFORMS = ['Claude Code', 'Codex CLI', 'Cursor CLI', 'Aider', 'Antigravity'];

// Echte Zellen aus der Rosetta-Tabelle (null = dokumentiert kein eigener Befehl)
const ROWS: (string | null)[][] = [
  ['/model', '/model', '/model', '/model', '/model'],
  ['/diff', '/diff', '/changes', '/diff', '/diff'],
  ['/rewind', null, '/rewind', '/undo', '/rewind'],
];

const ROW_START = 46;
const ROW_STEP = 78;

export const RosettaDemo = ({ lang }: { lang: Lang }) => {
  const t = dict[lang];
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleIn = spring({ frame, fps, config: { damping: 200 } });
  const headIn = spring({ frame: frame - 14, fps, config: { damping: 200 } });

  const COL_X = 430;
  const COL_W = 168;
  const ROW_Y = 268;
  const ROW_H = 118;

  return (
    <AbsoluteFill style={{ background: T.bg, fontFamily: T.font }}>
      <div style={{ position: 'absolute', top: 46, width: '100%', textAlign: 'center', fontSize: 44, fontWeight: 800, color: T.ink, letterSpacing: '-0.02em', opacity: titleIn, transform: `translateY(${(1 - titleIn) * -22}px)` }}>
        🔄 {t.title}
      </div>

      {/* Spaltenköpfe */}
      <div style={{ position: 'absolute', left: 96, top: 186, fontSize: 19, fontWeight: 800, color: T.muted, opacity: headIn }}>
        {t.task}
      </div>
      {PLATFORMS.map((p, i) => {
        const s = spring({ frame: frame - 14 - i * 4, fps, config: { damping: 16, stiffness: 150 } });
        return (
          <div
            key={p}
            style={{
              position: 'absolute', left: COL_X + i * COL_W, top: 176, width: COL_W - 14,
              textAlign: 'center', fontSize: 17, fontWeight: 800, color: T.ink,
              background: T.pink, border: `3px solid ${T.ink}`, borderRadius: 10, padding: '7px 4px',
              boxShadow: `3px 3px 0 ${T.ink}`, opacity: s, transform: `scale(${s})`,
            }}
          >
            {p}
          </div>
        );
      })}

      {/* Zeilen */}
      {ROWS.map((cells, r) => {
        const rowIn = spring({ frame: frame - ROW_START - r * ROW_STEP, fps, config: { damping: 15, stiffness: 130 } });
        const y = ROW_Y + r * ROW_H;
        return (
          <div key={r}>
            <div
              style={{
                position: 'absolute', left: 96, top: y + 12, width: 300, fontSize: 21, fontWeight: 800, color: T.ink,
                opacity: rowIn, transform: `translateX(${(1 - rowIn) * -40}px)`,
              }}
            >
              {t.rows[r]}
            </div>
            {cells.map((cell, i) => {
              const glow = interpolate(
                frame,
                [ROW_START + r * ROW_STEP + 14 + i * 7, ROW_START + r * ROW_STEP + 30 + i * 7],
                [0, 1],
                { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
              );
              return (
                <div
                  key={i}
                  style={{
                    position: 'absolute', left: COL_X + i * COL_W, top: y, width: COL_W - 14, height: 74,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: cell ? T.lime : 'transparent',
                    border: `3px solid ${cell ? T.ink : T.muted}`,
                    borderStyle: cell ? 'solid' : 'dashed',
                    borderRadius: 12,
                    boxShadow: cell ? `4px 4px 0 ${T.ink}` : 'none',
                    fontSize: cell ? 22 : 17,
                    fontWeight: 800,
                    fontFamily: cell ? 'monospace' : T.font,
                    color: cell ? T.ink : T.muted,
                    opacity: rowIn * (cell ? 0.35 + glow * 0.65 : 0.5),
                    transform: `scale(${rowIn * (cell ? 0.94 + glow * 0.06 : 0.96)})`,
                  }}
                >
                  {cell ?? '—'}
                </div>
              );
            })}
          </div>
        );
      })}

      {/* Fußnote zur „—"-Spalte */}
      <div
        style={{
          position: 'absolute', left: 96, bottom: 42, fontSize: 19, fontWeight: 700, color: T.muted,
          opacity: interpolate(frame, [ROW_START + 2 * ROW_STEP + 40, ROW_START + 2 * ROW_STEP + 60], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
        }}
      >
        — = {t.none}
      </div>
    </AbsoluteFill>
  );
};
