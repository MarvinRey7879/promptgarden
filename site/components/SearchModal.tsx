'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import type MiniSearch from 'minisearch';
import type { Lang } from '@/lib/i18n';

/**
 * Volltext-Suche (Marvin-Ideen-Wahl #1): client-seitig über statischen Index
 * /search/index.<lang>.json (Kapitel + Befehle + Addons). Lazy: MiniSearch und
 * Index laden erst beim ersten Öffnen. Öffnen per 🔍-Button oder Cmd/Ctrl+K.
 */
type Doc = { id: string; g: 'k' | 'b' | 'a' | 'p' | 'f'; t: string; s: string; b: string; u: string };

const TXT: Record<Lang, { placeholder: string; empty: string; hint: string; aria: string; groups: Record<'k' | 'b' | 'a' | 'p' | 'f', string> }> = {
  de: { placeholder: 'Suche in Kapiteln, Befehlen, Fehlern, Prompts …', empty: 'Nichts gefunden — anders formulieren?', hint: '↑↓ wählen · Enter öffnen · Esc schließen', aria: 'Suche (Strg+K)', groups: { k: 'Kapitel', b: 'Befehle', a: 'Addons', p: 'Prompt-Vorlagen', f: 'Fehler & Lösungen' } },
  en: { placeholder: 'Search chapters, commands, errors, prompts …', empty: 'Nothing found — try different words?', hint: '↑↓ select · Enter open · Esc close', aria: 'Search (Ctrl+K)', groups: { k: 'Chapters', b: 'Commands', a: 'Add-ons', p: 'Prompt templates', f: 'Errors & fixes' } },
  es: { placeholder: 'Busca en capítulos, comandos, errores, prompts …', empty: 'Nada encontrado — ¿pruebas otras palabras?', hint: '↑↓ elegir · Enter abrir · Esc cerrar', aria: 'Buscar (Ctrl+K)', groups: { k: 'Capítulos', b: 'Comandos', a: 'Add-ons', p: 'Plantillas de prompt', f: 'Errores y soluciones' } },
  fr: { placeholder: 'Cherche dans les chapitres, commandes, erreurs, prompts …', empty: 'Rien trouvé — essaie d’autres mots ?', hint: '↑↓ choisir · Entrée ouvrir · Échap fermer', aria: 'Rechercher (Ctrl+K)', groups: { k: 'Chapitres', b: 'Commandes', a: 'Add-ons', p: 'Modèles de prompt', f: 'Erreurs et solutions' } },
  zh: { placeholder: '搜索章节、命令、错误、提示词 …', empty: '没有找到——换个词试试？', hint: '↑↓ 选择 · Enter 打开 · Esc 关闭', aria: '搜索（Ctrl+K）', groups: { k: '章节', b: '命令', a: '扩展', p: '提示词模板', f: '错误与解决' } },
};

const GROUP_ORDER: ('k' | 'b' | 'f' | 'p' | 'a')[] = ['k', 'b', 'f', 'p', 'a'];
const GROUP_COLORS = { k: 'var(--lime)', b: 'var(--blue)', a: 'var(--pink)', p: 'var(--yellow)', f: '#f0b8b8' } as const;

