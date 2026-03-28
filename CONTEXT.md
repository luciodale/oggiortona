# Oggi a Ortona — Project Context

## What It Is

"Oggi a Ortona" is a local community utility app for Ortona, a small coastal town (~23k people) in Abruzzo, Italy. Not a social media feed. Not a portal. A utility with personality that answers "what do I need right now?"

## The Problem It Solves

- Local info (restaurants, events, classifieds) is scattered across multiple Facebook groups
- No single place for "what's open now" or "what's happening this week"
- Tourists in summer google "where to eat in Ortona" and get TripAdvisor garbage
- Locals check FB groups daily but info is buried in noise

## Two Core Sections

1. **Mangiare** (eat) — restaurant/food directory with live "open now" status + optional daily specials (piatto del giorno). The static directory is always useful; daily specials are a bonus dynamic layer.
2. **Fare** (do) — events calendar (sagre, musica, mercato, cultura, sport). Grouped by "this week" / "upcoming".

## Key Design Decisions

- **Utility, not social media.** The base layer (restaurant directory, event calendar) is always useful even with zero new content. Dynamic content (daily specials, community posts) is a bonus, not a requirement.
- **No registration for browsing.** Zero friction. Click a link from Facebook, it works instantly.
- **PWA, not native app.** Shared via link on Facebook. No app store download friction. Push notifications via Web Push API (iOS 16.4+).
- **WhatsApp-first contribution model (planned).** Restaurant owners send daily specials via WhatsApp initially. Simple form later.
- **Italian language throughout UI.** Code in English.
- **Logos via URL.** Restaurants and events can have a small logo/image via external URL. No image storage needed.
- **One daily push notification (planned).** Respectful, useful. Not daily if nothing new.

## Business Model

- Free at first to build adoption
- Later: EUR 5/month for businesses who want daily posting (pinned listings, daily specials)
- **Distribution**: Ortona Facebook groups (Lucio is local, can post there directly)
- **Growth path**: replicate to other Abruzzo towns (Vasto, Lanciano, San Vito Chietino, Pescara)

## Why: Lucio's Side Gig

- Lucio is employed by JUXT, contracting at Citi Bank on a high-profile project
- This is a side project with zero overlap with his banking work (deliberate)
- Low effort for someone with his frontend skills
- Can be advertised locally on Facebook, no public-facing personal brand needed
- Potential to grow into a small regional product

## Architecture

- `src/db/schema.sql` is the single source of truth for all data shapes
- `src/types/database.ts` mirrors schema 1:1
- `src/types/api.ts` defines request/response contracts
- `src/types/domain.ts` defines enriched types (e.g., RestaurantWithStatus)
- Astro pages fetch data server-side from D1, pass to React islands as props
- React islands handle client-side filtering/sorting (dataset is small enough)
- Custom hooks contain all business logic; TSX files are UI-only

## Current State (2026-03-28)

Fully implemented MVP:
- Both sections with API routes, pages, React islands, hooks
- 8 seed restaurants, 6 events
- Filtering, sorting, category tabs, open-now detection
- PWA setup (service worker, manifest)
- 46 unit tests passing, 0 type errors

## Not Yet Done

- PWA icons (192px, 512px) — placeholder favicon only
- Push notifications
- Domain purchase (oggiortona.com is available)
- Cloudflare D1 production database creation
- Real restaurant data for Ortona
- Admin interface for managing restaurants/events
- Populate real logos/images for restaurants and events

## Content Strategy

- Restaurant owners don't need to post every day. Their listing is permanent. They only post when they have something special.
- Events are populated by Lucio from Facebook groups initially, then by community.
- A dead day with zero new posts is fine — the directory and calendar are always useful.
