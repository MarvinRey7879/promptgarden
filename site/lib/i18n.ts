export const LANGS = ['de', 'en', 'es', 'fr', 'zh'] as const;
export type Lang = (typeof LANGS)[number];

export function isLang(x: string): x is Lang {
  return (LANGS as readonly string[]).includes(x);
}

type Dict = {
  nav: { lexikon: string; lernpfade: string; feed: string; vergleiche: string; befehle: string; addons: string; prompts: string };
  addonsTitle: string;
  addonsSub: string;
  addonsOfficial: string;
  cmdTitle: string;
  cmdSub: string;
  cmdWhenGood: string;
  cmdWhenBad: string;
  cmdAlternative: string;
  cmdAllCommands: string;
  newsletter: string;
  newsletterSoonTitle: string;
  newsletterSoonBody: string;
  heroTop: string;
  heroMark: string;
  heroSub: string;
  cards: { title: string; desc: string; emoji: string; href: string }[];
  insightLabel: string;
  insightText: string;
  levelLabel: string;
  levelTitle: string;
  levelChips: string[];
  lexikonTitle: string;
  search: string;
  colNr: string;
  colEntry: string;
  colCategory: string;
  colLevel: string;
  showing: (n: number, total: number) => string;
  categories: Record<string, string>;
  minutes: string;
  markDone: string;
  done: string;
  quizTitle: string;
  quizCheck: string;
  quizCorrect: string;
  quizWrong: string;
  related: string;
  example: string;
  sources: string;
  exercise: string;
  selfCheck: string;
  levelSimple: string;
  levelDetail: string;
  feedTitle: string;
  feedSub: string;
  feedTags: Record<string, string>;
  pathWorld0: string;
  pathWorld: string;
  pathWorld2: string;
  pathWorld3: string;
  pathTitle: string;
  pathSub: string;
  pathContinue: string;
  pathReadOnly: string;
  locked: string;
  newsEmailPlaceholder: string;
  newsSubmit: string;
  newsThanks: string;
  newsHint: string;
  wizardTitle: string;
  wizardSub: string;
  wizardQ: { q: string; options: string[] }[];
  wizardResultTitle: string;
  wizardResults: { beginner: string; intermediate: string; pro: string };
  wizardGo: string;
  wizardRestart: string;
  wizardToolQ: { q: string; options: string[] };
  wizardNextTitle: string;
  wizardNextPath: string;
  wizardNextTool: string;
  wizardNextInstall: string;
  bugBtn: string;
  bugTitle: string;
  bugPlaceholder: string;
  bugSend: string;
  donate: string;
  footerNote: string;
  close: string;
  xp: string;
  streakDays: (n: number) => string;
};

