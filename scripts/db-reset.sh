#!/usr/bin/env bash
set -euo pipefail

TARGET="${1:-local}"
DB_NAME="oggi-a-ortona-db"

if [[ "$TARGET" != "local" && "$TARGET" != "remote" ]]; then
  echo "Usage: $0 [local|remote]"
  exit 1
fi

if [[ "$TARGET" == "remote" ]]; then
  echo "Are you sure you want to reset the REMOTE database? (y/N)"
  read -r confirm
  [[ "$confirm" != "y" ]] && exit 0
fi

FLAG="--$TARGET"

echo "Dropping all tables..."
rm -rf .wrangler/state

echo "Running migration..."
bunx wrangler d1 execute "$DB_NAME" --file=src/db/migrations/0001_initial.sql $FLAG

echo "Seeding..."
bunx wrangler d1 execute "$DB_NAME" --file=src/db/seed.sql $FLAG

echo "Done!"
