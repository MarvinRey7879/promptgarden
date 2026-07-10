'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { API_URL, apiPost } from '@/lib/api';

/**
 * Cookieless Page-View-Tracking: nur Pfad, Sprache, Referrer-Host.
 * Keine Cookies, keine IDs → nicht-optionales Tracking, kein Consent-Banner nötig.
 * No-op solange kein Backend deployed (API_URL leer).
 */
export default function Track({ lang }: { lang: string }) {
  const pathname = usePathname();

  useEffect(() => {
    if (!API_URL || !pathname) return;
    apiPost('/v1/track', { path: pathname, lang, ref: document.referrer || null });
  }, [pathname, lang]);

  return null;
}
