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

// ---------- Demo 3: /loop (Claude Code) — Fakten aus commands.de.json claude-code/loop ----------
export const loopScripts: Record<Lang, TermScript> = {
  de: {
    title: 'Claude Code: /loop — wiederholt ausführen',
    lines: [
      { kind: 'cmd', text: '/loop 5m check if the deploy finished' },
      { kind: 'out', text: 'Loop geplant: alle 5 Minuten, solange die Session offen ist.' },
      { kind: 'out', text: '10:00 Deploy läuft noch … nächster Check in 5 Min.' },
      { kind: 'out', text: '10:05 Deploy läuft noch … nächster Check in 5 Min.' },
      { kind: 'ok', text: '10:10 Deploy fertig — Ergebnis gemeldet.' },
      { kind: 'note', text: 'Ohne Intervall bestimmt Claude das Tempo selbst.' },
    ],
  },
  en: {
    title: 'Claude Code: /loop — run repeatedly',
    lines: [
      { kind: 'cmd', text: '/loop 5m check if the deploy finished' },
      { kind: 'out', text: 'Loop scheduled: every 5 minutes while the session stays open.' },
      { kind: 'out', text: '10:00 Deploy still running … next check in 5 min.' },
      { kind: 'out', text: '10:05 Deploy still running … next check in 5 min.' },
      { kind: 'ok', text: '10:10 Deploy finished — result reported.' },
      { kind: 'note', text: 'Without an interval, Claude paces itself.' },
    ],
  },
  es: {
    title: 'Claude Code: /loop — ejecutar repetidamente',
    lines: [
      { kind: 'cmd', text: '/loop 5m check if the deploy finished' },
      { kind: 'out', text: 'Loop programado: cada 5 minutos mientras la sesión siga abierta.' },
      { kind: 'out', text: '10:00 El deploy sigue en marcha … próximo check en 5 min.' },
      { kind: 'out', text: '10:05 El deploy sigue en marcha … próximo check en 5 min.' },
      { kind: 'ok', text: '10:10 Deploy terminado — resultado informado.' },
      { kind: 'note', text: 'Sin intervalo, Claude decide el ritmo por sí mismo.' },
    ],
  },
  fr: {
    title: 'Claude Code : /loop — exécuter en boucle',
    lines: [
      { kind: 'cmd', text: '/loop 5m check if the deploy finished' },
      { kind: 'out', text: 'Boucle planifiée : toutes les 5 minutes tant que la session reste ouverte.' },
      { kind: 'out', text: '10:00 Le deploy tourne encore … prochain check dans 5 min.' },
      { kind: 'out', text: '10:05 Le deploy tourne encore … prochain check dans 5 min.' },
      { kind: 'ok', text: '10:10 Deploy terminé — résultat signalé.' },
      { kind: 'note', text: 'Sans intervalle, Claude choisit lui-même le rythme.' },
    ],
  },
  zh: {
    title: 'Claude Code：/loop——循环执行',
    lines: [
      { kind: 'cmd', text: '/loop 5m check if the deploy finished' },
      { kind: 'out', text: '循环已计划：只要会话开着，每 5 分钟执行一次。' },
      { kind: 'out', text: '10:00 部署仍在进行 … 5 分钟后再查。' },
      { kind: 'out', text: '10:05 部署仍在进行 … 5 分钟后再查。' },
      { kind: 'ok', text: '10:10 部署完成——结果已上报。' },
      { kind: 'note', text: '不给间隔时，Claude 会自己决定节奏。' },
    ],
  },
};

// ---------- Demo 4: /add (Aider) — Fakten aus commands.de.json aider/add ----------
export const aiderAddScripts: Record<Lang, TermScript> = {
  de: {
    title: 'Aider: /add — Datei zum Chat holen',
    lines: [
      { kind: 'cmd', text: '/add payment.py' },
      { kind: 'ok', text: 'payment.py ist jetzt im Chat — Aider darf sie bearbeiten.' },
      { kind: 'note', text: 'Nur Dateien im Chat kann Aider ändern; den Rest sieht es über die Repo-Map.' },
      { kind: 'cmd', text: 'Füge eine Validierung für negative Beträge hinzu' },
      { kind: 'out', text: 'Aider bearbeitet payment.py und committet die Änderung.' },
      { kind: 'note', text: 'Wieder entfernen: /drop payment.py' },
    ],
  },
  en: {
    title: 'Aider: /add — bring a file into the chat',
    lines: [
      { kind: 'cmd', text: '/add payment.py' },
      { kind: 'ok', text: 'payment.py is now in the chat — Aider may edit it.' },
      { kind: 'note', text: 'Aider can only change files in the chat; it sees the rest via the repo map.' },
      { kind: 'cmd', text: 'Add validation for negative amounts' },
      { kind: 'out', text: 'Aider edits payment.py and commits the change.' },
      { kind: 'note', text: 'Remove again: /drop payment.py' },
    ],
  },
  es: {
    title: 'Aider: /add — traer un archivo al chat',
    lines: [
      { kind: 'cmd', text: '/add payment.py' },
      { kind: 'ok', text: 'payment.py ya está en el chat — Aider puede editarlo.' },
      { kind: 'note', text: 'Aider solo cambia archivos del chat; el resto lo ve por el repo map.' },
      { kind: 'cmd', text: 'Añade validación para importes negativos' },
      { kind: 'out', text: 'Aider edita payment.py y hace commit del cambio.' },
      { kind: 'note', text: 'Quitar de nuevo: /drop payment.py' },
    ],
  },
  fr: {
    title: 'Aider : /add — amener un fichier dans le chat',
    lines: [
      { kind: 'cmd', text: '/add payment.py' },
      { kind: 'ok', text: 'payment.py est maintenant dans le chat — Aider peut le modifier.' },
      { kind: 'note', text: "Aider ne modifie que les fichiers du chat ; il voit le reste via la repo map." },
      { kind: 'cmd', text: 'Ajoute une validation pour les montants négatifs' },
      { kind: 'out', text: 'Aider modifie payment.py et committe le changement.' },
      { kind: 'note', text: 'Retirer : /drop payment.py' },
    ],
  },
  zh: {
    title: 'Aider：/add——把文件放进对话',
    lines: [
      { kind: 'cmd', text: '/add payment.py' },
      { kind: 'ok', text: 'payment.py 已进入对话——Aider 可以编辑它了。' },
      { kind: 'note', text: 'Aider 只能修改对话中的文件；其余文件通过 repo map 感知。' },
      { kind: 'cmd', text: '为负数金额添加校验' },
      { kind: 'out', text: 'Aider 编辑 payment.py 并提交改动。' },
      { kind: 'note', text: '移除：/drop payment.py' },
    ],
  },
};

