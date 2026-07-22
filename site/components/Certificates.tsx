'use client';

import { useEffect, useState } from 'react';
import { loadProgress, PROGRESS_EVENT } from '@/lib/progress';
import type { Lang } from '@/lib/i18n';

/**
 * Abschluss-Zertifikat (Ideen-Runde 5): sobald alle Kapitel einer Welt erledigt
 * sind (localStorage-Fortschritt), gibt es ein teilbares SVG-Zertifikat zum
 * Herunterladen (PNG) und Teilen. Rein clientseitig, kein Server.
 */
export type CertWorld = { key: string; name: string; chapters: { slug: string; xp: number }[] };

const T: Record<Lang, {
  heading: string; cert: string; completed: string; chapters: string; on: string;
  download: string; share: string; hint: (n: number, total: number) => string; done: string;
}> = {
  de: { heading: '🎓 Deine Zertifikate', cert: 'Zertifikat', completed: 'Welt abgeschlossen', chapters: 'Kapitel', on: 'Am', download: '⬇ PNG herunterladen', share: '🔗 Teilen', hint: (n, total) => `${n}/${total} Welten abgeschlossen — schließe alle Kapitel einer Welt ab, um dein Zertifikat zu erhalten.`, done: 'geschafft' },
  en: { heading: '🎓 Your certificates', cert: 'Certificate', completed: 'World completed', chapters: 'chapters', on: 'On', download: '⬇ Download PNG', share: '🔗 Share', hint: (n, total) => `${n}/${total} worlds completed — finish every chapter in a world to earn your certificate.`, done: 'done' },
  es: { heading: '🎓 Tus certificados', cert: 'Certificado', completed: 'Mundo completado', chapters: 'capítulos', on: 'El', download: '⬇ Descargar PNG', share: '🔗 Compartir', hint: (n, total) => `${n}/${total} mundos completados — termina todos los capítulos de un mundo para obtener tu certificado.`, done: 'hecho' },
  fr: { heading: '🎓 Tes certificats', cert: 'Certificat', completed: 'Monde terminé', chapters: 'chapitres', on: 'Le', download: '⬇ Télécharger PNG', share: '🔗 Partager', hint: (n, total) => `${n}/${total} mondes terminés — termine tous les chapitres d’un monde pour obtenir ton certificat.`, done: 'terminé' },
  zh: { heading: '🎓 你的证书', cert: '证书', completed: '世界已完成', chapters: '章', on: '日期', download: '⬇ 下载 PNG', share: '🔗 分享', hint: (n, total) => `已完成 ${n}/${total} 个世界——完成一个世界的所有章节即可获得证书。`, done: '完成' },
};

