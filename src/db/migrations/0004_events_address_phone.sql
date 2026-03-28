-- Rename location to address, add optional phone field
ALTER TABLE events RENAME COLUMN location TO address;
ALTER TABLE events ADD COLUMN phone TEXT;