// ---------- Demo 5: /compact (Claude Code) — Fakten aus commands.de.json claude-code/compact ----------
export const compactScripts: Record<Lang, TermScript> = {
  de: {
    title: 'Claude Code: /compact — Kontext freiräumen',
    lines: [
      { kind: 'note', text: 'Kontext fast voll — ältere Nachrichten belegen Platz.' },
      { kind: 'cmd', text: '/compact behalte die Liste der geänderten Dateien' },
      { kind: 'out', text: 'Bisherige Konversation wird zusammengefasst …' },
      { kind: 'ok', text: 'Kontext freigeräumt — Zusammenfassung ersetzt den Verlauf.' },
      { kind: 'note', text: 'Die Fokus-Anweisung steuert, was die Zusammenfassung behält.' },
    ],
  },
  en: {
    title: 'Claude Code: /compact — free up context',
    lines: [
      { kind: 'note', text: 'Context almost full — older messages take up space.' },
      { kind: 'cmd', text: '/compact keep the list of modified files' },
      { kind: 'out', text: 'Summarizing the conversation so far …' },
      { kind: 'ok', text: 'Context freed — a summary replaces the history.' },
      { kind: 'note', text: 'The focus instruction controls what the summary keeps.' },
    ],
  },
  es: {
    title: 'Claude Code: /compact — liberar contexto',
    lines: [
      { kind: 'note', text: 'Contexto casi lleno — los mensajes antiguos ocupan espacio.' },
      { kind: 'cmd', text: '/compact keep the list of modified files' },
      { kind: 'out', text: 'Resumiendo la conversación hasta ahora …' },
      { kind: 'ok', text: 'Contexto liberado — un resumen sustituye al historial.' },
      { kind: 'note', text: 'La instrucción de enfoque controla qué conserva el resumen.' },
    ],
  },
  fr: {
    title: 'Claude Code : /compact — libérer du contexte',
    lines: [
      { kind: 'note', text: 'Contexte presque plein — les anciens messages prennent de la place.' },
      { kind: 'cmd', text: '/compact keep the list of modified files' },
      { kind: 'out', text: 'Résumé de la conversation en cours …' },
      { kind: 'ok', text: "Contexte libéré — un résumé remplace l'historique." },
      { kind: 'note', text: "L'instruction de focus contrôle ce que le résumé conserve." },
    ],
  },
  zh: {
    title: 'Claude Code：/compact——腾出上下文',
    lines: [
      { kind: 'note', text: '上下文快满了——旧消息占用空间。' },
      { kind: 'cmd', text: '/compact keep the list of modified files' },
      { kind: 'out', text: '正在总结到目前为止的对话 …' },
      { kind: 'ok', text: '上下文已释放——摘要取代了历史记录。' },
      { kind: 'note', text: '聚焦指令决定摘要保留什么。' },
    ],
  },
};

