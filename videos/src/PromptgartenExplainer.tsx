import { AbsoluteFill, Sequence, interpolate, random, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { T, card, type Lang } from './theme';

/**
 * Flaggschiff-Explainer: „Was macht promptgarten?" — 42s Motion-Graphic in 5 Szenen.
 * S1 Intro-Logo · S2 Tool-Chaos → Ordnung · S3 Inhalt (Counter) · S4 So funktioniert's · S5 Outro-CTA
 */

const dict: Record<
  Lang,
  {
    tagline: string;
    chaosHead1: string;
    chaosHead2: string;
    contentHead: string;
    counters: [string, string, string, string];
    contentChips: string[];
    howHead: string;
    steps: { emoji: string; title: string; sub: string }[];
    xp: string;
    streak: string;
    outro1: string;
    outro2: string;
    outro3: string;
    langsRow: string;
  }
> = {
  de: {
    tagline: 'Programmieren mit KI-Agenten — einfach erklärt.',
    chaosHead1: 'Neue KI-Tools. Jede Woche.',
    chaosHead2: 'promptgarten ordnet alles — auf einer Seite.',
    contentHead: 'Was drin steckt',
    counters: ['Kapitel', 'Befehle', 'Plattformen', 'Sprachen'],
    contentChips: ['🌱 Einfach erklärt', '🔬 Vertieft', '❓ Quiz', '🎬 Videos', '📊 Diagramme'],
    howHead: 'So funktioniert es',
    steps: [
      { emoji: '🧭', title: 'Startpunkt finden', sub: '4 Fragen, 30 Sekunden' },
      { emoji: '📚', title: 'Lernpfad folgen', sub: 'Welt für Welt' },
      { emoji: '🏆', title: 'Dranbleiben', sub: 'XP sammeln, Streak halten' },
    ],
    xp: 'XP',
    streak: 'Tage-Streak',
    outro1: 'Kostenlos.',
    outro2: 'Ohne Account.',
    outro3: 'Sofort loslegen.',
    langsRow: 'DE · EN · ES · FR · 中文',
  },
  en: {
    tagline: 'Coding with AI agents — explained simply.',
    chaosHead1: 'New AI tools. Every week.',
    chaosHead2: 'promptgarten sorts it all — on one site.',
    contentHead: 'What is inside',
    counters: ['chapters', 'commands', 'platforms', 'languages'],
    contentChips: ['🌱 Simple', '🔬 In depth', '❓ Quizzes', '🎬 Videos', '📊 Diagrams'],
    howHead: 'How it works',
    steps: [
      { emoji: '🧭', title: 'Find your start', sub: '4 questions, 30 seconds' },
      { emoji: '📚', title: 'Follow the path', sub: 'world by world' },
      { emoji: '🏆', title: 'Keep going', sub: 'earn XP, keep your streak' },
    ],
    xp: 'XP',
    streak: 'day streak',
    outro1: 'Free.',
    outro2: 'No account.',
    outro3: 'Start right now.',
    langsRow: 'EN · DE · ES · FR · 中文',
  },
  es: {
    tagline: 'Programar con agentes de IA — explicado fácil.',
    chaosHead1: 'Nuevas herramientas de IA. Cada semana.',
    chaosHead2: 'promptgarten lo ordena todo — en un sitio.',
    contentHead: 'Qué contiene',
    counters: ['capítulos', 'comandos', 'plataformas', 'idiomas'],
    contentChips: ['🌱 Sencillo', '🔬 A fondo', '❓ Quiz', '🎬 Vídeos', '📊 Diagramas'],
    howHead: 'Cómo funciona',
    steps: [
      { emoji: '🧭', title: 'Encuentra tu inicio', sub: '4 preguntas, 30 segundos' },
      { emoji: '📚', title: 'Sigue la ruta', sub: 'mundo a mundo' },
      { emoji: '🏆', title: 'Sigue adelante', sub: 'gana XP, mantén la racha' },
    ],
    xp: 'XP',
    streak: 'días de racha',
    outro1: 'Gratis.',
    outro2: 'Sin cuenta.',
    outro3: 'Empieza ya.',
    langsRow: 'ES · EN · DE · FR · 中文',
  },
  fr: {
    tagline: 'Programmer avec des agents IA — expliqué simplement.',
    chaosHead1: 'De nouveaux outils IA. Chaque semaine.',
    chaosHead2: 'promptgarten met de l’ordre — sur un seul site.',
    contentHead: 'Ce qu’il contient',
    counters: ['chapitres', 'commandes', 'plateformes', 'langues'],
    contentChips: ['🌱 Simple', '🔬 Approfondi', '❓ Quiz', '🎬 Vidéos', '📊 Schémas'],
    howHead: 'Comment ça marche',
    steps: [
      { emoji: '🧭', title: 'Trouve ton départ', sub: '4 questions, 30 secondes' },
      { emoji: '📚', title: 'Suis le parcours', sub: 'monde après monde' },
      { emoji: '🏆', title: 'Continue', sub: 'gagne des XP, garde ta série' },
    ],
    xp: 'XP',
    streak: 'jours de série',
    outro1: 'Gratuit.',
    outro2: 'Sans compte.',
    outro3: 'Commence maintenant.',
    langsRow: 'FR · EN · DE · ES · 中文',
  },
  zh: {
    tagline: '用 AI 智能体编程 — 简单讲清楚。',
    chaosHead1: '新 AI 工具，每周都有。',
    chaosHead2: 'promptgarten 帮你理清一切 — 就在一个网站。',
    contentHead: '里面有什么',
    counters: ['章节', '命令', '平台', '语言'],
    contentChips: ['🌱 简单版', '🔬 深入版', '❓ 测验', '🎬 视频', '📊 图解'],
    howHead: '如何使用',
    steps: [
      { emoji: '🧭', title: '找到起点', sub: '4 个问题，30 秒' },
      { emoji: '📚', title: '跟随学习路径', sub: '一个世界接一个世界' },
      { emoji: '🏆', title: '坚持下去', sub: '赚取 XP，保持连续记录' },
    ],
    xp: 'XP',
    streak: '天连续记录',
    outro1: '免费。',
    outro2: '无需账号。',
    outro3: '立刻开始。',
    langsRow: '中文 · EN · DE · ES · FR',
  },
};

const COUNTER_VALUES = [60, 230, 4, 5];
const COUNTER_SUFFIX = ['+', '+', '', ''];
const COUNTER_COLORS = [T.lime, T.blue, T.pink, T.yellow];
const TOOLS = ['Claude Code', 'Cursor', 'Aider', 'Codex', 'MCP', 'Hooks', 'Subagents', '/compact', 'CLAUDE.md', 'Loops'];

// Dekorative Hintergrund-Shapes (deterministisch via random(seed))
const Bg = ({ seedOffset = 0 }: { seedOffset?: number }) => {
  const frame = useCurrentFrame();
  return (
    <>
      {Array.from({ length: 10 }, (_, i) => {
        const s = i + seedOffset;
        const x = random(`x${s}`) * 1280;
        const y = random(`y${s}`) * 720;
        const size = 14 + random(`s${s}`) * 26;
        const speed = 0.15 + random(`v${s}`) * 0.3;
        const shape = i % 3;
        const color = [T.lime, T.pink, T.blue, T.yellow][i % 4];
        const drift = Math.sin((frame * speed + i * 40) / 30) * 18;
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: x,
              top: y + drift,
              width: size,
              height: size,
              background: shape === 2 ? 'transparent' : color,
              border: `3px solid ${T.ink}`,
              borderRadius: shape === 0 ? '50%' : 6,
              opacity: 0.18,
              transform: `rotate(${frame * speed * 2 + i * 30}deg)`,
            }}
          />
        );
      })}
    </>
  );
};

