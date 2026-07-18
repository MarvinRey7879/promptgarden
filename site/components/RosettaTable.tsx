'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import type { RosettaFile } from '@/lib/rosetta';
import type { Lang } from '@/lib/i18n';

const DICT: Record<Lang, { search: string; none: string; noneTitle: string; hits: string; empty: string; task: string; legend: string }> = {
  de: {
    search: 'Aufgabe oder Befehl suchen …',
    none: '—',
    noneTitle: 'Kein eigener dokumentierter Befehl auf dieser Plattform',
    hits: 'Treffer',
    empty: 'Nichts gefunden. Andere Schreibweise probieren?',
    task: 'Aufgabe',
    legend: '„—" heißt: Diese Plattform hat dafür keinen eigenen dokumentierten Befehl.',
  },
  en: {
    search: 'Search task or command …',
    none: '—',
    noneTitle: 'No dedicated documented command on this platform',
    hits: 'matches',
    empty: 'Nothing found. Try a different spelling?',
    task: 'Task',
    legend: '“—” means: this platform has no dedicated documented command for it.',
  },
  es: {
    search: 'Buscar tarea o comando …',
    none: '—',
    noneTitle: 'Sin comando documentado propio en esta plataforma',
    hits: 'resultados',
    empty: 'No se encontró nada. ¿Probar otra forma de escribirlo?',
    task: 'Tarea',
    legend: '«—» significa: esta plataforma no tiene un comando propio documentado para eso.',
  },
  fr: {
    search: 'Rechercher une tâche ou une commande …',
    none: '—',
    noneTitle: 'Aucune commande dédiée documentée sur cette plateforme',
    hits: 'résultats',
    empty: 'Rien trouvé. Essayer une autre orthographe ?',
    task: 'Tâche',
    legend: '« — » signifie : cette plateforme n’a pas de commande dédiée documentée pour cela.',
  },
  zh: {
    search: '搜索任务或命令 …',
    none: '—',
    noneTitle: '该平台没有对应的官方命令',
    hits: '条结果',
    empty: '没有找到。换个写法试试？',
    task: '任务',
    legend: '“—” 表示：该平台没有为此提供专门的官方命令。',
  },
};

export default function RosettaTable({ lang, data, platformNames }: { lang: Lang; data: RosettaFile; platformNames: Record<string, string> }) {
  const t = DICT[lang];
  const [q, setQ] = useState('');

  const groups = useMemo(() => {
    const needle = q.trim().toLowerCase();
    if (!needle) return data.groups;
    return data.groups
      .map((g) => ({
        ...g,
        tasks: g.tasks.filter((task) => {
          if (task.label.toLowerCase().includes(needle) || task.hint.toLowerCase().includes(needle)) return true;
          return Object.values(task.cells).some((c) => c && c.name.toLowerCase().includes(needle));
        }),
      }))
      .filter((g) => g.tasks.length > 0);
  }, [q, data.groups]);

  const hits = groups.reduce((n, g) => n + g.tasks.length, 0);

  return (
    <>
      <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap', margin: '0 0 14px' }}>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder={t.search}
          aria-label={t.search}
          style={{
            flex: '1 1 260px',
            padding: '11px 15px',
            fontSize: 15,
            fontFamily: 'inherit',
            border: '3px solid var(--ink)',
            borderRadius: 12,
            background: 'var(--card)',
            color: 'inherit',
            boxShadow: '3px 3px 0 var(--ink)',
          }}
        />
        {q.trim() && (
          <span className="chip mono" style={{ fontSize: 12.5 }}>
            {hits} {t.hits}
          </span>
        )}
      </div>

      <p style={{ margin: '0 0 20px', fontSize: 13.5, color: 'var(--muted)' }}>{t.legend}</p>

      {groups.length === 0 && (
        <p style={{ margin: '26px 0', fontSize: 15, fontWeight: 700 }}>{t.empty}</p>
      )}

      {groups.map((g) => (
        <section key={g.id} style={{ margin: '0 0 34px' }}>
          <h2 style={{ margin: '0 0 12px', fontSize: 24, fontWeight: 800, letterSpacing: '-.02em' }}>{g.label}</h2>

          <div style={{ overflowX: 'auto', border: '3px solid var(--ink)', borderRadius: 14, boxShadow: '4px 4px 0 var(--ink)', background: 'var(--card)' }}>
            <table style={{ borderCollapse: 'collapse', width: '100%', minWidth: 760, fontSize: 14 }}>
              <thead>
                <tr style={{ background: 'var(--lime)' }}>
                  <th style={{ textAlign: 'left', padding: '11px 14px', borderBottom: '3px solid var(--ink)', fontSize: 13, textTransform: 'uppercase', letterSpacing: '.05em', minWidth: 190 }}>
                    {t.task}
                  </th>
                  {data.platforms.map((p) => (
                    <th
                      key={p}
                      style={{ textAlign: 'left', padding: '11px 12px', borderBottom: '3px solid var(--ink)', borderLeft: '2px solid var(--ink)', fontSize: 13, whiteSpace: 'nowrap' }}
                    >
                      {platformNames[p] ?? p}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {g.tasks.map((task, i) => (
                  <tr key={task.id} style={{ background: i % 2 ? 'transparent' : 'rgba(0,0,0,.03)' }}>
                    <th scope="row" style={{ textAlign: 'left', padding: '11px 14px', borderBottom: '1px solid var(--ink)', fontWeight: 800, verticalAlign: 'top' }}>
                      {task.label}
                      <span style={{ display: 'block', fontWeight: 400, fontSize: 12.5, color: 'var(--muted)', marginTop: 3, lineHeight: 1.45 }}>
                        {task.hint}
                      </span>
                    </th>
                    {data.platforms.map((p) => {
                      const cell = task.cells[p];
                      return (
                        <td key={p} style={{ padding: '11px 12px', borderBottom: '1px solid var(--ink)', borderLeft: '2px solid var(--ink)', verticalAlign: 'top', whiteSpace: 'nowrap' }}>
                          {cell ? (
                            <Link href={`/${lang}/befehle/${p}/${cell.slug}/`} className="mono" style={{ fontSize: 13.5, fontWeight: 700 }}>
                              {cell.name}
                            </Link>
                          ) : (
                            <span title={t.noneTitle} style={{ color: 'var(--muted)', fontSize: 15 }} aria-label={t.noneTitle}>
                              {t.none}
                            </span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      ))}
    </>
  );
}