export default function SearchModal({ lang }: { lang: Lang }) {
  const t = TXT[lang];
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState('');
  const [results, setResults] = useState<Doc[]>([]);
  const [sel, setSel] = useState(0);
  const [loading, setLoading] = useState(false);
  const ms = useRef<MiniSearch<Doc> | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const ensureIndex = useCallback(async () => {
    if (ms.current) return;
    setLoading(true);
    try {
      const [{ default: MS }, res] = await Promise.all([
        import('minisearch'),
        fetch(`/search/index.${lang}.json`),
      ]);
      const docs: Doc[] = await res.json();
      const idx = new MS<Doc>({
        fields: ['t', 's', 'b'],
        storeFields: ['g', 't', 's', 'u'],
        searchOptions: { boost: { t: 3, s: 2 }, prefix: true, fuzzy: 0.2 },
      });
      idx.addAll(docs);
      ms.current = idx;
    } finally {
      setLoading(false);
    }
  }, [lang]);

  // Cmd/Ctrl+K global
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setOpen(true);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  useEffect(() => {
    if (!open) return;
    ensureIndex();
    setTimeout(() => inputRef.current?.focus(), 30);
  }, [open, ensureIndex]);

  useEffect(() => {
    if (!ms.current || q.trim().length < 2) {
      setResults([]);
      setSel(0);
      return;
    }
    const hits = ms.current.search(q) as unknown as (Doc & { id: string })[];
    // Gruppen-stabil sortieren: erst nach Score (kommt sortiert), dann max 12 gesamt
    setResults(hits.slice(0, 12));
    setSel(0);
  }, [q, loading]);

  const go = (d: Doc) => {
    setOpen(false);
    setQ('');
    router.push(`/${lang}/${d.u}`);
  };

  const onInputKey = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSel((s) => Math.min(s + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSel((s) => Math.max(s - 1, 0));
    } else if (e.key === 'Enter' && results[sel]) {
      go(results[sel]);
    } else if (e.key === 'Escape') {
      setOpen(false);
    }
  };

  // Gruppierte Anzeige in fester Reihenfolge
  const grouped = GROUP_ORDER.map((g) => ({ g, items: results.filter((r) => r.g === g) })).filter((x) => x.items.length);

  return (
    <>
      <button
        aria-label={t.aria}
        onClick={() => setOpen(true)}
        className="pill"
        style={{ padding: '7px 12px', cursor: 'pointer', fontFamily: 'inherit', fontSize: 14, background: 'transparent' }}
      >
        🔍
      </button>

      {open && (
        <div className="modal-back" onClick={() => setOpen(false)} style={{ alignItems: 'flex-start', paddingTop: '10vh' }}>
          <div className="modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 620, width: '94%' }}>
            <input
              ref={inputRef}
              className="field"
              placeholder={t.placeholder}
              value={q}
              onChange={(e) => setQ(e.target.value)}
              onKeyDown={onInputKey}
              style={{ fontSize: 16, width: '100%' }}
            />
            <p className="mono" style={{ margin: '8px 0 0', fontSize: 11, color: 'var(--muted)' }}>{t.hint}</p>

            {loading && <p style={{ margin: '14px 0 0', fontSize: 13.5 }}>…</p>}
            {!loading && q.trim().length >= 2 && results.length === 0 && (
              <p style={{ margin: '14px 0 0', fontSize: 13.5, color: 'var(--muted)' }}>{t.empty}</p>
            )}

            <div style={{ marginTop: 10, maxHeight: '52vh', overflowY: 'auto' }}>
              {grouped.map(({ g, items }) => (
                <div key={g} style={{ marginBottom: 10 }}>
                  <p className="kicker" style={{ margin: '8px 0 6px' }}>{t.groups[g].toUpperCase()}</p>
                  {items.map((r) => {
                    const idx = results.indexOf(r);
                    return (
                      <button
                        key={r.u}
                        onClick={() => go(r)}
                        onMouseEnter={() => setSel(idx)}
                        style={{
                          display: 'block', width: '100%', textAlign: 'left', cursor: 'pointer',
                          fontFamily: 'inherit', border: '2px solid var(--ink)', borderRadius: 12,
                          padding: '9px 12px', marginBottom: 6,
                          background: idx === sel ? GROUP_COLORS[g] : '#fff',
                          boxShadow: idx === sel ? '3px 3px 0 var(--ink)' : 'none',
                        }}
                      >
                        <span style={{ fontSize: 14.5, fontWeight: 800 }}>{r.t}</span>
                        {r.s && <span style={{ display: 'block', fontSize: 12, color: 'var(--muted)', marginTop: 2 }}>{r.s}</span>}
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