// ---------- Demo 6: /plan (Cursor CLI) — Fakten aus commands.de.json cursor-cli/plan ----------
export const cursorPlanScripts: Record<Lang, TermScript> = {
  de: {
    title: 'Cursor CLI: /plan — erst planen, dann bauen',
    lines: [
      { kind: 'cmd', text: '/plan Login-Formular mit Validierung bauen' },
      { kind: 'out', text: 'Plan-Modus: Schritte werden entworfen, noch kein Code geändert.' },
      { kind: 'out', text: '1. Formular-Komponente  2. Validierung  3. Tests' },
      { kind: 'ok', text: 'Plan gespeichert — Menü: Build Locally / Build in Cloud.' },
      { kind: 'note', text: 'Pläne liegen auf Platte und lassen sich in Cloud-Agents übertragen.' },
    ],
  },
  en: {
    title: 'Cursor CLI: /plan — plan first, then build',
    lines: [
      { kind: 'cmd', text: '/plan build a login form with validation' },
      { kind: 'out', text: 'Plan mode: steps are drafted, no code changed yet.' },
      { kind: 'out', text: '1. Form component  2. Validation  3. Tests' },
      { kind: 'ok', text: 'Plan saved — menu: Build Locally / Build in Cloud.' },
      { kind: 'note', text: 'Plans are stored on disk and can be handed to cloud agents.' },
    ],
  },
  es: {
    title: 'Cursor CLI: /plan — primero planear, luego construir',
    lines: [
      { kind: 'cmd', text: '/plan build a login form with validation' },
      { kind: 'out', text: 'Modo plan: se redactan los pasos, aún sin cambiar código.' },
      { kind: 'out', text: '1. Componente del formulario  2. Validación  3. Tests' },
      { kind: 'ok', text: 'Plan guardado — menú: Build Locally / Build in Cloud.' },
      { kind: 'note', text: 'Los planes se guardan en disco y pueden pasarse a agentes en la nube.' },
    ],
  },
  fr: {
    title: 'Cursor CLI : /plan — planifier avant de construire',
    lines: [
      { kind: 'cmd', text: '/plan build a login form with validation' },
      { kind: 'out', text: "Mode plan : les étapes sont rédigées, aucun code n'est modifié." },
      { kind: 'out', text: '1. Composant du formulaire  2. Validation  3. Tests' },
      { kind: 'ok', text: 'Plan enregistré — menu : Build Locally / Build in Cloud.' },
      { kind: 'note', text: 'Les plans sont stockés sur disque et transférables aux agents cloud.' },
    ],
  },
  zh: {
    title: 'Cursor CLI：/plan——先规划，再动手',
    lines: [
      { kind: 'cmd', text: '/plan build a login form with validation' },
      { kind: 'out', text: '规划模式：先起草步骤，代码暂不改动。' },
      { kind: 'out', text: '1. 表单组件  2. 校验  3. 测试' },
      { kind: 'ok', text: '计划已保存——菜单：Build Locally / Build in Cloud。' },
      { kind: 'note', text: '计划保存在磁盘上，可交给云端智能体执行。' },
    ],
  },
};

export const GoalDemo = ({ lang }: { lang: Lang }) => <TerminalDemo script={goalScripts[lang]} />;
export const SandboxDemo = ({ lang }: { lang: Lang }) => <TerminalDemo script={sandboxScripts[lang]} />;
export const LoopDemo = ({ lang }: { lang: Lang }) => <TerminalDemo script={loopScripts[lang]} />;
export const AiderAddDemo = ({ lang }: { lang: Lang }) => <TerminalDemo script={aiderAddScripts[lang]} />;
export const CompactDemo = ({ lang }: { lang: Lang }) => <TerminalDemo script={compactScripts[lang]} />;
export const CursorPlanDemo = ({ lang }: { lang: Lang }) => <TerminalDemo script={cursorPlanScripts[lang]} />;

// ---------- Demo 7: codex exec (Codex CLI) — Fakten aus commands.de.json codex-cli/exec ----------
export const codexExecScripts: Record<Lang, TermScript> = {
  de: {
    title: 'Codex CLI: codex exec — ohne TUI, z. B. für CI',
    lines: [
      { kind: 'cmd', text: 'codex exec "fasse die Änderungen der letzten Commits zusammen" --json' },
      { kind: 'out', text: '{"type":"turn.started"}' },
      { kind: 'out', text: '{"type":"item.completed","item":{"text":"3 Commits: Login-Fix, …"}}' },
      { kind: 'ok', text: 'Non-interaktiv fertig — Ausgabe als JSONL für Skripte.' },
      { kind: 'note', text: 'Auch möglich: cat aufgabe.txt | codex exec -  (Prompt aus stdin)' },
    ],
  },
  en: {
    title: 'Codex CLI: codex exec — no TUI, e.g. for CI',
    lines: [
      { kind: 'cmd', text: 'codex exec "summarize the changes from the latest commits" --json' },
      { kind: 'out', text: '{"type":"turn.started"}' },
      { kind: 'out', text: '{"type":"item.completed","item":{"text":"3 commits: login fix, …"}}' },
      { kind: 'ok', text: 'Non-interactive run done — JSONL output for scripts.' },
      { kind: 'note', text: 'Also works: cat task.txt | codex exec -  (prompt from stdin)' },
    ],
  },
  es: {
    title: 'Codex CLI: codex exec — sin TUI, p. ej. para CI',
    lines: [
      { kind: 'cmd', text: 'codex exec "resume los cambios de los últimos commits" --json' },
      { kind: 'out', text: '{"type":"turn.started"}' },
      { kind: 'out', text: '{"type":"item.completed","item":{"text":"3 commits: arreglo de login, …"}}' },
      { kind: 'ok', text: 'Ejecución no interactiva lista — salida JSONL para scripts.' },
      { kind: 'note', text: 'También: cat tarea.txt | codex exec -  (prompt desde stdin)' },
    ],
  },
  fr: {
    title: 'Codex CLI : codex exec — sans TUI, p. ex. pour la CI',
    lines: [
      { kind: 'cmd', text: 'codex exec "résume les changements des derniers commits" --json' },
      { kind: 'out', text: '{"type":"turn.started"}' },
      { kind: 'out', text: '{"type":"item.completed","item":{"text":"3 commits : correctif login, …"}}' },
      { kind: 'ok', text: 'Exécution non interactive terminée — sortie JSONL pour les scripts.' },
      { kind: 'note', text: 'Aussi : cat tache.txt | codex exec -  (prompt depuis stdin)' },
    ],
  },
  zh: {
    title: 'Codex CLI：codex exec——无界面运行，适合 CI',
    lines: [
      { kind: 'cmd', text: 'codex exec "总结最近几次提交的改动" --json' },
      { kind: 'out', text: '{"type":"turn.started"}' },
      { kind: 'out', text: '{"type":"item.completed","item":{"text":"3 次提交：登录修复、…"}}' },
      { kind: 'ok', text: '非交互运行完成——JSONL 输出，方便脚本处理。' },
      { kind: 'note', text: '也可以：cat task.txt | codex exec -（从 stdin 读取提示词）' },
    ],
  },
};

