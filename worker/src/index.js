/**
 * promptgarden-api — Cloudflare Worker + D1
 * Endpunkte:
 *   POST /v1/bug        {message, page?, lang?}          — Bug-Report-Button
 *   POST /v1/feedback   {message, page?, lang?}          — Verbesserungsvorschläge (öffentlich)
 *   POST /v1/newsletter {email, lang?}                   — Anmeldung (Double-Opt-in folgt)
 *   POST /v1/track      {path, lang?, ref?}              — cookieless Page-View
 *   POST /v1/admin/note {note, prio?}    [X-Admin-Key]   — Marvins Prio-Feld
 *   GET  /v1/admin/summary               [X-Admin-Key]   — Zähler + offene Notes/Feedback/Bugs
 *   GET  /v1/health
 *
 * Datenschutz: keine IPs, keine User-Agents, keine Cookies gespeichert.
 * Besucher-Zählung: täglich rotierender, nicht rückrechenbarer Hash (Plausible-Prinzip) —
 * Rohwerte (IP/UA) werden nie gespeichert. Eigene Aufrufe (Admin-Browser, Bots, Headless)
 * werden mit internal=1 markiert und aus allen Statistiken gefiltert.
 */

const MAX_LEN = { message: 4000, note: 4000, email: 254, path: 300, page: 300 };

// Forum-Spam-Schutz: Basisliste böser Wörter (DE/EN, bewusst konservativ — Moderation via /admin)
const BAD_WORDS = [
  'hurensohn', 'fotze', 'wichser', 'schlampe', 'missgeburt', 'untermensch',
  'nigger', 'faggot', 'retard', 'cunt', 'kys', 'kill yourself',
  'viagra', 'casino bonus', 'porn', 'onlyfans', 'crypto pump', 'earn $', 'gratis geld',
];

function containsBadWord(text) {
  const t = text.toLowerCase();
  return BAD_WORDS.some((w) => t.includes(w));
}

function countLinks(text) {
  return (text.match(/https?:\/\//gi) || []).length;
}

function capsRatio(text) {
  const letters = text.replace(/[^a-zA-ZäöüÄÖÜß]/g, '');
  if (letters.length < 20) return 0;
  const upper = letters.replace(/[^A-ZÄÖÜ]/g, '').length;
  return upper / letters.length;
}

async function hashIp(ip, salt) {
  const data = new TextEncoder().encode(`${salt}:${ip}`);
  const digest = await crypto.subtle.digest('SHA-256', data);
  return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, '0')).join('');
}

function corsHeaders(request, env) {
  const origin = request.headers.get('Origin') || '';
  const allowed = (env.ALLOWED_ORIGINS || '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
  const ok = allowed.includes(origin) || allowed.includes('*');
  return {
    'Access-Control-Allow-Origin': ok ? origin : allowed[0] || '',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, X-Admin-Key',
    'Access-Control-Max-Age': '86400',
    Vary: 'Origin',
  };
}

function json(data, status, cors) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json', ...cors },
  });
}

function clip(s, max) {
  return typeof s === 'string' ? s.slice(0, max) : null;
}

/** Mail via Resend (news.promptgarten.com). Ohne RESEND_API_KEY: no-op (Backfill via Cron, sobald Key da). */
async function sendMail(env, to, subject, html, text) {
  if (!env.RESEND_API_KEY) return false;
  const body = { from: 'promptgarten 🌱 <mail@news.promptgarten.com>', to, subject, html };
  if (text) body.text = text; // Klartext-Variante: bessere Zustellbarkeit, lesbar ohne HTML
  const r = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  return r.ok;
}

