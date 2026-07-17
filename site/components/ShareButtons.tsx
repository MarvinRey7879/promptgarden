'use client';

import { usePathname } from 'next/navigation';
import { useState } from 'react';

/**
 * Teilen-Leiste (Ideen-Runde 3): Copy-Link, X, LinkedIn, WhatsApp + „Als Markdown"
 * für KI-Agenten. Reine Share-URLs ohne SDKs/Tracker; 1d-Pill-Stil.
 */
const T: Record<string, { share: string; copy: string; copied: string; md: string; mdDone: string }> = {
  de: { share: 'Teilen', copy: 'Link kopieren', copied: '✓ Kopiert', md: 'Als Markdown', mdDone: '✓ Markdown kopiert' },
  en: { share: 'Share', copy: 'Copy link', copied: '✓ Copied', md: 'As Markdown', mdDone: '✓ Markdown copied' },
  es: { share: 'Compartir', copy: 'Copiar enlace', copied: '✓ Copiado', md: 'Como Markdown', mdDone: '✓ Markdown copiado' },
  fr: { share: 'Partager', copy: 'Copier le lien', copied: '✓ Copié', md: 'En Markdown', mdDone: '✓ Markdown copié' },
  zh: { share: '分享', copy: '复制链接', copied: '✓ 已复制', md: '复制为 Markdown', mdDone: '✓ Markdown 已复制' },
};

const pill: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: 6,
  border: '2.5px solid var(--ink)',
  borderRadius: 99,
  padding: '6px 13px',
  fontSize: 12.5,
  fontWeight: 700,
  background: '#fff',
  color: 'var(--ink)',
  cursor: 'pointer',
  fontFamily: 'inherit',
  textDecoration: 'none',
};

export default function ShareButtons({ lang, title, teaser }: { lang: string; title: string; teaser?: string }) {
  const t = T[lang] ?? T.de;
  const pathname = usePathname();
  const url = `https://promptgarten.com${pathname}`;
  const [copied, setCopied] = useState<'link' | 'md' | null>(null);

  const copy = async (text: string, kind: 'link' | 'md') => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(kind);
      setTimeout(() => setCopied(null), 1600);
    } catch {
      /* Clipboard evtl. blockiert */
    }
  };

  const md = `[${title}](${url})${teaser ? `\n\n> ${teaser}` : ''}`;
  const enc = encodeURIComponent;

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginTop: 26 }}>
      <span className="kicker" style={{ color: 'var(--muted)', marginRight: 2 }}>{t.share}:</span>
      <button style={pill} data-share="link" onClick={() => copy(url, 'link')}>
        {copied === 'link' ? t.copied : `🔗 ${t.copy}`}
      </button>
      <a style={pill} href={`https://twitter.com/intent/tweet?text=${enc(title)}&url=${enc(url)}`} target="_blank" rel="noopener noreferrer">
        𝕏
      </a>
      <a style={pill} href={`https://www.linkedin.com/sharing/share-offsite/?url=${enc(url)}`} target="_blank" rel="noopener noreferrer">
        in
      </a>
      <a style={pill} href={`https://wa.me/?text=${enc(`${title} ${url}`)}`} target="_blank" rel="noopener noreferrer">
        💬
      </a>
      <button style={pill} data-share="md" onClick={() => copy(md, 'md')}>
        {copied === 'md' ? t.mdDone : `📋 ${t.md}`}
      </button>
    </div>
  );
}
