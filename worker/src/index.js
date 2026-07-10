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

      const isAdmin = (request.headers.get('X-Admin-Key') || '') === env.ADMIN_KEY && !!env.ADMIN_KEY;

      if (request.method === 'GET' && path === '/v1/admin/summary') {
        if (!isAdmin) return json({ error: 'unauthorized' }, 401, cors);
        const [bugs, feedback, notes, signups, views, topPaths] = await Promise.all([
          env.DB.prepare("SELECT * FROM bug_reports WHERE status='open' ORDER BY id DESC LIMIT 50").all(),
          env.DB.prepare("SELECT * FROM feedback WHERE status='new' ORDER BY id DESC LIMIT 50").all(),
          env.DB.prepare("SELECT * FROM admin_notes WHERE status='open' ORDER BY prio, id DESC LIMIT 50").all(),
          env.DB.prepare('SELECT COUNT(*) AS n FROM newsletter_signups').first(),
          env.DB.prepare("SELECT COUNT(*) AS n FROM page_views WHERE day >= date('now','-7 day')").first(),
          env.DB.prepare(
            "SELECT path, COUNT(*) AS n FROM page_views WHERE day >= date('now','-7 day') GROUP BY path ORDER BY n DESC LIMIT 15",
          ).all(),
        ]);
        return json(
          {
            open_bugs: bugs.results,
            new_feedback: feedback.results,
            open_admin_notes: notes.results,
            newsletter_count: signups?.n ?? 0,
            views_7d: views?.n ?? 0,
            top_paths_7d: topPaths.results,
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
