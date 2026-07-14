import type { Lang } from '@/lib/i18n';

/**
 * Flaggschiff-Explainer auf der Landing (Direktive 12): 42s-Motion-Graphic
 * „Was macht promptgarten?" aus dem Remotion-Projekt (videos/), pro Sprache
 * gerendert. Kein Autoplay, Poster-Frame, preload=none (Landing bleibt schnell).
 */
const kicker: Record<Lang, string> = {
  de: '🎬 WAS IST PROMPTGARTEN? — IN 42 SEKUNDEN',
  en: '🎬 WHAT IS PROMPTGARTEN? — IN 42 SECONDS',
  es: '🎬 ¿QUÉ ES PROMPTGARTEN? — EN 42 SEGUNDOS',
  fr: '🎬 C’EST QUOI PROMPTGARTEN ? — EN 42 SECONDES',
  zh: '🎬 promptgarten 是什么？— 42 秒看懂',
};

const caption: Record<Lang, string> = {
  de: 'Kapitel, Befehle, Lernpfade, Quiz — der Überblick als kurzes Video.',
  en: 'Chapters, commands, learning paths, quizzes — the overview as a short video.',
  es: 'Capítulos, comandos, rutas de aprendizaje, quiz — el resumen en un vídeo corto.',
  fr: 'Chapitres, commandes, parcours, quiz — l’aperçu en vidéo courte.',
  zh: '章节、命令、学习路径、测验 — 用短视频快速了解。',
};

export default function HeroVideo({ lang }: { lang: Lang }) {
  return (
    <div style={{ maxWidth: 720, margin: '0 auto 38px' }}>
      <div
        className="card"
        style={{ padding: '18px 22px', boxShadow: '6px 6px 0 var(--ink)', background: '#fff', transform: 'rotate(-.4deg)' }}
      >
        <p className="kicker" style={{ color: 'var(--ink)' }}>{kicker[lang]}</p>
        <video
          controls
          preload="none"
          playsInline
          poster={`/videos/promptgarten-explainer-poster.${lang}.jpg`}
          aria-label={caption[lang]}
          style={{ width: '100%', display: 'block', border: '2.5px solid var(--ink)', borderRadius: 14, background: 'var(--bg)' }}
        >
          <source src={`/videos/promptgarten-explainer.${lang}.mp4`} type="video/mp4" />
        </video>
        <p style={{ margin: '10px 0 0', fontSize: 13, color: 'var(--muted)' }}>{caption[lang]}</p>
      </div>
    </div>
  );
}
