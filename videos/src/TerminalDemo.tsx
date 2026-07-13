import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { T, type Lang } from './theme';

/**
 * Wiederverwendbare Terminal-Demo: getippter Befehl, dann Zeile für Zeile gestreamte Ausgabe.
 * Inhalte kommen als Script (title + lines) — Fakten stammen aus commands.<lang>.json.
 */
export type TermLine = { text: string; kind: 'cmd' | 'out' | 'ok' | 'note' };
export type TermScript = { title: string; lines: TermLine[] };

const TYPE_SPEED = 2.2; // Zeichen pro Frame beim Tippen
const LINE_GAP = 22; // Frames zwischen Ausgabezeilen

const COLORS: Record<TermLine['kind'], string> = {
  cmd: '#f5d565',
  out: '#e8e0d2',
  ok: '#c9e265',
  note: '#a8d8f0',
};

export const TerminalDemo = ({ script }: { script: TermScript }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const titleIn = spring({ frame, fps, config: { damping: 200 } });
  const termIn = spring({ frame: frame - 15, fps, config: { damping: 16, stiffness: 140 } });

  // Zeitplan: cmd-Zeilen werden getippt, andere erscheinen zeilenweise
  let t = 50; // Startframe der ersten Zeile
  const timed = script.lines.map((l) => {
    const start = t;
    const dur = l.kind === 'cmd' ? Math.ceil(l.text.length / TYPE_SPEED) + 14 : LINE_GAP;
    t = start + dur;
    return { ...l, start };
  });

  return (
    <AbsoluteFill style={{ background: T.bg, fontFamily: T.font }}>
      <div
        style={{
          position: 'absolute', top: 52, width: '100%', textAlign: 'center',
          fontSize: 44, fontWeight: 800, color: T.ink, letterSpacing: '-0.02em',
          opacity: titleIn, transform: `translateY(${(1 - titleIn) * -24}px)`,
        }}
      >
        {script.title}
      </div>

      {/* Terminal-Karte im 1d-Stil */}
      <div
        style={{
          position: 'absolute', left: 120, top: 140, width: 1040, height: 500,
          background: T.ink, border: `5px solid ${T.ink}`, borderRadius: 20,
          boxShadow: `10px 10px 0 ${T.accent}`, transform: `scale(${termIn})`,
          padding: '18px 26px', overflow: 'hidden',
        }}
      >
        {/* Fenster-Punkte */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
          {[T.pink, T.yellow, T.lime].map((c) => (
            <div key={c} style={{ width: 14, height: 14, borderRadius: 99, background: c }} />
          ))}
        </div>

        <div style={{ fontFamily: 'Consolas, "Courier New", monospace', fontSize: 24, lineHeight: 1.75 }}>
          {timed.map((l, i) => {
            if (frame < l.start) return null;
            const shown =
              l.kind === 'cmd'
                ? l.text.slice(0, Math.floor((frame - l.start) * TYPE_SPEED))
                : l.text;
            const fade = l.kind === 'cmd' ? 1 : interpolate(frame, [l.start, l.start + 8], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
            return (
              <div key={i} style={{ color: COLORS[l.kind], opacity: fade, whiteSpace: 'pre-wrap' }}>
                {l.kind === 'cmd' ? '❯ ' : l.kind === 'ok' ? '✔ ' : '  '}
                {shown}
                {l.kind === 'cmd' && frame - l.start < l.text.length / TYPE_SPEED + 10 && (
                  <span style={{ opacity: Math.floor(frame / 12) % 2 === 0 ? 1 : 0 }}>▌</span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ---------- Demo 1: /goal (Claude Code) — Fakten aus commands.de.json claude-code/goal ----------
export const goalScripts: Record<Lang, TermScript> = {
  de: {
    title: 'Claude Code: /goal — Ziel setzen',
    lines: [
      { kind: 'cmd', text: '/goal alle Tests grün bekommen' },
      { kind: 'out', text: 'Ziel gesetzt. Claude arbeitet weiter, bis die Bedingung erfüllt ist.' },
      { kind: 'out', text: 'Turn 1: 3 Tests rot → Fix in utils.ts …' },
      { kind: 'out', text: 'Turn 2: 1 Test rot → Fix in api.test.ts …' },
      { kind: 'ok', text: 'Turn 3: Alle 42 Tests grün — Ziel erreicht.' },
      { kind: 'note', text: 'Ziel vorzeitig beenden: /goal clear' },
    ],
  },
  en: {
    title: 'Claude Code: /goal — set a goal',
    lines: [
      { kind: 'cmd', text: '/goal get all tests passing' },
      { kind: 'out', text: 'Goal set. Claude keeps working until the condition is met.' },
      { kind: 'out', text: 'Turn 1: 3 tests failing → fix in utils.ts …' },
      { kind: 'out', text: 'Turn 2: 1 test failing → fix in api.test.ts …' },
      { kind: 'ok', text: 'Turn 3: All 42 tests passing — goal reached.' },
      { kind: 'note', text: 'End a goal early: /goal clear' },
    ],
  },
  es: {
    title: 'Claude Code: /goal — fijar un objetivo',
    lines: [
      { kind: 'cmd', text: '/goal conseguir que todos los tests pasen' },
      { kind: 'out', text: 'Objetivo fijado. Claude sigue trabajando hasta cumplir la condición.' },
      { kind: 'out', text: 'Turno 1: 3 tests en rojo → arreglo en utils.ts …' },
      { kind: 'out', text: 'Turno 2: 1 test en rojo → arreglo en api.test.ts …' },
      { kind: 'ok', text: 'Turno 3: Los 42 tests en verde — objetivo cumplido.' },
      { kind: 'note', text: 'Terminar antes: /goal clear' },
    ],
  },
  fr: {
    title: 'Claude Code : /goal — fixer un objectif',
    lines: [
      { kind: 'cmd', text: '/goal faire passer tous les tests' },
      { kind: 'out', text: "Objectif fixé. Claude continue jusqu'à ce que la condition soit remplie." },
      { kind: 'out', text: 'Tour 1 : 3 tests rouges → correction dans utils.ts …' },
      { kind: 'out', text: 'Tour 2 : 1 test rouge → correction dans api.test.ts …' },
      { kind: 'ok', text: 'Tour 3 : Les 42 tests sont verts — objectif atteint.' },
      { kind: 'note', text: 'Arrêter avant : /goal clear' },
    ],
  },
  zh: {
    title: 'Claude Code：/goal——设定目标',
    lines: [
      { kind: 'cmd', text: '/goal 让所有测试通过' },
      { kind: 'out', text: '目标已设定。Claude 会持续工作，直到条件满足。' },
      { kind: 'out', text: '第 1 轮：3 个测试失败 → 修复 utils.ts …' },
      { kind: 'out', text: '第 2 轮：1 个测试失败 → 修复 api.test.ts …' },
      { kind: 'ok', text: '第 3 轮：42 个测试全部通过——目标达成。' },
      { kind: 'note', text: '提前结束目标：/goal clear' },
    ],
  },
};

// ---------- Demo 2: agent sandbox run (Cursor CLI) — Fakten aus commands.de.json cursor-cli/sandbox-run ----------
export const sandboxScripts: Record<Lang, TermScript> = {
  de: {
    title: 'Cursor CLI: agent sandbox run — isoliert testen',
    lines: [
      { kind: 'cmd', text: 'agent sandbox run npm install' },
      { kind: 'note', text: 'Sandbox: Workspace lesen/schreiben ✓ · Netzwerk ✗ (Standard)' },
      { kind: 'out', text: 'npm install läuft isoliert — das restliche System bleibt geschützt.' },
      { kind: 'ok', text: 'Fertig. Änderungen nur im Workspace.' },
      { kind: 'note', text: 'Netz erlauben: --network · Pfade freigeben: --allow-paths' },
    ],
  },
  en: {
    title: 'Cursor CLI: agent sandbox run — test in isolation',
    lines: [
      { kind: 'cmd', text: 'agent sandbox run npm install' },
      { kind: 'note', text: 'Sandbox: workspace read/write ✓ · network ✗ (default)' },
      { kind: 'out', text: 'npm install runs isolated — the rest of your system stays protected.' },
      { kind: 'ok', text: 'Done. Changes only inside the workspace.' },
      { kind: 'note', text: 'Allow network: --network · open paths: --allow-paths' },
    ],
  },
  es: {
    title: 'Cursor CLI: agent sandbox run — probar aislado',
    lines: [
      { kind: 'cmd', text: 'agent sandbox run npm install' },
      { kind: 'note', text: 'Sandbox: workspace lectura/escritura ✓ · red ✗ (por defecto)' },
      { kind: 'out', text: 'npm install corre aislado — el resto del sistema queda protegido.' },
      { kind: 'ok', text: 'Listo. Cambios solo dentro del workspace.' },
      { kind: 'note', text: 'Permitir red: --network · abrir rutas: --allow-paths' },
    ],
  },
  fr: {
    title: 'Cursor CLI : agent sandbox run — tester isolé',
    lines: [
      { kind: 'cmd', text: 'agent sandbox run npm install' },
      { kind: 'note', text: 'Sandbox : workspace lecture/écriture ✓ · réseau ✗ (défaut)' },
      { kind: 'out', text: "npm install tourne isolé — le reste du système reste protégé." },
      { kind: 'ok', text: 'Terminé. Changements uniquement dans le workspace.' },
      { kind: 'note', text: 'Autoriser le réseau : --network · ouvrir des chemins : --allow-paths' },
    ],
  },
  zh: {
    title: 'Cursor CLI：agent sandbox run——隔离测试',
    lines: [
      { kind: 'cmd', text: 'agent sandbox run npm install' },
      { kind: 'note', text: '沙箱：工作区读/写 ✓ · 网络 ✗（默认）' },
      { kind: 'out', text: 'npm install 在隔离环境中运行——系统其余部分保持安全。' },
      { kind: 'ok', text: '完成。改动只发生在工作区内。' },
      { kind: 'note', text: '允许网络：--network · 开放路径：--allow-paths' },
    ],
  },
};

export const GoalDemo = ({ lang }: { lang: Lang }) => <TerminalDemo script={goalScripts[lang]} />;
export const SandboxDemo = ({ lang }: { lang: Lang }) => <TerminalDemo script={sandboxScripts[lang]} />;