// ---------- Demo 8: /review (Codex CLI) — Fakten aus commands.de.json codex-cli/review ----------
export const codexReviewScripts: Record<Lang, TermScript> = {
  de: {
    title: 'Codex CLI: /review — Änderungen prüfen lassen',
    lines: [
      { kind: 'cmd', text: '/review' },
      { kind: 'out', text: 'Review der nicht committeten Änderungen (3 Dateien) …' },
      { kind: 'out', text: 'auth.ts:42 — Token-Ablauf wird nicht geprüft (Vorschlag beigefügt)' },
      { kind: 'out', text: 'api.ts:118 — fehlende Fehlerbehandlung bei Timeout' },
      { kind: 'ok', text: '2 Findings — vor dem Merge beheben.' },
      { kind: 'note', text: 'CLI-Variante: codex review --base main' },
    ],
  },
  en: {
    title: 'Codex CLI: /review — get your changes reviewed',
    lines: [
      { kind: 'cmd', text: '/review' },
      { kind: 'out', text: 'Reviewing uncommitted changes (3 files) …' },
      { kind: 'out', text: 'auth.ts:42 — token expiry never checked (suggestion attached)' },
      { kind: 'out', text: 'api.ts:118 — missing error handling on timeout' },
      { kind: 'ok', text: '2 findings — fix before merging.' },
      { kind: 'note', text: 'CLI variant: codex review --base main' },
    ],
  },
  es: {
    title: 'Codex CLI: /review — revisar tus cambios',
    lines: [
      { kind: 'cmd', text: '/review' },
      { kind: 'out', text: 'Revisando cambios sin commit (3 archivos) …' },
      { kind: 'out', text: 'auth.ts:42 — no se comprueba la expiración del token (sugerencia adjunta)' },
      { kind: 'out', text: 'api.ts:118 — falta manejo de errores en timeout' },
      { kind: 'ok', text: '2 hallazgos — corrígelos antes del merge.' },
      { kind: 'note', text: 'Variante CLI: codex review --base main' },
    ],
  },
  fr: {
    title: 'Codex CLI : /review — faire relire tes changements',
    lines: [
      { kind: 'cmd', text: '/review' },
      { kind: 'out', text: 'Review des changements non commités (3 fichiers) …' },
      { kind: 'out', text: "auth.ts:42 — l'expiration du token n'est jamais vérifiée (suggestion jointe)" },
      { kind: 'out', text: 'api.ts:118 — gestion des erreurs manquante sur timeout' },
      { kind: 'ok', text: '2 findings — à corriger avant le merge.' },
      { kind: 'note', text: 'Variante CLI : codex review --base main' },
    ],
  },
  zh: {
    title: 'Codex CLI：/review——让 AI 审查你的改动',
    lines: [
      { kind: 'cmd', text: '/review' },
      { kind: 'out', text: '正在审查未提交的改动（3 个文件）…' },
      { kind: 'out', text: 'auth.ts:42——未检查 token 过期（附修改建议）' },
      { kind: 'out', text: 'api.ts:118——超时缺少错误处理' },
      { kind: 'ok', text: '2 个发现——合并前请修复。' },
      { kind: 'note', text: 'CLI 形式：codex review --base main' },
    ],
  },
};

export const CodexExecDemo = ({ lang }: { lang: Lang }) => <TerminalDemo script={codexExecScripts[lang]} />;
export const CodexReviewDemo = ({ lang }: { lang: Lang }) => <TerminalDemo script={codexReviewScripts[lang]} />;

