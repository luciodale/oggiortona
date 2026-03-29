/// <reference types="astro/client" />
/// <reference types="@clerk/astro/env" />

type Env = {
  DB: import("@cloudflare/workers-types").D1Database;
  CLERK_SECRET_KEY?: string;
  VAPID_PUBLIC_KEY: string;
  VAPID_PRIVATE_KEY: string;
  VAPID_SUBJECT: string;
  CRON_SECRET: string;
};

type Runtime = import("@astrojs/cloudflare").Runtime<Env>;

declare namespace App {
  interface Locals extends Runtime {
    user: import("./types/database").UserRow | null;
    db: import("./db/client").Db;
    isAdmin: boolean;
    locale: import("./types/domain").Locale;
  }
}
