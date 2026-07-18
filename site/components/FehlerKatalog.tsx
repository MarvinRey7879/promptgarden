'use client';

import { useMemo, useState } from 'react';
import type { FehlerFile, FehlerKategorie } from '@/lib/fehler';
import type { Lang } from '@/lib/i18n';

const DICT: Record<Lang, {
  search: string; all: string; hits: string; empty: string;
  cause: string; fix: string; prevent: string; sources: string; platforms: string;
  kat: Record<FehlerKategorie, string>;
}> = {
  de: {
    search: 'Fehlermeldung oder Symptom suchen …', all: 'Alle', hits: 'Treffer', empty: 'Nichts gefunden. Versuch einen kürzeren Teil der Fehlermeldung.',
    cause: 'Ursache', fix: 'So behebst du es', prevent: 'Künftig vermeiden', sources: 'Quellen', platforms: 'Betrifft',
    kat: { limits: 'Limits & Kosten', auth: 'Zugang & Schlüssel', kontext: 'Kontext', werkzeuge: 'Werkzeuge & MCP', sicherheit: 'Sicherheit', code: 'Code & Tests', setup: 'Installation' },
  },
  en: {
    search: 'Search error message or symptom …', all: 'All', hits: 'matches', empty: 'Nothing found. Try a shorter part of the error message.',
    cause: 'Cause', fix: 'How to fix it', prevent: 'Avoid it next time', sources: 'Sources', platforms: 'Affects',
    kat: { limits: 'Limits & cost', auth: 'Access & keys', kontext: 'Context', werkzeuge: 'Tools & MCP', sicherheit: 'Security', code: 'Code & tests', setup: 'Installation' },
  },
  es: {
    search: 'Buscar mensaje de error o síntoma …', all: 'Todos', hits: 'resultados', empty: 'No se encontró nada. Prueba con una parte más corta del mensaje.',
    cause: 'Causa', fix: 'Cómo solucionarlo', prevent: 'Evitarlo en el futuro', sources: 'Fuentes', platforms: 'Afecta a',
    kat: { limits: 'Límites y costes', auth: 'Acceso y claves', kontext: 'Contexto', werkzeuge: 'Herramientas y MCP', sicherheit: 'Seguridad', code: 'Código y pruebas', setup: 'Instalación' },
  },
  fr: {
    search: 'Rechercher un message d’erreur ou un symptôme …', all: 'Tous', hits: 'résultats', empty: 'Rien trouvé. Essaie une partie plus courte du message.',
    cause: 'Cause', fix: 'Comment corriger', prevent: 'Éviter à l’avenir', sources: 'Sources', platforms: 'Concerne',
    kat: { limits: 'Limites & coûts', auth: 'Accès & clés', kontext: 'Contexte', werkzeuge: 'Outils & MCP', sicherheit: 'Sécurité', code: 'Code & tests', setup: 'Installation' },
  },
  zh: {
    search: '搜索错误信息或现象 …', all: '全部', hits: '条结果', empty: '没有找到。试试错误信息里更短的一段。',
    cause: '原因', fix: '如何解决', prevent: '以后如何避免', sources: '来源', platforms: '影响',
    kat: { limits: '限额与成本', auth: '访问与密钥', kontext: '上下文', werkzeuge: '工具与 MCP', sicherheit: '安全', code: '代码与测试', setup: '安装' },
  },
};

const KAT_COLORS: Record<FehlerKategorie, string> = {
  limits: 'var(--yellow)',
  auth: 'var(--pink)',
  kontext: 'var(--blue)',
  werkzeuge: 'var(--lime)',
  sicherheit: '#f0b8b8',
  code: '#d9d2f0',
  setup: '#e8d9c3',
};

const ORDER: FehlerKategorie[] = ['limits', 'auth', 'kontext', 'werkzeuge', 'sicherheit', 'code', 'setup'];

