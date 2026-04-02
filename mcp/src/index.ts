import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  getRecentEventsSchema,
  getRecentEvents,
} from "./tools/get-recent-events.js";
import { insertEventsSchema, insertEvents } from "./tools/insert-events.js";
import {
  SCRAPE_EVENTS_PROMPT,
  scrapeEventsPromptDefinition,
} from "./prompts/scrape-events.js";

const server = new McpServer({
  name: "oggiortona-events",
  version: "0.1.0",
});

server.registerTool("get_recent_events", {
  description:
    "Get recent and upcoming events from the Oggi a Ortona database. Use this first to check for duplicates before inserting.",
  inputSchema: getRecentEventsSchema,
}, getRecentEvents);

server.registerTool("insert_events", {
  description:
    "Batch insert events in a single query. Events are created with active=0, approved=0 (admin must approve). Link is mandatory. Max 20 events per call.",
  inputSchema: insertEventsSchema,
}, insertEvents);

server.registerPrompt(scrapeEventsPromptDefinition.name, {
  description: scrapeEventsPromptDefinition.description,
}, () => ({
  messages: [
    {
      role: "user",
      content: {
        type: "text",
        text: SCRAPE_EVENTS_PROMPT,
      },
    },
  ],
}));

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main();
