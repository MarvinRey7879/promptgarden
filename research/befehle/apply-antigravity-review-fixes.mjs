// Review-Fixes Antigravity-Batch (Adversarial-Review 14.07.): 1 BLOCK + 9 FIX + 5 NOTEs.
// Geparste Objekte, harte Anker — NOT FOUND wirft.
import { readFileSync, writeFileSync } from 'node:fs';

const PA = 'C:/Users/marvi/promptgarden/research/befehle/antigravity-batch-a.json';
const PB = 'C:/Users/marvi/promptgarden/research/befehle/antigravity-batch-b.json';
const a = JSON.parse(readFileSync(PA, 'utf8'));
const b = JSON.parse(readFileSync(PB, 'utf8'));

const pick = (arr, slug) => {
  const e = arr.find((x) => x.slug === slug);
  if (!e) throw new Error('slug fehlt: ' + slug);
  return e;
};
const subStr = (obj, get, set, from, to) => {
  const cur = get(obj);
  if (!cur.includes(from)) throw new Error(`NOT FOUND [${obj.slug}]: ${from.slice(0, 50)}`);
  set(obj, cur.replace(from, to));
};
const subField = (e, f, from, to) => subStr(e, (o) => o[f], (o, v) => { o[f] = v; }, from, to);

for (const l of ['de', 'en']) {
  // BLOCK: model-flag — erfundenes kebab-case-Modellformat
  const mf = pick(a[l], 'model-flag');
  subStr(mf, (o) => o.whenGood[0].example, (o, v) => { o.whenGood[0].example = v; },
    'agy --model gemini-3.1-pro', 'agy --model="Gemini 3.1 Pro"');

  // FIX: start-tui — gcli-migration-Quelle ergänzen (deckt Migrations-Checkliste)
  const st = pick(a[l], 'start-tui');
  if (!st.sources.some((s) => s.url.includes('gcli-migration'))) {
    st.sources.push({ title: 'Antigravity CLI Doku: Migration von Gemini CLI', url: 'https://antigravity.google/docs/cli/gcli-migration' });
  }

  // FIX: dangerously-skip-permissions — Semantik
  const dp = pick(a[l], 'dangerously-skip-permissions');
  subField(dp, 'summary',
    l === 'de' ? 'Umgeht Permission-Overrides beim Start' : 'Bypasses permission overrides at startup',
    l === 'de' ? 'Umgeht Permission-Restriktionen beim Start' : 'Bypasses permission restrictions at startup');

  // FIX: plugin-import-gemini — Key-Umbenennung ist manueller Schritt
  const pig = pick(a[l], 'plugin-import-gemini');
  subField(pig, 'what',
    l === 'de'
      ? 'in eine dedizierte mcp_config.json migriert (Schema-Key url/httpUrl wird dabei zu serverUrl).'
      : 'migrate into a dedicated mcp_config.json (the url/httpUrl schema key becomes serverUrl).',
    l === 'de'
      ? 'in eine dedizierte mcp_config.json migriert; bei Remote-Servern musst du den Schema-Key url/httpUrl anschließend manuell auf serverUrl umstellen.'
      : 'migrate into a dedicated mcp_config.json; for remote servers you then need to rename the url/httpUrl schema key to serverUrl manually.');

  // FIX: skills-as-commands — import gemini konvertiert keine losen Skill-Dateien
  const sk = pick(a[l], 'skills-as-commands');
  subStr(sk, (o) => o.whenBad[0].alternative, (o, v) => { o.whenBad[0].alternative = v; },
    l === 'de'
      ? 'agy plugin import gemini nutzen oder Skill-Dateien manuell an den neuen Pfad verschieben'
      : 'Run agy plugin import gemini, or move the skill files to the new path manually',
    l === 'de'
      ? 'Skill-Dateien manuell an den neuen Pfad verschieben (agy plugin import gemini konvertiert nur Extensions, keine losen Skill-Dateien)'
      : 'Move the skill files to the new path manually (agy plugin import gemini only converts extensions, not loose skill files)');

  // FIX: agents — d = deny, nicht approve
  subField(pick(b[l], 'agents'), 'what',
    l === 'de' ? 'a/d erlauben Inline-Tool-Approvals direkt aus der Liste' : 'a/d grant inline tool approvals right from the list',
    l === 'de' ? 'a genehmigt und d lehnt Inline-Tool-Anfragen direkt aus der Liste ab' : 'a approves and d denies inline tool requests right from the list');

  // FIX: diff — Kommentar gilt der Zeile, nicht dem Hunk
  subField(pick(b[l], 'diff'), 'what',
    l === 'de' ? 'c fügt einen Kommentar zu einem Hunk hinzu, d löscht ihn' : 'c adds a comment to a hunk, d deletes it',
    l === 'de' ? 'c fügt einen Kommentar zur aktuellen Zeile hinzu, d löscht ihn' : 'c adds a comment on the current line, d deletes it');

  // FIX: mcp — Verbindungsstatus statt Auth-Status
  const mcp = pick(b[l], 'mcp');
  subField(mcp, 'what',
    l === 'de' ? 'inklusive Auth-Status' : 'including auth status',
    l === 'de' ? 'inklusive Verbindungsstatus' : 'including connection status');
  subStr(mcp, (o) => o.whenGood[0].example, (o, v) => { o.whenGood[0].example = v; },
    l === 'de' ? '/mcp öffnen, um zu sehen, ob ein Server authentifiziert ist' : 'Open /mcp to see whether a server is authenticated',
    l === 'de' ? '/mcp öffnen, um zu sehen, ob ein Server verbunden ist' : 'Open /mcp to see whether a server is connected');

  // FIX: config — Keybindings liegen in separater Datei, nicht in settings.json
  subField(pick(b[l], 'config'), 'what',
    l === 'de' ? 'u.a. Rendering-Modus, Keybindings-Datei und Terminal-Verhalten' : 'covering things like rendering mode, the keybindings file, and terminal behavior',
    l === 'de' ? 'u.a. Rendering-Modus und Terminal-Verhalten' : 'covering things like rendering mode and terminal behavior');

  // FIX: clear — Checkpoint-Behauptung unbelegt
  const cl = pick(b[l], 'clear');
  subStr(cl, (o) => o.whenBad[0].why, (o, v) => { o.whenBad[0].why = v; },
    l === 'de' ? '/clear leert den aktiven Kontext, ohne den bisherigen Thread als abrufbaren Checkpoint zu sichern.' : "/clear wipes the active context without saving the prior thread as a retrievable checkpoint.",
    l === 'de' ? '/clear leert den aktiven Kontext — mitten in einer Aufgabe verlierst du damit den Arbeitsstand des Threads.' : "/clear wipes the active context — mid-task you lose the thread's working state.");

  // NOTE: permissions — docs/mcp als Quelle für mcp(server/tool)-Beispiel
  const pm = pick(b[l], 'permissions');
  if (!pm.sources.some((s) => s.url === 'https://antigravity.google/docs/mcp')) {
    pm.sources.push({ title: 'Antigravity Doku: MCP', url: 'https://antigravity.google/docs/mcp' });
  }

  // NOTE: usage — Plan-Stufe heißt Standard, nicht Free
  subField(pick(b[l], 'usage'), 'what', '(Free/Pro/Ultra)', '(Standard/Pro/Ultra)');

  // NOTE: planning — multi-turn statt mehrstufig/multi-step
  const pl = pick(b[l], 'planning');
  if (l === 'de') {
    subField(pl, 'summary', 'Aktiviert den mehrstufigen Plan-Generierungsmodus.', 'Aktiviert den Multi-Turn-Plan-Generierungsmodus.');
    subField(pl, 'what', 'vor der Ausführung einen mehrstufigen Plan erstellt', 'vor der Ausführung über mehrere Turns hinweg einen Plan erstellt');
  } else {
    subField(pl, 'summary', 'Turns on the multi-step plan generation mode.', 'Turns on the multi-turn plan generation mode.');
    subField(pl, 'what', 'creates a multi-step plan before executing', 'generates a plan across multiple turns before executing');
  }

  // NOTE: rewind — nur Konversationshistorie belegt
  subField(pick(b[l], 'rewind'), 'what',
    l === 'de' ? 'setzt Konversation und/oder Code auf einen früheren Stand' : 'resets the conversation and/or code to an earlier state',
    l === 'de' ? 'setzt die Konversationshistorie auf einen früheren Stand' : 'resets the conversation history to an earlier state');

  // NOTE: context — Aufschlüsselung ist Ausschmückung
  subField(pick(b[l], 'context'), 'what',
    l === 'de' ? 'durch bisherige Konversation, Dateien und Tool-Outputs bereits belegt ist' : 'already used up by prior conversation, files, and tool outputs',
    l === 'de' ? 'bereits belegt ist' : 'already used up');
}

writeFileSync(PA, JSON.stringify(a, null, 2));
writeFileSync(PB, JSON.stringify(b, null, 2));

// Nach-Validierung
for (const [f, d] of [['a', a], ['b', b]]) {
  for (let i = 0; i < d.de.length; i++) {
    if (d.de[i].slug !== d.en[i].slug) throw new Error(`Slug-Drift ${f}[${i}]`);
    const su = JSON.stringify(d.de[i].sources.map((s) => s.url));
    if (su !== JSON.stringify(d.en[i].sources.map((s) => s.url))) throw new Error(`Quellen-Drift ${f}/${d.de[i].slug}`);
  }
}
console.log('FIXES OK.');
console.log('model-flag example:', a.de.find((x) => x.slug === 'model-flag').whenGood[0].example);
console.log('agents what (en):', b.en.find((x) => x.slug === 'agents').what.match(/a approves[^,]+/)[0]);
console.log('usage what (de):', b.de.find((x) => x.slug === 'usage').what);
