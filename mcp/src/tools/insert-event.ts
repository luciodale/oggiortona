import { z } from "zod";
import { toSQLValue } from "../lib/d1.js";
import type { EventInput } from "../lib/types.js";

const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
const timeRegex = /^\d{2}:\d{2}$/;

function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
}

function maxAllowedIso(): string {
  const d = new Date();
  d.setUTCFullYear(d.getUTCFullYear() + 2);
  return d.toISOString().slice(0, 10);
}

function isNotPast(value: string): boolean {
  return value >= todayIso();
}

function isNotTooFar(value: string): boolean {
  return value <= maxAllowedIso();
}

export const eventFieldsSchema = {
  title: z.string().min(1).describe("Event title"),
  description: z
    .string()
    .max(500)
    .nullable()
    .default(null)
    .describe("Event description (max 500 chars)"),
  dateStart: z
    .string()
    .regex(dateRegex, "Must be YYYY-MM-DD")
    .refine(isNotPast, "dateStart must be today or in the future — past events are rejected")
    .refine(isNotTooFar, "dateStart must be within 2 years from today — likely wrong year")
    .describe("Start date in YYYY-MM-DD format (must be today or future, within 2 years)"),
  dateEnd: z
    .string()
    .regex(dateRegex, "Must be YYYY-MM-DD")
    .refine(isNotTooFar, "dateEnd must be within 2 years from today")
    .nullable()
    .default(null)
    .describe("End date in YYYY-MM-DD format (null for single-day events)"),
  timeStart: z
    .string()
    .regex(timeRegex, "Must be HH:MM")
    .nullable()
    .default(null)
    .describe("Start time in HH:MM format"),
  timeEnd: z
    .string()
    .regex(timeRegex, "Must be HH:MM")
    .nullable()
    .default(null)
    .describe("End time in HH:MM format"),
  address: z.string().min(1).describe("Event location/venue"),
  phone: z
    .string()
    .nullable()
    .default(null)
    .describe("Contact phone number"),
  latitude: z
    .number()
    .nullable()
    .default(null)
    .describe("GPS latitude"),
  longitude: z
    .number()
    .nullable()
    .default(null)
    .describe("GPS longitude"),
  category: z
    .string()
    .min(1)
    .describe("Event category"),
  price: z
    .number()
    .min(0)
    .nullable()
    .default(null)
    .describe("Ticket price (null if free or unknown)"),
  link: z
    .string()
    .min(1)
    .describe("Source URL (mandatory for AI-inserted events)"),
};

// SQL column order must match toEventValuesRow
const EVENT_COLUMNS = [
  "title",
  "description",
  "date_start",
  "date_end",
  "time_start",
  "time_end",
  "address",
  "phone",
  "latitude",
  "longitude",
  "category",
  "price",
  "link",
  "owner_id",
  "active",
  "deleted",
  "approved",
  "highlighted",
  "created_at",
  "updated_at",
] as const;

function toEventValuesRow(event: EventInput): string {
  const values = [
    toSQLValue(event.title),
    toSQLValue(event.description),
    toSQLValue(event.dateStart),
    toSQLValue(event.dateEnd),
    toSQLValue(event.timeStart),
    toSQLValue(event.timeEnd),
    toSQLValue(event.address),
    toSQLValue(event.phone),
    toSQLValue(event.latitude),
    toSQLValue(event.longitude),
    toSQLValue(event.category),
    toSQLValue(event.price),
    toSQLValue(event.link),
    "'ai_scraper'",
    "0",
    "0",
    "0",
    "0",
    "datetime('now')",
    "datetime('now')",
  ];
  return `(${values.join(", ")})`;
}

export function buildInsertSQL(events: Array<EventInput>): string {
  const rows = events.map(toEventValuesRow);
  return `INSERT INTO events (${EVENT_COLUMNS.join(", ")}) VALUES ${rows.join(", ")}`;
}
