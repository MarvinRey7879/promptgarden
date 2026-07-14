'use client';

import { useState } from 'react';

/** Kopier-Button für Prompt-Vorlagen (1d-Stil, kurzes ✓-Feedback). */
const LABELS: Record<string, { copy: string; done: string }> = {
  de: { copy: 'Kopieren', done: '✓ Kopiert' },
  en: { copy: 'Copy', done: '✓ Copied' },
  es: { copy: 'Copiar', done: '✓ Copiado' },
  fr: { copy: 'Copier', done: '✓ Copié' },
  zh: { copy: '复制', done: '✓ 已复制' },
};

export default function CopyButton({ text, lang }: { text: string; lang: string }) {
  const [done, setDone] = useState(false);
  const t = LABELS[lang] ?? LABELS.de;
  return (
    <button
      className="btn"
      style={{ fontSize: 13, padding: '7px 14px' }}
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text);
          setDone(true);
          setTimeout(() => setDone(false), 1600);
        } catch {
          /* Clipboard evtl. blockiert */
        }
      }}
    >
      {done ? t.done : `📋 ${t.copy}`}
    </button>
  );
}
