// SINGLE SOURCE OF TRUTH for all data shapes.
// All types are inferred from these table definitions.

import { sqliteTable, text, integer, real, index, unique } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

// -- Users (synced from Clerk on first authenticated request) --

export const users = sqliteTable("users", {
  id: text("id").primaryKey(), // Clerk user ID
  email: text("email"),
  name: text("name"),
  avatarUrl: text("avatar_url"),
  createdAt: text("created_at").notNull().default(sql`(datetime('now'))`),
});

// -- Restaurants --

export const restaurants = sqliteTable("restaurants", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  description: text("description"),
  type: text("type").notNull(), // comma-separated: e.g. 'bar,gelateria'
  priceRange: integer("price_range").notNull(),
  phone: text("phone"),
  address: text("address").notNull(),
  latitude: real("latitude"),
  longitude: real("longitude"),
  openingHours: text("opening_hours").notNull(), // JSON
  menuUrl: text("menu_url"),
  ownerId: text("owner_id").notNull().references(() => users.id),
  active: integer("active").notNull().default(1),
  deleted: integer("deleted").notNull().default(0),
  approved: integer("approved").notNull().default(1),
  createdAt: text("created_at").notNull().default(sql`(datetime('now'))`),
  updatedAt: text("updated_at").notNull().default(sql`(datetime('now'))`),
});

// -- Promotions (unified: special | deal | news) --

export const promotions = sqliteTable("promotions", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  restaurantId: integer("restaurant_id").notNull().references(() => restaurants.id, { onDelete: "cascade" }),
  type: text("type").notNull(), // 'special' | 'deal' | 'news'
  title: text("title").notNull(),
  description: text("description"),
  price: real("price"),
  dateStart: text("date_start").notNull(),
  dateEnd: text("date_end").notNull(),
  timeStart: text("time_start"),
  timeEnd: text("time_end"),
  createdAt: text("created_at").notNull().default(sql`(datetime('now'))`),
}, (table) => [
  index("idx_promotions_restaurant").on(table.restaurantId),
  index("idx_promotions_type").on(table.type),
  index("idx_promotions_dates").on(table.dateStart, table.dateEnd),
]);

// -- Push Subscriptions (Web Push: admin | owner | general) --

export const pushSubscriptions = sqliteTable("push_subscriptions", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  endpoint: text("endpoint").notNull(),
  p256dh: text("p256dh").notNull(),
  auth: text("auth").notNull(),
  scope: text("scope").notNull().default("admin"),
  createdAt: text("created_at").notNull().default(sql`(datetime('now'))`),
}, (table) => [
  index("idx_push_subscriptions_user").on(table.userId),
  index("idx_push_subscriptions_scope").on(table.scope),
  unique("uq_push_subscriptions_endpoint_scope").on(table.endpoint, table.scope),
]);

// -- Events --

export const events = sqliteTable("events", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  description: text("description"),
  dateStart: text("date_start").notNull(),
  dateEnd: text("date_end"),
  timeStart: text("time_start"),
  timeEnd: text("time_end"),
  address: text("address").notNull(),
  phone: text("phone"),
  latitude: real("latitude"),
  longitude: real("longitude"),
  category: text("category").notNull(),
  price: real("price"),
  ownerId: text("owner_id").notNull().references(() => users.id),
  active: integer("active").notNull().default(1),
  deleted: integer("deleted").notNull().default(0),
  approved: integer("approved").notNull().default(1),
  createdAt: text("created_at").notNull().default(sql`(datetime('now'))`),
  updatedAt: text("updated_at").notNull().default(sql`(datetime('now'))`),
}, (table) => [
  index("idx_events_date_start").on(table.dateStart),
  index("idx_events_category").on(table.category),
]);
