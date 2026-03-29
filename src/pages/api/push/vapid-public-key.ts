import type { APIContext } from "astro";

export async function GET({ locals }: APIContext): Promise<Response> {
  return Response.json({ publicKey: locals.runtime.env.VAPID_PUBLIC_KEY });
}
