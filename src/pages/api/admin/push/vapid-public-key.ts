import type { APIContext } from "astro";
import { requireAdmin } from "../../../../utils/adminGuard";

export async function GET({ locals }: APIContext): Promise<Response> {
  const denied = requireAdmin(locals);
  if (denied) return denied;

  const env = locals.runtime.env;
  return Response.json({ publicKey: env.VAPID_PUBLIC_KEY });
}