export default function FehlerKatalog({ lang, data }: { lang: Lang; data: FehlerFile }) {
  const t = DICT[lang];
  const [q, setQ] = useState('');
  const [kat, setKat] = useState<FehlerKategorie | null>(null);
  const [open, setOpen] = useState<string | null>(null);

  const present = useMemo(() => ORDER.filter((k) => data.items.some((i) => i.kategorie === k)), [data.items]);

  const items = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return data.items.filter((i) => {
      if (kat && i.kategorie !== kat) return false;
      if (!needle) return true;
      return (
        i.symptom.toLowerCase().includes(needle) ||
        i.ursache.toLowerCase().includes(needle) ||
        i.fix.some((f) => f.toLowerCase().includes(needle)) ||
        i.plattformen.some((p) => p.toLowerCase().includes(needle))
      );
    });
  }, [q, kat, data.items]);

  return (
    <>
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder={t.search}
        aria-label={t.search}
        style={{
          width: '100%',
          padding: '12px 16px',
          fontSize: 15.5,
          fontFamily: 'inherit',
          border: '3px solid var(--ink)',
          borderRadius: 12,
          background: 'var(--card)',
          color: 'inherit',
          boxShadow: '3px 3px 0 var(--ink)',
          marginBottom: 14,
        }}
      />

      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 8 }}>
        <button
          onClick={() => setKat(null)}
          className="chip"
          style={{ cursor: 'pointer', fontFamily: 'inherit', background: kat === null ? 'var(--ink)' : 'transparent', color: kat === null ? 'var(--card)' : 'inherit', border: '2.5px solid var(--ink)' }}
        >
          {t.all}
        </button>
        {present.map((k) => (
          <button
            key={k}
            onClick={() => setKat(kat === k ? null : k)}
            className="chip"
            style={{ cursor: 'pointer', fontFamily: 'inherit', background: kat === k ? KAT_COLORS[k] : 'transparent', border: '2.5px solid var(--ink)', fontWeight: kat === k ? 800 : 600 }}
          >
            {t.kat[k]}
          </button>
        ))}
        <span className="chip mono" style={{ fontSize: 12, opacity: 0.75 }}>
          {items.length} {t.hits}
        </span>
      </div>

      {items.length === 0 && <p style={{ margin: '26px 0', fontSize: 15, fontWeight: 700 }}>{t.empty}</p>}

      <div style={{ display: 'grid', gap: 14, marginTop: 18 }}>
        {items.map((i) => {
          const isOpen = open === i.id;
          return (
            <article key={i.id} className="card" style={{ padding: 0, overflow: 'hidden', boxShadow: '4px 4px 0 var(--ink)' }}>
              <button
                onClick={() => setOpen(isOpen ? null : i.id)}
                aria-expanded={isOpen}
                style={{
                  display: 'flex',
                  gap: 12,
                  alignItems: 'flex-start',
                  width: '100%',
                  textAlign: 'left',
                  padding: '15px 18px',
                  background: KAT_COLORS[i.kategorie],
                  border: 0,
                  borderBottom: isOpen ? '3px solid var(--ink)' : 0,
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  color: 'var(--ink)',
                }}
              >
                <span style={{ fontSize: 18, lineHeight: 1.3 }} aria-hidden>
                  {isOpen ? '▾' : '▸'}
                </span>
                <span style={{ flex: 1 }}>
                  <span className="mono" style={{ display: 'block', fontSize: 14.5, fontWeight: 800, lineHeight: 1.45 }}>
                    {i.symptom}
                  </span>
                  <span style={{ display: 'block', fontSize: 12, marginTop: 5, opacity: 0.8 }}>
                    {t.platforms}: {i.plattformen.join(' · ')}
                  </span>
                </span>
              </button>

              {isOpen && (
                <div style={{ padding: '16px 18px 18px' }}>
                  <p className="kicker" style={{ margin: '0 0 4px' }}>{t.cause.toUpperCase()}</p>
                  <p style={{ margin: '0 0 16px', fontSize: 14.5, lineHeight: 1.65 }}>{i.ursache}</p>

                  <p className="kicker" style={{ margin: '0 0 4px' }}>🔧 {t.fix.toUpperCase()}</p>
                  <ol style={{ margin: '0 0 16px', paddingLeft: 22, fontSize: 14.5, lineHeight: 1.7 }}>
                    {i.fix.map((f, n) => (
                      <li key={n}>{f}</li>
                    ))}
                  </ol>

                  <p className="kicker" style={{ margin: '0 0 4px' }}>🛡️ {t.prevent.toUpperCase()}</p>
                  <p style={{ margin: '0 0 16px', fontSize: 14.5, lineHeight: 1.65 }}>{i.vorbeugen}</p>

                  <p className="kicker" style={{ margin: '0 0 4px' }}>{t.sources.toUpperCase()}</p>
                  <ul style={{ margin: 0, paddingLeft: 20, fontSize: 13.5, lineHeight: 1.7 }}>
                    {i.sources.map((s) => (
                      <li key={s.url}>
                        <a href={s.url} target="_blank" rel="noopener noreferrer">
                          {s.title}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </article>
          );
        })}
      </div>
    </>
  );
}
