'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

/**
 * Google AdSense Loader (Marvin-Direktive 14.07.: Werbung an, nicht optional —
 * Einwilligung übernimmt Googles zertifizierte CMP aus dem AdSense-Konto
 * („Datenschutz & Mitteilungen", DSGVO-Nachricht + Limited Ads für Ablehner).
 * AUSNAHME: Landingpages (/{lang}/) bleiben werbefrei.
 * Altes localStorage-Flag pg_ads_consent wird nicht mehr ausgewertet.
 */
const CLIENT = 'ca-pub-6850490267678365';
const LANGS = ['de', 'en', 'es', 'fr', 'zh'];

function isLanding(pathname: string | null): boolean {
  if (!pathname) return true;
  const parts = pathname.split('/').filter(Boolean);
  return parts.length === 0 || (parts.length === 1 && LANGS.includes(parts[0]));
}

export default function AdsConsent() {
  const pathname = usePathname();

  useEffect(() => {
    if (isLanding(pathname)) return;
    if (document.querySelector('script[src*="adsbygoogle"]')) return;
    const s = document.createElement('script');
    s.async = true;
    s.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${CLIENT}`;
    s.crossOrigin = 'anonymous';
    document.head.appendChild(s);
  }, [pathname]);

  return null;
}
