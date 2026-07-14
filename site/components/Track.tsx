'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { API_URL, apiPost } from '@/lib/api';

/**
 * Cookieless Page-View-Tracking: nur Pfad, Sprache, Referrer-Host.
 * Keine Cookies, keine IDs → nicht-optionales Tracking, kein Consent-Banner nötig.
 * Eigene Aufrufe (Betreiber/Loop) melden sich mit internal:true und werden in den
 * Statistiken gefiltert: Flag via Admin-Login (pg_admin_key) oder einmalig ?ich=1.
 * No-op solange kein Backend deployed (API_URL leer).
 */
export default function Track({ lang }: { lang: string }) {
  const pathname = usePathname();

  useEffect(() => {
    if (!API_URL || !pathname) return;
    let internal = false;
    try {
      if (new URLSearchParams(window.location.search).has('ich')) {
        localStorage.setItem('pg_internal', '1');
      }
      internal = !!(localStorage.getItem('pg_admin_key') || localStorage.getItem('pg_internal'));
    } catch {
      /* localStorage optional */
    }
    apiPost('/v1/track', { path: pathname, lang, ref: document.referrer || null, internal });
  }, [pathname, lang]);

  return null;
}
