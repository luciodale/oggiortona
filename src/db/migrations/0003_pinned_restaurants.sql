CREATE TABLE IF NOT EXISTS pinned_restaurants (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  restaurant_id INTEGER NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  UNIQUE(user_id, restaurant_id)
);

CREATE INDEX IF NOT EXISTS idx_pinned_user ON pinned_restaurants(user_id);
