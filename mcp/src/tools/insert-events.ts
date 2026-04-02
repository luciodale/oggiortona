import { z } from "zod";
import { executeD1 } from "../lib/d1.js";
import type { EventInput } from "../lib/types.js";
import { eventFieldsSchema, buildInsertSQL } from "./insert-event.js";

const eventSchema = z.object(eventFieldsSchema);

export const insertEventsSchema = {
  events: z
    .array(eventSchema)
    .min(1)
    .max(20)
    .describe("Array of events to insert (max 20)"),
  target: z
    .enum(["local", "remote"])
    .default("remote")
    .describe("Which D1 database to insert into"),
};

export async function insertEvents(args: {
  events: Array<EventInput>;
  target?: "local" | "remote";
}) {
  const target = args.target ?? "remote";
  const sql = buildInsertSQL(args.events);
  const results = await executeD1(sql, target);

  const firstResult = results[0];
  if (!firstResult?.success) {
    return {
      content: [
        {
          type: "text" as const,
          text: `Batch insert failed: ${JSON.stringify(firstResult)}`,
        },
      ],
    };
  }

  const summary = args.events
    .map((e) => `  - "${e.title}" on ${e.dateStart} [${e.category}]`)
    .join("\n");

  return {
    content: [
      {
        type: "text" as const,
        text: `${args.events.length} events inserted:\n${summary}`,
      },
    ],
  };
}
