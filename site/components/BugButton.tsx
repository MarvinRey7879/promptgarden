'use client';

import { useState } from 'react';
import { type Lang, ui } from '@/lib/i18n';

const BUG_MAIL = 'marvin.mez@tm2.ai'; // TODO(It.2): durch Worker-Endpoint ersetzen

export default function BugButton({ lang }: { lang: Lang }) {
  const t = ui[lang];
  const [open, setOpen] = useState(false);
  const [text, setText] = useState('');

  const send = () => {
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
          </div>
        </div>
      )}
    </>
  );
}
