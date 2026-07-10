'use client';

import { useEffect, useState } from 'react';
import { type Lang, ui } from '@/lib/i18n';
import { completeEntry, isCompleted, PROGRESS_EVENT } from '@/lib/progress';

export default function CompleteButton({
  lang,
  slug,
  xp,
}: {
  lang: Lang;
  slug: string;
  xp: number;
}) {
  const t = ui[lang];
  const [done, setDone] = useState(false);

  useEffect(() => {
    setDone(isCompleted(slug));
    const onChange = () => setDone(isCompleted(slug));
    window.addEventListener(PROGRESS_EVENT, onChange);
    return () => window.removeEventListener(PROGRESS_EVENT, onChange);
  }, [slug]);

  if (done) {
    return (
      <span className="chip" style={{ background: 'var(--lime)' }}>
        ✓ {t.done}
      </span>
    );
  }
  return (
    <button className="btn secondary" onClick={() => completeEntry(slug, xp)}>
      {t.markDone} (+{xp} {t.xp})
    </button>
  );
}
