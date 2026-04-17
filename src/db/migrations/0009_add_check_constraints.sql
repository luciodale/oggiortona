-- CHECK constraints on enum columns + renewed_at timestamps on promotions.
-- App layer already validates via Zod/manual checks; DB level guards protect
-- against direct DB writes that bypass validation.
-- None of these tables have child tables FK'ing back to them, so table
-- rebuilds are safe on D1 (which does not expose PRAGMA foreign_keys).

-- promotions: type IN ('generale','special','deal','news'); add renewed_at
CREATE TABLE promotions_new (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  restaurant_id INTEGER NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('generale','special','deal','news')),
  title TEXT NOT NULL,
  description TEXT,
  price REAL,
  date_start TEXT NOT NULL,
  date_end TEXT NOT NULL,
  time_start TEXT,
  time_end TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  renewed_at TEXT
);
INSERT INTO promotions_new (id, restaurant_id, type, title, description, price, date_start, date_end, time_start, time_end, created_at)
SELECT id, restaurant_id, type, title, description, price, date_start, date_end, time_start, time_end, created_at FROM promotions;
DROP TABLE promotions;
ALTER TABLE promotions_new RENAME TO promotions;
CREATE INDEX idx_promotions_restaurant ON promotions(restaurant_id);
CREATE INDEX idx_promotions_type ON promotions(type);
CREATE INDEX idx_promotions_dates ON promotions(date_start, date_end);

-- store_promotions: type IN ('generale','saldi','deal','news'); add renewed_at
CREATE TABLE store_promotions_new (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  store_id INTEGER NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('generale','saldi','deal','news')),
  title TEXT NOT NULL,
  description TEXT,
  price REAL,
  date_start TEXT NOT NULL,
  date_end TEXT NOT NULL,
  time_start TEXT,
  time_end TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  renewed_at TEXT
);
INSERT INTO store_promotions_new (id, store_id, type, title, description, price, date_start, date_end, time_start, time_end, created_at)
SELECT id, store_id, type, title, description, price, date_start, date_end, time_start, time_end, created_at FROM store_promotions;
DROP TABLE store_promotions;
ALTER TABLE store_promotions_new RENAME TO store_promotions;
CREATE INDEX idx_store_promotions_store ON store_promotions(store_id);
CREATE INDEX idx_store_promotions_type ON store_promotions(type);
CREATE INDEX idx_store_promotions_dates ON store_promotions(date_start, date_end);

-- promotion_bumps: action IN ('create','renew')
CREATE TABLE promotion_bumps_new (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  restaurant_id INTEGER NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
  action TEXT NOT NULL CHECK (action IN ('create','renew')),
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
INSERT INTO promotion_bumps_new SELECT * FROM promotion_bumps;
DROP TABLE promotion_bumps;
ALTER TABLE promotion_bumps_new RENAME TO promotion_bumps;
CREATE INDEX idx_promotion_bumps_restaurant_created ON promotion_bumps(restaurant_id, created_at);

-- store_promotion_bumps: action IN ('create','renew')
CREATE TABLE store_promotion_bumps_new (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  store_id INTEGER NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
  action TEXT NOT NULL CHECK (action IN ('create','renew')),
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
INSERT INTO store_promotion_bumps_new SELECT * FROM store_promotion_bumps;
DROP TABLE store_promotion_bumps;
ALTER TABLE store_promotion_bumps_new RENAME TO store_promotion_bumps;
CREATE INDEX idx_store_promotion_bumps_store_created ON store_promotion_bumps(store_id, created_at);

-- push_subscriptions: scope IN ('admin','owner','general')
CREATE TABLE push_subscriptions_new (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT REFERENCES users(id) ON DELETE CASCADE,
  endpoint TEXT NOT NULL,
  p256dh TEXT NOT NULL,
  auth TEXT NOT NULL,
  scope TEXT NOT NULL DEFAULT 'admin' CHECK (scope IN ('admin','owner','general')),
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
INSERT INTO push_subscriptions_new SELECT * FROM push_subscriptions;
DROP TABLE push_subscriptions;
ALTER TABLE push_subscriptions_new RENAME TO push_subscriptions;
CREATE INDEX idx_push_subscriptions_user ON push_subscriptions(user_id);
CREATE INDEX idx_push_subscriptions_scope ON push_subscriptions(scope);
CREATE UNIQUE INDEX uq_push_subscriptions_endpoint_scope ON push_subscriptions(endpoint, scope);
