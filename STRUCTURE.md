# Code Structure Standards

Every file has one job. Components are thin shells. Logic lives in hooks and utilities. This document is the enforced contract.

## Directory Layout

```
src/
  building-blocks/       Astro layout primitives (AppWrapper, Layout, BottomNav, etc.)
  components/
    auth/                Auth-related React islands (SignInForm, LogoutButton)
    events/              Event section components
    profile/             Profile section components
      storefront/        Storefront sub-components (PromotionForm, PromotionCard, PromotionsList)
    restaurants/         Restaurant section components
      form/              RestaurantForm sub-components (DayRow, UrlStatus, AddressSearchField)
    shared/              Cross-section components (MapView, PwaInstallPrompt, IconBubble)
    ui/                  Atomic UI primitives (Button, Input, Textarea, Pill, TimePicker, DurationSelect)
  config/                Static configuration (categories, site, profileRoutes)
  db/                    Database layer (schema, client, migrations, seed)
  hooks/                 All custom React hooks
  icons/                 SVG icon components (one per file)
  pages/
    api/                 API route handlers
    events/              Event pages
    restaurants/         Restaurant pages
    profile/             Profile catch-all page
    add/                 Content creation pages
    sign-in/             Auth pages
  schemas/               Zod validation schemas
  styles/                Global CSS with theme tokens
  types/                 Type definitions (database, api, domain)
  utils/                 Pure functions and tested utilities
specs/                   Allium behavioral specifications
```

## Component Rules

### React Components (.tsx)

**Maximum content:** hook calls + JSX composition. No inline logic.

A component file contains:
1. Import statements
2. Props type definition
3. Named export function that calls hooks and returns JSX

A component file does NOT contain:
- `useState`, `useEffect`, `useCallback`, `useMemo` calls directly (these belong in hooks)
- Data fetching (`fetch`, API calls)
- Data transformation (filtering, mapping, sorting)
- Derived computations
- Sub-component definitions (extract to own file)
- Constants or configuration objects (extract to `config/` or `utils/`)

**Exception:** a single `useRef` for a DOM container passed to a hook is acceptable inline.

**Size guideline:** if a component exceeds ~80 lines of JSX, extract sub-components.

```
-- CORRECT: thin component
function RestaurantList({ restaurants }) {
  const containerRef = useRef(null);
  useZipperScroll(containerRef);
  const { filters, filtered, toggleOpenNow } = useRestaurantFilters(restaurants);

  return (
    <div ref={containerRef}>
      <Pill active={filters.openNow} onClick={toggleOpenNow}>Aperto ora</Pill>
      {filtered.map((r) => <RestaurantCard key={r.id} restaurant={r} />)}
    </div>
  );
}

-- WRONG: logic inline
function RestaurantList({ restaurants }) {
  const [openNow, setOpenNow] = useState(false);
  const filtered = useMemo(() =>
    restaurants.filter(r => !openNow || r.isOpen).sort(...)
  , [restaurants, openNow]);
  // ... 200 lines of JSX with inline sub-components
}
```

### Astro Components (.astro)

**Frontmatter:** import statements + one function call for data + simple variable assignments.

Data fetching and transformation go in `utils/` functions that accept `db` as a parameter.

```
-- CORRECT
const { specials, deals } = await fetchHomePageData(Astro.locals.db);
const greeting = getGreeting(new Date().getHours());

-- WRONG
const [a, b, c, d] = await Promise.all([
  db.select()...,
  db.select()...,
  db.select()...,
  db.select()...,
]);
const countByType = new Map(b.map(...));
// 30 lines of data processing
```

### Sub-component Extraction

Extract a sub-component when:
- A section of JSX exceeds ~40 lines
- The same structure repeats (even twice)
- The section has its own props/data dependencies distinct from the parent

Place sub-components in a subdirectory named after the parent:
- `components/profile/storefront/PromotionCard.tsx`
- `components/restaurants/form/DayRow.tsx`

## Hook Rules

### Naming
- `use` prefix required
- Descriptive of what the hook manages: `useRestaurantFilters`, `useViewMode`, `useMapPins`
- Data-fetching hooks: `useRestaurantDetail`, `useUserRestaurants`, `useExpiredPromotions`

### Structure
```
export function useThingName(params) {
  // state declarations
  // effects
  // callbacks
  // derived values
  return { publicApi };
}
```