/** Pflicht vor jedem Einsetzen von Feed-Inhalten in HTML — Titel enthalten &, <, ' usw. */
function escapeHtml(s) {
  return String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

const TAG_FARBE = { modelle: '#c9e265', tools: '#a8d8f0', mcp: '#f5d565', security: '#f9c5d8', papers: '#e0d4f7' };

/**
 * Wochen-Digest im promptgarten-Look (Marvin 27.07: „kannste gerne schöner machen").
 * E-Mail-tauglich gebaut: Tabellen-Layout, alles inline, keine externen Assets,
 * kein Flexbox/Grid — das überleben auch Outlook und ältere Clients.
 */
export function digestMailHtml(lang, items, unsubUrl, t) {
  const karten = items
    .map((i) => {
      const tag = t.tags?.[i.tag] || i.tag || '';
      const farbe = TAG_FARBE[i.tag] || '#c9e265';
      const quelle = Array.isArray(i.sources) && i.sources[0]?.url ? i.sources[0].url : '';
      return `
      <tr><td style="padding:0 0 14px">
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background:#ffffff;border:2px solid #2b2118;border-radius:14px">
          <tr><td style="padding:16px 18px">
            <table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr>
              <td style="background:${farbe};border:1.5px solid #2b2118;border-radius:7px;padding:1px 9px;font:700 11px/1.6 -apple-system,Segoe UI,sans-serif;color:#2b2118;text-transform:uppercase;letter-spacing:.06em">${escapeHtml(tag)}</td>
              <td style="padding-left:9px;font:400 11.5px/1.6 -apple-system,Segoe UI,sans-serif;color:#7d7064">${escapeHtml(i.date || '')}</td>
            </tr></table>
            <p style="margin:9px 0 5px;font:800 16px/1.35 -apple-system,Segoe UI,sans-serif;color:#2b2118">${escapeHtml(i.title)}</p>
            <p style="margin:0;font:400 14px/1.6 -apple-system,Segoe UI,sans-serif;color:#4a4038">${escapeHtml(i.summary)}</p>
            ${quelle ? `<p style="margin:9px 0 0"><a href="${escapeHtml(quelle)}" style="font:600 12.5px/1.5 -apple-system,Segoe UI,sans-serif;color:#e8613c;text-decoration:underline">${escapeHtml(t.source)} &rarr;</a></p>` : ''}
          </td></tr>
        </table>
      </td></tr>`;
    })
    .join('');

  return `<!doctype html><html lang="${escapeHtml(lang)}"><head><meta charset="utf-8"><meta name="color-scheme" content="light"></head>
<body style="margin:0;padding:0;background:#fdf6ec">
<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background:#fdf6ec">
  <tr><td align="center" style="padding:26px 14px 40px">
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="max-width:600px">
      <tr><td style="padding:0 2px 18px">
        <p style="margin:0;font:800 22px/1.2 -apple-system,Segoe UI,sans-serif;color:#2b2118">prompt<span style="color:#e8613c">garten</span> 🌱</p>
        <p style="margin:6px 0 0;font:700 12px/1.5 -apple-system,Segoe UI,sans-serif;color:#e8613c;text-transform:uppercase;letter-spacing:.1em">${escapeHtml(t.kicker)}</p>
        <p style="margin:6px 0 0;font:400 14.5px/1.6 -apple-system,Segoe UI,sans-serif;color:#7d7064">${escapeHtml(t.intro(items.length))}</p>
      </td></tr>
      ${karten}
      <tr><td align="center" style="padding:8px 0 0">
        <a href="https://promptgarten.com/${escapeHtml(lang)}/feed/" style="display:inline-block;background:#e8613c;color:#ffffff;border:2px solid #2b2118;border-radius:999px;padding:11px 24px;font:800 14px/1 -apple-system,Segoe UI,sans-serif;text-decoration:none">${escapeHtml(t.cta)}</a>
      </td></tr>
      <tr><td style="padding:26px 2px 0;border-top:1px solid rgba(43,33,24,.18)">
        <p style="margin:14px 0 0;font:400 11.5px/1.6 -apple-system,Segoe UI,sans-serif;color:#8a7d70">${escapeHtml(t.why)}</p>
        <p style="margin:8px 0 0;font:400 11.5px/1.6 -apple-system,Segoe UI,sans-serif;color:#8a7d70">
          <a href="https://promptgarten.com/${escapeHtml(lang)}/" style="color:#8a7d70">promptgarten.com</a> &nbsp;·&nbsp;
          <a href="${escapeHtml(unsubUrl)}" style="color:#8a7d70">${escapeHtml(t.unsub)}</a>
        </p>
      </td></tr>
    </table>
  </td></tr>
</table>
</body></html>`;
}

/** Klartext-Variante derselben Mail. */
export function digestMailText(lang, items, unsubUrl, t) {
  const zeilen = items
    .map((i) => {
      const q = Array.isArray(i.sources) && i.sources[0]?.url ? `\n  ${t.source}: ${i.sources[0].url}` : '';
      return `[${t.tags?.[i.tag] || i.tag}] ${i.date}\n${i.title}\n${i.summary}${q}`;
    })
    .join('\n\n');
  return `promptgarten — ${t.kicker}\n${t.intro(items.length)}\n\n${zeilen}\n\n${t.cta}: https://promptgarten.com/${lang}/feed/\n\n${t.why}\n${t.unsub}: ${unsubUrl}`;
}

const MAIL_TXT = {
  de: { confirmSub: 'Bitte bestätige deine Anmeldung — promptgarten', confirm: 'Klick zum Bestätigen deiner Newsletter-Anmeldung:', confirmBtn: 'Anmeldung bestätigen', digestSub: 'Deine KI-Woche — promptgarten', unsub: 'Abmelden',
    kicker: 'Deine KI-Woche', intro: (n) => `${n} ${n === 1 ? 'Meldung' : 'Meldungen'} aus der Welt der Coding-Agenten — jede mit Quelle.`, cta: 'Alle Meldungen ansehen', source: 'Quelle', why: 'Du bekommst diese Mail, weil du dich auf promptgarten.com für den Newsletter angemeldet und die Anmeldung bestätigt hast.',
    tags: { modelle: 'Modelle', tools: 'Tools', mcp: 'MCP', security: 'Sicherheit', papers: 'Papers' } },
  en: { confirmSub: 'Please confirm your signup — promptgarten', confirm: 'Click to confirm your newsletter signup:', confirmBtn: 'Confirm signup', digestSub: 'Your AI week — promptgarten', unsub: 'Unsubscribe',
    kicker: 'Your AI week', intro: (n) => `${n} ${n === 1 ? 'story' : 'stories'} from the world of coding agents — each one sourced.`, cta: 'See all stories', source: 'Source', why: 'You are getting this because you signed up for the newsletter on promptgarten.com and confirmed your address.',
    tags: { modelle: 'Models', tools: 'Tools', mcp: 'MCP', security: 'Security', papers: 'Papers' } },
  es: { confirmSub: 'Confirma tu suscripción — promptgarten', confirm: 'Haz clic para confirmar tu suscripción:', confirmBtn: 'Confirmar', digestSub: 'Tu semana de IA — promptgarten', unsub: 'Darse de baja',
    kicker: 'Tu semana de IA', intro: (n) => `${n} ${n === 1 ? 'noticia' : 'noticias'} del mundo de los agentes de programación — cada una con su fuente.`, cta: 'Ver todas las noticias', source: 'Fuente', why: 'Recibes este correo porque te suscribiste al boletín en promptgarten.com y confirmaste tu dirección.',
    tags: { modelle: 'Modelos', tools: 'Herramientas', mcp: 'MCP', security: 'Seguridad', papers: 'Papers' } },
  fr: { confirmSub: 'Confirme ton inscription — promptgarten', confirm: 'Clique pour confirmer ton inscription :', confirmBtn: 'Confirmer', digestSub: 'Ta semaine IA — promptgarten', unsub: 'Se désinscrire',
    kicker: 'Ta semaine IA', intro: (n) => `${n} ${n === 1 ? 'actualité' : 'actualités'} du monde des agents de code — chacune sourcée.`, cta: 'Voir toutes les actualités', source: 'Source', why: 'Tu reçois cet e-mail parce que tu t’es inscrit à la newsletter sur promptgarten.com et que tu as confirmé ton adresse.',
    tags: { modelle: 'Modèles', tools: 'Outils', mcp: 'MCP', security: 'Sécurité', papers: 'Papers' } },
  zh: { confirmSub: '请确认订阅 — promptgarten', confirm: '点击确认你的订阅：', confirmBtn: '确认订阅', digestSub: '你的 AI 一周 — promptgarten', unsub: '退订',
    kicker: '你的 AI 一周', intro: (n) => `${n} 条来自编程智能体领域的消息——每条都附出处。`, cta: '查看全部消息', source: '来源', why: '你收到这封邮件，是因为你在 promptgarten.com 订阅了新闻通讯并确认了邮箱地址。',
    tags: { modelle: '模型', tools: '工具', mcp: 'MCP', security: '安全', papers: '论文' } },
};
const mailT = (lang) => MAIL_TXT[lang] || MAIL_TXT.de;
const API_BASE = 'https://promptgarden-api.promptgarden.workers.dev';

function confirmMailHtml(lang, token) {
  const t = mailT(lang);
  const link = `${API_BASE}/v1/newsletter/confirm?token=${token}`;
  return `<div style="font-family:sans-serif;max-width:480px"><p>${t.confirm}</p><p><a href="${link}" style="background:#e8613c;color:#fff;padding:10px 22px;border-radius:99px;text-decoration:none;font-weight:bold">${t.confirmBtn} 🌱</a></p><p style="color:#888;font-size:12px">${link}</p></div>`;
}

function isEmail(s) {
  return typeof s === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(s) && s.length <= MAX_LEN.email;
}

export default {
  async fetch(request, env) {
    const cors = corsHeaders(request, env);
    if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: cors });

    const url = new URL(request.url);
    const path = url.pathname;

    try {
      if (request.method === 'GET' && path === '/v1/health') {
        return json({ ok: true, service: 'promptgarden-api' }, 200, cors);
      }

      if (request.method === 'GET' && (path === '/v1/newsletter/confirm' || path === '/v1/newsletter/unsubscribe')) {
        const token = url.searchParams.get('token') || '';
        if (!/^[a-f0-9-]{36}$/.test(token)) return new Response('Invalid token', { status: 400 });
        const row = await env.DB.prepare('SELECT id, lang FROM newsletter_signups WHERE token = ?').bind(token).first();
        if (!row) return new Response('Unknown token', { status: 404 });
        const back = `https://promptgarten.com/${['de','en','es','fr','zh'].includes(row.lang) ? row.lang : 'de'}/`;
        if (path === '/v1/newsletter/confirm') {
          await env.DB.prepare('UPDATE newsletter_signups SET confirmed = 1 WHERE id = ?').bind(row.id).run();
          return new Response(`<!doctype html><meta charset="utf-8"><meta http-equiv="refresh" content="3;url=${back}"><body style="font-family:sans-serif;text-align:center;padding-top:15vh;background:#fdf6ec"><h1>✅ 🌱</h1><p>OK — Newsletter aktiv. / Signup confirmed.</p><a href="${back}">promptgarten.com</a></body>`, { headers: { 'Content-Type': 'text/html; charset=utf-8' } });
        }
        await env.DB.prepare('DELETE FROM newsletter_signups WHERE id = ?').bind(row.id).run();
        return new Response(`<!doctype html><meta charset="utf-8"><body style="font-family:sans-serif;text-align:center;padding-top:15vh;background:#fdf6ec"><h1>👋</h1><p>Abgemeldet. / Unsubscribed.</p><a href="${back}">promptgarten.com</a></body>`, { headers: { 'Content-Type': 'text/html; charset=utf-8' } });
      }

      if (request.method === 'GET' && path === '/v1/forum') {
        const posts = await env.DB.prepare(
          "SELECT id, created_at, name, message, lang FROM forum_posts WHERE status='visible' ORDER BY id DESC LIMIT 100",
        ).all();
        return json({ posts: posts.results }, 200, cors);
      }

      const isAdmin = (request.headers.get('X-Admin-Key') || '') === env.ADMIN_KEY && !!env.ADMIN_KEY;

      if (request.method === 'GET' && path === '/v1/admin/summary') {
        if (!isAdmin) return json({ error: 'unauthorized' }, 401, cors);
        const [bugs, feedback, notes, signups, views, topPaths, forumRecent, forumBlocked, todos, viewsByDay, viewsByLang, viewsByCountry, topRefs, viewsTotal, signupsRecent, donations, revenue, visitors7d, internal7d] = await Promise.all([
          env.DB.prepare("SELECT * FROM bug_reports WHERE status='open' ORDER BY id DESC LIMIT 50").all(),
          env.DB.prepare("SELECT * FROM feedback WHERE status='new' ORDER BY id DESC LIMIT 50").all(),
          env.DB.prepare("SELECT * FROM admin_notes WHERE status='open' ORDER BY prio, id DESC LIMIT 50").all(),
          env.DB.prepare('SELECT COUNT(*) AS n FROM newsletter_signups').first(),
          env.DB.prepare("SELECT COUNT(*) AS n FROM page_views WHERE internal=0 AND day >= date('now','-7 day')").first(),
          env.DB.prepare(
            "SELECT path, COUNT(*) AS n, COUNT(DISTINCT visitor) AS u FROM page_views WHERE internal=0 AND day >= date('now','-7 day') GROUP BY path ORDER BY n DESC LIMIT 30",
          ).all(),
          env.DB.prepare('SELECT id, created_at, name, message, lang, status FROM forum_posts ORDER BY id DESC LIMIT 20').all(),
          env.DB.prepare("SELECT COUNT(*) AS n FROM forum_posts WHERE status='blocked'").first(),
          env.DB.prepare('SELECT * FROM marvin_todos ORDER BY done, id DESC LIMIT 50').all(),
          env.DB.prepare(
            "SELECT day, COUNT(*) AS n, COUNT(DISTINCT visitor) AS u FROM page_views WHERE internal=0 AND day >= date('now','-30 day') GROUP BY day ORDER BY day",
          ).all(),
          env.DB.prepare(
            "SELECT COALESCE(lang,'?') AS lang, COUNT(*) AS n FROM page_views WHERE internal=0 AND day >= date('now','-7 day') GROUP BY lang ORDER BY n DESC",
          ).all(),
          env.DB.prepare(
            "SELECT COALESCE(country,'?') AS country, COUNT(*) AS n FROM page_views WHERE internal=0 AND day >= date('now','-7 day') GROUP BY country ORDER BY n DESC LIMIT 12",
          ).all(),
          env.DB.prepare(
            "SELECT ref_host, COUNT(*) AS n FROM page_views WHERE internal=0 AND day >= date('now','-7 day') AND ref_host IS NOT NULL AND ref_host NOT LIKE '%promptgart%' GROUP BY ref_host ORDER BY n DESC LIMIT 10",
          ).all(),
          env.DB.prepare('SELECT COUNT(*) AS n FROM page_views WHERE internal=0').first(),
          env.DB.prepare('SELECT id, created_at, email FROM newsletter_signups ORDER BY id DESC LIMIT 20').all(),
          env.DB.prepare('SELECT * FROM donations ORDER BY id DESC LIMIT 20').all(),
          env.DB.prepare('SELECT COALESCE(SUM(amount_cents),0) AS cents, COUNT(*) AS n FROM donations').first(),
          env.DB.prepare(
            "SELECT COUNT(DISTINCT visitor) AS n FROM page_views WHERE internal=0 AND visitor IS NOT NULL AND day >= date('now','-7 day')",
          ).first(),
          env.DB.prepare("SELECT COUNT(*) AS n FROM page_views WHERE internal=1 AND day >= date('now','-7 day')").first(),
        ]);
        return json(
          {
            open_bugs: bugs.results,
            new_feedback: feedback.results,
            open_admin_notes: notes.results,
            newsletter_count: signups?.n ?? 0,
            views_7d: views?.n ?? 0,
            top_paths_7d: topPaths.results,
            forum_recent: forumRecent.results,
            forum_blocked_count: forumBlocked?.n ?? 0,
            marvin_todos: todos.results,
            views_by_day: viewsByDay.results,
            views_by_lang: viewsByLang.results,
            views_by_country: viewsByCountry.results,
            top_refs: topRefs.results,
            views_total: viewsTotal?.n ?? 0,
            newsletter_recent: signupsRecent.results,
            donations: donations.results,
            revenue_total_cents: revenue?.cents ?? 0,
            revenue_count: revenue?.n ?? 0,
            visitors_7d: visitors7d?.n ?? 0,
            views_internal_7d: internal7d?.n ?? 0,
          },
          200,
          cors,
        );
      }

      if (request.method !== 'POST') return json({ error: 'method not allowed' }, 405, cors);

      let body;
      try {
        body = await request.json();
      } catch {
        return json({ error: 'invalid json' }, 400, cors);
      }

      // Honeypot: echte Nutzer füllen "website" nie aus
      if (body.website) return json({ ok: true }, 200, cors);

      if (path === '/v1/bug' || path === '/v1/feedback') {
        const message = clip(body.message, MAX_LEN.message);
        if (!message || !message.trim()) return json({ error: 'message required' }, 400, cors);
        const table = path === '/v1/bug' ? 'bug_reports' : 'feedback';
        await env.DB.prepare(`INSERT INTO ${table} (message, page, lang) VALUES (?, ?, ?)`)
          .bind(message.trim(), clip(body.page, MAX_LEN.page), clip(body.lang, 8))
          .run();
        return json({ ok: true }, 201, cors);
      }

      if (path === '/v1/newsletter') {
        if (!isEmail(body.email)) return json({ error: 'invalid email' }, 400, cors);
        const email = body.email.toLowerCase();
        const lang = clip(body.lang, 8);
        const token = crypto.randomUUID();
        await env.DB.prepare(
          'INSERT INTO newsletter_signups (email, lang, token) VALUES (?, ?, ?) ON CONFLICT(email) DO NOTHING',
        )
          .bind(email, lang, token)
          .run();
        // Double-Opt-in-Mail (bei Re-Signup: vorhandenen Token verwenden; ohne Key: Cron-Backfill)
        const row = await env.DB.prepare('SELECT token, confirmed, opt_in_sent FROM newsletter_signups WHERE email = ?').bind(email).first();
        if (row && !row.confirmed) {
          const sent = await sendMail(env, email, mailT(lang).confirmSub, confirmMailHtml(lang, row.token));
          if (sent) await env.DB.prepare('UPDATE newsletter_signups SET opt_in_sent = 1 WHERE email = ?').bind(email).run();
        }
        return json({ ok: true }, 201, cors);
      }

      if (path === '/v1/track') {
        const p = clip(body.path, MAX_LEN.path);
        if (!p || !p.startsWith('/')) return json({ error: 'invalid path' }, 400, cors);
        const day = new Date().toISOString().slice(0, 10);
        const country = request.cf?.country || null;
        let refHost = null;
        try {
          if (body.ref) refHost = new URL(body.ref).hostname.slice(0, 100);
        } catch {
          /* ignorieren — Referrer optional */
        }
        // Unique-Besucher ohne Identifier-Speicherung: täglich rotierender Hash aus
        // Salt+Tag+IP+UA (Plausible-Prinzip) — Rohwerte landen nie in der DB.
        const ua = request.headers.get('User-Agent') || '';
        const ip = request.headers.get('CF-Connecting-IP') || '';
        const visitor = (await hashIp(`${day}:${ip}:${ua}`, env.IP_SALT || 'pg-default')).slice(0, 16);
        // Eigene/automatisierte Aufrufe markieren statt zählen: Admin-Browser sendet
        // internal:true (localStorage-Flag), dazu Bots/Headless/CLI per UA-Heuristik.
        const isInternal =
          body.internal === true ||
          /bot|crawl|spider|headless|playwright|puppeteer|curl|wget|python|node-fetch|axios|lighthouse/i.test(ua);
        await env.DB.prepare(
          'INSERT INTO page_views (day, path, lang, country, ref_host, visitor, internal) VALUES (?, ?, ?, ?, ?, ?, ?)',
        )
          .bind(day, p, clip(body.lang, 8), country, refHost, visitor, isInternal ? 1 : 0)
          .run();
        return json({ ok: true }, 201, cors);
      }

      if (path === '/v1/forum') {
        const name = clip(body.name, 40);
        const message = clip(body.message, 1500);
        if (!name || name.trim().length < 2) return json({ error: 'name too short' }, 400, cors);
        if (!message || message.trim().length < 5) return json({ error: 'message too short' }, 400, cors);

        const ip = request.headers.get('CF-Connecting-IP') || 'unknown';
        const ipHash = await hashIp(ip, env.IP_SALT || 'pg-default');

        // Rate-Limit: max 5 Posts pro Stunde und IP
        const recent = await env.DB.prepare(
          "SELECT COUNT(*) AS n FROM forum_posts WHERE ip_hash = ? AND created_at > datetime('now','-1 hour')",
        )
          .bind(ipHash)
          .first();
        if ((recent?.n ?? 0) >= 5) return json({ error: 'rate limit — try later' }, 429, cors);

        // Duplikat: identische Nachricht derselben IP in letzter Stunde
        const dup = await env.DB.prepare(
          "SELECT COUNT(*) AS n FROM forum_posts WHERE ip_hash = ? AND message = ? AND created_at > datetime('now','-1 hour')",
        )
          .bind(ipHash, message.trim())
          .first();

        // Spam-Heuristiken → still als 'blocked' speichern (Spammer bekommt ok, sieht Post aber nie)
        const isSpam =
          containsBadWord(`${name} ${message}`) ||
          countLinks(message) > 1 ||
          capsRatio(message) > 0.7 ||
          (dup?.n ?? 0) > 0;

        await env.DB.prepare(
          'INSERT INTO forum_posts (name, message, lang, status, ip_hash) VALUES (?, ?, ?, ?, ?)',
        )
          .bind(name.trim(), message.trim(), clip(body.lang, 8), isSpam ? 'blocked' : 'visible', ipHash)
          .run();
        return json({ ok: true }, 201, cors);
      }

      if (path === '/v1/admin/forum') {
        if (!isAdmin) return json({ error: 'unauthorized' }, 401, cors);
        const id = Number(body.id);
        const action = body.action;
        if (!id || !['hide', 'show', 'delete'].includes(action)) {
          return json({ error: 'id + action (hide|show|delete) required' }, 400, cors);
        }
        if (action === 'delete') {
          await env.DB.prepare('DELETE FROM forum_posts WHERE id = ?').bind(id).run();
        } else {
          await env.DB.prepare('UPDATE forum_posts SET status = ? WHERE id = ?')
            .bind(action === 'hide' ? 'hidden' : 'visible', id)
            .run();
        }
        return json({ ok: true }, 200, cors);
      }

      // Ko-fi-Webhook (Revenue-Tracking): Ko-fi POSTet form-encoded {data: JSON}.
      // Aktiv erst wenn KOFI_TOKEN-Secret gesetzt ist (Marvin: Ko-fi → Settings → API → Verification Token).
      if (path === '/v1/kofi-webhook') {
        if (!env.KOFI_TOKEN) return json({ error: 'not configured' }, 503, cors);
        let payload;
        try {
          const form = await request.formData();
          payload = JSON.parse(form.get('data'));
        } catch {
          return json({ error: 'bad payload' }, 400, cors);
        }
        if (payload.verification_token !== env.KOFI_TOKEN) return json({ error: 'unauthorized' }, 401, cors);
        const cents = Math.round(parseFloat(payload.amount || '0') * 100);
        await env.DB.prepare(
          'INSERT INTO donations (source, amount_cents, currency, supporter, message, external_id) VALUES (?, ?, ?, ?, ?, ?)',
        )
          .bind('ko-fi', cents, clip(payload.currency || 'EUR', 8), clip(payload.from_name || '', 100), clip(payload.message || '', 500), clip(payload.kofi_transaction_id || '', 80))
          .run();
        return json({ ok: true }, 200, cors);
      }

      if (path === '/v1/admin/donation') {
        if (!isAdmin) return json({ error: 'unauthorized' }, 401, cors);
        const cents = Math.round(Number(body.amount_cents));
        if (!Number.isFinite(cents) || cents <= 0) return json({ error: 'amount_cents required' }, 400, cors);
        await env.DB.prepare(
          'INSERT INTO donations (source, amount_cents, currency, supporter, message) VALUES (?, ?, ?, ?, ?)',
        )
          .bind(clip(body.source || 'manual', 40), cents, clip(body.currency || 'EUR', 8), clip(body.supporter || '', 100), clip(body.message || '', 500))
          .run();
        return json({ ok: true }, 200, cors);
      }

      if (path === '/v1/admin/todo') {
        if (!isAdmin) return json({ error: 'unauthorized' }, 401, cors);
        const action = body.action;
        if (action === 'add') {
          const title = clip(body.title, 300);
          if (!title || !title.trim()) return json({ error: 'title required' }, 400, cors);
          await env.DB.prepare('INSERT INTO marvin_todos (title, detail) VALUES (?, ?)')
            .bind(title.trim(), clip(body.detail || '', 2000))
            .run();
          return json({ ok: true }, 200, cors);
        }
        const id = Number(body.id);
        if (!id) return json({ error: 'id required' }, 400, cors);
        if (action === 'toggle') {
          await env.DB.prepare(
            "UPDATE marvin_todos SET done = ?, done_at = CASE WHEN ? = 1 THEN datetime('now') ELSE NULL END WHERE id = ?",
          )
            .bind(body.done ? 1 : 0, body.done ? 1 : 0, id)
            .run();
          return json({ ok: true }, 200, cors);
        }
        if (action === 'delete') {
          await env.DB.prepare('DELETE FROM marvin_todos WHERE id = ?').bind(id).run();
          return json({ ok: true }, 200, cors);
        }
        return json({ error: 'unknown action' }, 400, cors);
      }

      if (path === '/v1/admin/note') {
        if (!isAdmin) return json({ error: 'unauthorized' }, 401, cors);
        const note = clip(body.note, MAX_LEN.note);
        if (!note || !note.trim()) return json({ error: 'note required' }, 400, cors);
        const prio = [1, 2, 3].includes(body.prio) ? body.prio : 2;
        await env.DB.prepare('INSERT INTO admin_notes (note, prio) VALUES (?, ?)')
          .bind(note.trim(), prio)
          .run();
        return json({ ok: true }, 201, cors);
      }

      return json({ error: 'not found' }, 404, cors);
    } catch (err) {
      return json({ error: 'internal', detail: String(err?.message || err).slice(0, 200) }, 500, cors);
    }
  },

  /** Wöchentlicher Digest (Mo 08:00 UTC) + Opt-in-Backfill. Resend-Cap 100/Tag → max 90 Mails/Lauf. */
  async scheduled(event, env) {
    if (!env.RESEND_API_KEY) return;
    let budget = 90;

    // 1) Backfill: Bestätigungsmails, die vor dem API-Key nicht rausgehen konnten
    const pending = await env.DB.prepare(
      'SELECT email, lang, token FROM newsletter_signups WHERE confirmed = 0 AND opt_in_sent = 0 LIMIT 30',
    ).all();
    for (const p of pending.results) {
      if (budget <= 0) return;
      const ok = await sendMail(env, p.email, mailT(p.lang).confirmSub, confirmMailHtml(p.lang, p.token));
      if (ok) {
        await env.DB.prepare('UPDATE newsletter_signups SET opt_in_sent = 1 WHERE email = ?').bind(p.email).run();
        budget--;
      }
    }

    // 2) Digest an Bestätigte: Feed-Items der letzten 7 Tage je Sprache
    const since = new Date(Date.now() - 7 * 864e5).toISOString().slice(0, 10);
    const feeds = {};
    const subs = await env.DB.prepare('SELECT email, lang, token FROM newsletter_signups WHERE confirmed = 1 LIMIT 200').all();
    for (const s of subs.results) {
      if (budget <= 0) return;
      const lang = ['de', 'en', 'es', 'fr', 'zh'].includes(s.lang) ? s.lang : 'de';
      if (!feeds[lang]) {
        const r = await fetch(`https://promptgarten.com/api/feed.${lang}.json`);
        feeds[lang] = r.ok ? (await r.json()).filter((i) => i.date >= since) : [];
      }
      const items = feeds[lang];
      if (!items.length) continue;
      const t = mailT(lang);
      const unsubUrl = `${API_BASE}/v1/newsletter/unsubscribe?token=${s.token}`;
      const html = digestMailHtml(lang, items, unsubUrl, t);
      const text = digestMailText(lang, items, unsubUrl, t);
      const ok = await sendMail(env, s.email, t.digestSub, html, text);
      if (ok) budget--;
    }
  },
};
