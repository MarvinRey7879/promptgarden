import Link from 'next/link';
import { getPlatforms } from '@/lib/commands';
import { getRosetta } from '@/lib/rosetta';
import type { Lang } from '@/lib/i18n';

/**
 * Zeigt auf einer Befehls-Detailseite die Entsprechungen desselben Befehls auf den
 * anderen Plattformen — Datenquelle ist die Rosetta-Tabelle (jede Zelle dort ist
 * gegen commands.json validiert). Rendert nichts, wenn der Befehl dort nicht vorkommt
 * oder keine andere Plattform eine Entsprechung hat.
 */
const T: Record<Lang, { title: (task: string) => string; all: string; none: string }> = {
  de: { title: (task) => `Dieselbe Aufgabe („${task}") auf anderen Plattformen`, all: 'Alle 28 Aufgaben vergleichen', none: 'keine Entsprechung' },
  en: { title: (task) => `The same task (“${task}”) on other platforms`, all: 'Compare all 28 tasks', none: 'no equivalent' },
  es: { title: (task) => `La misma tarea («${task}») en otras plataformas`, all: 'Comparar las 28 tareas', none: 'sin equivalente' },
  fr: { title: (task) => `La même tâche (« ${task} ») sur les autres plateformes`, all: 'Comparer les 28 tâches', none: 'pas d’équivalent' },
  zh: { title: (task) => `同一任务（“${task}”）在其他平台上的写法`, all: '对照全部 28 项任务', none: '无对应命令' },
};

export default function RosettaHinweis({ lang, platform, slug }: { lang: Lang; platform: string; slug: string }) {
  const d = getRosetta(lang);
  const t = T[lang];

  const task = d.groups.flatMap((g) => g.tasks).find((x) => x.cells[platform]?.slug === slug);
  if (!task) return null;

  const others = d.platforms
    .filter((p) => p !== platform)
    .map((p) => ({ id: p, cell: task.cells[p] }))
    .filter((x) => x.cell);
  if (others.length === 0) return null;

  const names = Object.fromEntries(getPlatforms(lang).map((p) => [p.id, p.name]));

  return (
    <div className="card" style={{ padding: '16px 20px', marginBottom: 18, background: 'var(--blue)', boxShadow: '4px 4px 0 var(--ink)' }}>
      <p className="kicker" style={{ color: 'var(--ink)', margin: '0 0 10px' }}>🔄 {t.title(task.label).toUpperCase()}</p>
      <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexWrap: 'wrap', gap: '8px 18px' }}>
        {others.map(({ id, cell }) => (
          <li key={id} style={{ fontSize: 14 }}>
            <span style={{ color: 'var(--ink)', opacity: 0.75 }}>{names[id] ?? id}: </span>
            <Link href={`/${lang}/befehle/${id}/${cell!.slug}/`} className="mono" style={{ fontWeight: 800 }}>
              {cell!.name}
            </Link>
          </li>
        ))}
      </ul>
      <p style={{ margin: '12px 0 0', fontSize: 13 }}>
        <Link href={`/${lang}/rosetta/`} style={{ fontWeight: 700 }}>
          {t.all} →
        </Link>
      </p>
    </div>
  );
}
