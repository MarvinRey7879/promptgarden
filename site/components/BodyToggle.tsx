'use client';

/**
 * Detail-Level-Toggle (Marvin 13.07): 🌱 Einfach / 🔬 Im Detail.
 * Beide Versionen kommen fertig gerendert (HTML) vom Server; die Wahl
 * liegt in localStorage (pg_detail_level) und gilt seitenübergreifend.
 * Ohne detailHtml wird nur der einfache Text ohne Toggle gezeigt.
 */
import { useEffect, useState } from 'react';

const KEY = 'pg_detail_level';

export default function BodyToggle({
  bodyHtml,
  detailHtml,
  labelSimple,
  labelDetail,
}: {
  bodyHtml: string;
  detailHtml: string | null;
  labelSimple: string;
  labelDetail: string;
}) {
  const [level, setLevel] = useState<'simple' | 'detail'>('simple');

  useEffect(() => {
    const saved = localStorage.getItem(KEY);
    if (saved === 'detail') setLevel('detail');
  }, []);

  const choose = (l: 'simple' | 'detail') => {
    setLevel(l);
    localStorage.setItem(KEY, l);
  };

  if (!detailHtml) {
    return <div className="prose" dangerouslySetInnerHTML={{ __html: bodyHtml }} />;
  }

  const btn = (active: boolean): React.CSSProperties => ({
    padding: '6px 14px',
    borderRadius: 999,
    border: '2px solid var(--ink)',
    background: active ? 'var(--ink)' : 'transparent',
    color: active ? '#fff' : 'var(--ink)',
    fontWeight: 800,
    fontSize: 13,
    cursor: 'pointer',
  });

  return (
    <div>
      <div style={{ display: 'flex', gap: 8, margin: '0 0 16px' }} role="tablist" aria-label={`${labelSimple} · ${labelDetail}`}>
        <button role="tab" aria-selected={level === 'simple'} style={btn(level === 'simple')} onClick={() => choose('simple')}>
          {labelSimple}
        </button>
        <button role="tab" aria-selected={level === 'detail'} style={btn(level === 'detail')} onClick={() => choose('detail')}>
          {labelDetail}
        </button>
      </div>
      <div className="prose" dangerouslySetInnerHTML={{ __html: level === 'detail' ? detailHtml : bodyHtml }} />
    </div>
  );
}
