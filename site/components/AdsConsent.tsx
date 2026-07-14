'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

/**
 * DSGVO-Consent für Google AdSense: Das Ads-Script (setzt Cookies/Requests an Google)
 * lädt AUSSCHLIESSLICH nach ausdrücklicher Einwilligung. Entscheidung in
 * localStorage pg_ads_consent ("yes" | "no") — Banner erscheint nur ohne Entscheidung.
 * Ohne Einwilligung bleibt die Seite komplett cookieless (nicht-optionales Tracking bleibt hash-basiert).
 */
const CLIENT = 'ca-pub-6850490267678365';

const TXT: Record<string, { text: string; ok: string; no: string }> = {
  de: {
    text: 'Werbung finanziert diese kostenlose Seite. Nur mit deinem Ok laden wir Google-Anzeigen (setzt Cookies von Google).',
    ok: 'Ok, Anzeigen erlauben',
    no: 'Ohne Anzeigen weiter',
  },
  en: {
    text: 'Ads fund this free site. Only with your OK do we load Google ads (sets Google cookies).',
    ok: 'OK, allow ads',
    no: 'Continue without ads',
  },
  es: {
    text: 'La publicidad financia esta web gratuita. Solo con tu OK cargamos anuncios de Google (usa cookies de Google).',
    ok: 'OK, permitir anuncios',
    no: 'Seguir sin anuncios',
  },
  fr: {
    text: 'La publicité finance ce site gratuit. Ce n’est qu’avec ton accord que nous chargeons les annonces Google (cookies Google).',
    ok: 'OK, autoriser les annonces',
    no: 'Continuer sans annonces',
  },
  zh: {
    text: '广告支撑这个免费网站。只有你同意后，我们才会加载 Google 广告（会使用 Google Cookie）。',
    ok: '好的，允许广告',
    no: '不看广告继续',
  },
};

function loadAds() {
  if (document.querySelector('script[src*="adsbygoogle"]')) return;
  const s = document.createElement('script');
  s.async = true;
  s.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${CLIENT}`;
  s.crossOrigin = 'anonymous';
  document.head.appendChild(s);
}

export default function AdsConsent() {
  const pathname = usePathname();
  const lang = TXT[pathname?.split('/')[1] ?? 'de'] ? (pathname?.split('/')[1] as string) : 'de';
  const [show, setShow] = useState(false);

  useEffect(() => {
    let v: string | null = null;
    try {
      v = localStorage.getItem('pg_ads_consent');
    } catch {
      return;
    }
    if (v === 'yes') loadAds();
    else if (v === null) setShow(true);
  }, []);

  const decide = (yes: boolean) => {
    try {
      localStorage.setItem('pg_ads_consent', yes ? 'yes' : 'no');
    } catch {
      /* optional */
    }
    setShow(false);
    if (yes) loadAds();
  };

  if (!show) return null;
  const t = TXT[lang];
  return (
    <div
      role="dialog"
      aria-live="polite"
      style={{
        position: 'fixed',
        left: 12,
        right: 12,
        bottom: 12,
        zIndex: 90,
        maxWidth: 560,
        margin: '0 auto',
        background: 'var(--yellow)',
        border: '3px solid var(--ink)',
        borderRadius: 16,
        boxShadow: '5px 5px 0 var(--ink)',
        padding: '14px 18px',
      }}
    >
      <p style={{ margin: '0 0 10px', fontSize: 13.5, lineHeight: 1.5, fontWeight: 600 }}>{t.text}</p>
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
        <button
          onClick={() => decide(true)}
          style={{
            background: 'var(--ink)', color: 'var(--bg)', border: '2.5px solid var(--ink)', borderRadius: 12,
            padding: '8px 16px', fontFamily: 'inherit', fontSize: 13.5, fontWeight: 800, cursor: 'pointer',
          }}
        >
          {t.ok}
        </button>
        <button
          onClick={() => decide(false)}
          style={{
            background: '#fff', color: 'var(--ink)', border: '2.5px solid var(--ink)', borderRadius: 12,
            padding: '8px 16px', fontFamily: 'inherit', fontSize: 13.5, fontWeight: 700, cursor: 'pointer',
          }}
        >
          {t.no}
        </button>
      </div>
    </div>
  );
}
