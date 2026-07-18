'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { levelEmoji, loadProgress, type Progress } from '@/lib/progress';
import type { Lang } from '@/lib/i18n';

export type WorldMeta = { id: string; label: string; slugs: string[] };
export type EntryMeta = { slug: string; title: string; category: string; difficulty: number };

const DICT: Record<Lang, {
  xp: string; streak: string; days: string; done: string; of: string;
  worlds: string; curve: string; curveEmpty: string; challenge: string; challengeEmpty: string;
  cats: Record<string, string>; catTitle: string; share: string; shared: string;
  empty: string; emptyCta: string; local: string; best: string; avg: string; points: string;
}> = {
  de: {
    xp: 'XP gesammelt', streak: 'Tage-Streak', days: 'Tage', done: 'Kapitel erledigt', of: 'von',
    worlds: 'Fortschritt nach Welten', curve: 'Deine XP-Kurve', curveEmpty: 'Die Kurve entsteht ab heute — pro Tag ein Punkt, sobald du Kapitel abschließt.',
    challenge: 'Tages-Challenge', challengeEmpty: 'Noch keine Challenge gespielt. Fünf Fragen, jeden Tag neu.',
    cats: { begriff: 'Begriffe', konzept: 'Konzepte', guide: 'Anleitungen', 'prompt-pattern': 'Prompt-Muster' },
    catTitle: 'Was du gelernt hast', share: '📸 Als Bild speichern', shared: '✓ Bild gespeichert',
    empty: 'Noch kein Fortschritt gespeichert.', emptyCta: 'Erstes Kapitel öffnen',
    local: 'Alles steht nur in diesem Browser — nichts wird hochgeladen.',
    best: 'Bestes Ergebnis', avg: 'Schnitt', points: 'Punkte',
  },
  en: {
    xp: 'XP earned', streak: 'day streak', days: 'days', done: 'chapters done', of: 'of',
    worlds: 'Progress by world', curve: 'Your XP curve', curveEmpty: 'The curve starts today — one point per day as you finish chapters.',
    challenge: 'Daily challenge', challengeEmpty: 'No challenge played yet. Five questions, new every day.',
    cats: { begriff: 'Terms', konzept: 'Concepts', guide: 'Guides', 'prompt-pattern': 'Prompt patterns' },
    catTitle: 'What you have learned', share: '📸 Save as image', shared: '✓ Image saved',
    empty: 'No progress saved yet.', emptyCta: 'Open your first chapter',
    local: 'Everything lives in this browser only — nothing is uploaded.',
    best: 'Best score', avg: 'Average', points: 'points',
  },
  es: {
    xp: 'XP conseguidos', streak: 'días seguidos', days: 'días', done: 'capítulos completados', of: 'de',
    worlds: 'Progreso por mundo', curve: 'Tu curva de XP', curveEmpty: 'La curva empieza hoy: un punto por día a medida que completes capítulos.',
    challenge: 'Reto diario', challengeEmpty: 'Aún no has jugado ningún reto. Cinco preguntas, nuevas cada día.',
    cats: { begriff: 'Términos', konzept: 'Conceptos', guide: 'Guías', 'prompt-pattern': 'Patrones de prompt' },
    catTitle: 'Lo que has aprendido', share: '📸 Guardar como imagen', shared: '✓ Imagen guardada',
    empty: 'Todavía no hay progreso guardado.', emptyCta: 'Abrir el primer capítulo',
    local: 'Todo se queda en este navegador: no se sube nada.',
    best: 'Mejor resultado', avg: 'Media', points: 'puntos',
  },
  fr: {
    xp: 'XP gagnés', streak: 'jours d’affilée', days: 'jours', done: 'chapitres terminés', of: 'sur',
    worlds: 'Progression par monde', curve: 'Ta courbe d’XP', curveEmpty: 'La courbe démarre aujourd’hui : un point par jour, au fil des chapitres terminés.',
    challenge: 'Défi du jour', challengeEmpty: 'Aucun défi joué pour l’instant. Cinq questions, renouvelées chaque jour.',
    cats: { begriff: 'Termes', konzept: 'Concepts', guide: 'Guides', 'prompt-pattern': 'Modèles de prompt' },
    catTitle: 'Ce que tu as appris', share: '📸 Enregistrer en image', shared: '✓ Image enregistrée',
    empty: 'Aucune progression enregistrée pour l’instant.', emptyCta: 'Ouvrir le premier chapitre',
    local: 'Tout reste dans ce navigateur — rien n’est envoyé.',
    best: 'Meilleur score', avg: 'Moyenne', points: 'points',
  },
  zh: {
    xp: '已获得 XP', streak: '连续天数', days: '天', done: '已完成章节', of: '/',
    worlds: '各世界进度', curve: '你的 XP 曲线', curveEmpty: '曲线从今天开始——每完成章节，每天记录一个点。',
    challenge: '每日挑战', challengeEmpty: '还没有玩过挑战。每天五道新题。',
    cats: { begriff: '术语', konzept: '概念', guide: '指南', 'prompt-pattern': '提示词范式' },
    catTitle: '你学到了什么', share: '📸 保存为图片', shared: '✓ 图片已保存',
    empty: '还没有保存任何进度。', emptyCta: '打开第一章',
    local: '所有数据只保存在这个浏览器里——不会上传。',
    best: '最好成绩', avg: '平均', points: '分',
  },
};

