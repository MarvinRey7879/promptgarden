/**
 * Qualitäts-Phase It. 167: Der Eintrag zu /vim beschrieb einen Befehl, den es
 * nicht mehr gibt. Zwei unabhängige Belege:
 *   - die offizielle Referenz (code.claude.com/docs/en/commands): "Removed in
 *     v2.1.92. To toggle between Vim and Normal editing modes, use /config →
 *     Editor mode"
 *   - der Changelog (github.com/anthropics/claude-code): unter 2.1.92 steht
 *     "Removed `/vim` command (toggle vim mode via `/config` → Editor mode)"
 *
 * Die Seite bleibt bestehen, statt gelöscht zu werden: Wer nach /vim sucht,
 * soll den Nachfolger finden. Der Text sagt jetzt klar, dass der Befehl weg ist.
 *
 * Idempotent: läuft nur, solange der alte Text vorhanden ist.
 */
import { readFileSync, writeFileSync } from 'node:fs';

const ROOT = 'site/content/';
const CHANGELOG = 'https://github.com/anthropics/claude-code/blob/main/CHANGELOG.md';

const TEXTE = {
  de: {
    summary: 'Gibt es nicht mehr — in Version 2.1.92 entfernt.',
    what:
      'Gibt es nicht mehr — in Version 2.1.92 entfernt.\n\n' +
      'Den Vim-Modus schaltest du jetzt über /config → Editor mode um. Die Tastenkürzel selbst sind geblieben, nur der eigene Befehl dafür ist weggefallen.',
    gutTitel: 'Nichts mehr — der Befehl ist weg',
    gutBeispiel: '/config aufrufen und unter "Editor mode" zwischen Vim und Normal umschalten.',
    schlechtTitel: 'Auf einer Version ab 2.1.92',
    schlechtWarum: 'der Befehl wurde in 2.1.92 entfernt und tut nichts mehr',
    schlechtAlt: '/config → Editor mode nutzen',
    quelle: 'Claude-Code-Changelog: /vim entfernt in 2.1.92',
  },
  en: {
    summary: 'No longer exists — removed in version 2.1.92.',
    what:
      'No longer exists — removed in version 2.1.92.\n\n' +
      'Switch Vim mode via /config → Editor mode instead. The key bindings themselves stayed; only the dedicated command for them is gone.',
    gutTitel: 'Nothing — the command is gone',
    gutBeispiel: 'Run /config and switch between Vim and Normal under "Editor mode".',
    schlechtTitel: 'On version 2.1.92 or later',
    schlechtWarum: 'the command was removed in 2.1.92 and does nothing',
    schlechtAlt: 'Use /config → Editor mode',
    quelle: 'Claude Code changelog: /vim removed in 2.1.92',
  },
  es: {
    summary: 'Ya no existe — eliminado en la versión 2.1.92.',
    what:
      'Ya no existe — eliminado en la versión 2.1.92.\n\n' +
      'El modo Vim se cambia ahora en /config → Editor mode. Los atajos de teclado siguen ahí; solo desapareció el comando dedicado.',
    gutTitel: 'Nada — el comando ya no está',
    gutBeispiel: 'Ejecuta /config y alterna entre Vim y Normal en "Editor mode".',
    schlechtTitel: 'En la versión 2.1.92 o posterior',
    schlechtWarum: 'el comando se eliminó en 2.1.92 y no hace nada',
    schlechtAlt: 'Usa /config → Editor mode',
    quelle: 'Changelog de Claude Code: /vim eliminado en 2.1.92',
  },
  fr: {
    summary: 'N’existe plus — supprimé dans la version 2.1.92.',
    what:
      'N’existe plus — supprimé dans la version 2.1.92.\n\n' +
      'Le mode Vim se règle désormais via /config → Editor mode. Les raccourcis clavier sont restés ; seule la commande dédiée a disparu.',
    gutTitel: 'Rien — la commande a disparu',
    gutBeispiel: 'Lance /config et bascule entre Vim et Normal sous « Editor mode ».',
    schlechtTitel: 'Sur une version 2.1.92 ou ultérieure',
    schlechtWarum: 'la commande a été supprimée en 2.1.92 et ne fait plus rien',
    schlechtAlt: 'Utiliser /config → Editor mode',
    quelle: 'Changelog de Claude Code : /vim supprimé en 2.1.92',
  },
  zh: {
    summary: '已不存在——在 2.1.92 版本中移除。',
    what:
      '已不存在——在 2.1.92 版本中移除。\n\n' +
      '现在通过 /config → Editor mode 切换 Vim 模式。快捷键本身保留，只是取消了专用命令。',
    gutTitel: '没有了——该命令已移除',
    gutBeispiel: '运行 /config，在“Editor mode”下在 Vim 与 Normal 之间切换。',
    schlechtTitel: '在 2.1.92 及更高版本上',
    schlechtWarum: '该命令在 2.1.92 中被移除，已无作用',
    schlechtAlt: '改用 /config → Editor mode',
    quelle: 'Claude Code 更新日志：/vim 在 2.1.92 中移除',
  },
};

for (const [lang, t] of Object.entries(TEXTE)) {
  const pfad = `${ROOT}commands.${lang}.json`;
  const daten = JSON.parse(readFileSync(pfad, 'utf8'));
  const arr = Array.isArray(daten) ? daten : daten.commands || Object.values(daten).find(Array.isArray);
  const k = arr.find((x) => x.platform === 'claude-code' && x.slug === 'vim');
  if (!k) throw new Error(`/vim nicht gefunden in ${lang}`);

  if (/2\.1\.92/.test(k.summary)) {
    console.log(lang, 'schon korrigiert — übersprungen');
    continue;
  }

  k.summary = t.summary;
  k.what = t.what;
  k.whenGood = [{ title: t.gutTitel, example: t.gutBeispiel }];
  k.whenBad = [{ title: t.schlechtTitel, why: t.schlechtWarum, alternative: t.schlechtAlt }];
  if (!k.sources.some((s) => s.url === CHANGELOG)) {
    k.sources.push({ title: t.quelle, url: CHANGELOG });
  }

  writeFileSync(pfad, JSON.stringify(daten, null, 2) + '\n');
  console.log(lang, 'korrigiert');
}