// ---------- Demo 9: agy -p / --print (Antigravity CLI) — Fakten aus commands.de.json antigravity-cli/print ----------
export const agyPrintScripts: Record<Lang, TermScript> = {
  de: {
    title: 'Antigravity CLI: agy -p — ohne TUI, für Skripte',
    lines: [
      { kind: 'cmd', text: 'agy -p "prüfe dieses Git-Diff und entwirf eine Commit-Message" --cwd $(pwd)' },
      { kind: 'out', text: 'Analysiere 3 geänderte Dateien …' },
      { kind: 'out', text: 'fix(auth): Token-Ablauf vor Refresh prüfen' },
      { kind: 'ok', text: 'Fertig — Ausgabe direkt in der Pipeline nutzbar.' },
      { kind: 'note', text: 'Konversation fortsetzen: agy -c -p "fasse den Stand zusammen"' },
    ],
  },
  en: {
    title: 'Antigravity CLI: agy -p — no TUI, for scripts',
    lines: [
      { kind: 'cmd', text: 'agy -p "Review this git diff and draft a conventional commit message" --cwd $(pwd)' },
      { kind: 'out', text: 'Analyzing 3 changed files …' },
      { kind: 'out', text: 'fix(auth): check token expiry before refresh' },
      { kind: 'ok', text: 'Done — output ready for your pipeline.' },
      { kind: 'note', text: 'Continue a conversation: agy -c -p "summarize where we are"' },
    ],
  },
  es: {
    title: 'Antigravity CLI: agy -p — sin TUI, para scripts',
    lines: [
      { kind: 'cmd', text: 'agy -p "revisa este diff de Git y redacta un mensaje de commit" --cwd $(pwd)' },
      { kind: 'out', text: 'Analizando 3 archivos modificados …' },
      { kind: 'out', text: 'fix(auth): comprobar expiración del token antes del refresh' },
      { kind: 'ok', text: 'Listo — salida lista para tu pipeline.' },
      { kind: 'note', text: 'Continuar una conversación: agy -c -p "resume el estado actual"' },
    ],
  },
  fr: {
    title: 'Antigravity CLI : agy -p — sans TUI, pour les scripts',
    lines: [
      { kind: 'cmd', text: 'agy -p "vérifie ce diff Git et rédige un message de commit" --cwd $(pwd)' },
      { kind: 'out', text: 'Analyse de 3 fichiers modifiés …' },
      { kind: 'out', text: "fix(auth): vérifier l'expiration du token avant le refresh" },
      { kind: 'ok', text: 'Terminé — sortie prête pour ton pipeline.' },
      { kind: 'note', text: 'Continuer une conversation : agy -c -p "résume l’état actuel"' },
    ],
  },
  zh: {
    title: 'Antigravity CLI：agy -p——无界面运行，适合脚本',
    lines: [
      { kind: 'cmd', text: 'agy -p "审查这个 Git diff 并起草一条提交信息" --cwd $(pwd)' },
      { kind: 'out', text: '正在分析 3 个改动的文件 …' },
      { kind: 'out', text: 'fix(auth): 在刷新前检查 token 是否过期' },
      { kind: 'ok', text: '完成——输出可直接用于流水线。' },
      { kind: 'note', text: '继续会话：agy -c -p "总结当前进度"' },
    ],
  },
};

export const AgyPrintDemo = ({ lang }: { lang: Lang }) => <TerminalDemo script={agyPrintScripts[lang]} />;

// ---------- Demo 10: /context (Claude Code) — Fakten aus commands.de.json claude-code/context ----------
// Beispielwerte illustrativ (wie bei den anderen Demos). Verhalten faktentreu:
// farbiges Raster der Kontextnutzung + Optimierungsvorschlag + Argument 'all'.
export const contextScripts: Record<Lang, TermScript> = {
  de: {
    title: 'Claude Code: /context — Kontextnutzung sehen',
    lines: [
      { kind: 'cmd', text: '/context' },
      { kind: 'out', text: 'Kontextnutzung — farbiges Raster:' },
      { kind: 'out', text: 'Tools        █░░░░░░░░░  14 %' },
      { kind: 'out', text: 'Nachrichten  ███░░░░░░░  33 %' },
      { kind: 'out', text: 'Memory       █░░░░░░░░░   6 %' },
      { kind: 'ok', text: 'Frei █████░░░░░ 47 % — Vorschlag: alte Anhänge lösen.' },
      { kind: 'note', text: 'Detailaufschlüsselung ausklappen: /context all' },
    ],
  },
  en: {
    title: 'Claude Code: /context — see context usage',
    lines: [
      { kind: 'cmd', text: '/context' },
      { kind: 'out', text: 'Context usage — colored grid:' },
      { kind: 'out', text: 'Tools      █░░░░░░░░░  14 %' },
      { kind: 'out', text: 'Messages   ███░░░░░░░  33 %' },
      { kind: 'out', text: 'Memory     █░░░░░░░░░   6 %' },
      { kind: 'ok', text: 'Free █████░░░░░ 47 % — suggestion: drop old attachments.' },
      { kind: 'note', text: 'Expand the full breakdown: /context all' },
    ],
  },
  es: {
    title: 'Claude Code: /context — ver el uso del contexto',
    lines: [
      { kind: 'cmd', text: '/context' },
      { kind: 'out', text: 'Uso del contexto — rejilla de colores:' },
      { kind: 'out', text: 'Tools      █░░░░░░░░░  14 %' },
      { kind: 'out', text: 'Mensajes   ███░░░░░░░  33 %' },
      { kind: 'out', text: 'Memory     █░░░░░░░░░   6 %' },
      { kind: 'ok', text: 'Libre █████░░░░░ 47 % — sugerencia: soltar adjuntos viejos.' },
      { kind: 'note', text: 'Desplegar el detalle completo: /context all' },
    ],
  },
  fr: {
    title: 'Claude Code : /context — voir l’usage du contexte',
    lines: [
      { kind: 'cmd', text: '/context' },
      { kind: 'out', text: 'Usage du contexte — grille colorée :' },
      { kind: 'out', text: 'Tools      █░░░░░░░░░  14 %' },
      { kind: 'out', text: 'Messages   ███░░░░░░░  33 %' },
      { kind: 'out', text: 'Memory     █░░░░░░░░░   6 %' },
      { kind: 'ok', text: 'Libre █████░░░░░ 47 % — suggestion : retirer les vieilles pièces jointes.' },
      { kind: 'note', text: 'Déplier le détail complet : /context all' },
    ],
  },
  zh: {
    title: 'Claude Code：/context——查看上下文占用',
    lines: [
      { kind: 'cmd', text: '/context' },
      { kind: 'out', text: '上下文占用——彩色栅格：' },
      { kind: 'out', text: '工具      █░░░░░░░░░  14 %' },
      { kind: 'out', text: '消息      ███░░░░░░░  33 %' },
      { kind: 'out', text: '记忆      █░░░░░░░░░   6 %' },
      { kind: 'ok', text: '空闲 █████░░░░░ 47 %——建议：移除旧附件。' },
      { kind: 'note', text: '展开完整明细：/context all' },
    ],
  },
};