### What belongs in a hook
- `useState`, `useEffect`, `useCallback`, `useMemo`, `useRef`
- API calls and data fetching
- Event listeners and cleanup
- Data transformation and filtering
- Timer/interval management
- URL state synchronization
- Form state management

### What does NOT belong in a hook
- JSX rendering
- CSS class computation (this is UI concern, stays in component)
- Direct DOM manipulation beyond refs

### Testing
- Export the pure logic function separately from the hook for testing:
  ```
  // Testable pure function
  export function restaurantsToMapPins(restaurants) { ... }

  // Hook wraps it with memoization
  export function useMapPins(restaurants) {
    return useMemo(() => restaurantsToMapPins(restaurants), [restaurants]);
  }
  ```

## Utility Rules

### Location: `src/utils/`

### What qualifies as a utility
- Pure functions (no side effects, no React, no DOM)
- Data transformations
- Formatters and parsers
- Validation helpers
- Constants that multiple files need

### Naming
- File name matches primary export concept: `enrichRestaurant.ts`, `promotionBadge.ts`
- Function names are verbs: `groupPromotionsByRestaurant`, `isPromotionExpired`, `getGreeting`
- Constants are UPPER_SNAKE: `ORTONA_CENTER`, `DAY_NAMES`, `MAP_CSS`

### Testing
- Every utility file has a corresponding `.test.ts` file
- Test the pure function, not the hook that wraps it
- For browser-dependent functions (`window`), extract a pure inner function that accepts parameters:
  ```
  // Testable
  export function parseRedirectUrl(search: string) { ... }

  // Browser wrapper
  export function getRedirectUrl() {
    if (typeof window === "undefined") return "/";
    return parseRedirectUrl(window.location.search);
  }
  ```

## API Route Rules

### Location: `src/pages/api/`

### Structure per handler
```
export async function GET({ locals, params }: APIContext): Promise<Response> {
  // 1. Extract db and auth from locals
  // 2. Validate params
  // 3. Query using Drizzle (call utility for complex enrichment)
  // 4. Return Response.json()
}
```

### Conventions
- Named exports only: `GET`, `POST`, `PUT`, `DELETE`
- Auth check at top: `if (!user) return Response.json({ error: "Non autenticato" }, { status: 401 })`
- Ownership check before mutation: `if (restaurant.ownerId !== user.id) return Response.json({ error: "Non autorizzato" }, { status: 403 })`
- Zod validation for request bodies
- Shared enrichment logic in `utils/enrichRestaurant.ts`, not duplicated across routes
- Always return typed JSON responses

## Type System Flow

```
src/db/schema.ts          Drizzle table definitions (SINGLE SOURCE OF TRUTH)
        |
        v
src/types/database.ts     InferSelectModel re-exports (UserRow, RestaurantRow, etc.)
        |                 + hand-written value types (DaySchedule, OpeningHours)
        v
src/types/domain.ts       Enriched types (RestaurantWithStatus = RestaurantRow + computed fields)
        |
        v
src/types/api.ts          Request/response contracts composing database + domain types
```

Rules:
- Never define row types manually. Always infer from Drizzle schema.
- Domain types extend database types with computed fields.
- API types compose database and domain types.
- Categories/types are plain strings with `Record<string, string>` lookup maps.

## Config Rules

### Location: `src/config/`

Contains:
- `categories.ts`: label maps, color maps, type arrays
- `site.ts`: site metadata, nav items
- `profileRoutes.ts`: TanStack Router route tree

Does NOT contain:
- React components (exception: `profileRoutes.ts` imports page components for route definitions)
- Business logic
- Data fetching

## Icon Rules

- Every icon in `src/icons/` as a named TSX function
- Props: `{ className, strokeWidth }` from `src/icons/types.ts`
- Never inline SVGs in components
- Never inline SVGs in Astro templates (use the icon component)

## Allium Spec Rules

### Location: `specs/`

- One `.allium` file per domain area: `restaurants.allium`, `promotions.allium`, `events.allium`, `auth.allium`
- Specs describe observable behavior, not implementation
- Cross-references via `use "./other.allium" as alias`
- Surfaces map to pages/API endpoints
- Rules map to API handlers and middleware logic
- Entities map to Drizzle schema tables
- Keep specs in sync with code: after changing domain behavior, update the corresponding spec
