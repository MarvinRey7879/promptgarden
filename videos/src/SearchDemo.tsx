import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { T, type Lang } from './theme';

/**
 * Suche-Demo (R7): nachgebautes Such-Modal im 1d-Stil — „mcp" wird getippt,
 * Ergebnis-Gruppen erscheinen gestaffelt, Auswahl wandert, Enter öffnet Kapitel-Karte.
 * Fakten = echte Treffer der Live-Suche (Kapitel mcp, Befehl /mcp, Prompt-Bibliothek).
 */
const dict: Record<Lang, {
  title: string; hint: string; placeholder: string;
  groups: [string, string, string];
  results: [string[], string[], string[]];
  chapterTitle: string; chapterTeaser: string;
}> = {
  de: {
    title: 'Alles durchsuchen: 🔍 oder Strg+K',
    hint: '↑↓ wählen · Enter öffnen',
    placeholder: 'Suche …',
    groups: ['KAPITEL', 'BEFEHLE', 'ADDONS'],
    results: [['MCP — ein Stecker für alle Werkzeuge', 'Einen eigenen MCP-Server schreiben'], ['/mcp — Claude Code', 'agy mcp — Antigravity CLI'], ['MCP-Server-Katalog']],
    chapterTitle: 'MCP',
    chapterTeaser: 'Ein offener Standard, der KI-Werkzeuge wie ein Stecker verbindet.',
  },
  en: {
    title: 'Search everything: 🔍 or Ctrl+K',
    hint: '↑↓ select · Enter open',
    placeholder: 'Search …',
    groups: ['CHAPTERS', 'COMMANDS', 'ADD-ONS'],
    results: [['MCP — one plug for every tool', 'Write your own MCP server'], ['/mcp — Claude Code', 'agy mcp — Antigravity CLI'], ['MCP server catalog']],
    chapterTitle: 'MCP',
    chapterTeaser: 'An open standard that connects AI tools like a plug.',
  },
  es: {
    title: 'Busca en todo: 🔍 o Ctrl+K',
    hint: '↑↓ elegir · Enter abrir',
    placeholder: 'Busca …',
    groups: ['CAPÍTULOS', 'COMANDOS', 'ADD-ONS'],
    results: [['MCP — un enchufe para todas las herramientas', 'Escribe tu propio servidor MCP'], ['/mcp — Claude Code', 'agy mcp — Antigravity CLI'], ['Catálogo de servidores MCP']],
    chapterTitle: 'MCP',
    chapterTeaser: 'Un estándar abierto que conecta herramientas de IA como un enchufe.',
  },
  fr: {
    title: 'Cherche partout : 🔍 ou Ctrl+K',
    hint: '↑↓ choisir · Entrée ouvrir',
    placeholder: 'Cherche …',
    groups: ['CHAPITRES', 'COMMANDES', 'ADD-ONS'],
    results: [['MCP — une prise pour tous les outils', 'Écrire son propre serveur MCP'], ['/mcp — Claude Code', 'agy mcp — Antigravity CLI'], ['Catalogue de serveurs MCP']],
    chapterTitle: 'MCP',
    chapterTeaser: 'Un standard ouvert qui connecte les outils IA comme une prise.',
  },
  zh: {
    title: '全站搜索：🔍 或 Ctrl+K',
    hint: '↑↓ 选择 · Enter 打开',
    placeholder: '搜索 …',
    groups: ['章节', '命令', '扩展'],
    results: [['MCP——所有工具的通用插头', '自己写一个 MCP 服务器'], ['/mcp — Claude Code', 'agy mcp — Antigravity CLI'], ['MCP 服务器目录']],
    chapterTitle: 'MCP',
    chapterTeaser: '一个开放标准，像插头一样连接 AI 工具。',
  },
};

const QUERY = 'mcp';
const GROUP_COLORS = [T.lime, T.blue, T.pink];

