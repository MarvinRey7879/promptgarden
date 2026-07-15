'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { type Lang, ui } from '@/lib/i18n';
import { loadProgress, touchVisit, levelEmoji, PROGRESS_EVENT, type Progress } from '@/lib/progress';
import { API_URL, apiPost } from '@/lib/api';
import SearchModal from '@/components/SearchModal';

export default function Header({ lang }: { lang: Lang }) {
  const t = ui[lang];
  const pathname = usePathname();
  const [progress, setProgress] = useState<Progress | null>(null);
  const [showNews, setShowNews] = useState(false);
  const [email, setEmail] = useState('');
  const [newsState, setNewsState] = useState<'idle' | 'sent' | 'error'>('idle');

  const signup = async () => {
    const ok = await apiPost('/v1/newsletter', { email: email.trim(), lang });
    setNewsState(ok ? 'sent' : 'error');
    if (ok) setEmail('');
  };

  useEffect(() => {
    document.documentElement.lang = lang;
    setProgress(touchVisit());
    const onChange = () => setProgress(loadProgress());
    window.addEventListener(PROGRESS_EVENT, onChange);
    return () => window.removeEventListener(PROGRESS_EVENT, onChange);
  }, [lang]);

  // Sprachwechsel: zyklisch durch alle Sprachen (de → en → es → fr → zh → de)
  const langCycle: Lang[] = ['de', 'en', 'es', 'fr', 'zh'];
  const otherLang: Lang = langCycle[(langCycle.indexOf(lang) + 1) % langCycle.length];
  const switchHref = pathname.replace(`/${lang}`, `/${otherLang}`) || `/${otherLang}/`;

  const navItems = [
    { label: t.nav.lexikon, href: `/${lang}/lexikon/` },
    { label: t.nav.lernpfade, href: `/${lang}/lernpfade/` },
    { label: t.nav.befehle, href: `/${lang}/befehle/` },
    { label: t.nav.prompts, href: `/${lang}/prompts/` },
    { label: t.nav.addons, href: `/${lang}/addons/` },
    { label: t.nav.feed, href: `/${lang}/feed/` },
    { label: t.nav.vergleiche, href: `/${lang}/vergleiche/` },
    { label: `🎯 ${t.nav.challenge}`, href: `/${lang}/challenge/` },
    { label: 'Forum', href: `/${lang}/forum/` },
  ];

  return (
    <>
      <header
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '20px 0',
          gap: 12,
          flexWrap: 'wrap',
        }}
      >
        <Link
          href={`/${lang}/`}
          style={{ fontWeight: 800, fontSize: 20, letterSpacing: '-.03em' }}
        >
          prompt<span style={{ color: 'var(--accent)' }}>garten</span> 🌱
        </Link>
        <nav style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {navItems.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className={`pill${pathname.startsWith(n.href.replace(/\/$/, '')) ? ' active' : ''}`}
            >
              {n.label}
            </Link>
          ))}
        </nav>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          {progress && (progress.xp > 0 || progress.streak >= 1) && (
            <span className="chip" title="XP & Streak — nur in deinem Browser gespeichert">
              <span>{levelEmoji(progress.xp)}</span>
              <span style={{ color: 'var(--accent)' }}>⚡ {progress.xp} {t.xp}</span>
              <span style={{ color: 'var(--muted)' }}>·</span>
              <span>🔥 {t.streakDays(progress.streak)}</span>
            </span>
          )}
          <SearchModal lang={lang} />
          <Link href={switchHref} className="pill" style={{ padding: '7px 10px' }}>
            🌍 {otherLang.toUpperCase()}
          </Link>
          <button className="btn" onClick={() => setShowNews(true)}>
            {t.newsletter}
          </button>
        </div>
      </header>
      {showNews && (
        <div className="modal-back" onClick={() => setShowNews(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3 style={{ margin: '0 0 8px', fontSize: 20, fontWeight: 800 }}>
              {t.newsletter} 🌱
            </h3>
            {!API_URL || newsState === 'sent' ? (
              <p style={{ margin: '0 0 16px', color: 'var(--muted)', fontSize: 14.5, lineHeight: 1.5 }}>
                {newsState === 'sent' ? t.newsThanks : t.newsletterSoonBody}
              </p>
            ) : (
              <>
                <div style={{ display: 'flex', gap: 8, margin: '12px 0 8px' }}>
                  <input
                    className="field"
                    type="email"
                    placeholder={t.newsEmailPlaceholder}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && email.includes('@') && signup()}
                  />
                  <button className="btn" onClick={signup} disabled={!email.includes('@')}>
                    {t.newsSubmit}
                  </button>
                </div>
                <p style={{ margin: '0 0 14px', color: 'var(--muted)', fontSize: 12.5 }}>
                  {t.newsHint}
                  {newsState === 'error' && ' — Fehler, versuch es nochmal.'}
                </p>
              </>
            )}
            <button className="btn secondary" onClick={() => { setShowNews(false); setNewsState('idle'); }}>
              {t.close}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
