'use client';

import { useMemo, useState } from 'react';

/**
 * Prompt-Baukasten (Ideen-Runde 3): Vorlage wählen, <PLATZHALTER> als Felder
 * ausfüllen, fertigen Prompt live sehen und kopieren. Rein clientseitig.
 */
export type SandboxItem = { id: string; title: string; category: string; prompt: string };

const T: Record<string, { kicker: string; pick: string; fields: string; preview: string; copy: string; copied: string; empty: string }> = {
  de: { kicker: '🧑‍💻 PROMPT-BAUKASTEN — VORLAGE WÄHLEN, LÜCKEN FÜLLEN, KOPIEREN', pick: 'Vorlage', fields: 'Deine Angaben', preview: 'Fertiger Prompt', copy: 'Prompt kopieren', copied: '✓ Kopiert', empty: 'Noch leer — Felder oben füllen.' },
  en: { kicker: '🧑‍💻 PROMPT BUILDER — PICK A TEMPLATE, FILL THE BLANKS, COPY', pick: 'Template', fields: 'Your inputs', preview: 'Final prompt', copy: 'Copy prompt', copied: '✓ Copied', empty: 'Still empty — fill the fields above.' },
  es: { kicker: '🧑‍💻 CONSTRUCTOR DE PROMPTS — ELIGE PLANTILLA, RELLENA, COPIA', pick: 'Plantilla', fields: 'Tus datos', preview: 'Prompt final', copy: 'Copiar prompt', copied: '✓ Copiado', empty: 'Aún vacío — rellena los campos.' },
  fr: { kicker: '🧑‍💻 ATELIER DE PROMPTS — CHOISIS, REMPLIS, COPIE', pick: 'Modèle', fields: 'Tes entrées', preview: 'Prompt final', copy: 'Copier le prompt', copied: '✓ Copié', empty: 'Encore vide — remplis les champs.' },
  zh: { kicker: '🧑‍💻 提示词工作台——选模板、填空、复制', pick: '模板', fields: '你的输入', preview: '最终提示词', copy: '复制提示词', copied: '✓ 已复制', empty: '还是空的——先填写上面的字段。' },
};

const PLACEHOLDER_RE = /<([^<>\n]{2,80})>/g;

export default function PromptSandbox({ lang, items }: { lang: string; items: SandboxItem[] }) {
  const t = T[lang] ?? T.de;
  const [selId, setSelId] = useState(items[0]?.id ?? '');
  const [values, setValues] = useState<Record<string, string>>({});
  const [copied, setCopied] = useState(false);

  const sel = items.find((i) => i.id === selId) ?? items[0];
  const placeholders = useMemo(() => {
    const seen = new Set<string>();
    const out: string[] = [];
    for (const m of sel.prompt.matchAll(PLACEHOLDER_RE)) {
      if (!seen.has(m[1])) { seen.add(m[1]); out.push(m[1]); }
    }
    return out;
  }, [sel]);

  const filled = useMemo(
    () => sel.prompt.replace(PLACEHOLDER_RE, (full, name: string) => (values[name]?.trim() ? values[name].trim() : full)),
    [sel, values],
  );
  const openCount = placeholders.filter((p) => !values[p]?.trim()).length;

  return (
    <div className="card" style={{ padding: '20px 24px', margin: '0 0 30px', background: '#fff', boxShadow: '5px 5px 0 var(--ink)' }}>
      <p className="kicker" style={{ color: 'var(--ink)' }}>{t.kicker}</p>

      <label style={{ display: 'block', fontSize: 13, fontWeight: 700, margin: '12px 0 14px' }}>
        {t.pick}:
        <select
          value={sel.id}
          onChange={(e) => { setSelId(e.target.value); setValues({}); setCopied(false); }}
          className="field"
          style={{ display: 'block', width: '100%', marginTop: 6, fontFamily: 'inherit', fontSize: 14 }}
        >
          {items.map((i) => (
            <option key={i.id} value={i.id}>{i.title}</option>
          ))}
        </select>
      </label>

      {placeholders.length > 0 && (
        <div style={{ marginBottom: 14 }}>
          <p className="kicker" style={{ color: 'var(--muted)', marginBottom: 8 }}>{t.fields}</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 10 }}>
            {placeholders.map((p) => (
              <label key={p} style={{ fontSize: 12.5, fontWeight: 700 }}>
                <span className="mono" style={{ background: 'var(--yellow)', borderRadius: 6, padding: '1px 6px' }}>{p}</span>
                <input
                  className="field"
                  style={{ display: 'block', width: '100%', marginTop: 4, fontSize: 13.5 }}
                  value={values[p] ?? ''}
                  onChange={(e) => { setValues((v) => ({ ...v, [p]: e.target.value })); setCopied(false); }}
                />
              </label>
            ))}
          </div>
        </div>
      )}

      <p className="kicker" style={{ color: 'var(--muted)', marginBottom: 6 }}>
        {t.preview}{openCount > 0 ? ` · ${'○'.repeat(Math.min(openCount, 8))}` : ' · ✓'}
      </p>
      <pre
        data-sandbox-preview
        className="mono"
        style={{ background: 'var(--bg)', border: '2.5px solid var(--ink)', borderRadius: 12, padding: '14px 16px', fontSize: 13, lineHeight: 1.55, whiteSpace: 'pre-wrap', margin: '0 0 12px' }}
      >
        {filled}
      </pre>
      <button
        className="btn"
        data-sandbox-copy
        style={{ fontSize: 13.5 }}
        onClick={async () => {
          try {
            await navigator.clipboard.writeText(filled);
            setCopied(true);
            setTimeout(() => setCopied(false), 1600);
          } catch { /* Clipboard evtl. blockiert */ }
        }}
      >
        {copied ? t.copied : `📋 ${t.copy}`}
      </button>
    </div>
  );
}
