import type { InferInsertModel } from "drizzle-orm";
import type { events } from "../../../src/db/schema";

export type D1Target = "local" | "remote";

type EventInsert = InferInsertModel<typeof events>;

// Derived from Drizzle schema. Only user-facing fields for MCP inserts.
// link is required here (nullable in schema, but mandatory for AI-scraped events).
export type EventInput = {
  [K in
    | "title"
    | "description"
    | "dateStart"
    | "dateEnd"
    | "timeStart"
    | "timeEnd"
    | "address"
    | "phone"
    | "latitude"
    | "longitude"
    | "category"
    | "price"]-?: EventInsert[K];
} & { link: string };

// Raw SQL query result shape (snake_case column names from D1).
// Must match the SELECT in get-recent-events.ts.
export type EventRow = {
  id: number;
  title: string;
  date_start: string;
  date_end: string | null;
  time_start: string | null;
  time_end: string | null;
  address: string;
  category: string;
  link: string | null;
  active: number;
  approved: number;
};

export type D1QueryResult = {
  results: Array<Record<string, unknown>>;
  success: boolean;
  meta: Record<string, unknown>;
};
