'use client';

import { useEffect, useRef, useState } from 'react';
import type { Lang } from '@/lib/i18n';

/**
 * Vorlesefunktion (Ideen-Runde 5): liest den Kapiteltext per Browser-
 * SpeechSynthesis-API vor. Kostenlos, rein clientseitig, kein Server. Blendet
 * sich aus, wenn der Browser die API nicht unterstützt.
 */
const T: Record<Lang, { play: string; stop: string; speed: string }> = {
  de: { play: '🔊 Vorlesen', stop: '⏹ Stopp', speed: 'Tempo' },
  en: { play: '🔊 Read aloud', stop: '⏹ Stop', speed: 'Speed' },
  es: { play: '🔊 Leer en voz alta', stop: '⏹ Detener', speed: 'Velocidad' },
  fr: { play: '🔊 Lire à voix haute', stop: '⏹ Arrêter', speed: 'Vitesse' },
  zh: { play: '🔊 朗读', stop: '⏹ 停止', speed: '语速' },
};

const BCP47: Record<Lang, string> = {
  de: 'de-DE', en: 'en-US', es: 'es-ES', fr: 'fr-FR', zh: 'zh-CN',
};

export default function ReadAloud({ lang, text }: { lang: Lang; text: string }) {
  const t = T[lang] ?? T.de;
  const [supported, setSupported] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [rate, setRate] = useState(1);
  const rateRef = useRef(1);

  useEffect(() => {
    setSupported(typeof window !== 'undefined' && 'speechSynthesis' in window);
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) window.speechSynthesis.cancel();
    };
  }, []);

  if (!supported) return null;

  const start = () => {
    const synth = window.speechSynthesis;
    synth.cancel();
    // Text in Häppchen (Sätze) aufteilen — vermeidet die Längenbegrenzung mancher Engines.
    const chunks = text.match(/[^.!?。！？]+[.!?。！？]*\s*/g) ?? [text];
    let i = 0;
    const speakNext = () => {
      if (i >= chunks.length) { setSpeaking(false); return; }
      const u = new SpeechSynthesisUtterance(chunks[i].trim());
      u.lang = BCP47[lang] ?? 'en-US';
      u.rate = rateRef.current;
      u.onend = () => { i += 1; speakNext(); };
      u.onerror = () => { setSpeaking(false); };
      synth.speak(u);
    };
    setSpeaking(true);
    speakNext();
  };

  const stop = () => {
    window.speechSynthesis.cancel();
    setSpeaking(false);
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', margin: '0 0 18px' }}>
      <button
        className="btn"
        onClick={speaking ? stop : start}
        aria-pressed={speaking}
        style={{ fontSize: 13.5 }}
      >
        {speaking ? t.stop : t.play}
      </button>
      <span className="mono" style={{ fontSize: 12, color: 'var(--muted)' }}>{t.speed}:</span>
      {[0.75, 1, 1.25].map((r) => (
        <button
          key={r}
          onClick={() => { setRate(r); rateRef.current = r; if (speaking) { stop(); setTimeout(start, 60); } }}
          aria-pressed={rate === r}
          className="mono"
          style={{
            fontSize: 12, fontWeight: 700, cursor: 'pointer',
            border: '2px solid var(--ink)', borderRadius: 8, padding: '3px 9px',
            background: rate === r ? 'var(--yellow)' : 'transparent', color: 'var(--ink)',
          }}
        >
          {r}×
        </button>
      ))}
    </div>
  );
}
