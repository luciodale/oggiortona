import type { APIContext } from "astro";
import { requireAdmin } from "../../../../utils/adminGuard";
import { pushSubscriptions } from "../../../../db/schema";
import { eq, count } from "drizzle-orm";

export async function GET({ locals }: APIContext): Promise<Response> {
  const denied = requireAdmin(locals);
  if (denied) return denied;

  const result = await locals.db
    .select({ count: count() })
    .from(pushSubscriptions)
    .where(eq(pushSubscriptions.scope, "general"));

  return Response.json({ count: result[0]?.count ?? 0 });
}
