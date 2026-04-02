# Oggi a Ortona Style Guide

## Design Philosophy

Warm Mediterranean warmth, not cold minimalism. Every surface, color, and shadow should evoke sun-baked stone, olive oil, and candlelit Italian evenings. Dark mode is not inverted light mode; it is the same town at night.

## Color System

All colors are CSS custom properties defined in `src/styles/global.css` under `@theme`. Dark mode overrides live in the `html.dark` selector. Components use Tailwind utilities (`bg-surface`, `text-primary`, `border-border`) which resolve to `var()` references and automatically adapt to the active theme.

**Never use raw Tailwind palette colors** (e.g. `bg-amber-50`, `text-violet-700`). Always use a design token.

### Core Palette

| Token | Light | Dark | Usage |
|---|---|---|---|
| `primary` | `#2c1810` | `#e8dfd4` | Body text, headings |
| `secondary` | `#f5efe6` | `#2a2420` | Subtle warm backgrounds |
| `accent` | `#8b5e14` | `#d4a040` | CTAs, links, focus rings. Neutral amber, not section-specific |
| `accent-hover` | `#744e0e` | `#be8d35` | Hover state for accent |
| `surface` | `#fdfaf6` | `#141110` | Page background |
| `surface-alt` | `#f7f2eb` | `#1e1a16` | Alternate/hover surfaces |
| `surface-warm` | `#f0e8db` | `#252018` | Inactive toggle backgrounds |
| `card` | `#ffffff` | `#252019` | Cards, inputs, modals, dropdowns |
| `border` | `#e0d5c5` | `#3a322b` | Default borders |
| `border-light` | `#ece5da` | `#2e2820` | Subtle borders |
| `muted` | `#6d6155` | `#9a8d80` | Secondary text, active pill background |
| `success` | `#4a7c59` | `#5a9a6e` | Open/active/approve states |
| `danger` | `#b84233` | `#d45a4a` | Error/closed/delete states |

### Section Colors

Two sections define the app identity. Each has a full ramp for gradients and tinted backgrounds.

| Token | Purpose |
|---|---|
| `mangiare` | Restaurant section accent (burnt orange) |
| `mangiare-light` | Tinted page/card background |
| `mangiare-mid` | Gradient midpoint |
| `mangiare-deep` | Gradient endpoint |
| `mangiare-muted` | Hover accents, decorative |
| `fare` | Event section accent (steel blue) |
| `fare-light/mid/deep/muted` | Same ramp as mangiare |

### Semantic Color Groups

**Promotion types** (used in badges, cards, entries):
- `promo-deal` / `promo-deal-bg` (warm plum)
- `promo-news` / `promo-news-bg` (warm teal)
- Special type reuses `mangiare` / `mangiare-light`

**Event categories** (pill badges):
- `cat-sagra`, `cat-cibo`, `cat-musica`, `cat-mercato`, `cat-cultura`, `cat-sport`, `cat-altro`
- Each has a `-bg` companion for the badge background
- Defined in `src/config/categories.ts` as class pairs like `"bg-cat-sagra-bg text-cat-sagra"`

**Status indicators**:
- `status-pending` / `status-pending-bg` (warm amber)
- `status-rejected` / `status-rejected-bg` (warm red)

## Typography

### Fonts

| Token | Family | Usage |
|---|---|---|
| `font-family` | DM Sans | Body text, labels, buttons, metadata |
| `font-family-display` | Playfair Display | Headings, card titles, hero numbers |

### Type Scale

| Pattern | Classes | Where |
|---|---|---|
| Page title | `font-family-display text-3xl font-medium tracking-tight` | H1 on list pages |
| Hero number | `font-family-display text-[2.25rem] font-semibold` | Home page date, section titles |
| Detail title | `font-family-display text-2xl font-medium leading-tight` | Bottom sheet H1 |
| Card title | `font-family-display text-lg font-medium` (restaurants) / `text-base font-medium` (events) | Card headings |
| Body text | `text-[13px] leading-relaxed text-muted` | Descriptions, paragraphs |
| Section divider | `text-[10px] font-semibold uppercase tracking-[0.15em] text-muted` | Section headers above lists |
| Metadata | `text-[11px] text-muted` | Times, types, dates |
| Micro label | `text-[10px] font-semibold uppercase tracking-wide` | Category badges, status pills |
| Button text | `text-[13px] font-semibold` | All buttons |
| Form label | `text-[13px] font-medium text-primary` | Input labels |

