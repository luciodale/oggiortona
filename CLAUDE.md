# Oggi a Ortona

## Language
- All UI text is in Italian. No English in user-facing strings.
- Code (variable names, comments, type names) is in English.

## TypeScript
- Strict mode. No `any` ever. No `as` casts except `as const`.
- Use `type` keyword, never `interface`.
- Named exports only. No default exports (except where Astro mandates).
- No barrel exports (no index.ts re-exporting).
- Arguments must be explicitly typed; return types inferred.

## Components
- Use `function` keyword for all React components and handlers.
- Business logic lives in custom hooks (`src/hooks/`). TSX files contain only UI + hook calls.
- Astro components for server-rendered content. React islands only where client-side interactivity is required.
- Favour types over interfaces.

## Types (Single Source of Truth)
- `src/db/schema.ts` (Drizzle) is the single source of truth for all data shapes.
- `src/types/database.ts` re-exports `InferSelectModel` types from Drizzle schema. Never define row types manually.
- `src/db/client.ts` provides `createDb(d1)`. Access via `locals.db` (set by middleware).
- `src/types/api.ts` defines request/response contracts composing database types.
- `src/types/domain.ts` defines enriched/computed types for UI.
- All queries use Drizzle query builder. No raw SQL.
- Categories/types are plain strings, not union types. Lookup maps use `Record<string, string>`.

## Icons
- NEVER inline SVGs. All icons live in `src/icons/` as TSX components.
- Each icon exports a named function accepting `{ className, strokeWidth }` from `src/icons/types.ts`.
- Import and use the icon component everywhere (Astro pages, React islands).
- CupIcon = mangiare section icon, CalendarIcon = fare section icon. Reuse these with different colors via `className`.

## Styling
- TailwindCSS 4 utility classes. No CSS modules, no styled-components.
- Mobile-first responsive design. Start with mobile, add `md:` and `lg:` breakpoints.
- Design tokens in `src/styles/global.css` under `@theme`.

## API Routes
- File-based routing under `src/pages/api/`.
- Named exports: `GET`, `POST`, `PUT`, `DELETE`.
- Access D1 via `locals.runtime.env.DB`.
- Always return typed JSON responses. Always handle errors with proper HTTP status codes.

## Database
- Drizzle ORM over Cloudflare D1. Schema in `src/db/schema.ts`.
- All migrations in `src/db/migrations/` numbered sequentially (raw SQL for D1 execute).
- Use Drizzle query builder for all queries. No raw SQL.

## Package Manager
- Bun exclusively.

## Checks
- Run `bun run typecheck` and `bun run test` to validate changes.
