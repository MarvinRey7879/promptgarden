'use client';

import { useEffect, useState } from 'react';
import type { Lang } from '@/lib/i18n';
import { API_URL } from '@/lib/api';

const T: Record<Lang, Record<string, string>> = {
  de: { intro: 'Verbesserungsvorschläge, falsche Fakten, fehlende Themen, Fragen — schreib es hier. Die Loop liest jede Nachricht.', name: 'Name', msg: 'Deine Nachricht…', send: 'Absenden', thanks: 'Danke! Dein Beitrag ist online.', empty: 'Noch keine Beiträge — sei der/die Erste!', err: 'Fehler — bitte später nochmal.', rate: 'Zu viele Beiträge — warte kurz.', offline: 'Forum lädt nicht (Backend offline?).' },
  en: { intro: 'Suggestions, wrong facts, missing topics, questions — write it here. The loop reads every message.', name: 'Name', msg: 'Your message…', send: 'Post', thanks: 'Thanks! Your post is live.', empty: 'No posts yet — be the first!', err: 'Error — please try again later.', rate: 'Too many posts — wait a bit.', offline: 'Forum not loading (backend offline?).' },
  es: { intro: 'Sugerencias, datos incorrectos, temas que faltan, preguntas — escríbelo aquí. El loop lee cada mensaje.', name: 'Nombre', msg: 'Tu mensaje…', send: 'Publicar', thanks: '¡Gracias! Tu publicación está en línea.', empty: 'Aún no hay publicaciones — ¡sé el primero!', err: 'Error — inténtalo más tarde.', rate: 'Demasiadas publicaciones — espera un poco.', offline: 'El foro no carga.' },
  fr: { intro: 'Suggestions, erreurs factuelles, sujets manquants, questions — écris-le ici. La loop lit chaque message.', name: 'Nom', msg: 'Ton message…', send: 'Publier', thanks: 'Merci ! Ton message est en ligne.', empty: 'Pas encore de messages — sois le premier !', err: 'Erreur — réessaie plus tard.', rate: 'Trop de messages — attends un peu.', offline: 'Le forum ne charge pas.' },
  zh: { intro: '改进建议、错误事实、缺失主题、问题——写在这里。Loop 会阅读每条消息。', name: '名字', msg: '你的留言…', send: '发布', thanks: '谢谢！你的帖子已上线。', empty: '还没有帖子——来发第一条吧！', err: '出错了——请稍后再试。', rate: '发帖太频繁——请稍等。', offline: '论坛加载失败。' },
};

type Post = { id: number; created_at: string; name: string; message: string; lang?: string };

export default function ForumBoard({ lang }: { lang: Lang }) {
  const t = T[lang];
  const [posts, setPosts] = useState<Post[] | null>(null);
  const [name, setName] = useState('');
  const [msg, setMsg] = useState('');
  const [state, setState] = useState<'idle' | 'sending' | 'sent' | 'error' | 'rate'>('idle');

  const load = async () => {
    try {
      const res = await fetch(`${API_URL}/v1/forum`);
      const data = await res.json();
      setPosts(data.posts ?? []);
    } catch {
      setPosts(null);
    }
  };

  useEffect(() => {
    if (API_URL) load();
  }, []);

  const send = async () => {
    setState('sending');
    try {
      const res = await fetch(`${API_URL}/v1/forum`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, message: msg, lang }),
      });
      if (res.status === 429) return setState('rate');
      if (!res.ok) return setState('error');
      setMsg('');
      setState('sent');
      load();
      setTimeout(() => setState('idle'), 2500);
    } catch {
      setState('error');
    }
  };

  if (!API_URL) return <p>{t.offline}</p>;

  return (
    <div>
      <p style={{ margin: '0 0 20px', color: 'var(--muted)', fontSize: 15, maxWidth: 620, lineHeight: 1.55 }}>
        {t.intro}
      </p>

      <div className="card" style={{ padding: '18px 22px', marginBottom: 28, background: 'var(--lime)' }}>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <input
            className="field"
            style={{ maxWidth: 200 }}
            placeholder={t.name}
            value={name}
            maxLength={40}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <textarea
          className="field"
          style={{ marginTop: 10 }}
          placeholder={t.msg}
          value={msg}
          maxLength={1500}
          onChange={(e) => setMsg(e.target.value)}
        />
        <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginTop: 10 }}>
          <button
            className="btn"
            onClick={send}
            disabled={state === 'sending' || name.trim().length < 2 || msg.trim().length < 5}
          >
            {t.send}
          </button>
          {state === 'sent' && <span style={{ fontWeight: 700, fontSize: 13.5 }}>🌱 {t.thanks}</span>}
          {state === 'error' && <span style={{ fontWeight: 700, fontSize: 13.5, color: 'var(--accent)' }}>{t.err}</span>}
          {state === 'rate' && <span style={{ fontWeight: 700, fontSize: 13.5, color: 'var(--accent)' }}>{t.rate}</span>}
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 14, paddingBottom: 40 }}>
        {posts === null && <p className="mono" style={{ fontSize: 12, color: 'var(--muted)' }}>…</p>}
        {posts?.length === 0 && <p style={{ color: 'var(--muted)' }}>{t.empty}</p>}
        {posts?.map((p) => (
          <div key={p.id} className="card" style={{ padding: '14px 18px', boxShadow: '3px 3px 0 var(--ink)' }}>
            <p style={{ margin: '0 0 4px' }}>
              <b style={{ fontSize: 14.5 }}>{p.name}</b>{' '}
              <span className="mono" style={{ fontSize: 10.5, color: 'var(--muted)' }}>
                {p.created_at} UTC{p.lang ? ` · ${p.lang}` : ''}
              </span>
            </p>
            <p style={{ margin: 0, fontSize: 14.5, lineHeight: 1.55, whiteSpace: 'pre-wrap' }}>{p.message}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
