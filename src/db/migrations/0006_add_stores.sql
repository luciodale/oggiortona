-- Stores (parallel to restaurants, no price_range, store_url instead of menu_url)
CREATE TABLE IF NOT EXISTS stores (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  description TEXT,
  type TEXT NOT NULL,
  phone TEXT,
  address TEXT NOT NULL,
  latitude REAL,
  longitude REAL,
  opening_hours TEXT NOT NULL,
  store_url TEXT,
  owner_id TEXT NOT NULL REFERENCES users(id),
  active INTEGER NOT NULL DEFAULT 1,
  deleted INTEGER NOT NULL DEFAULT 0,
  approved INTEGER NOT NULL DEFAULT 1,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Store Promotions (generale | saldi | deal | news)
CREATE TABLE IF NOT EXISTS store_promotions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  store_id INTEGER NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  price REAL,
  date_start TEXT NOT NULL,
  date_end TEXT NOT NULL,
  time_start TEXT,
  time_end TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_store_promotions_store ON store_promotions(store_id);
CREATE INDEX IF NOT EXISTS idx_store_promotions_type ON store_promotions(type);
CREATE INDEX IF NOT EXISTS idx_store_promotions_dates ON store_promotions(date_start, date_end);

-- Store Promotion Bumps (append-only audit for 12h cooldown)
CREATE TABLE IF NOT EXISTS store_promotion_bumps (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  store_id INTEGER NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
  action TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_store_promotion_bumps_store_created ON store_promotion_bumps(store_id, created_at);

-- Pinned Stores (user favourites)
CREATE TABLE IF NOT EXISTS pinned_stores (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  store_id INTEGER NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  UNIQUE(user_id, store_id)
);
CREATE INDEX IF NOT EXISTS idx_pinned_stores_user ON pinned_stores(user_id);

-- Events: add store_id FK (mirrors restaurant_id)
ALTER TABLE events ADD COLUMN store_id INTEGER REFERENCES stores(id) ON DELETE SET NULL;
CREATE INDEX IF NOT EXISTS idx_events_store_id ON events(store_id);
