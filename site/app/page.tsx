'use client';

import { useEffect } from 'react';

export default function LangRedirect() {
  useEffect(() => {
    const l = navigator.language?.toLowerCase() ?? '';
    const target = l.startsWith('de') ? '/de/' : l.startsWith('es') ? '/es/' : '/en/';
    window.location.replace(target);
  }, []);

  return (
    <div style={{ padding: 60, textAlign: 'center', fontWeight: 700 }}>
      <p>🌱</p>
      <p>
        <a href="/de/" style={{ textDecoration: 'underline' }}>
          Deutsch
        </a>
        {' · '}
        <a href="/en/" style={{ textDecoration: 'underline' }}>
          English
        </a>
      </p>
    </div>
  );
}
