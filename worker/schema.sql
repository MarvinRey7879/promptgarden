-- promptgarden-db — D1 Schema (v1, Iteration 2)
-- Datenschutz-Grundsatz: cookieless, keine IPs, keine User-Agents, keine Identifier.

CREATE TABLE IF NOT EXISTS bug_reports (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  message TEXT NOT NULL,
  page TEXT,
  lang TEXT,
  status TEXT NOT NULL DEFAULT 'open' -- open | done | wontfix
);

-- Verbesserungsvorschläge von Besuchern (öffentlich)
CREATE TABLE IF NOT EXISTS feedback (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  message TEXT NOT NULL,
  page TEXT,
  lang TEXT,
  status TEXT NOT NULL DEFAULT 'new' -- new | seen | done
);

-- Marvins Prio-Eingaben (nur mit ADMIN_KEY) — die Loop liest das jede Iteration
CREATE TABLE IF NOT EXISTS admin_notes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  note TEXT NOT NULL,
  prio INTEGER NOT NULL DEFAULT 2, -- 1 hoch, 2 normal, 3 niedrig
  status TEXT NOT NULL DEFAULT 'open' -- open | in_arbeit | done
);

CREATE TABLE IF NOT EXISTS newsletter_signups (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  email TEXT NOT NULL UNIQUE,
  lang TEXT,
  confirmed INTEGER NOT NULL DEFAULT 0 -- Double-Opt-in folgt (It. 3+)
);

-- Cookieless Page-Views: nur Datum (kein Timestamp), Pfad, Sprache, Land (CF-Header), Referrer-Host.
-- Bewusst KEINE Session-/User-Zuordnung → nicht-optionales Tracking, kein Consent nötig.
CREATE TABLE IF NOT EXISTS page_views (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  day TEXT NOT NULL,        -- YYYY-MM-DD
  path TEXT NOT NULL,
  lang TEXT,
  country TEXT,
  ref_host TEXT
);
CREATE INDEX IF NOT EXISTS idx_views_day ON page_views(day);
CREATE INDEX IF NOT EXISTS idx_views_path ON page_views(path);
