import { APP_VERSION } from "../../config/version";

export function GET(): Response {
  return Response.json({ version: APP_VERSION });
}
