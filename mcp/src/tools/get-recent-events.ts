import { z } from "zod";
import { executeD1 } from "../lib/d1.js";
import type { EventRow } from "../lib/types.js";

export const getRecentEventsSchema = {
  days_ahead: z
    .number()
    .int()
    .min(1)
    .max(365)
    .default(60)
    .describe("How many days ahead to look for events"),
  target: z
    .enum(["local", "remote"])
    .default("remote")
    .describe("Which D1 database to query"),
};

export async function getRecentEvents(args: {
  days_ahead?: number;
  target?: "local" | "remote";
}) {
  const daysAhead = args.days_ahead ?? 60;
  const target = args.target ?? "remote";

  const sql = `SELECT id, title, date_start, date_end, time_start, time_end, address, category, link, active, approved FROM events WHERE deleted = 0 AND date_start >= date('now', '-7 days') AND date_start <= date('now', '+${daysAhead} days') ORDER BY date_start ASC`;

  const results = await executeD1(sql, target);

  const firstResult = results[0];
  if (!firstResult?.success) {
    return {
      content: [
        {
          type: "text" as const,
          text: `Query failed: ${JSON.stringify(firstResult)}`,
        },
      ],
    };
  }

  const rows = firstResult.results as Array<EventRow>;

  const summary = rows
    .map(
      (r) =>
        `[${r.id}] ${r.title} | ${r.date_start} | ${r.address} | ${r.category} | active=${r.active} approved=${r.approved}${r.link ? ` | ${r.link}` : ""}`,
    )
    .join("\n");

  return {
    content: [
      {
        type: "text" as const,
        text: rows.length > 0
          ? `Found ${rows.length} events:\n${summary}`
          : "No events found in the specified range.",
      },
    ],
  };
}
