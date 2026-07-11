'use client';

import { useState } from 'react';
import type { Lang } from '@/lib/i18n';

/**
 * Interaktiver Token-Schätzer — erscheint nur auf den Einträgen token + context-window.
 * Bewusst als GROBE Schätzung gelabelt (echte Tokenizer variieren je Modell).
 * Heuristik: lateinische Schrift ~4 Zeichen/Token, CJK ~1,5 Zeichen/Token.
 */
const T: Record<Lang, { title: string; placeholder: string; tokens: string; note: string; fits: string }> = {
  de: {
    title: '🧮 Probier es aus: Wie viele Tokens ist dein Text?',
    placeholder: 'Tipp oder füge Text ein…',
    tokens: 'Tokens (grobe Schätzung)',
    note: 'Grobe Schätzung — echte Tokenizer zählen je nach Modell anders.',
    fits: 'So viel Platz nimmt das in typischen Context Windows ein:',
  },
  en: {
    title: '🧮 Try it: how many tokens is your text?',
    placeholder: 'Type or paste text…',
    tokens: 'tokens (rough estimate)',
    note: 'Rough estimate — real tokenizers count differently per model.',
    fits: 'How much space that takes in typical context windows:',
  },
  es: {
    title: '🧮 Pruébalo: ¿cuántos tokens tiene tu texto?',
    placeholder: 'Escribe o pega texto…',
    tokens: 'tokens (estimación aproximada)',
    note: 'Estimación aproximada — los tokenizers reales cuentan distinto según el modelo.',
    fits: 'Cuánto espacio ocupa en context windows típicos:',
  },
  fr: {
    title: '🧮 Essaie : combien de tokens fait ton texte ?',
    placeholder: 'Tape ou colle du texte…',
    tokens: 'tokens (estimation approximative)',
    note: 'Estimation approximative — les vrais tokenizers comptent différemment selon le modèle.',
    fits: 'La place que ça prend dans des context windows typiques :',
  },
  zh: {
    title: '🧮 试一试：你的文本有多少 token？',
    placeholder: '输入或粘贴文本…',
    tokens: 'token（粗略估计）',
    note: '粗略估计 — 不同模型的真实 tokenizer 计数方式不同。',
    fits: '在典型 context window 中占用的空间：',
  },
};

const WINDOWS = [
  { label: '8k', size: 8_000 },
  { label: '200k', size: 200_000 },
  { label: '1M', size: 1_000_000 },
];

function estimateTokens(text: string): number {
  if (!text) return 0;
  let cjk = 0;
  for (const ch of text) {
    if (/[　-鿿가-힯豈-﫿]/.test(ch)) cjk++;
  }
  const latin = text.length - cjk;
  return Math.max(text.trim() ? 1 : 0, Math.round(latin / 4 + cjk / 1.5));
}

export default function TokenPlayground({ lang }: { lang: Lang }) {
  const t = T[lang];
  const [text, setText] = useState('');
  const tokens = estimateTokens(text);

  return (
    <div className="card" style={{ padding: '20px 24px', marginTop: 30, background: 'var(--pink)' }}>
      <p className="kicker" style={{ color: 'var(--ink)' }}>{t.title}</p>
      <textarea
        className="field"
        placeholder={t.placeholder}
        value={text}
        onChange={(e) => setText(e.target.value)}
        style={{ minHeight: 80, background: '#fff' }}
      />
      <p style={{ margin: '12px 0 4px', fontSize: 22, fontWeight: 800 }}>
        ≈ {tokens.toLocaleString()} <span style={{ fontSize: 13, fontWeight: 600 }}>{t.tokens}</span>
      </p>
      <p style={{ margin: '0 0 14px', fontSize: 12, color: '#5c4a52' }}>{t.note}</p>

      {tokens > 0 && (
        <>
          <p style={{ margin: '0 0 8px', fontSize: 12.5, fontWeight: 700 }}>{t.fits}</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {WINDOWS.map((w) => {
              const pct = Math.min(100, (tokens / w.size) * 100);
              return (
                <div key={w.label} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span className="mono" style={{ fontSize: 11, width: 38, fontWeight: 600 }}>{w.label}</span>
                  <div
                    style={{
                      flex: 1,
                      height: 14,
                      background: '#fff',
                      border: '2px solid var(--ink)',
                      borderRadius: 99,
                      overflow: 'hidden',
                    }}
                  >
                    <div
                      style={{
                        width: `${Math.max(pct, tokens > 0 ? 1 : 0)}%`,
                        height: '100%',
                        background: pct >= 100 ? 'var(--accent)' : 'var(--lime)',
                        transition: 'width .15s ease',
                      }}
                    />
                  </div>
                  <span className="mono" style={{ fontSize: 11, width: 52, textAlign: 'right' }}>
                    {pct >= 100 ? '100%+' : pct < 0.1 ? '<0.1%' : `${pct.toFixed(1)}%`}
                  </span>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