## Spacing

### Hierarchy

| Gap | Tailwind | Usage |
|---|---|---|
| 12px | `gap-3` | Between cards in a list |
| 20px | `pb-5` / `gap-5` | Between filter area and content |
| 24px | `mt-6` | Between list sections (this week / upcoming) |
| 32px | `mt-8` | Between major page sections (profile groups) |

### Layout Constants

- Page max width: `max-w-lg` (512px) centered with `mx-auto`
- Horizontal padding: `px-5` (20px)
- Bottom clearance: `pb-24` (for floating nav)
- Safe area top: `pt-safe` (custom utility: `max(1rem, env(safe-area-inset-top))`)

## Elevation

| Token | Light | Dark | Usage |
|---|---|---|---|
| `shadow-card` | `0 1px 3px rgba(0,0,0,0.08), ...` | `0 1px 3px rgba(0,0,0,0.4), ...` | Cards, inputs, toggles |
| `shadow-elevated` | `0 4px 24px rgba(0,0,0,0.08)` | `0 4px 24px rgba(0,0,0,0.4)` | Modals, bottom sheet |

Cards use `rounded-2xl bg-card shadow-card`. Never use inline shadow values.

## Components

### Button (`src/components/ui/Button.tsx`)

Variants: `primary` (accent), `outline` (bordered), `ghost` (transparent), `danger` (red tint).
Base includes `flex items-center justify-center rounded-xl py-3 text-[13px] font-semibold`.
Use `fullWidth` prop for form submissions.

### Pill (`src/components/ui/Pill.tsx`)

Toggle filters. Active state: `bg-muted text-card shadow-sm`. Inactive: `bg-surface-warm text-muted`.

### ListHeader (`src/components/shared/ListHeader.tsx`)

Shared header for list pages (restaurants, events). Renders title, ViewToggle, refresh button, and filter children. Pass `section="mangiare"` or `section="fare"` for the refresh button hover color.

### PillAction (`src/components/shared/PillAction.tsx`)

Small action links/buttons. Variants: `default`, `accent`, `promo`.

### Icons

All in `src/icons/`. Each exports a named function accepting `{ className, strokeWidth }` from `src/icons/types.ts`. Never inline SVGs. Default size `h-4 w-4`, override via `className`.

## Dark Mode

### How It Works

1. `<script>` in `<head>` (AppHead.astro) reads `localStorage.theme`, falls back to `prefers-color-scheme`, adds `.dark` to `<html>` before paint
2. `html.dark` selector in `global.css` overrides all `--color-*` and `--shadow-*` variables
3. Components use token utilities (`bg-surface`, `text-primary`, `bg-card`) which auto-adapt
4. No `dark:` prefixes needed anywhere

### Theme Toggle

Three-way selector in ProfileDashboard: Sistema / Chiaro / Scuro. Stores in `localStorage.theme`. Dispatches `themechange` event so `useThemeColor` updates the meta theme-color.

### Rules

- **Never use `bg-white`**. Use `bg-card`.
- **Never use `text-white` on `bg-primary`**. Use `text-card` (adapts in both modes).
- `text-white` is only safe on colors that stay dark in both modes: `bg-[#25D366]` (WhatsApp), `bg-accent`, `bg-mangiare`, `bg-fare`.
- Inline SVG strokes/fills that need theme awareness must read computed CSS properties via `getCardColor()` from `src/utils/map.ts`.
- Leaflet map uses `getTileUrl()` which returns Voyager (light) or Dark Matter (dark) tiles.

## Map

- Tile provider: CartoDB Voyager (light) / Dark Matter (dark)
- Popup styles in `MAP_CSS` (`src/utils/map.ts`) use `var()` references
- Pin SVGs receive the card color as a stroke parameter at render time
- Zoom controls use `var(--color-surface-alt)` background

## File Organization

| Path | Contains |
|---|---|
| `src/styles/global.css` | All tokens, dark mode overrides, base resets, animations |
| `src/config/categories.ts` | Category/promotion color class mappings |
| `src/utils/promotionBadge.ts` | Promotion badge style resolver |
| `src/components/ui/` | Reusable primitives (Button, Pill, Input, etc.) |
| `src/components/shared/` | Cross-section components (ListHeader, ViewToggle, etc.) |
| `src/icons/` | All icon components |
