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
 * Datenschutz: keine IPs, keine User-Agents, keine Cookies, keine Identifier.
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

      if (request.method === 'GET' && path === '/v1/forum') {
        const posts = await env.DB.prepare(
          "SELECT id, created_at, name, message, lang FROM forum_posts WHERE status='visible' ORDER BY id DESC LIMIT 100",
        ).all();
        return json({ posts: posts.results }, 200, cors);
      }

      const isAdmin = (request.headers.get('X-Admin-Key') || '') === env.ADMIN_KEY && !!env.ADMIN_KEY;

      if (request.method === 'GET' && path === '/v1/admin/summary') {
        if (!isAdmin) return json({ error: 'unauthorized' }, 401, cors);
        const [bugs, feedback, notes, signups, views, topPaths, forumRecent, forumBlocked, todos, viewsByDay, viewsByLang, viewsByCountry, topRefs, viewsTotal, signupsRecent, donations, revenue] = await Promise.all([
          env.DB.prepare("SELECT * FROM bug_reports WHERE status='open' ORDER BY id DESC LIMIT 50").all(),
          env.DB.prepare("SELECT * FROM feedback WHERE status='new' ORDER BY id DESC LIMIT 50").all(),
          env.DB.prepare("SELECT * FROM admin_notes WHERE status='open' ORDER BY prio, id DESC LIMIT 50").all(),
          env.DB.prepare('SELECT COUNT(*) AS n FROM newsletter_signups').first(),
          env.DB.prepare("SELECT COUNT(*) AS n FROM page_views WHERE day >= date('now','-7 day')").first(),
          env.DB.prepare(
            "SELECT path, COUNT(*) AS n FROM page_views WHERE day >= date('now','-7 day') GROUP BY path ORDER BY n DESC LIMIT 15",
          ).all(),
          env.DB.prepare('SELECT id, created_at, name, message, lang, status FROM forum_posts ORDER BY id DESC LIMIT 20').all(),
          env.DB.prepare("SELECT COUNT(*) AS n FROM forum_posts WHERE status='blocked'").first(),
          env.DB.prepare('SELECT * FROM marvin_todos ORDER BY done, id DESC LIMIT 50').all(),
          env.DB.prepare(
            "SELECT day, COUNT(*) AS n FROM page_views WHERE day >= date('now','-30 day') GROUP BY day ORDER BY day",
          ).all(),
          env.DB.prepare(
            "SELECT COALESCE(lang,'?') AS lang, COUNT(*) AS n FROM page_views WHERE day >= date('now','-7 day') GROUP BY lang ORDER BY n DESC",
          ).all(),
          env.DB.prepare(
            "SELECT COALESCE(country,'?') AS country, COUNT(*) AS n FROM page_views WHERE day >= date('now','-7 day') GROUP BY country ORDER BY n DESC LIMIT 12",
          ).all(),
          env.DB.prepare(
            "SELECT ref_host, COUNT(*) AS n FROM page_views WHERE day >= date('now','-7 day') AND ref_host IS NOT NULL AND ref_host NOT LIKE '%promptgart%' GROUP BY ref_host ORDER BY n DESC LIMIT 10",
          ).all(),
          env.DB.prepare('SELECT COUNT(*) AS n FROM page_views').first(),
          env.DB.prepare('SELECT id, created_at, email FROM newsletter_signups ORDER BY id DESC LIMIT 20').all(),
          env.DB.prepare('SELECT * FROM donations ORDER BY id DESC LIMIT 20').all(),
          env.DB.prepare('SELECT COALESCE(SUM(amount_cents),0) AS cents, COUNT(*) AS n FROM donations').first(),
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
        await env.DB.prepare(
          'INSERT INTO newsletter_signups (email, lang) VALUES (?, ?) ON CONFLICT(email) DO NOTHING',
        )
          .bind(body.email.toLowerCase(), clip(body.lang, 8))
          .run();
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
        await env.DB.prepare(
          'INSERT INTO page_views (day, path, lang, country, ref_host) VALUES (?, ?, ?, ?, ?)',
        )
          .bind(day, p, clip(body.lang, 8), country, refHost)
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
};