const CAT_COLORS: Record<string, string> = {
  begriff: 'var(--blue)',
  konzept: 'var(--lime)',
  guide: 'var(--yellow)',
  'prompt-pattern': 'var(--pink)',
};

function loadChallenge(): Record<string, number> {
  try {
    const raw = localStorage.getItem('pg_challenge_v1');
    if (!raw) return {};
    const v = JSON.parse(raw);
    return v && typeof v === 'object' ? v : {};
  } catch {
    return {};
  }
}

/** Kleine SVG-Linie aus [{x,y}] normalisiert auf die Box. */
function polyline(values: number[], w: number, h: number, pad = 6): string {
  if (values.length < 2) return '';
  const max = Math.max(...values, 1);
  const stepX = (w - pad * 2) / (values.length - 1);
  return values
    .map((v, i) => `${(pad + i * stepX).toFixed(1)},${(h - pad - (v / max) * (h - pad * 2)).toFixed(1)}`)
    .join(' ');
}

export default function Fortschritt({ lang, worlds, entries }: { lang: Lang; worlds: WorldMeta[]; entries: EntryMeta[] }) {
  const t = DICT[lang];
  const [p, setP] = useState<Progress | null>(null);
  const [challenge, setChallenge] = useState<Record<string, number>>({});
  const [saved, setSaved] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    setP(loadProgress());
    setChallenge(loadChallenge());
  }, []);

  if (!p) return <p style={{ fontSize: 15, color: 'var(--muted)' }}>…</p>;

  const doneSet = new Set(p.completed);
  const total = entries.length;
  const doneCount = p.completed.length;

  const catCounts: Record<string, number> = {};
  for (const e of entries) if (doneSet.has(e.slug)) catCounts[e.category] = (catCounts[e.category] ?? 0) + 1;

  const histDates = Object.keys(p.history ?? {}).sort();
  const histValues = histDates.map((d) => (p.history ?? {})[d]);
  const chDates = Object.keys(challenge).sort();
  const chValues = chDates.map((d) => challenge[d]);
  const chBest = chValues.length ? Math.max(...chValues) : 0;
  const chAvg = chValues.length ? chValues.reduce((a, b) => a + b, 0) / chValues.length : 0;

  const shareImage = () => {
    const c = canvasRef.current;
    if (!c) return;
    const ctx = c.getContext('2d');
    if (!ctx) return;
    c.width = 1200;
    c.height = 630;
    ctx.fillStyle = '#fdf6ec';
    ctx.fillRect(0, 0, 1200, 630);
    ctx.strokeStyle = '#1a1a1a';
    ctx.lineWidth = 10;
    ctx.strokeRect(20, 20, 1160, 590);
    ctx.fillStyle = '#1a1a1a';
    ctx.font = 'bold 54px system-ui, sans-serif';
    ctx.fillText('promptgarten 🌱', 70, 130);
    ctx.font = 'bold 150px system-ui, sans-serif';
    ctx.fillText(`${levelEmoji(p.xp)} ${p.xp} XP`, 70, 300);
    ctx.font = '44px system-ui, sans-serif';
    ctx.fillText(`${doneCount} ${t.done} ${t.of} ${total}`, 70, 390);
    ctx.fillText(`🔥 ${p.streak} ${t.days}`, 70, 460);
    ctx.font = '32px system-ui, sans-serif';
    ctx.fillStyle = '#6b6257';
    ctx.fillText('promptgarten.com', 70, 550);
    c.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `promptgarten-fortschritt-${p.xp}xp.png`;
      a.click();
      URL.revokeObjectURL(url);
      setSaved(true);
      setTimeout(() => setSaved(false), 2200);
    }, 'image/png');
  };

  if (doneCount === 0 && p.xp === 0 && chValues.length === 0) {
    return (
      <div className="card" style={{ padding: '28px 30px', textAlign: 'center', background: 'var(--yellow)' }}>
        <p style={{ margin: '0 0 16px', fontSize: 17, fontWeight: 700 }}>{t.empty}</p>
        <Link href={`/${lang}/lernpfade/`} className="btn">
          {t.emptyCta} →
        </Link>
      </div>
    );
  }

  return (
    <>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 14, marginBottom: 26 }}>
        {[
          { v: `${levelEmoji(p.xp)} ${p.xp}`, l: t.xp, bg: 'var(--lime)' },
          { v: `🔥 ${p.streak}`, l: t.streak, bg: 'var(--pink)' },
          { v: `${doneCount}/${total}`, l: t.done, bg: 'var(--blue)' },
        ].map((s) => (
          <div key={s.l} className="card" style={{ padding: '16px 18px', background: s.bg, boxShadow: '4px 4px 0 var(--ink)' }}>
            <div style={{ fontSize: 30, fontWeight: 800, letterSpacing: '-.02em' }}>{s.v}</div>
            <div style={{ fontSize: 13, marginTop: 2 }}>{s.l}</div>
          </div>
        ))}
      </div>

      <section style={{ marginBottom: 30 }}>
        <h2 style={{ margin: '0 0 12px', fontSize: 22, fontWeight: 800 }}>{t.worlds}</h2>
        <div style={{ display: 'grid', gap: 10 }}>
          {worlds.map((w) => {
            const done = w.slugs.filter((s) => doneSet.has(s)).length;
            const pct = w.slugs.length ? Math.round((done / w.slugs.length) * 100) : 0;
            return (
              <div key={w.id}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, fontWeight: 700, marginBottom: 4 }}>
                  <span>{w.label}</span>
                  <span className="mono" style={{ fontSize: 13 }}>
                    {done}/{w.slugs.length}
                  </span>
                </div>
                <div style={{ height: 16, border: '2.5px solid var(--ink)', borderRadius: 99, overflow: 'hidden', background: 'var(--card)' }}>
                  <div style={{ width: `${pct}%`, height: '100%', background: 'var(--lime)' }} />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section style={{ marginBottom: 30 }}>
        <h2 style={{ margin: '0 0 12px', fontSize: 22, fontWeight: 800 }}>{t.catTitle}</h2>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          {Object.entries(t.cats).map(([key, label]) => (
            <span key={key} className="chip" style={{ background: CAT_COLORS[key], border: '2.5px solid var(--ink)', fontWeight: 700 }}>
              {label}: {catCounts[key] ?? 0}
            </span>
          ))}
        </div>
      </section>

      <section style={{ marginBottom: 30 }}>
        <h2 style={{ margin: '0 0 12px', fontSize: 22, fontWeight: 800 }}>{t.curve}</h2>
        {histValues.length >= 2 ? (
          <div className="card" style={{ padding: 14, boxShadow: '4px 4px 0 var(--ink)' }}>
            <svg viewBox="0 0 600 160" style={{ width: '100%', height: 'auto', display: 'block' }} role="img" aria-label={t.curve}>
              <polyline points={polyline(histValues, 600, 160)} fill="none" stroke="var(--ink)" strokeWidth="4" strokeLinejoin="round" strokeLinecap="round" />
              <text x="8" y="16" fontSize="13" fill="currentColor" opacity=".6">
                {histValues[histValues.length - 1]} XP
              </text>
            </svg>
          </div>
        ) : (
          <p style={{ fontSize: 14.5, color: 'var(--muted)', margin: 0 }}>{t.curveEmpty}</p>
        )}
      </section>

      <section style={{ marginBottom: 30 }}>
        <h2 style={{ margin: '0 0 12px', fontSize: 22, fontWeight: 800 }}>{t.challenge}</h2>
        {chValues.length ? (
          <div className="card" style={{ padding: 14, boxShadow: '4px 4px 0 var(--ink)' }}>
            <div style={{ display: 'flex', gap: 18, marginBottom: 10, fontSize: 14, fontWeight: 700 }}>
              <span>
                {t.best}: {chBest}/5
              </span>
              <span>
                {t.avg}: {chAvg.toFixed(1)}/5
              </span>
              <span className="mono" style={{ color: 'var(--muted)' }}>
                {chValues.length}× {t.points}
              </span>
            </div>
            <div style={{ display: 'flex', gap: 4, alignItems: 'flex-end', height: 70 }}>
              {chValues.slice(-30).map((v, i) => (
                <div
                  key={i}
                  title={`${chDates.slice(-30)[i]}: ${v}/5`}
                  style={{ flex: 1, height: `${(v / 5) * 100}%`, minHeight: 4, background: v >= 4 ? 'var(--lime)' : v >= 2 ? 'var(--yellow)' : 'var(--pink)', border: '2px solid var(--ink)', borderRadius: 4 }}
                />
              ))}
            </div>
          </div>
        ) : (
          <p style={{ fontSize: 14.5, color: 'var(--muted)', margin: 0 }}>{t.challengeEmpty}</p>
        )}
      </section>

      <button className="btn" onClick={shareImage}>
        {saved ? t.shared : t.share}
      </button>
      <canvas ref={canvasRef} style={{ display: 'none' }} />
      <p style={{ margin: '16px 0 0', fontSize: 13, color: 'var(--muted)' }}>{t.local}</p>
    </>
  );
}