export const ui: Record<Lang, Dict> = {
  de: {
    nav: { lexikon: 'Lexikon', lernpfade: 'Lernpfade', feed: 'Feed', vergleiche: 'Vergleiche', befehle: 'Befehle', addons: 'Addons', prompts: 'Prompts' },
    addonsTitle: 'Addons & Integrationen',
    addonsSub: 'Die wichtigsten Werkzeuge rund um KI-Coding-Agenten: MCP-Server, Plugins, Editor- und Wissens-Integrationen — geprüft, mit Quelle.',
    addonsOfficial: 'Offiziell',
    cmdTitle: 'Befehls-Referenz',
    cmdSub: 'Jeder Befehl einzeln erklärt: was er macht, wann er glänzt — und wann etwas anderes besser passt.',
    cmdWhenGood: 'Wann einsetzen?',
    cmdWhenBad: 'Wann eher nicht?',
    cmdAlternative: 'Besser',
    cmdAllCommands: 'Alle Befehle',
    newsletter: 'Newsletter',
    newsletterSoonTitle: 'Newsletter kommt bald 🌱',
    newsletterSoonBody: 'Wir bauen gerade den Versand. Schau in ein paar Tagen wieder vorbei — oder merk dir die Seite.',
    heroTop: 'Pflanze dein',
    heroMark: 'KI-Wissen',
    heroSub: 'Alles rund ums Coden mit KI — kostenlos, wachsend, ohne Fachchinesisch. Außer du willst Fachchinesisch, das haben wir auch.',
    cards: [
      { emoji: '📖', title: 'Begriffe', desc: 'Wörter, die alle benutzen und keiner erklärt.', href: 'lexikon/?cat=begriff' },
      { emoji: '✍️', title: 'Prompts', desc: 'Best Practices, die dein Modell wirklich versteht.', href: 'lexikon/?cat=prompt-pattern' },
      { emoji: '🤖', title: 'Agenten', desc: 'Was sie können, wo sie scheitern, wie du sie zähmst.', href: 'lexikon/?cat=konzept' },
      { emoji: '🔄', title: 'Loops', desc: 'Denken → Handeln → Prüfen. Und wieder von vorn.', href: 'loops/' },
    ],
    insightLabel: 'AKTUELL IM FEED',
    insightText: 'Ein Agent ohne Stop-Bedingung ist kein Agent — er ist eine Endlosschleife mit Selbstbewusstsein.',
    levelLabel: 'DEIN LEVEL?',
    levelTitle: 'Starte den passenden Lernpfad:',
    levelChips: ['🌱 Neu hier', '🌿 Dabei', '🌳 Profi'],
    lexikonTitle: 'Lexikon',
    search: 'Suche einen Begriff…',
    colNr: 'NR',
    colEntry: 'EINTRAG',
    colCategory: 'KATEGORIE',
    colLevel: 'LEVEL',
    showing: (n, total) => `Zeige ${n} von ${total} Einträgen`,
    categories: { begriff: 'Begriff', 'prompt-pattern': 'Prompt-Pattern', konzept: 'Konzept', guide: 'Guide', vergleich: 'Vergleich' },
    minutes: 'Min',
    markDone: 'Als gelesen markieren',
    done: 'Abgeschlossen',
    quizTitle: 'Kurz-Quiz',
    quizCheck: 'Prüfen',
    quizCorrect: 'Richtig!',
    quizWrong: 'Nicht ganz —',
    related: 'Verwandte Themen',
    example: 'Beispiel',
    sources: 'Quellen',
    exercise: 'Übung — mach das bei dir',
    selfCheck: 'Selbst-Check',
    levelSimple: '🌱 Einfach',
    levelDetail: '🔬 Im Detail',
    feedTitle: 'Feed',
    feedSub: 'Was gerade in der KI-Welt passiert — kuratiert, verifiziert, mit Quellen.',
    feedTags: { modelle: 'Modelle', tools: 'Tools', mcp: 'MCP', security: 'Security' , papers: 'Papers' },
    pathWorld0: "WELT 0 · LOSLEGEN",
    pathWorld: 'WELT 1 · GRUNDLAGEN',
    pathWorld3: "WELT 3 · WERKZEUGKASTEN",
    pathWorld2: 'WELT 2 · AGENTEN',
    pathTitle: 'Dein Weg zum Agenten-Flüsterer',
    pathSub: 'Kein Account nötig zum Lesen — XP & Streaks gibt es optional obendrauf. Gespeichert nur in deinem Browser.',
    pathContinue: 'Weiterlernen →',
    pathReadOnly: 'Nur lesen, ohne Spiel',
    locked: 'Gesperrt — schließe erst das Kapitel davor ab',
    newsEmailPlaceholder: 'deine@email.de',
    newsSubmit: 'Anmelden',
    newsThanks: 'Danke! Du bekommst eine Bestätigung, sobald der Versand startet.',
    newsHint: 'Kein Spam. Abmelden jederzeit. Versand startet in Kürze.',
    wizardTitle: 'Wo stehst du?',
    wizardSub: '4 Fragen, 30 Sekunden — dann weißt du, wo du am besten anfängst.',
    wizardQ: [
      { q: 'Wie viel hast du schon mit KI gebaut?', options: ['Noch nichts', 'Ein paar Sachen', 'Ich arbeite täglich damit'] },
      { q: 'Was beschreibt dich am besten?', options: ['Nur neugierig', 'Vibe-Coder (KI schreibt, ich lenke)', 'Programmierer:in'] },
      { q: 'Begriffe wie MCP, Agent-Loop, Context Window?', options: ['Nie gehört', 'Ein paar kenne ich', 'Kenne ich alle'] },
    ],
    wizardResultTitle: 'Dein Startpunkt',
    wizardResults: {
      beginner: '🌱 Starte mit Welt 1 — Grundlagen. Kein Vorwissen nötig, in kleinen Schritten.',
      intermediate: '🌿 Du kannst die Basics überspringen: Steig bei den Agenten-Themen ein (Welt 2).',
      pro: '🌳 Ab ins Lexikon: Filter auf ●●● und die schweren Themen — Loops, Guardrails, Subagents.',
    },
    wizardGo: 'Los geht’s →',
    wizardRestart: 'Nochmal',
    wizardToolQ: { q: 'Womit arbeitest du (hauptsächlich)?', options: ['Claude Code', 'Cursor', 'Aider', 'Codex CLI', 'Noch mit gar keinem Tool'] },
    wizardNextTitle: 'Deine nächsten Schritte',
    wizardNextPath: 'Starte deinen Lernpfad',
    wizardNextTool: 'Befehls-Referenz für dein Tool',
    wizardNextInstall: 'Kapitel: Claude Code installieren',
    bugBtn: '🐛 Bug melden',
    bugTitle: 'Was ist kaputt oder falsch?',
    bugPlaceholder: 'Falscher Fakt, veraltetes Element, Tippfehler, Idee…',
    bugSend: 'Per E-Mail senden',
    donate: 'Unterstützen',
    footerNote: 'promptgarten ist kostenlos — gebaut von Marvin, damit jeder Coden mit KI lernen kann. Alle Inhalte sind ausdrücklich KI- und Scraping-freundlich (freie JSON-API + llms.txt). Fehler gefunden? Melde ihn!',
    close: 'Schließen',
    xp: 'XP',
    streakDays: (n) => `${n} Tag${n === 1 ? '' : 'e'}`,
  },
  en: {
    nav: { lexikon: 'Glossary', lernpfade: 'Learning paths', feed: 'Feed', vergleiche: 'Compare', befehle: 'Commands', addons: 'Add-ons', prompts: 'Prompts' },
    addonsTitle: 'Add-ons & integrations',
    addonsSub: 'The most important tools around AI coding agents: MCP servers, plugins, editor and knowledge integrations — vetted, with sources.',
    addonsOfficial: 'Official',
    cmdTitle: 'Command reference',
    cmdSub: 'Every command explained one by one: what it does, when it shines — and when something else fits better.',
    cmdWhenGood: 'When to use it?',
    cmdWhenBad: 'When not to?',
    cmdAlternative: 'Better',
    cmdAllCommands: 'All commands',
    newsletter: 'Newsletter',
    newsletterSoonTitle: 'Newsletter coming soon 🌱',
    newsletterSoonBody: 'We are building the sending pipeline right now. Check back in a few days.',
    heroTop: 'Grow your',
    heroMark: 'AI knowledge',
    heroSub: 'Everything about coding with AI — free, growing, no jargon. Unless you want jargon, we have that too.',
    cards: [
      { emoji: '📖', title: 'Terms', desc: 'Words everyone uses and nobody explains.', href: 'lexikon/?cat=begriff' },
      { emoji: '✍️', title: 'Prompts', desc: 'Best practices your model actually understands.', href: 'lexikon/?cat=prompt-pattern' },
      { emoji: '🤖', title: 'Agents', desc: 'What they can do, where they fail, how to tame them.', href: 'lexikon/?cat=konzept' },
      { emoji: '🔄', title: 'Loops', desc: 'Think → act → check. And again from the top.', href: 'loops/' },
    ],
    insightLabel: 'LATEST IN THE FEED',
    insightText: 'An agent without a stop condition is not an agent — it is an infinite loop with confidence.',
    levelLabel: 'YOUR LEVEL?',
    levelTitle: 'Start the path that fits:',
    levelChips: ['🌱 New here', '🌿 Getting there', '🌳 Pro'],
    lexikonTitle: 'Glossary',
    search: 'Search a term…',
    colNr: 'NO',
    colEntry: 'ENTRY',
    colCategory: 'CATEGORY',
    colLevel: 'LEVEL',
    showing: (n, total) => `Showing ${n} of ${total} entries`,
    categories: { begriff: 'Term', 'prompt-pattern': 'Prompt pattern', konzept: 'Concept', guide: 'Guide', vergleich: 'Comparison' },
    minutes: 'min',
    markDone: 'Mark as read',
    done: 'Completed',
    quizTitle: 'Quick quiz',
    quizCheck: 'Check',
    quizCorrect: 'Correct!',
    quizWrong: 'Not quite —',
    related: 'Related topics',
    example: 'Example',
    sources: 'Sources',
    exercise: 'Exercise — try it yourself',
    selfCheck: 'Self-check',
    levelSimple: '🌱 Simple',
    levelDetail: '🔬 In depth',
    feedTitle: 'Feed',
    feedSub: 'What is happening in the AI world right now — curated, verified, with sources.',
    feedTags: { modelle: 'Models', tools: 'Tools', mcp: 'MCP', security: 'Security' , papers: 'Papers' },
    pathWorld0: "WORLD 0 · GETTING STARTED",
    pathWorld: 'WORLD 1 · BASICS',
    pathWorld3: "WORLD 3 · TOOLBOX",
    pathWorld2: 'WORLD 2 · AGENTS',
    pathTitle: 'Your path to agent whisperer',
    pathSub: 'No account needed to read — XP & streaks are optional on top. Stored only in your browser.',
    pathContinue: 'Continue →',
    pathReadOnly: 'Just read, no game',
    locked: 'Locked — finish the previous chapter first',
    newsEmailPlaceholder: 'you@email.com',
    newsSubmit: 'Sign up',
    newsThanks: 'Thanks! You will get a confirmation once sending starts.',
    newsHint: 'No spam. Unsubscribe anytime. Sending starts soon.',
    wizardTitle: 'Where do you stand?',
    wizardSub: '4 questions, 30 seconds — then you know the best place to start.',
    wizardQ: [
      { q: 'How much have you built with AI so far?', options: ['Nothing yet', 'A few things', 'I work with it daily'] },
      { q: 'What describes you best?', options: ['Just curious', 'Vibe coder (AI writes, I steer)', 'Programmer'] },
      { q: 'Terms like MCP, agent loop, context window?', options: ['Never heard of them', 'I know a few', 'I know them all'] },
    ],
    wizardResultTitle: 'Your starting point',
    wizardResults: {
      beginner: '🌱 Start with World 1 — Basics. No prior knowledge needed, small steps.',
      intermediate: '🌿 You can skip the basics: jump into the agent topics (World 2).',
      pro: '🌳 Head to the glossary: filter for ●●● and the hard topics — loops, guardrails, subagents.',
    },
    wizardGo: 'Let’s go →',
    wizardRestart: 'Again',
    wizardToolQ: { q: 'What do you (mainly) work with?', options: ['Claude Code', 'Cursor', 'Aider', 'Codex CLI', 'No tool yet'] },
    wizardNextTitle: 'Your next steps',
    wizardNextPath: 'Start your learning path',
    wizardNextTool: 'Command reference for your tool',
    wizardNextInstall: 'Chapter: Install Claude Code',
    bugBtn: '🐛 Report a bug',
    bugTitle: 'What is broken or wrong?',
    bugPlaceholder: 'Wrong fact, outdated element, typo, idea…',
    bugSend: 'Send via email',
    donate: 'Support us',
    footerNote: 'promptgarten is free — built by Marvin so everyone can learn coding with AI. All content is explicitly AI- and scraping-friendly (free JSON API + llms.txt). Found an error? Report it!',
    close: 'Close',
    xp: 'XP',
    streakDays: (n) => `${n} day${n === 1 ? '' : 's'}`,
  },
  es: {
    nav: { lexikon: 'Glosario', lernpfade: 'Rutas de aprendizaje', feed: 'Feed', vergleiche: 'Comparar', befehle: 'Comandos', addons: 'Add-ons', prompts: 'Prompts' },
    addonsTitle: 'Add-ons e integraciones',
    addonsSub: 'Las herramientas más importantes alrededor de los agentes de programación con IA: servidores MCP, plugins, integraciones de editor y de conocimiento — verificadas, con fuentes.',
    addonsOfficial: 'Oficial',
    cmdTitle: 'Referencia de comandos',
    cmdSub: 'Cada comando explicado uno por uno: qué hace, cuándo brilla — y cuándo encaja mejor otra cosa.',
    cmdWhenGood: '¿Cuándo usarlo?',
    cmdWhenBad: '¿Cuándo mejor no?',
    cmdAlternative: 'Mejor',
    cmdAllCommands: 'Todos los comandos',
    newsletter: 'Newsletter',
    newsletterSoonTitle: 'El newsletter llega pronto 🌱',
    newsletterSoonBody: 'Estamos construyendo el envío ahora mismo. Vuelve a pasarte en unos días — o guarda esta página.',
    heroTop: 'Cultiva tu',
    heroMark: 'conocimiento de IA',
    heroSub: 'Todo sobre programar con IA — gratis, en crecimiento, sin tecnicismos. A menos que quieras tecnicismos, de eso también tenemos.',
    cards: [
      { emoji: '📖', title: 'Términos', desc: 'Palabras que todos usan y nadie explica.', href: 'lexikon/?cat=begriff' },
      { emoji: '✍️', title: 'Prompts', desc: 'Buenas prácticas que tu modelo realmente entiende.', href: 'lexikon/?cat=prompt-pattern' },
      { emoji: '🤖', title: 'Agentes', desc: 'Qué pueden hacer, dónde fallan, cómo domarlos.', href: 'lexikon/?cat=konzept' },
      { emoji: '🔄', title: 'Loops', desc: 'Pensar → actuar → comprobar. Y otra vez desde el principio.', href: 'loops/' },
    ],
    insightLabel: 'LO ÚLTIMO EN EL FEED',
    insightText: 'Un agente sin condición de parada no es un agente — es un bucle infinito con seguridad en sí mismo.',
    levelLabel: '¿TU NIVEL?',
    levelTitle: 'Empieza la ruta que te conviene:',
    levelChips: ['🌱 Soy nuevo', '🌿 Ya voy avanzando', '🌳 Soy pro'],
    lexikonTitle: 'Glosario',
    search: 'Busca un término…',
    colNr: 'N.º',
    colEntry: 'ENTRADA',
    colCategory: 'CATEGORÍA',
    colLevel: 'NIVEL',
    showing: (n, total) => `Mostrando ${n} de ${total} entradas`,
    categories: { begriff: 'Término', 'prompt-pattern': 'Patrón de prompt', konzept: 'Concepto', guide: 'Guía', vergleich: 'Comparación' },
    minutes: 'min',
    markDone: 'Marcar como leído',
    done: 'Completado',
    quizTitle: 'Quiz rápido',
    quizCheck: 'Comprobar',
    quizCorrect: '¡Correcto!',
    quizWrong: 'No exactamente —',
    related: 'Temas relacionados',
    example: 'Ejemplo',
    sources: 'Fuentes',
    exercise: 'Ejercicio — pruébalo tú',
    selfCheck: 'Autoevaluación',
    levelSimple: '🌱 Sencillo',
    levelDetail: '🔬 En detalle',
    feedTitle: 'Feed',
    feedSub: 'Lo que está pasando ahora en el mundo de la IA — curado, verificado, con fuentes.',
    feedTags: { modelle: 'Modelos', tools: 'Herramientas', mcp: 'MCP', security: 'Seguridad' , papers: 'Papers' },
    pathWorld0: "MUNDO 0 · PRIMEROS PASOS",
    pathWorld: 'MUNDO 1 · FUNDAMENTOS',
    pathWorld3: "MUNDO 3 · CAJA DE HERRAMIENTAS",
    pathWorld2: 'MUNDO 2 · AGENTES',
    pathTitle: 'Tu camino para susurrar a los agentes',
    pathSub: 'No hace falta cuenta para leer — XP y rachas son opcionales, además. Se guardan solo en tu navegador.',
    pathContinue: 'Seguir aprendiendo →',
    pathReadOnly: 'Solo leer, sin juego',
    locked: 'Bloqueado — termina antes el capítulo anterior',
    newsEmailPlaceholder: 'tu@email.com',
    newsSubmit: 'Registrarme',
    newsThanks: '¡Gracias! Recibirás una confirmación en cuanto empiece el envío.',
    newsHint: 'Sin spam. Cancela cuando quieras. El envío empieza pronto.',
    wizardTitle: '¿Dónde estás?',
    wizardSub: '4 preguntas, 30 segundos — y sabrás por dónde es mejor empezar.',
    wizardQ: [
      { q: '¿Cuánto has construido ya con IA?', options: ['Nada todavía', 'Algunas cosas', 'Trabajo con ella cada día'] },
      { q: '¿Qué te describe mejor?', options: ['Solo tengo curiosidad', 'Vibe coder (la IA escribe, yo dirijo)', 'Programador/a'] },
      { q: '¿Términos como MCP, agent loop, context window?', options: ['Nunca los he oído', 'Conozco algunos', 'Los conozco todos'] },
    ],
    wizardResultTitle: 'Tu punto de partida',
    wizardResults: {
      beginner: '🌱 Empieza con el Mundo 1 — Fundamentos. No hace falta saber nada antes, en pasos pequeños.',
      intermediate: '🌿 Puedes saltarte lo básico: entra directo en los temas de agentes (Mundo 2).',
      pro: '🌳 Ve directo al glosario: filtra por ●●● y los temas difíciles — loops, guardrails, subagents.',
    },
    wizardGo: 'Vamos →',
    wizardRestart: 'Otra vez',
    wizardToolQ: { q: '¿Con qué trabajas (principalmente)?', options: ['Claude Code', 'Cursor', 'Aider', 'Codex CLI', 'Con ninguna herramienta aún'] },
    wizardNextTitle: 'Tus próximos pasos',
    wizardNextPath: 'Empieza tu ruta de aprendizaje',
    wizardNextTool: 'Referencia de comandos para tu herramienta',
    wizardNextInstall: 'Capítulo: Instalar Claude Code',
    bugBtn: '🐛 Reportar un error',
    bugTitle: '¿Qué está roto o mal?',
    bugPlaceholder: 'Dato incorrecto, elemento desactualizado, error tipográfico, idea…',
    bugSend: 'Enviar por correo',
    donate: 'Apoyar',
    footerNote: 'promptgarten es gratis — creado por Marvin para que todo el mundo pueda aprender a programar con IA. Todo el contenido es explícitamente amigable con IA y scraping (API JSON gratuita + llms.txt). ¿Encontraste un error? ¡Repórtalo!',
    close: 'Cerrar',
    xp: 'XP',
    streakDays: (n) => `${n} día${n === 1 ? '' : 's'}`,
  },
  fr: {
    nav: { lexikon: 'Lexique', lernpfade: "Parcours d'apprentissage", feed: 'Feed', vergleiche: 'Comparer', befehle: 'Commandes', addons: 'Add-ons', prompts: 'Prompts' },
    addonsTitle: 'Add-ons & intégrations',
    addonsSub: 'Les outils les plus importants autour des agents de codage IA : serveurs MCP, plugins, intégrations éditeur et connaissances — vérifiés, avec sources.',
    addonsOfficial: 'Officiel',
    cmdTitle: 'Référence des commandes',
    cmdSub: "Chaque commande expliquée une par une : ce qu'elle fait, quand elle brille — et quand autre chose convient mieux.",
    cmdWhenGood: 'Quand l’utiliser ?',
    cmdWhenBad: 'Quand éviter ?',
    cmdAlternative: 'Mieux',
    cmdAllCommands: 'Toutes les commandes',
    newsletter: 'Newsletter',
    newsletterSoonTitle: 'La newsletter arrive bientôt 🌱',
    newsletterSoonBody: "On est en train de construire l'envoi. Reviens dans quelques jours — ou garde cette page en favori.",
    heroTop: 'Fais pousser ton',
    heroMark: 'savoir en IA',
    heroSub: "Tout sur le coding avec l'IA — gratuit, en croissance, sans jargon. Sauf si tu veux du jargon, ça aussi on l'a.",
    cards: [
      { emoji: '📖', title: 'Termes', desc: "Des mots que tout le monde utilise et que personne n'explique.", href: 'lexikon/?cat=begriff' },
      { emoji: '✍️', title: 'Prompts', desc: 'Des bonnes pratiques que ton modèle comprend vraiment.', href: 'lexikon/?cat=prompt-pattern' },
      { emoji: '🤖', title: 'Agents', desc: "Ce qu'ils savent faire, où ils échouent, comment les dompter.", href: 'lexikon/?cat=konzept' },
      { emoji: '🔄', title: 'Loops', desc: 'Réfléchir → agir → vérifier. Et on recommence.', href: 'loops/' },
    ],
    insightLabel: 'DERNIÈRE ACTU DU FEED',
    insightText: "Un agent sans condition d'arrêt n'est pas un agent — c'est une boucle infinie sûre d'elle-même.",
    levelLabel: 'TON NIVEAU ?',
    levelTitle: 'Démarre le parcours qui te correspond :',
    levelChips: ['🌱 Nouveau ici', '🌿 Ça avance', '🌳 Pro'],
    lexikonTitle: 'Lexique',
    search: 'Cherche un terme…',
    colNr: 'N°',
    colEntry: 'ENTRÉE',
    colCategory: 'CATÉGORIE',
    colLevel: 'NIVEAU',
    showing: (n, total) => `Affichage de ${n} sur ${total} entrées`,
    categories: { begriff: 'Terme', 'prompt-pattern': 'Pattern de prompt', konzept: 'Concept', guide: 'Guide', vergleich: 'Comparaison' },
    minutes: 'min',
    markDone: 'Marquer comme lu',
    done: 'Terminé',
    quizTitle: 'Quiz rapide',
    quizCheck: 'Vérifier',
    quizCorrect: 'Correct !',
    quizWrong: 'Pas tout à fait —',
    related: 'Sujets liés',
    example: 'Exemple',
    sources: 'Sources',
    exercise: 'Exercice — à toi de jouer',
    selfCheck: 'Auto-vérification',
    levelSimple: '🌱 Simple',
    levelDetail: '🔬 En détail',
    feedTitle: 'Feed',
    feedSub: "Ce qui se passe en ce moment dans le monde de l'IA — sélectionné, vérifié, avec sources.",
    feedTags: { modelle: 'Modèles', tools: 'Outils', mcp: 'MCP', security: 'Sécurité' , papers: 'Papers' },
    pathWorld0: "MONDE 0 · DÉMARRER",
    pathWorld: 'MONDE 1 · BASES',
    pathWorld3: "MONDE 3 · BOÎTE À OUTILS",
    pathWorld2: 'MONDE 2 · AGENTS',
    pathTitle: "Ton chemin pour devenir un chuchoteur d'agents",
    pathSub: "Pas besoin de compte pour lire — XP et séries sont en option, en plus. Sauvegardé seulement dans ton navigateur.",
    pathContinue: 'Continuer →',
    pathReadOnly: 'Juste lire, sans le jeu',
    locked: "Verrouillé — termine d'abord le chapitre précédent",
    newsEmailPlaceholder: 'toi@email.fr',
    newsSubmit: "S'inscrire",
    newsThanks: "Merci ! Tu recevras une confirmation dès que l'envoi commence.",
    newsHint: "Pas de spam. Désabonnement à tout moment. L'envoi démarre bientôt.",
    wizardTitle: 'Où en es-tu ?',
    wizardSub: '4 questions, 30 secondes — et tu sauras par où commencer.',
    wizardQ: [
      { q: "Combien as-tu déjà construit avec l'IA ?", options: ['Rien encore', 'Quelques trucs', "J'y travaille tous les jours"] },
      { q: "Qu'est-ce qui te décrit le mieux ?", options: ['Juste curieux', "Vibe coder (l'IA écrit, je pilote)", 'Développeur/développeuse'] },
      { q: 'Des termes comme MCP, agent loop, context window ?', options: ['Jamais entendu parler', "J'en connais quelques-uns", 'Je les connais tous'] },
    ],
    wizardResultTitle: 'Ton point de départ',
    wizardResults: {
      beginner: '🌱 Commence par le Monde 1 — Bases. Aucune connaissance préalable requise, par petites étapes.',
      intermediate: '🌿 Tu peux sauter les bases : direct dans les sujets sur les agents (Monde 2).',
      pro: '🌳 File au lexique : filtre sur ●●● et les sujets difficiles — loops, garde-fous, sous-agents.',
    },
    wizardGo: "C'est parti →",
    wizardRestart: 'Recommencer',
    wizardToolQ: { q: 'Avec quoi travailles-tu (principalement) ?', options: ['Claude Code', 'Cursor', 'Aider', 'Codex CLI', "Avec aucun outil pour l'instant"] },
    wizardNextTitle: 'Tes prochaines étapes',
    wizardNextPath: 'Commence ton parcours',
    wizardNextTool: 'Référence des commandes pour ton outil',
    wizardNextInstall: 'Chapitre : Installer Claude Code',
    bugBtn: '🐛 Signaler un bug',
    bugTitle: "Qu'est-ce qui est cassé ou faux ?",
    bugPlaceholder: 'Fait erroné, élément dépassé, faute de frappe, idée…',
    bugSend: 'Envoyer par e-mail',
    donate: 'Soutenir',
    footerNote: "promptgarten est gratuit — créé par Marvin pour que chacun puisse apprendre à coder avec l’IA. Tout le contenu est explicitement ouvert aux IA et au scraping (API JSON gratuite + llms.txt). Une erreur ? Signale-la !",
    close: 'Fermer',
    xp: 'XP',
    streakDays: (n) => `${n} jour${n === 1 ? '' : 's'}`,
  },
  zh: {
    nav: { lexikon: '词典', lernpfade: '学习路径', feed: '资讯', vergleiche: '对比', befehle: '命令', addons: '扩展', prompts: '提示词' },
    addonsTitle: '扩展与集成',
    addonsSub: 'AI 编程智能体周边最重要的工具：MCP 服务器、插件、编辑器与知识库集成——经过核实，附来源。',
    addonsOfficial: '官方',
    cmdTitle: '命令参考',
    cmdSub: '每条命令逐一讲解：它做什么、什么时候好用——以及什么时候更适合用别的。',
    cmdWhenGood: '什么时候用？',
    cmdWhenBad: '什么时候不该用？',
    cmdAlternative: '更好的选择',
    cmdAllCommands: '全部命令',
    newsletter: '订阅',
    newsletterSoonTitle: '订阅邮件即将上线 🌱',
    newsletterSoonBody: '我们正在搭建发送系统。过几天再回来看看——或者先收藏这个页面。',
    heroTop: '种下你的',
    heroMark: 'AI 知识',
    heroSub: '关于用 AI 写代码的一切——免费、持续更新、不讲行话。除非你就想要行话，那我们也有。',
    cards: [
      { emoji: '📖', title: '术语', desc: '所有人都在用、却没人解释的词。', href: 'lexikon/?cat=begriff' },
      { emoji: '✍️', title: 'Prompt', desc: '模型真正听得懂的最佳实践。', href: 'lexikon/?cat=prompt-pattern' },
      { emoji: '🤖', title: 'Agent', desc: '它们能做什么、在哪会翻车、怎么驯服它们。', href: 'lexikon/?cat=konzept' },
      { emoji: '🔄', title: 'Loop', desc: '思考 → 行动 → 检查。然后从头再来。', href: 'loops/' },
    ],
    insightLabel: '最新动态',
    insightText: '没有停止条件的 agent 不是 agent —— 它是一个自信满满的无限循环。',
    levelLabel: '你在哪个阶段？',
    levelTitle: '选一条适合你的学习路径：',
    levelChips: ['🌱 刚入门', '🌿 有点基础', '🌳 老手'],
    lexikonTitle: '词典',
    search: '搜索一个词条…',
    colNr: '序号',
    colEntry: '词条',
    colCategory: '分类',
    colLevel: '难度',
    showing: (n, total) => `显示 ${total} 个词条中的 ${n} 个`,
    categories: { begriff: '术语', 'prompt-pattern': 'Prompt 模式', konzept: '概念', guide: '指南', vergleich: '对比' },
    minutes: '分钟',
    markDone: '标记为已读',
    done: '已完成',
    quizTitle: '小测验',
    quizCheck: '检查',
    quizCorrect: '答对了！',
    quizWrong: '不太对 ——',
    related: '相关主题',
    example: '示例',
    sources: '来源',
    exercise: '练习——自己动手试试',
    selfCheck: '自查清单',
    levelSimple: '🌱 简明',
    levelDetail: '🔬 深入',
    feedTitle: '资讯',
    feedSub: 'AI 世界正在发生的事 —— 精选、核实、附来源。',
    feedTags: { modelle: '模型', tools: '工具', mcp: 'MCP', security: '安全' , papers: '论文' },
    pathWorld0: "第 0 关 · 入门",
    pathWorld: '第一部分 · 基础',
    pathWorld3: "第 3 关 · 工具箱",
    pathWorld2: '第二部分 · Agent',
    pathTitle: '你的 agent 驯服之路',
    pathSub: '阅读不需要账号 —— XP 和连续打卡是可选的附加功能，只保存在你的浏览器里。',
    pathContinue: '继续学习 →',
    pathReadOnly: '只阅读，不玩游戏化',
    locked: '已锁定 —— 先完成前一章',
    newsEmailPlaceholder: 'you@example.com',
    newsSubmit: '订阅',
    newsThanks: '谢谢！一旦开始发送，你会收到一封确认邮件。',
    newsHint: '不会发垃圾邮件，随时可以取消订阅。发送即将开始。',
    wizardTitle: '你现在在哪个阶段？',
    wizardSub: '4 个问题，30 秒 —— 就知道从哪里开始最合适。',
    wizardQ: [
      { q: '你已经用 AI 做过多少东西了？', options: ['还什么都没做过', '做过一些', '我每天都在用它工作'] },
      { q: '哪个描述更符合你？', options: ['只是好奇', 'Vibe coder（AI 写代码，我来把关）', '程序员'] },
      { q: '像 MCP、agent loop、context window 这样的词？', options: ['从没听过', '知道一些', '全都知道'] },
    ],
    wizardResultTitle: '你的起点',
    wizardResults: {
      beginner: '🌱 从"第一部分·基础"开始。不需要预备知识，一步一步来。',
      intermediate: '🌿 你可以跳过基础部分：直接进入 agent 主题（第二部分）。',
      pro: '🌳 直接去词典：筛选 ●●● 难度，挑战 loop、guardrails、subagent 这些硬核话题。',
    },
    wizardGo: '开始吧 →',
    wizardRestart: '重新来',
    wizardToolQ: { q: '你（主要）用什么工具？', options: ['Claude Code', 'Cursor', 'Aider', 'Codex CLI', '还没有用任何工具'] },
    wizardNextTitle: '你的下一步',
    wizardNextPath: '开始你的学习路径',
    wizardNextTool: '你的工具的命令参考',
    wizardNextInstall: '章节：安装 Claude Code',
    bugBtn: '🐛 反馈问题',
    bugTitle: '哪里坏了，或者哪里说错了？',
    bugPlaceholder: '错误的事实、过时的内容、错别字、新想法……',
    bugSend: '通过邮件发送',
    donate: '支持我们',
    footerNote: 'promptgarten 完全免费——由 Marvin 打造，让每个人都能学会用 AI 编程。所有内容明确对 AI 和抓取友好（免费 JSON API + llms.txt）。发现错误？请告诉我们！',
    close: '关闭',
    xp: 'XP',
    streakDays: (n) => `${n} 天`,
  },
};

/**
 * SEO: canonical + hreflang für eine Seite. `path` = Pfad NACH dem Sprachsegment,
 * mit trailing slash (z.B. 'lexikon/mcp/' oder '' für die Sprach-Startseite).
 * Absolute URLs entstehen über metadataBase (https://promptgarten.com).
 */
export function langAlternates(lang: Lang, path: string) {
  const languages: Record<string, string> = {};
  for (const l of LANGS) languages[l] = `/${l}/${path}`;
  languages['x-default'] = `/en/${path}`;
  return { canonical: `/${lang}/${path}`, languages };
}
