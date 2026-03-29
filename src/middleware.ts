import { clerkMiddleware, createRouteMatcher, clerkClient } from "@clerk/astro/server";
import type { D1Database } from "@cloudflare/workers-types";
import { createDb } from "./db/client";
import { users } from "./db/schema";
import { eq } from "drizzle-orm";
import type { Locale } from "./types/domain";

const isProtectedRoute = createRouteMatcher([
  "/profile(.*)",
  "/add(.*)",
  "/api/my-events",
  "/api/push(.*)",
  "/admin(.*)",
  "/api/admin(.*)",
]);

function detectLocale(request: Request): Locale {
  const cookie = request.headers.get("cookie") ?? "";
  const match = cookie.match(/(?:^|;\s*)locale=(it|en)(?:;|$)/);
  if (match) return match[1] as Locale;

  const acceptLang = request.headers.get("accept-language") ?? "";
  if (/\bit\b/i.test(acceptLang)) return "it";
  return "en";
}

export const onRequest = clerkMiddleware(async (auth, context, next) => {
  context.locals.locale = detectLocale(context.request);

  const d1 = context.locals.runtime.env.DB as D1Database;
  const db = createDb(d1);
  context.locals.db = db;

  const { userId } = auth();

  if (userId) {
    let [user] = await db.select().from(users).where(eq(users.id, userId)).limit(1);

    if (!user) {
      try {
        const clerk = clerkClient(context);
        const clerkUser = await clerk.users.getUser(userId);
        const email = clerkUser.emailAddresses[0]?.emailAddress ?? null;
        const nameParts = [clerkUser.firstName, clerkUser.lastName].filter(Boolean);
        const name = nameParts.length > 0 ? nameParts.join(" ") : null;

        await db.insert(users).values({
          id: userId,
          email,
          name,
          avatarUrl: clerkUser.imageUrl,
        });

        [user] = await db.select().from(users).where(eq(users.id, userId)).limit(1);
      } catch (err) {
        console.error("[middleware] Failed to sync Clerk user:", err instanceof Error ? err.message : err);
      }
    }

    context.locals.user = user ?? null;

    const { sessionClaims } = auth();
    const metadata = sessionClaims?.publicMetadata as Record<string, unknown> | undefined;
    context.locals.isAdmin = metadata?.admin === "true";
  } else {
    context.locals.user = null;
    context.locals.isAdmin = false;
  }

  if (isProtectedRoute(context.request) && !userId) {
    const url = new URL(context.request.url);
    return context.redirect(`/sign-in?redirect_url=${encodeURIComponent(url.pathname + url.search)}`);
  }

  return next();
});