// Szenen-Ausblenden in den letzten 15 Frames
const useFadeOut = (duration: number) => {
  const frame = useCurrentFrame();
  return interpolate(frame, [duration - 15, duration], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
};

const S1Intro = ({ t }: { t: (typeof dict)['de'] }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const fade = useFadeOut(170);
  const seedIn = spring({ frame, fps, config: { damping: 9, stiffness: 120 } });
  const word = 'promptgarten';
  const tagIn = spring({ frame: frame - 55, fps, config: { damping: 200 } });
  const lineW = interpolate(frame, [70, 100], [0, 460], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return (
    <AbsoluteFill style={{ background: T.bg, fontFamily: T.font, opacity: fade }}>
      <Bg />
      <div style={{ position: 'absolute', top: 170, width: '100%', textAlign: 'center' }}>
        <div style={{ fontSize: 120, transform: `scale(${seedIn}) rotate(${(1 - seedIn) * -40}deg)`, display: 'inline-block' }}>🌱</div>
        <div style={{ fontSize: 84, fontWeight: 800, color: T.ink, letterSpacing: '-0.03em', marginTop: 8 }}>
          {word.split('').map((ch, i) => {
            const li = spring({ frame: frame - 20 - i * 2.5, fps, config: { damping: 14, stiffness: 200 } });
            return (
              <span key={i} style={{ display: 'inline-block', opacity: li, transform: `translateY(${(1 - li) * 40}px)` }}>
                {ch}
              </span>
            );
          })}
        </div>
        <div style={{ height: 8, width: lineW, background: T.lime, border: `3px solid ${T.ink}`, borderRadius: 6, margin: '6px auto 18px' }} />
        <div style={{ fontSize: 32, fontWeight: 700, color: T.muted, opacity: tagIn, transform: `translateY(${(1 - tagIn) * 24}px)` }}>
          {t.tagline}
        </div>
      </div>
    </AbsoluteFill>
  );
};

const S2Chaos = ({ t }: { t: (typeof dict)['de'] }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const DUR = 260;
  const fade = useFadeOut(DUR);
  // Phase A (0–120): Chips fliegen wild rein. Phase B (120–…): ordnen sich ins Raster.
  const order = spring({ frame: frame - 120, fps, config: { damping: 16, stiffness: 90 } });
  const head1In = spring({ frame, fps, config: { damping: 200 } });
  const head2In = spring({ frame: frame - 130, fps, config: { damping: 200 } });
  return (
    <AbsoluteFill style={{ background: T.bg, fontFamily: T.font, opacity: fade }}>
      <Bg seedOffset={20} />
      <div style={{ position: 'absolute', top: 70, width: '100%', textAlign: 'center', height: 70 }}>
        <div
          style={{
            fontSize: 48, fontWeight: 800, color: T.ink, letterSpacing: '-0.02em', position: 'absolute', width: '100%',
            opacity: head1In * (1 - head2In), transform: `translateY(${(1 - head1In) * -26}px)`,
          }}
        >
          {t.chaosHead1}
        </div>
        <div
          style={{
            fontSize: 44, fontWeight: 800, color: T.ink, letterSpacing: '-0.02em', position: 'absolute', width: '100%',
            opacity: head2In, transform: `translateY(${(1 - head2In) * 26}px)`,
          }}
        >
          {t.chaosHead2}
        </div>
      </div>
      {TOOLS.map((tool, i) => {
        const inSpr = spring({ frame: frame - 15 - i * 6, fps, config: { damping: 11, stiffness: 130 } });
        // wilde Position
        const wx = 120 + random(`wx${i}`) * 980;
        const wy = 190 + random(`wy${i}`) * 400;
        const wr = (random(`wr${i}`) - 0.5) * 24;
        // geordnetes Raster 5×2
        const gx = 130 + (i % 5) * 210;
        const gy = 300 + Math.floor(i / 5) * 130;
        const x = wx + (gx - wx) * order;
        const y = wy + (gy - wy) * order;
        const r = wr * (1 - order);
        const color = [T.lime, T.pink, T.blue, T.yellow, '#fff'][i % 5];
        return (
          <div
            key={tool}
            style={{
              position: 'absolute', left: x, top: y, width: 190, height: 92,
              background: color, border: `4px solid ${T.ink}`, borderRadius: 18,
              boxShadow: `6px 6px 0 ${T.ink}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 24, fontWeight: 800, color: T.ink,
              transform: `scale(${inSpr}) rotate(${r}deg)`,
              fontFamily: tool.startsWith('/') || tool.includes('.md') ? 'Consolas, monospace' : T.font,
            }}
          >
            {tool}
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

const S3Content = ({ t }: { t: (typeof dict)['de'] }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const DUR = 300;
  const fade = useFadeOut(DUR);
  const headIn = spring({ frame, fps, config: { damping: 200 } });
  return (
    <AbsoluteFill style={{ background: T.bg, fontFamily: T.font, opacity: fade }}>
      <Bg seedOffset={40} />
      <div style={{ position: 'absolute', top: 70, width: '100%', textAlign: 'center', fontSize: 52, fontWeight: 800, color: T.ink, letterSpacing: '-0.02em', opacity: headIn, transform: `translateY(${(1 - headIn) * -26}px)` }}>
        {t.contentHead}
      </div>
      {COUNTER_VALUES.map((target, i) => {
        const inSpr = spring({ frame: frame - 30 - i * 14, fps, config: { damping: 13, stiffness: 140 } });
        const count = Math.floor(
          interpolate(frame, [40 + i * 14, 110 + i * 14], [0, target], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
        );
        return (
          <div
            key={i}
            style={{
              ...card(COUNTER_COLORS[i]),
              position: 'absolute', left: 90 + i * 290, top: 200, width: 250, height: 190,
              transform: `scale(${inSpr}) rotate(${i % 2 === 0 ? -1.2 : 1.2}deg)`,
            }}
          >
            <div style={{ fontSize: 64, fontWeight: 800, color: T.ink, fontVariantNumeric: 'tabular-nums' }}>
              {count}
              {COUNTER_SUFFIX[i]}
            </div>
            <div style={{ fontSize: 26, fontWeight: 700, color: T.ink }}>{t.counters[i]}</div>
          </div>
        );
      })}
      <div style={{ position: 'absolute', top: 470, width: '100%', display: 'flex', justifyContent: 'center', gap: 18 }}>
        {t.contentChips.map((chip, i) => {
          const inSpr = spring({ frame: frame - 130 - i * 10, fps, config: { damping: 12, stiffness: 160 } });
          return (
            <div
              key={chip}
              style={{
                background: '#fff', border: `3.5px solid ${T.ink}`, borderRadius: 99, padding: '14px 26px',
                fontSize: 24, fontWeight: 700, color: T.ink, boxShadow: `4px 4px 0 ${T.ink}`,
                transform: `scale(${inSpr})`, opacity: inSpr,
              }}
            >
              {chip}
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

const S4How = ({ t }: { t: (typeof dict)['de'] }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const DUR = 280;
  const fade = useFadeOut(DUR);
  const headIn = spring({ frame, fps, config: { damping: 200 } });
  const colors = [T.yellow, T.blue, T.lime];
  const xp = Math.floor(interpolate(frame, [150, 230], [0, 120], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }));
  const flame = 1 + Math.sin(frame / 6) * 0.12;
  const badgeIn = spring({ frame: frame - 150, fps, config: { damping: 10, stiffness: 120 } });
  return (
    <AbsoluteFill style={{ background: T.bg, fontFamily: T.font, opacity: fade }}>
      <Bg seedOffset={60} />
      <div style={{ position: 'absolute', top: 70, width: '100%', textAlign: 'center', fontSize: 52, fontWeight: 800, color: T.ink, letterSpacing: '-0.02em', opacity: headIn, transform: `translateY(${(1 - headIn) * -26}px)` }}>
        {t.howHead}
      </div>
      {t.steps.map((step, i) => {
        const inSpr = spring({ frame: frame - 30 - i * 22, fps, config: { damping: 13, stiffness: 130 } });
        return (
          <div key={i}>
            <div
              style={{
                ...card(colors[i]),
                position: 'absolute', left: 100 + i * 380, top: 210, width: 320, height: 210,
                transform: `scale(${inSpr}) rotate(${i === 1 ? 1 : -1}deg)`, padding: 16, textAlign: 'center',
              }}
            >
              <div style={{ fontSize: 58 }}>{step.emoji}</div>
              <div style={{ fontSize: 29, fontWeight: 800, color: T.ink }}>{step.title}</div>
              <div style={{ fontSize: 21, fontWeight: 600, color: T.muted, marginTop: 6 }}>{step.sub}</div>
            </div>
            {i < 2 && (
              <div style={{ position: 'absolute', left: 100 + i * 380 + 330, top: 290, fontSize: 52, color: T.ink, opacity: spring({ frame: frame - 50 - i * 22, fps, config: { damping: 200 } }) }}>
                →
              </div>
            )}
          </div>
        );
      })}
      <div
        style={{
          position: 'absolute', top: 490, width: '100%', display: 'flex', justifyContent: 'center', gap: 24,
          opacity: badgeIn,
        }}
      >
        <div style={{ background: T.ink, color: T.bg, borderRadius: 99, padding: '16px 34px', fontSize: 30, fontWeight: 800, fontVariantNumeric: 'tabular-nums', transform: `scale(${badgeIn})` }}>
          ⭐ {xp} {t.xp}
        </div>
        <div style={{ background: '#fff', border: `4px solid ${T.ink}`, borderRadius: 99, padding: '16px 34px', fontSize: 30, fontWeight: 800, boxShadow: `5px 5px 0 ${T.ink}`, transform: `scale(${badgeIn})` }}>
          <span style={{ display: 'inline-block', transform: `scale(${flame})` }}>🔥</span> 4 {t.streak}
        </div>
      </div>
    </AbsoluteFill>
  );
};

const S5Outro = ({ t }: { t: (typeof dict)['de'] }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const panelIn = spring({ frame, fps, config: { damping: 16, stiffness: 90 } });
  const lines = [t.outro1, t.outro2, t.outro3];
  const ctaIn = spring({ frame: frame - 90, fps, config: { damping: 9, stiffness: 110 } });
  const pulse = 1 + Math.sin(Math.max(0, frame - 110) / 8) * 0.04;
  const sprout = spring({ frame: frame - 140, fps, config: { damping: 12 } });
  return (
    <AbsoluteFill style={{ background: T.bg, fontFamily: T.font }}>
      <AbsoluteFill
        style={{
          background: T.ink, borderRadius: 36, margin: 28,
          transform: `translateY(${(1 - panelIn) * 720}px)`,
          alignItems: 'center', justifyContent: 'center',
        }}
      >
        <div style={{ textAlign: 'center' }}>
          {lines.map((line, i) => {
            const li = spring({ frame: frame - 25 - i * 16, fps, config: { damping: 14, stiffness: 150 } });
            return (
              <div key={i} style={{ fontSize: 62, fontWeight: 800, color: i === 2 ? T.lime : T.bg, letterSpacing: '-0.02em', opacity: li, transform: `translateX(${(1 - li) * (i % 2 === 0 ? -60 : 60)}px)`, lineHeight: 1.25 }}>
                {line}
              </div>
            );
          })}
          <div
            style={{
              display: 'inline-block', marginTop: 44, background: T.lime, color: T.ink,
              border: `5px solid ${T.ink}`, borderRadius: 99, padding: '20px 52px',
              fontSize: 44, fontWeight: 800, boxShadow: `0 0 0 6px ${T.bg}`,
              transform: `scale(${ctaIn * pulse})`,
            }}
          >
            🌱 promptgarten.com
          </div>
          <div style={{ marginTop: 26, fontSize: 24, fontWeight: 700, color: 'rgba(247,243,233,.75)', opacity: sprout }}>
            {t.langsRow}
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export const PromptgartenExplainer = ({ lang }: { lang: Lang }) => {
  const t = dict[lang];
  return (
    <AbsoluteFill style={{ background: T.bg }}>
      <Sequence durationInFrames={170}>
        <S1Intro t={t} />
      </Sequence>
      <Sequence from={170} durationInFrames={260}>
        <S2Chaos t={t} />
      </Sequence>
      <Sequence from={430} durationInFrames={300}>
        <S3Content t={t} />
      </Sequence>
      <Sequence from={730} durationInFrames={280}>
        <S4How t={t} />
      </Sequence>
      <Sequence from={1010} durationInFrames={250}>
        <S5Outro t={t} />
      </Sequence>
    </AbsoluteFill>
  );
};
