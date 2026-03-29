import type { APIContext } from "astro";
import { fetchHomePageData } from "../../utils/homeData";

export async function GET({ locals }: APIContext): Promise<Response> {
  const data = await fetchHomePageData(locals.db);
  return Response.json(data);
}
