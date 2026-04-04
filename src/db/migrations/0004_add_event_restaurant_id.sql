ALTER TABLE events ADD COLUMN restaurant_id INTEGER REFERENCES restaurants(id) ON DELETE SET NULL;
CREATE INDEX IF NOT EXISTS idx_events_restaurant_id ON events(restaurant_id);
