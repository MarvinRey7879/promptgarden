export const LANGS = ['de', 'en', 'es'] as const;
export type Lang = (typeof LANGS)[number];

export function isLang(x: string): x is Lang {
  return (LANGS as readonly string[]).includes(x);
}

type Dict = {
  nav: { lexikon: string; lernpfade: string; feed: string; vergleiche: string };
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
  feedTitle: string;
  feedSub: string;
  feedTags: Record<string, string>;
  pathWorld: string;
  pathWorld2: string;
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
    nav: { lexikon: 'Lexikon', lernpfade: 'Lernpfade', feed: 'Feed', vergleiche: 'Vergleiche' },
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
      { emoji: '🔄', title: 'Loops', desc: 'Denken → Handeln → Prüfen. Und wieder von vorn.', href: 'lexikon/loops-fuer-agenten/' },
    ],
    insightLabel: 'INSIGHT DER WOCHE',
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
    feedTitle: 'Feed',
    feedSub: 'Was gerade in der KI-Welt passiert — kuratiert, verifiziert, mit Quellen.',
    feedTags: { modelle: 'Modelle', tools: 'Tools', mcp: 'MCP', security: 'Security' },
    pathWorld: 'WELT 1 · GRUNDLAGEN',
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
    wizardSub: '3 Fragen, 20 Sekunden — dann weißt du, wo du am besten anfängst.',
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
    bugBtn: '🐛 Bug melden',
    bugTitle: 'Was ist kaputt oder falsch?',
    bugPlaceholder: 'Falscher Fakt, veraltetes Element, Tippfehler, Idee…',
    bugSend: 'Per E-Mail senden',
    donate: 'Unterstützen',
    footerNote: 'promptgarden ist kostenlos und wird von einer autonomen KI-Loop gebaut und gepflegt. Fehler gefunden? Melde ihn — die Loop liest mit.',
    close: 'Schließen',
    xp: 'XP',
    streakDays: (n) => `${n} Tag${n === 1 ? '' : 'e'}`,
  },
  en: {
    nav: { lexikon: 'Glossary', lernpfade: 'Learning paths', feed: 'Feed', vergleiche: 'Compare' },
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
      { emoji: '🔄', title: 'Loops', desc: 'Think → act → check. And again from the top.', href: 'lexikon/loops-fuer-agenten/' },
    ],
    insightLabel: 'INSIGHT OF THE WEEK',
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
    feedTitle: 'Feed',
    feedSub: 'What is happening in the AI world right now — curated, verified, with sources.',
    feedTags: { modelle: 'Models', tools: 'Tools', mcp: 'MCP', security: 'Security' },
    pathWorld: 'WORLD 1 · BASICS',
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
    wizardSub: '3 questions, 20 seconds — then you know the best place to start.',
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
    bugBtn: '🐛 Report a bug',
    bugTitle: 'What is broken or wrong?',
    bugPlaceholder: 'Wrong fact, outdated element, typo, idea…',
    bugSend: 'Send via email',
    donate: 'Support us',
    footerNote: 'promptgarden is free and is built and maintained by an autonomous AI loop. Found an error? Report it — the loop reads along.',
    close: 'Close',
    xp: 'XP',
    streakDays: (n) => `${n} day${n === 1 ? '' : 's'}`,
  },
  es: {
    nav: { lexikon: 'Glosario', lernpfade: 'Rutas de aprendizaje', feed: 'Feed', vergleiche: 'Comparar' },
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
      { emoji: '🔄', title: 'Loops', desc: 'Pensar → actuar → comprobar. Y otra vez desde el principio.', href: 'lexikon/loops-fuer-agenten/' },
    ],
    insightLabel: 'INSIGHT DE LA SEMANA',
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
    feedTitle: 'Feed',
    feedSub: 'Lo que está pasando ahora en el mundo de la IA — curado, verificado, con fuentes.',
    feedTags: { modelle: 'Modelos', tools: 'Herramientas', mcp: 'MCP', security: 'Seguridad' },
    pathWorld: 'MUNDO 1 · FUNDAMENTOS',
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
    wizardSub: '3 preguntas, 20 segundos — y sabrás por dónde es mejor empezar.',
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
    bugBtn: '🐛 Reportar un error',
    bugTitle: '¿Qué está roto o mal?',
    bugPlaceholder: 'Dato incorrecto, elemento desactualizado, error tipográfico, idea…',
    bugSend: 'Enviar por correo',
    donate: 'Apoyar',
    footerNote: 'promptgarden es gratis y lo construye y mantiene un loop de IA autónomo. ¿Encontraste un error? Repórtalo — el loop lo lee.',
    close: 'Cerrar',
    xp: 'XP',
    streakDays: (n) => `${n} día${n === 1 ? '' : 's'}`,
  },
};
