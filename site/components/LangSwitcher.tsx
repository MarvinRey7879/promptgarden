'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import type { Lang } from '@/lib/i18n';

/**
 * Sprach-Picker (UX-Verbesserung): Dropdown mit allen 5 Sprachen statt eines
 * zyklischen Buttons — von jeder Sprache aus 1 Klick zu jeder anderen, aktuelle
 * Sprache markiert. Verlinkt auf dieselbe Seite in der Zielsprache.
 */
const NAMES: Record<Lang, string> = { de: 'Deutsch', en: 'English', es: 'Español', fr: 'Français', zh: '中文' };
const ORDER: Lang[] = ['de', 'en', 'es', 'fr', 'zh'];

export default function LangSwitcher({ lang }: { lang: Lang }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onDoc = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('mousedown', onDoc);
    document.addEventListener('keydown', onKey);
    return () => { document.removeEventListener('mousedown', onDoc); document.removeEventListener('keydown', onKey); };
  }, []);
  useEffect(() => setOpen(false), [pathname]);

  const hrefFor = (t: Lang) => pathname.replace(new RegExp('^/' + lang), '/' + t) || `/${t}/`;

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button className="pill" aria-haspopup="menu" aria-expanded={open} onClick={() => setOpen((v) => !v)} style={{ padding: '7px 11px' }}>
        🌍 {lang.toUpperCase()} <span aria-hidden style={{ fontSize: 10 }}>▾</span>
      </button>
      {open && (
        <div role="menu" style={{ position: 'absolute', right: 0, top: 'calc(100% + 6px)', zIndex: 50, background: '#fff', border: '2.5px solid var(--ink)', borderRadius: 12, boxShadow: '4px 4px 0 var(--ink)', padding: 6, minWidth: 158 }}>
          {ORDER.map((t) => (
            <Link
              key={t}
              role="menuitem"
              href={hrefFor(t)}
              lang={t}
              hrefLang={t}
              aria-current={t === lang ? 'true' : undefined}
              style={{ display: 'flex', justifyContent: 'space-between', gap: 12, padding: '7px 10px', borderRadius: 8, fontSize: 13.5, fontWeight: t === lang ? 800 : 600, background: t === lang ? 'var(--yellow)' : 'transparent', textDecoration: 'none', color: 'var(--ink)' }}
            >
              <span>{NAMES[t]}</span>
              <span className="mono" style={{ color: 'var(--muted)' }}>{t.toUpperCase()}</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
