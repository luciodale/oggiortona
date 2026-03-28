/// <reference types="astro/client" />

type Runtime = import("@astrojs/cloudflare").Runtime<Env>;

type Env = {
  DB: import("@cloudflare/workers-types").D1Database;
};

declare namespace App {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  type Locals = Runtime;
}
