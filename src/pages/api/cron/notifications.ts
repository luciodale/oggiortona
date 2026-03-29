import type { APIContext } from "astro";
import { notifyOwners } from "../../../utils/notifyOwners";

export async function POST({ request, locals }: APIContext): Promise<Response> {
  const authHeader = request.headers.get("Authorization");
  const expected = `Bearer ${locals.runtime.env.CRON_SECRET}`;
  if (authHeader !== expected) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const db = locals.db;
  const env = locals.runtime.env;

  await notifyOwners(db, env);

  return Response.json({ ok: true });
}
