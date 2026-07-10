'use client';

import { useEffect } from 'react';

export default function LangRedirect() {
  useEffect(() => {
    const target = navigator.language?.toLowerCase().startsWith('de') ? '/de/' : '/en/';
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
