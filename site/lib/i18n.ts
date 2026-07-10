export const LANGS = ['de', 'en'] as const;
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
  pathWorld: string;
  pathTitle: string;
  pathSub: string;
  pathContinue: string;
  pathReadOnly: string;
  locked: string;
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
    pathWorld: 'WELT 1 · GRUNDLAGEN',
    pathTitle: 'Dein Weg zum Agenten-Flüsterer',
    pathSub: 'Kein Account nötig zum Lesen — XP & Streaks gibt es optional obendrauf. Gespeichert nur in deinem Browser.',
    pathContinue: 'Weiterlernen →',
    pathReadOnly: 'Nur lesen, ohne Spiel',
    locked: 'Gesperrt — schließe erst das Kapitel davor ab',
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
    pathWorld: 'WORLD 1 · BASICS',
    pathTitle: 'Your path to agent whisperer',
    pathSub: 'No account needed to read — XP & streaks are optional on top. Stored only in your browser.',
    pathContinue: 'Continue →',
    pathReadOnly: 'Just read, no game',
    locked: 'Locked — finish the previous chapter first',
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
};
