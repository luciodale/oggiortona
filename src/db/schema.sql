-- Oggi a Ortona - Database Schema
-- This file is the SINGLE SOURCE OF TRUTH for all data shapes.
-- All TypeScript types in src/types/database.ts must mirror this schema.

CREATE TABLE IF NOT EXISTS restaurants (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  name          TEXT    NOT NULL,
  description   TEXT,
  type          TEXT    NOT NULL, -- comma-separated: e.g. 'bar,gelateria'
  price_range   INTEGER NOT NULL CHECK (price_range BETWEEN 1 AND 3),
  phone         TEXT,
  address       TEXT    NOT NULL,
  latitude      REAL,
  longitude     REAL,
  google_maps_url TEXT,
  opening_hours TEXT    NOT NULL, -- JSON: see OpeningHours type
  image_url     TEXT,
  active        INTEGER NOT NULL DEFAULT 1,
  created_at    TEXT    NOT NULL DEFAULT (datetime('now')),
  updated_at    TEXT    NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS daily_specials (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  restaurant_id INTEGER NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
  description   TEXT    NOT NULL,
  price         REAL,
  image_url     TEXT,
  date          TEXT    NOT NULL, -- ISO date: 'YYYY-MM-DD'
  created_at    TEXT    NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_daily_specials_date ON daily_specials(date);
CREATE INDEX IF NOT EXISTS idx_daily_specials_restaurant ON daily_specials(restaurant_id);

-- Timed deals / offers (distinct from daily specials)
CREATE TABLE IF NOT EXISTS deals (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  restaurant_id INTEGER NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
  title         TEXT    NOT NULL,
  description   TEXT,
  valid_from    TEXT    NOT NULL, -- ISO datetime
  valid_until   TEXT    NOT NULL, -- ISO datetime
  created_at    TEXT    NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_deals_valid ON deals(valid_from, valid_until);
CREATE INDEX IF NOT EXISTS idx_deals_restaurant ON deals(restaurant_id);

CREATE TABLE IF NOT EXISTS events (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  title       TEXT    NOT NULL,
  description TEXT,
  date_start  TEXT    NOT NULL, -- ISO date: 'YYYY-MM-DD'
  date_end    TEXT,
  time_start  TEXT,             -- 'HH:MM'
  time_end    TEXT,
  location    TEXT    NOT NULL,
  category    TEXT    NOT NULL CHECK (category IN ('sagra', 'musica', 'mercato', 'cultura', 'sport', 'altro')),
  image_url   TEXT,
  created_at  TEXT    NOT NULL DEFAULT (datetime('now')),
  updated_at  TEXT    NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_events_date_start ON events(date_start);
CREATE INDEX IF NOT EXISTS idx_events_category ON events(category);

