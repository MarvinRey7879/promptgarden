-- Migration 14.07.2026: Unique-Besucher (täglich rotierender Hash, Plausible-Prinzip)
-- + internal-Flag (eigene Aufrufe von Marvin/Loop/Bots werden markiert und aus Statistiken gefiltert)
ALTER TABLE page_views ADD COLUMN visitor TEXT;
ALTER TABLE page_views ADD COLUMN internal INTEGER DEFAULT 0;
CREATE INDEX IF NOT EXISTS idx_views_visitor ON page_views(visitor);
CREATE INDEX IF NOT EXISTS idx_views_internal ON page_views(internal);
