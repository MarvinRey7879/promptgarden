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
