-- Users (synced from Clerk on first authenticated request)
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  email TEXT,
  name TEXT,
  avatar_url TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Restaurants
CREATE TABLE IF NOT EXISTS restaurants (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  description TEXT,
  type TEXT NOT NULL,
  price_range INTEGER NOT NULL,
  phone TEXT,
  address TEXT NOT NULL,
  latitude REAL,
  longitude REAL,
  opening_hours TEXT NOT NULL,
  image_url TEXT,
  menu_url TEXT,
  owner_id TEXT NOT NULL REFERENCES users(id),
  active INTEGER NOT NULL DEFAULT 1,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Promotions (unified: special | deal | news)
CREATE TABLE IF NOT EXISTS promotions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  restaurant_id INTEGER NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
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
CREATE INDEX IF NOT EXISTS idx_promotions_restaurant ON promotions(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_promotions_type ON promotions(type);
CREATE INDEX IF NOT EXISTS idx_promotions_dates ON promotions(date_start, date_end);

-- Push Subscriptions
CREATE TABLE IF NOT EXISTS push_subscriptions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  endpoint TEXT NOT NULL UNIQUE,
  p256dh TEXT NOT NULL,
  auth TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_push_subscriptions_user ON push_subscriptions(user_id);

-- Events
CREATE TABLE IF NOT EXISTS events (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  description TEXT,
  date_start TEXT NOT NULL,
  date_end TEXT,
  time_start TEXT,
  time_end TEXT,
  address TEXT NOT NULL,
  phone TEXT,
  latitude REAL,
  longitude REAL,
  category TEXT NOT NULL,
  price REAL,
  image_url TEXT,
  owner_id TEXT NOT NULL REFERENCES users(id),
  active INTEGER NOT NULL DEFAULT 1,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_events_date_start ON events(date_start);
CREATE INDEX IF NOT EXISTS idx_events_category ON events(category);
