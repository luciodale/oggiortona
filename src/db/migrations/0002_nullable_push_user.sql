-- Allow anonymous push subscriptions (general scope) by making user_id nullable
CREATE TABLE push_subscriptions_new (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT REFERENCES users(id) ON DELETE CASCADE,
  endpoint TEXT NOT NULL,
  p256dh TEXT NOT NULL,
  auth TEXT NOT NULL,
  scope TEXT NOT NULL DEFAULT 'admin',
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  UNIQUE(endpoint, scope)
);

INSERT INTO push_subscriptions_new (id, user_id, endpoint, p256dh, auth, scope, created_at)
  SELECT id, user_id, endpoint, p256dh, auth, scope, created_at FROM push_subscriptions;

DROP TABLE push_subscriptions;
ALTER TABLE push_subscriptions_new RENAME TO push_subscriptions;

CREATE INDEX idx_push_subscriptions_user ON push_subscriptions(user_id);
CREATE INDEX idx_push_subscriptions_scope ON push_subscriptions(scope);
