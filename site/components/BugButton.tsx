'use client';

import { useState } from 'react';
import { type Lang, ui } from '@/lib/i18n';
import { API_URL, apiPost } from '@/lib/api';

const BUG_MAIL = 'marvin.mez@tm2.ai'; // Fallback solange Worker nicht deployed

export default function BugButton({ lang }: { lang: Lang }) {
  const t = ui[lang];
  const [open, setOpen] = useState(false);
  const [text, setText] = useState('');
  const [sent, setSent] = useState(false);

  const send = async () => {
    if (API_URL) {
      const ok = await apiPost('/v1/bug', {
        message: text,
        page: window.location.pathname,
        lang,
      });
      if (ok) {
        setSent(true);
        setText('');
        setTimeout(() => {
          setSent(false);
          setOpen(false);
        }, 1600);
        return;
      }
    }
    const subject = encodeURIComponent('[promptgarden] Bug/Feedback');
    const body = encodeURIComponent(`${text}\n\n— Seite: ${window.location.href}`);
    window.location.href = `mailto:${BUG_MAIL}?subject=${subject}&body=${body}`;
    setOpen(false);
    setText('');
  };

  return (
    <>
      <button
        className="btn secondary"
        style={{ position: 'fixed', right: 18, bottom: 18, zIndex: 50 }}
        onClick={() => setOpen(true)}
      >
        {t.bugBtn}
      </button>
      {open && (
        <div className="modal-back" onClick={() => setOpen(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            {sent ? (
              <p style={{ margin: 0, fontWeight: 800, fontSize: 18 }}>🌱 {lang === 'de' ? 'Danke! Die Loop liest das.' : 'Thanks! The loop will read it.'}</p>
            ) : (
              <>
            <h3 style={{ margin: '0 0 10px', fontSize: 20, fontWeight: 800 }}>{t.bugTitle}</h3>
            <textarea
              className="field"
              placeholder={t.bugPlaceholder}
              value={text}
              onChange={(e) => setText(e.target.value)}
              autoFocus
            />
            <div style={{ display: 'flex', gap: 10, marginTop: 14 }}>
              <button className="btn" onClick={send} disabled={!text.trim()}>
                {t.bugSend}
              </button>
              <button className="btn secondary" onClick={() => setOpen(false)}>
                {t.close}
              </button>
            </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
