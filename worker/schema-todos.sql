CREATE TABLE IF NOT EXISTS marvin_todos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  title TEXT NOT NULL,
  detail TEXT DEFAULT '',
  done INTEGER NOT NULL DEFAULT 0,
  done_at TEXT
);