export const ContextCmdDemo = ({ lang }: { lang: Lang }) => <TerminalDemo script={contextScripts[lang]} />;

// ---------- Demo 11: /rewind (Claude Code) — Fakten aus commands.de.json claude-code/rewind ----------
// Verhalten faktentreu: Checkpoint waehlen → Konversation und/oder Code
// zuruecksetzen, oder ab einer Nachricht zusammenfassen. Aliase /checkpoint, /undo.
export const rewindScripts: Record<Lang, TermScript> = {
  de: {
    title: 'Claude Code: /rewind — Stand zurücksetzen',
    lines: [
      { kind: 'cmd', text: '/rewind' },
      { kind: 'out', text: 'Checkpoints wählen:' },
      { kind: 'out', text: '1) vor „Login-Refactor"  — Konversation + Code' },
      { kind: 'out', text: '2) vor „API-Fix" — fehlgeschlagen' },
      { kind: 'ok', text: 'Zurück zu 1) — Konversation und Code wiederhergestellt.' },
      { kind: 'note', text: 'Oder ab einer Nachricht zusammenfassen · Aliase: /checkpoint, /undo' },
    ],
  },
  en: {
    title: 'Claude Code: /rewind — roll back your state',
    lines: [
      { kind: 'cmd', text: '/rewind' },
      { kind: 'out', text: 'Pick a checkpoint:' },
      { kind: 'out', text: '1) before "login refactor" — conversation + code' },
      { kind: 'out', text: '2) before "API fix" — failed' },
      { kind: 'ok', text: 'Back to 1) — conversation and code restored.' },
      { kind: 'note', text: 'Or summarize from a message onward · aliases: /checkpoint, /undo' },
    ],
  },
  es: {
    title: 'Claude Code: /rewind — volver a un estado anterior',
    lines: [
      { kind: 'cmd', text: '/rewind' },
      { kind: 'out', text: 'Elige un checkpoint:' },
      { kind: 'out', text: '1) antes de "refactor de login" — conversación + código' },
      { kind: 'out', text: '2) antes de "fix de API" — falló' },
      { kind: 'ok', text: 'Volver a 1) — conversación y código restaurados.' },
      { kind: 'note', text: 'O resumir desde un mensaje · alias: /checkpoint, /undo' },
    ],
  },
  fr: {
    title: 'Claude Code : /rewind — revenir à un état antérieur',
    lines: [
      { kind: 'cmd', text: '/rewind' },
      { kind: 'out', text: 'Choisis un checkpoint :' },
      { kind: 'out', text: '1) avant « refactor du login » — conversation + code' },
      { kind: 'out', text: "2) avant « fix de l'API » — échoué" },
      { kind: 'ok', text: 'Retour à 1) — conversation et code restaurés.' },
      { kind: 'note', text: "Ou résumer à partir d'un message · alias : /checkpoint, /undo" },
    ],
  },
  zh: {
    title: 'Claude Code：/rewind——回到之前的状态',
    lines: [
      { kind: 'cmd', text: '/rewind' },
      { kind: 'out', text: '选择一个检查点：' },
      { kind: 'out', text: '1) “登录重构”之前 — 对话 + 代码' },
      { kind: 'out', text: '2) “API 修复”之前 — 已失败' },
      { kind: 'ok', text: '回到 1) — 对话和代码已还原。' },
      { kind: 'note', text: '或从某条消息起做总结 · 别名：/checkpoint、/undo' },
    ],
  },
};

export const RewindDemo = ({ lang }: { lang: Lang }) => <TerminalDemo script={rewindScripts[lang]} />;

