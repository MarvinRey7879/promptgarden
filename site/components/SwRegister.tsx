'use client';

import { useEffect } from 'react';

/** Registriert den Service Worker (PWA/Offline) — nur im Produktions-Build. */
export default function SwRegister() {
  useEffect(() => {
    if (process.env.NODE_ENV !== 'production') return;
    if (!('serviceWorker' in navigator)) return;
    navigator.serviceWorker.register('/sw.js').catch(() => {
      /* Offline-Modus ist optional */
    });
  }, []);
  return null;
}
