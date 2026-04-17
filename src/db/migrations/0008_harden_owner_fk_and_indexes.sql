-- Add indexes on owner_id columns. These columns are filtered by
-- /api/my-restaurants, /api/my-stores, /api/my-events, and the
-- "owner or admin" branches of single-resource GETs.
-- Using IF NOT EXISTS so this is safe to rerun.

CREATE INDEX IF NOT EXISTS idx_restaurants_owner ON restaurants(owner_id);
CREATE INDEX IF NOT EXISTS idx_stores_owner ON stores(owner_id);
CREATE INDEX IF NOT EXISTS idx_events_owner ON events(owner_id);