// ---------- Demo 12: /architect (Aider) — Fakten aus commands.de.json aider/architect ----------
// Faktentreu: Hauptmodell (Architect) plant, separates Editor-Modell
// (--editor-model) setzt den Plan in konkrete Datei-Edits um.
export const aiderArchitectScripts: Record<Lang, TermScript> = {
  de: {
    title: 'Aider: /architect — planen + umsetzen (2 Modelle)',
    lines: [
      { kind: 'cmd', text: '/architect Zahlungslogik refaktorieren' },
      { kind: 'out', text: 'Architect-Modell entwirft die Lösung …' },
      { kind: 'out', text: 'Plan: payment.py aufteilen, Validierung auslagern' },
      { kind: 'out', text: 'Editor-Modell setzt den Plan in Datei-Edits um …' },
      { kind: 'ok', text: 'payment.py + validators.py geändert und committet.' },
      { kind: 'note', text: 'Editor-Modell wählbar: --editor-model' },
    ],
  },
  en: {
    title: 'Aider: /architect — plan + apply (two models)',
    lines: [
      { kind: 'cmd', text: '/architect refactor the payment logic' },
      { kind: 'out', text: 'Architect model drafts the solution …' },
      { kind: 'out', text: 'Plan: split payment.py, extract validation' },
      { kind: 'out', text: 'Editor model turns the plan into file edits …' },
      { kind: 'ok', text: 'payment.py + validators.py changed and committed.' },
      { kind: 'note', text: 'Pick the editor model: --editor-model' },
    ],
  },
  es: {
    title: 'Aider: /architect — planear + aplicar (dos modelos)',
    lines: [
      { kind: 'cmd', text: '/architect refactorizar la lógica de pago' },
      { kind: 'out', text: 'El modelo arquitecto redacta la solución …' },
      { kind: 'out', text: 'Plan: dividir payment.py, extraer la validación' },
      { kind: 'out', text: 'El modelo editor convierte el plan en ediciones …' },
      { kind: 'ok', text: 'payment.py + validators.py modificados y con commit.' },
      { kind: 'note', text: 'Elegir modelo editor: --editor-model' },
    ],
  },
  fr: {
    title: 'Aider : /architect — planifier + appliquer (deux modèles)',
    lines: [
      { kind: 'cmd', text: '/architect refactorer la logique de paiement' },
      { kind: 'out', text: 'Le modèle architecte rédige la solution …' },
      { kind: 'out', text: 'Plan : découper payment.py, extraire la validation' },
      { kind: 'out', text: 'Le modèle éditeur transforme le plan en éditions …' },
      { kind: 'ok', text: 'payment.py + validators.py modifiés et commités.' },
      { kind: 'note', text: 'Choisir le modèle éditeur : --editor-model' },
    ],
  },
  zh: {
    title: 'Aider：/architect——规划 + 落地（两个模型）',
    lines: [
      { kind: 'cmd', text: '/architect 重构支付逻辑' },
      { kind: 'out', text: '架构模型起草方案 …' },
      { kind: 'out', text: '方案：拆分 payment.py，抽离校验' },
      { kind: 'out', text: '编辑模型把方案转成文件改动 …' },
      { kind: 'ok', text: 'payment.py + validators.py 已修改并提交。' },
      { kind: 'note', text: '可选编辑模型：--editor-model' },
    ],
  },
};

export const AiderArchitectDemo = ({ lang }: { lang: Lang }) => <TerminalDemo script={aiderArchitectScripts[lang]} />;

// ---------- Demo 13: /diff (Codex CLI) — Fakten aus commands.de.json codex-cli/diff ----------
// Faktentreu: zeigt die Aenderungen der laufenden Codex-Sitzung; ergaenzt /review.
export const codexDiffScripts: Record<Lang, TermScript> = {
  de: {
    title: 'Codex CLI: /diff — Sitzungs-Änderungen sehen',
    lines: [
      { kind: 'cmd', text: '/diff' },
      { kind: 'out', text: 'auth.ts' },
      { kind: 'ok', text: '+  if (Date.now() > token.exp) refresh()' },
      { kind: 'out', text: 'api.ts' },
      { kind: 'note', text: '-  clearTimeout(dupHandler)' },
      { kind: 'out', text: '2 Dateien geändert — Diff der laufenden Sitzung.' },
      { kind: 'note', text: 'Ergänzt /review, das die Änderungen zusätzlich bewertet.' },
    ],
  },
  en: {
    title: 'Codex CLI: /diff — see your session changes',
    lines: [
      { kind: 'cmd', text: '/diff' },
      { kind: 'out', text: 'auth.ts' },
      { kind: 'ok', text: '+  if (Date.now() > token.exp) refresh()' },
      { kind: 'out', text: 'api.ts' },
      { kind: 'note', text: '-  clearTimeout(dupHandler)' },
      { kind: 'out', text: '2 files changed — diff for the current session.' },
      { kind: 'note', text: 'Complements /review, which also evaluates the changes.' },
    ],
  },
  es: {
    title: 'Codex CLI: /diff — ver los cambios de la sesión',
    lines: [
      { kind: 'cmd', text: '/diff' },
      { kind: 'out', text: 'auth.ts' },
      { kind: 'ok', text: '+  if (Date.now() > token.exp) refresh()' },
      { kind: 'out', text: 'api.ts' },
      { kind: 'note', text: '-  clearTimeout(dupHandler)' },
      { kind: 'out', text: '2 archivos cambiados — diff de la sesión actual.' },
      { kind: 'note', text: 'Complementa a /review, que además evalúa los cambios.' },
    ],
  },
  fr: {
    title: 'Codex CLI : /diff — voir les changements de la session',
    lines: [
      { kind: 'cmd', text: '/diff' },
      { kind: 'out', text: 'auth.ts' },
      { kind: 'ok', text: '+  if (Date.now() > token.exp) refresh()' },
      { kind: 'out', text: 'api.ts' },
      { kind: 'note', text: '-  clearTimeout(dupHandler)' },
      { kind: 'out', text: '2 fichiers modifiés — diff de la session en cours.' },
      { kind: 'note', text: 'Complète /review, qui évalue en plus les changements.' },
    ],
  },
  zh: {
    title: 'Codex CLI：/diff——查看本次会话的改动',
    lines: [
      { kind: 'cmd', text: '/diff' },
      { kind: 'out', text: 'auth.ts' },
      { kind: 'ok', text: '+  if (Date.now() > token.exp) refresh()' },
      { kind: 'out', text: 'api.ts' },
      { kind: 'note', text: '-  clearTimeout(dupHandler)' },
      { kind: 'out', text: '2 个文件已改动——当前会话的 diff。' },
      { kind: 'note', text: '与 /review 互补，后者还会评估这些改动。' },
    ],
  },
};