export const SearchDemo = ({ lang }: { lang: Lang }) => {
  const t = dict[lang];
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleIn = spring({ frame, fps, config: { damping: 200 } });
  const modalIn = spring({ frame: frame - 18, fps, config: { damping: 15, stiffness: 130 } });
  // Tippen ab Frame 45
  const typed = QUERY.slice(0, Math.max(0, Math.floor((frame - 45) / 9)));
  // Ergebnisse gestaffelt ab Frame 80
  const flat = t.results.flat();
  // Auswahl wandert: Frames 170-260, dann Enter
  const SEL_START = 170;
  const selIdx = frame < SEL_START ? 0 : Math.min(Math.floor((frame - SEL_START) / 30), 1);
  const enterAt = 260;
  const cardIn = spring({ frame: frame - enterAt, fps, config: { damping: 12, stiffness: 110 } });
  const modalOut = frame > enterAt ? interpolate(frame, [enterAt, enterAt + 12], [1, 0.12], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }) : 1;

  let itemIndex = -1;

  return (
    <AbsoluteFill style={{ background: T.bg, fontFamily: T.font }}>
      <div style={{ position: 'absolute', top: 46, width: '100%', textAlign: 'center', fontSize: 46, fontWeight: 800, color: T.ink, letterSpacing: '-0.02em', opacity: titleIn, transform: `translateY(${(1 - titleIn) * -24}px)` }}>
        {t.title}
      </div>

      {/* Such-Modal */}
      <div
        style={{
          position: 'absolute', left: 240, top: 130, width: 800,
          background: '#fff', border: `4px solid ${T.ink}`, borderRadius: 20,
          boxShadow: `9px 9px 0 ${T.ink}`, padding: '20px 26px',
          transform: `scale(${modalIn})`, opacity: modalOut,
        }}
      >
        <div style={{ border: `3px solid ${T.ink}`, borderRadius: 12, padding: '10px 16px', fontSize: 26, fontFamily: 'Consolas, monospace', color: T.ink, background: T.bg }}>
          🔍 {typed || t.placeholder}
          {frame >= 45 && frame < 90 && <span style={{ opacity: Math.floor(frame / 10) % 2 === 0 ? 1 : 0 }}>▌</span>}
        </div>
        <div style={{ fontSize: 14, color: T.muted, marginTop: 6, fontFamily: 'Consolas, monospace' }}>{t.hint}</div>

        {t.results.map((items, gi) => {
          const gIn = spring({ frame: frame - 80 - gi * 14, fps, config: { damping: 200 } });
          return (
            <div key={gi} style={{ marginTop: 14, opacity: gIn }}>
              <div style={{ fontSize: 13, fontWeight: 800, color: T.muted, letterSpacing: '0.1em', marginBottom: 6 }}>{t.groups[gi]}</div>
              {items.map((r) => {
                itemIndex++;
                const idx = itemIndex;
                const active = idx === selIdx && frame >= 100;
                return (
                  <div
                    key={r}
                    style={{
                      border: `2.5px solid ${T.ink}`, borderRadius: 12, padding: '8px 14px', marginBottom: 6,
                      fontSize: 19, fontWeight: 700, color: T.ink,
                      background: active ? GROUP_COLORS[gi] : T.bg,
                      boxShadow: active ? `4px 4px 0 ${T.ink}` : 'none',
                      transform: active ? 'translateX(4px)' : 'none',
                    }}
                  >
                    {r}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>

      {/* Kapitel-Karte nach Enter */}
      <div
        style={{
          position: 'absolute', left: 340, top: 250, width: 600,
          background: T.lime, border: `5px solid ${T.ink}`, borderRadius: 24,
          boxShadow: `10px 10px 0 ${T.ink}`, padding: '30px 34px',
          transform: `scale(${cardIn}) rotate(-0.6deg)`, opacity: cardIn,
        }}
      >
        <div style={{ fontSize: 15, fontWeight: 800, color: T.muted, letterSpacing: '0.12em' }}>📖 {t.groups[0]}</div>
        <div style={{ fontSize: 52, fontWeight: 800, color: T.ink, letterSpacing: '-0.02em', margin: '6px 0' }}>{t.chapterTitle}</div>
        <div style={{ fontSize: 24, fontWeight: 600, color: T.ink, lineHeight: 1.45 }}>{t.chapterTeaser}</div>
        <div style={{ marginTop: 16, display: 'inline-block', background: T.ink, color: T.bg, borderRadius: 99, padding: '8px 20px', fontSize: 18, fontWeight: 800 }}>
          🌱 / 🔬 + Quiz
        </div>
      </div>
    </AbsoluteFill>
  );
};
