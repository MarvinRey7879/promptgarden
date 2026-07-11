-- Migration It. 24: Mini-Forum mit Spam-Schutz
-- Datenschutz: IP nie im Klartext — nur salted SHA-256-Hash für Rate-Limit/Missbrauchsschutz.

CREATE TABLE IF NOT EXISTS forum_posts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  name TEXT NOT NULL,
  message TEXT NOT NULL,
  lang TEXT,
  status TEXT NOT NULL DEFAULT 'visible', -- visible | hidden | blocked
  ip_hash TEXT
);
CREATE INDEX IF NOT EXISTS idx_forum_status ON forum_posts(status, id DESC);
CREATE INDEX IF NOT EXISTS idx_forum_ip ON forum_posts(ip_hash, created_at);