export const CodexDiffDemo = ({ lang }: { lang: Lang }) => <TerminalDemo script={codexDiffScripts[lang]} />;

// ---------- Demo 14: /model (Cursor CLI) — Fakten aus commands.de.json cursor-cli/model ----------
// Faktentreu: Modell-Picker (Fuzzy) in laufender Session; Fast-Modus,
// Reasoning-Effort und Kontext bleiben beim Wechsel erhalten.
export const cursorModelScripts: Record<Lang, TermScript> = {
  de: {
    title: 'Cursor CLI: /model — Modell in der Session wechseln',
    lines: [
      { kind: 'cmd', text: '/model opus' },
      { kind: 'out', text: 'Modellauswahl (Fuzzy-Suche):' },
      { kind: 'ok', text: '> Claude Opus 4.8' },
      { kind: 'out', text: '  GPT-5.6 Sol' },
      { kind: 'ok', text: 'Gewechselt zu Claude Opus 4.8 — Session läuft weiter.' },
      { kind: 'note', text: 'Fast-Modus, Reasoning-Effort und Kontext bleiben erhalten.' },
    ],
  },
  en: {
    title: 'Cursor CLI: /model — switch model mid-session',
    lines: [
      { kind: 'cmd', text: '/model opus' },
      { kind: 'out', text: 'Model picker (fuzzy search):' },
      { kind: 'ok', text: '> Claude Opus 4.8' },
      { kind: 'out', text: '  GPT-5.6 Sol' },
      { kind: 'ok', text: 'Switched to Claude Opus 4.8 — session continues.' },
      { kind: 'note', text: 'Fast mode, reasoning effort and context are preserved.' },
    ],
  },
  es: {
    title: 'Cursor CLI: /model — cambiar de modelo en la sesión',
    lines: [
      { kind: 'cmd', text: '/model opus' },
      { kind: 'out', text: 'Selector de modelo (búsqueda difusa):' },
      { kind: 'ok', text: '> Claude Opus 4.8' },
      { kind: 'out', text: '  GPT-5.6 Sol' },
      { kind: 'ok', text: 'Cambiado a Claude Opus 4.8 — la sesión continúa.' },
      { kind: 'note', text: 'Se conservan modo rápido, esfuerzo de razonamiento y contexto.' },
    ],
  },
  fr: {
    title: 'Cursor CLI : /model — changer de modèle en session',
    lines: [
      { kind: 'cmd', text: '/model opus' },
      { kind: 'out', text: 'Sélecteur de modèle (recherche floue) :' },
      { kind: 'ok', text: '> Claude Opus 4.8' },
      { kind: 'out', text: '  GPT-5.6 Sol' },
      { kind: 'ok', text: 'Basculé vers Claude Opus 4.8 — la session continue.' },
      { kind: 'note', text: 'Mode rapide, effort de raisonnement et contexte sont conservés.' },
    ],
  },
  zh: {
    title: 'Cursor CLI：/model——会话中切换模型',
    lines: [
      { kind: 'cmd', text: '/model opus' },
      { kind: 'out', text: '模型选择器（模糊搜索）：' },
      { kind: 'ok', text: '> Claude Opus 4.8' },
      { kind: 'out', text: '  GPT-5.6 Sol' },
      { kind: 'ok', text: '已切换到 Claude Opus 4.8——会话继续。' },
      { kind: 'note', text: '快速模式、推理力度和上下文都会保留。' },
    ],
  },
};

export const CursorModelDemo = ({ lang }: { lang: Lang }) => <TerminalDemo script={cursorModelScripts[lang]} />;
