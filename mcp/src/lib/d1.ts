import { resolve } from "path";
import type { D1Target, D1QueryResult } from "./types.js";

const PROJECT_ROOT = resolve(import.meta.dir, "..", "..", "..");
const DATABASE_NAME = "oggi-a-ortona-db";

function escapeSQL(value: string): string {
  return value.replace(/'/g, "''");
}

function toSQLValue(value: unknown): string {
  if (value === null || value === undefined) return "NULL";
  if (typeof value === "number") return String(value);
  if (typeof value === "string") return `'${escapeSQL(value)}'`;
  return "NULL";
}

export { toSQLValue };

export async function executeD1(
  command: string,
  target: D1Target,
): Promise<Array<D1QueryResult>> {
  const args = [
    "wrangler",
    "d1",
    "execute",
    DATABASE_NAME,
    `--command=${command}`,
    "--json",
  ];

  if (target === "remote") {
    args.push("--remote");
  } else {
    args.push("--local");
  }

  const proc = Bun.spawn(["bunx", ...args], {
    cwd: PROJECT_ROOT,
    stdout: "pipe",
    stderr: "pipe",
  });

  const [stdout, stderr] = await Promise.all([
    new Response(proc.stdout).text(),
    new Response(proc.stderr).text(),
  ]);

  const exitCode = await proc.exited;

  if (exitCode !== 0) {
    throw new Error(`wrangler d1 execute failed (exit ${exitCode}): ${stderr}`);
  }

  const parsed: unknown = JSON.parse(stdout);
  if (!Array.isArray(parsed)) {
    throw new Error(`Unexpected wrangler output: ${stdout.slice(0, 500)}`);
  }

  return parsed as Array<D1QueryResult>;
}
