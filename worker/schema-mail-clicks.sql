-- Klicks aus Newsletter-Mails (Marvin 27.07: „das sollten wir auch tracken wer durch die Mails kommt").
-- Bewusst OHNE Personenbezug: kein Empfänger, keine Mail-Adresse, kein Öffnungs-Pixel.
-- Gezählt wird nur, welcher Link einer Kampagne wie oft geklickt wurde.
CREATE TABLE IF NOT EXISTS mail_clicks (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  day TEXT NOT NULL,          -- YYYY-MM-DD
  campaign TEXT NOT NULL,     -- z.B. digest-2026-07-27
  item TEXT,                  -- Feed-ID der Meldung, oder 'cta' / 'site'
  lang TEXT,
  kind TEXT NOT NULL,         -- 'story' (auf promptgarten) | 'source' (externe Quelle) | 'cta'
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_mail_clicks_day ON mail_clicks(day);
CREATE INDEX IF NOT EXISTS idx_mail_clicks_campaign ON mail_clicks(campaign);
