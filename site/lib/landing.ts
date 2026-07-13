import type { Lang } from './i18n';

/**
 * Landing-Page-Strings (It. 73, CRO/SEO-Research-basiert: research/landing-cro-seo-2026-07.md).
 * Regeln daraus: EIN spezifischer Primär-CTA (kein „Get Started"), Show-don't-tell mit echten
 * Karten, ehrliche Katalog-Zahlen statt Fake-Social-Proof, 3-Schritte-How-it-works, E-E-A-T-Trust.
 */
export type LandingDict = {
  metaTitle: string;
  heroSub: string;
  ctaPrimary: string; // spezifisch! (NN/g 4 Ss)
  audiences: string[];
  statsTemplate: (k: number, b: number, a: number, w: number) => string;
  exampleKicker: string;
  exampleEntrySlug: string; // echter Eintrag fürs Show-don't-tell
  howTitle: string;
  how: { emoji: string; title: string; desc: string; href: string }[];
  trustTitle: string;
  trust: { emoji: string; text: string }[];
};

export const landing: Record<Lang, LandingDict> = {
  de: {
    metaTitle: 'promptgarten 🌱 — Coden mit KI lernen: Lexikon, Lernpfade & CLI-Befehle, kostenlos in 5 Sprachen',
    heroSub: 'Coden mit KI lernen — kostenlos, in 5 Sprachen, ohne Account. Vom ersten Begriff bis zur eigenen Agenten-Loop.',
    ctaPrimary: '🌱 Finde deinen Startpunkt',
    audiences: ['Anfänger:innen', 'Vibe-Coder', 'Entwickler:innen', 'Agenten-Nutzer'],
    statsTemplate: (k, b, a, w) => `${k} Kapitel · ${b} Befehle erklärt · ${a} Addons · ${w} Lernwelten · 5 Sprachen — alles mit sichtbaren Quellen`,
    exampleKicker: 'SO SIEHT EIN KAPITEL AUS',
    exampleEntrySlug: 'mcp',
    howTitle: 'So funktioniert promptgarten',
    how: [
      { emoji: '🧭', title: '1 · Finden', desc: 'Such einen Begriff im Lexikon — oder lass dir in 20 Sekunden deinen Startpunkt empfehlen.', href: 'start/' },
      { emoji: '📚', title: '2 · Lernen', desc: 'Folge einem Lernpfad: Kapitel für Kapitel, mit Quiz, Schwierigkeitsgrad und XP — gespeichert nur in deinem Browser.', href: 'lernpfade/' },
      { emoji: '🛠️', title: '3 · Anwenden', desc: 'Schlag jeden CLI-Befehl nach, finde die richtigen Addons und bleib über den Feed aktuell.', href: 'befehle/' },
    ],
    trustTitle: 'Warum du dem hier trauen kannst',
    trust: [
      { emoji: '🔍', text: 'Jede Behauptung hat eine sichtbare Quelle — direkt auf der Seite, jede URL geprüft.' },
      { emoji: '🆓', text: 'Komplett kostenlos, kein Account nötig, kein Tracking mit Cookies.' },
      { emoji: '🤖', text: 'Ausdrücklich KI- und Scraping-freundlich: freie JSON-API + llms.txt — jeder soll lernen, Mensch wie Maschine.' },
      { emoji: '🔄', text: 'Wird laufend aktualisiert — neue Modelle, Befehle und News landen hier zuerst.' },
    ],
  },
  en: {
    metaTitle: 'promptgarten 🌱 — Learn coding with AI: glossary, learning paths & CLI commands, free in 5 languages',
    heroSub: 'Learn coding with AI — free, in 5 languages, no account. From your first term to your own agent loop.',
    ctaPrimary: '🌱 Find your starting point',
    audiences: ['Beginners', 'Vibe coders', 'Developers', 'Agent users'],
    statsTemplate: (k, b, a, w) => `${k} chapters · ${b} commands explained · ${a} add-ons · ${w} learning worlds · 5 languages — all with visible sources`,
    exampleKicker: 'WHAT A CHAPTER LOOKS LIKE',
    exampleEntrySlug: 'mcp',
    howTitle: 'How promptgarten works',
    how: [
      { emoji: '🧭', title: '1 · Find', desc: 'Look up a term in the glossary — or get your personal starting point recommended in 20 seconds.', href: 'start/' },
      { emoji: '📚', title: '2 · Learn', desc: 'Follow a learning path: chapter by chapter, with quizzes, difficulty levels and XP — stored only in your browser.', href: 'lernpfade/' },
      { emoji: '🛠️', title: '3 · Apply', desc: 'Look up every CLI command, find the right add-ons and stay current via the feed.', href: 'befehle/' },
    ],
    trustTitle: 'Why you can trust this',
    trust: [
      { emoji: '🔍', text: 'Every claim has a visible source — right on the page, every URL verified.' },
      { emoji: '🆓', text: 'Completely free, no account required, no cookie tracking.' },
      { emoji: '🤖', text: 'Explicitly AI- and scraping-friendly: free JSON API + llms.txt — everyone should learn, human or machine.' },
      { emoji: '🔄', text: 'Continuously updated — new models, commands and news land here first.' },
    ],
  },
  es: {
    metaTitle: 'promptgarten 🌱 — Aprende a programar con IA: glosario, rutas de aprendizaje y comandos CLI, gratis en 5 idiomas',
    heroSub: 'Aprende a programar con IA — gratis, en 5 idiomas, sin cuenta. Desde tu primer término hasta tu propio loop de agente.',
    ctaPrimary: '🌱 Encuentra tu punto de partida',
    audiences: ['Principiantes', 'Vibe coders', 'Desarrolladores', 'Usuarios de agentes'],
    statsTemplate: (k, b, a, w) => `${k} capítulos · ${b} comandos explicados · ${a} add-ons · ${w} mundos de aprendizaje · 5 idiomas — todo con fuentes visibles`,
    exampleKicker: 'ASÍ SE VE UN CAPÍTULO',
    exampleEntrySlug: 'mcp',
    howTitle: 'Cómo funciona promptgarten',
    how: [
      { emoji: '🧭', title: '1 · Encuentra', desc: 'Busca un término en el glosario — o recibe tu punto de partida personal en 20 segundos.', href: 'start/' },
      { emoji: '📚', title: '2 · Aprende', desc: 'Sigue una ruta de aprendizaje: capítulo a capítulo, con quiz, nivel de dificultad y XP — guardado solo en tu navegador.', href: 'lernpfade/' },
      { emoji: '🛠️', title: '3 · Aplica', desc: 'Consulta cada comando CLI, encuentra los add-ons adecuados y mantente al día con el feed.', href: 'befehle/' },
    ],
    trustTitle: 'Por qué puedes confiar en esto',
    trust: [
      { emoji: '🔍', text: 'Cada afirmación tiene una fuente visible — en la propia página, cada URL verificada.' },
      { emoji: '🆓', text: 'Completamente gratis, sin cuenta, sin tracking con cookies.' },
      { emoji: '🤖', text: 'Explícitamente amigable con IA y scraping: API JSON gratuita + llms.txt — todos deben poder aprender.' },
      { emoji: '🔄', text: 'Actualizado continuamente — nuevos modelos, comandos y noticias llegan aquí primero.' },
    ],
  },
  fr: {
    metaTitle: 'promptgarten 🌱 — Apprends à coder avec l’IA : lexique, parcours et commandes CLI, gratuit en 5 langues',
    heroSub: 'Apprends à coder avec l’IA — gratuit, en 5 langues, sans compte. De ton premier terme à ta propre boucle d’agent.',
    ctaPrimary: '🌱 Trouve ton point de départ',
    audiences: ['Débutant·es', 'Vibe coders', 'Développeur·ses', 'Utilisateurs d’agents'],
    statsTemplate: (k, b, a, w) => `${k} chapitres · ${b} commandes expliquées · ${a} add-ons · ${w} mondes d’apprentissage · 5 langues — tout avec sources visibles`,
    exampleKicker: 'À QUOI RESSEMBLE UN CHAPITRE',
    exampleEntrySlug: 'mcp',
    howTitle: 'Comment fonctionne promptgarten',
    how: [
      { emoji: '🧭', title: '1 · Trouver', desc: 'Cherche un terme dans le lexique — ou reçois ton point de départ personnel en 20 secondes.', href: 'start/' },
      { emoji: '📚', title: '2 · Apprendre', desc: 'Suis un parcours : chapitre par chapitre, avec quiz, niveau de difficulté et XP — stocké uniquement dans ton navigateur.', href: 'lernpfade/' },
      { emoji: '🛠️', title: '3 · Appliquer', desc: 'Consulte chaque commande CLI, trouve les bons add-ons et reste à jour via le feed.', href: 'befehle/' },
    ],
    trustTitle: 'Pourquoi tu peux faire confiance',
    trust: [
      { emoji: '🔍', text: 'Chaque affirmation a une source visible — sur la page même, chaque URL vérifiée.' },
      { emoji: '🆓', text: 'Entièrement gratuit, sans compte, sans tracking par cookies.' },
      { emoji: '🤖', text: 'Explicitement ouvert aux IA et au scraping : API JSON gratuite + llms.txt — tout le monde doit pouvoir apprendre.' },
      { emoji: '🔄', text: 'Mis à jour en continu — nouveaux modèles, commandes et actus arrivent ici en premier.' },
    ],
  },
  zh: {
    metaTitle: 'promptgarten 🌱 — 用 AI 学编程：词典、学习路径与 CLI 命令，免费支持 5 种语言',
    heroSub: '用 AI 学编程——免费、5 种语言、无需账号。从第一个术语到你自己的智能体循环。',
    ctaPrimary: '🌱 找到你的起点',
    audiences: ['初学者', 'Vibe Coder', '开发者', '智能体用户'],
    statsTemplate: (k, b, a, w) => `${k} 个章节 · ${b} 条命令详解 · ${a} 个扩展 · ${w} 个学习世界 · 5 种语言——全部附可见来源`,
    exampleKicker: '章节长这样',
    exampleEntrySlug: 'mcp',
    howTitle: 'promptgarten 是这样运作的',
    how: [
      { emoji: '🧭', title: '1 · 找到', desc: '在词典里查一个术语——或者花 20 秒获得为你推荐的起点。', href: 'start/' },
      { emoji: '📚', title: '2 · 学习', desc: '跟随学习路径：逐章推进，配测验、难度等级和 XP——只保存在你的浏览器里。', href: 'lernpfade/' },
      { emoji: '🛠️', title: '3 · 应用', desc: '查阅每条 CLI 命令，找到合适的扩展，通过资讯保持最新。', href: 'befehle/' },
    ],
    trustTitle: '为什么值得信任',
    trust: [
      { emoji: '🔍', text: '每个论断都有可见来源——就在页面上，每个链接都经过验证。' },
      { emoji: '🆓', text: '完全免费，无需账号，无 Cookie 追踪。' },
      { emoji: '🤖', text: '明确对 AI 和抓取友好：免费 JSON API + llms.txt——人人（人和机器）都能学习。' },
      { emoji: '🔄', text: '持续更新——新模型、新命令和新闻最先出现在这里。' },
    ],
  },
};
