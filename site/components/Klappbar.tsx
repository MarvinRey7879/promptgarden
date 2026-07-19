'use client';

import { useEffect, useState } from 'react';

/**
 * Klappt einen Abschnitt NUR auf schmalen Bildschirmen ein. Am Desktop rendert
 * die Komponente ihren Inhalt unverändert — dort ist Platz genug.
 *
 * Serverseitig wird bewusst der offene Zustand gerendert: der Text steht damit
 * vollständig im HTML (Suchmaschinen, Vorlesewerkzeuge), das Einklappen passiert
 * erst nach dem Laden im Browser.
 */
export default function Klappbar({
  titel,
  anzahl,
  offenLabel,
  standardOffen = false,
  children,
}: {
  titel: string;
  anzahl: number;
  offenLabel: string;
  standardOffen?: boolean;
  children: React.ReactNode;
}) {
  const [mobil, setMobil] = useState(false);
  const [offen, setOffen] = useState(true);

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 760px)');
    const anpassen = () => {
      setMobil(mq.matches);
      setOffen(!mq.matches || standardOffen);
    };
    anpassen();
    mq.addEventListener('change', anpassen);
    return () => mq.removeEventListener('change', anpassen);
  }, [standardOffen]);

  if (!mobil) {
    return (
      <>
        <p className="kicker" style={{ marginBottom: 10 }}>{titel}</p>
        {children}
      </>
    );
  }

  return (
    <>
      <button
        onClick={() => setOffen((v) => !v)}
        aria-expanded={offen}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '100%',
          minHeight: 48,
          gap: 10,
          marginBottom: 10,
          padding: '10px 14px',
          background: offen ? 'var(--ink)' : '#fff',
          color: offen ? '#fff' : 'var(--ink)',
          border: '2px solid var(--ink)',
          borderRadius: 12,
          fontFamily: 'inherit',
          fontSize: 13,
          fontWeight: 800,
          letterSpacing: '.08em',
          cursor: 'pointer',
        }}
      >
        <span>{titel}</span>
        <span style={{ fontWeight: 700, letterSpacing: 0, opacity: 0.85 }}>
          {anzahl} {offenLabel} {offen ? '▾' : '▸'}
        </span>
      </button>
      {offen && children}
    </>
  );
}
