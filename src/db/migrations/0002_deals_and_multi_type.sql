-- Allow comma-separated types: drop CHECK constraint by recreating table
CREATE TABLE IF NOT EXISTS restaurants_new (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  name          TEXT    NOT NULL,
  description   TEXT,
  type          TEXT    NOT NULL,
  price_range   INTEGER NOT NULL CHECK (price_range BETWEEN 1 AND 3),
  phone         TEXT,
  address       TEXT    NOT NULL,
  latitude      REAL,
  longitude     REAL,
  google_maps_url TEXT,
  opening_hours TEXT    NOT NULL,
  image_url     TEXT,
  active        INTEGER NOT NULL DEFAULT 1,
  created_at    TEXT    NOT NULL DEFAULT (datetime('now')),
  updated_at    TEXT    NOT NULL DEFAULT (datetime('now'))
);

INSERT INTO restaurants_new SELECT * FROM restaurants;
DROP TABLE restaurants;
ALTER TABLE restaurants_new RENAME TO restaurants;

-- Deals table
CREATE TABLE IF NOT EXISTS deals (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  restaurant_id INTEGER NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
  title         TEXT    NOT NULL,
  description   TEXT,
  valid_from    TEXT    NOT NULL,
  valid_until   TEXT    NOT NULL,
  created_at    TEXT    NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_deals_valid ON deals(valid_from, valid_until);
CREATE INDEX IF NOT EXISTS idx_deals_restaurant ON deals(restaurant_id);
