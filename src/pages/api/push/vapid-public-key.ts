import type { APIContext } from "astro";

export async function GET({ locals }: APIContext): Promise<Response> {
  if (!locals.user) {
    return Response.json({ error: "Non autenticato" }, { status: 401 });
  }

  return Response.json({ publicKey: locals.runtime.env.VAPID_PUBLIC_KEY });
}