function esc(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function buildSvg(worldTitle: string, chapterCount: number, xp: number, date: string, t: (typeof T)[Lang]): string {
  const title = esc(worldTitle);
  const titleSize = worldTitle.length > 30 ? 30 : 40;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630" font-family="Georgia, 'Times New Roman', serif">
  <rect width="1200" height="630" fill="#fdf6ec"/>
  <rect x="28" y="28" width="1144" height="574" fill="none" stroke="#2b2118" stroke-width="9" rx="26"/>
  <rect x="28" y="28" width="1144" height="18" fill="#c9e265"/>
  <text x="80" y="128" font-size="30" font-weight="700" fill="#2b2118">promptgarten</text>
  <text x="80" y="232" font-size="58" font-weight="800" fill="#2b2118">${esc(t.cert)}</text>
  <line x1="80" y1="262" x2="540" y2="262" stroke="#c9e265" stroke-width="7"/>
  <text x="80" y="${titleSize > 34 ? 348 : 344}" font-size="${titleSize}" font-weight="700" fill="#2b2118">${title}</text>
  <text x="80" y="428" font-size="26" fill="#6b5d4a">${esc(t.completed)}</text>
  <text x="80" y="498" font-size="26" fill="#6b5d4a">${chapterCount} ${esc(t.chapters)}  ·  +${xp} XP</text>
  <text x="80" y="556" font-size="22" fill="#6b5d4a">${esc(t.on)} ${esc(date)}</text>
  <circle cx="1040" cy="470" r="92" fill="#c9e265" stroke="#2b2118" stroke-width="7"/>
  <path d="M998 470 l28 30 l58 -66" fill="none" stroke="#2b2118" stroke-width="12" stroke-linecap="round" stroke-linejoin="round"/>
  <text x="1040" y="600" font-size="18" fill="#6b5d4a" text-anchor="middle">promptgarten.com</text>
</svg>`;
}

function toDataUrl(svg: string): string {
  return 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svg)));
}

async function svgToPngBlob(svg: string): Promise<Blob | null> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const c = document.createElement('canvas');
      c.width = 1200; c.height = 630;
      const ctx = c.getContext('2d');
      if (!ctx) { resolve(null); return; }
      ctx.drawImage(img, 0, 0);
      c.toBlob((b) => resolve(b), 'image/png');
    };
    img.onerror = () => resolve(null);
    img.src = toDataUrl(svg);
  });
}

export default function Certificates({ lang, worlds }: { lang: Lang; worlds: CertWorld[] }) {
  const t = T[lang] ?? T.de;
  const [doneKeys, setDoneKeys] = useState<string[]>([]);
  const [date, setDate] = useState('');

  useEffect(() => {
    const compute = () => {
      const p = loadProgress();
      const done = new Set(p.completed);
      setDoneKeys(worlds.filter((w) => w.chapters.length > 0 && w.chapters.every((c) => done.has(c.slug))).map((w) => w.key));
      setDate(p.lastVisit || new Date().toISOString().slice(0, 10));
    };
    compute();
    window.addEventListener(PROGRESS_EVENT, compute);
    window.addEventListener('storage', compute);
    return () => {
      window.removeEventListener(PROGRESS_EVENT, compute);
      window.removeEventListener('storage', compute);
    };
  }, [worlds]);

  const earned = worlds.filter((w) => doneKeys.includes(w.key));

  const download = async (w: CertWorld) => {
    const xp = w.chapters.reduce((s, c) => s + c.xp, 0);
    const svg = buildSvg(w.name, w.chapters.length, xp, date, t);
    const blob = await svgToPngBlob(svg);
    if (!blob) return;
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `promptgarten-zertifikat-${w.key}.png`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 4000);
  };

  const share = async (w: CertWorld) => {
    const xp = w.chapters.reduce((s, c) => s + c.xp, 0);
    const svg = buildSvg(w.name, w.chapters.length, xp, date, t);
    const blob = await svgToPngBlob(svg);
    const nav = navigator as Navigator & { canShare?: (d: unknown) => boolean };
    if (blob && typeof navigator.share === 'function') {
      const file = new File([blob], `promptgarten-zertifikat-${w.key}.png`, { type: 'image/png' });
      if (!nav.canShare || nav.canShare({ files: [file] })) {
        try { await navigator.share({ files: [file], title: `${t.cert} — ${w.name}`, text: 'promptgarten.com' }); return; } catch { /* abgebrochen */ }
      }
    }
    download(w);
  };

  return (
    <div style={{ margin: '30px 0' }}>
      <p className="kicker" style={{ marginBottom: 12 }}>{t.heading}</p>
      {earned.length === 0 ? (
        <p style={{ fontSize: 14, color: 'var(--muted)', lineHeight: 1.5 }}>{t.hint(doneKeys.length, worlds.length)}</p>
      ) : (
        <div style={{ display: 'grid', gap: 18 }}>
          {earned.map((w) => {
            const xp = w.chapters.reduce((s, c) => s + c.xp, 0);
            const svg = buildSvg(w.name, w.chapters.length, xp, date, t);
            return (
              <div key={w.key} className="card" style={{ padding: 16, background: '#fff', boxShadow: '5px 5px 0 var(--ink)' }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={toDataUrl(svg)} alt={`${t.cert} — ${w.name}`} style={{ width: '100%', height: 'auto', border: '2px solid var(--ink)', borderRadius: 10, display: 'block' }} />
                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 12 }}>
                  <button className="btn" style={{ fontSize: 13.5 }} onClick={() => download(w)}>{t.download}</button>
                  <button className="btn secondary" style={{ fontSize: 13.5 }} onClick={() => share(w)}>{t.share}</button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
