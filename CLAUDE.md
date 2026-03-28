# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**OneTurn** — a smart queue and booking platform for Uzbekistan's public services (banks, clinics, government offices). Monorepo with Next.js 16, Tailwind CSS 4, and shadcn/ui.

## Commands

All commands run from the repo root via Turborepo:

```bash
pnpm dev          # Start all dev servers (Turbopack)
pnpm build        # Build all packages
pnpm lint         # Lint all packages
pnpm format       # Format all packages with Prettier
pnpm typecheck    # TypeScript type checking
```

Per-workspace commands:

```bash
pnpm --filter embed dev          # Widget demo (port 3001)
pnpm --filter dashboard dev      # Org dashboard (port 3002)
pnpm --filter web dev            # Original web app (port 3000)
```

Adding shadcn/ui components:

```bash
pnpm dlx shadcn@latest add <component> -c packages/ui
```

## Architecture

**Monorepo structure (Turborepo + PNPM):**

**Apps:**

- `apps/embed` — Widget demo app. Shows a fake bank website with the OneTurn booking widget (6-step flow: location → branch → service → slot → verification → success). State managed via React Context + useReducer in `components/widget/booking-context.tsx`.
- `apps/dashboard` — Organization dashboard. Login page + sidebar layout. Key feature: live queue Kanban board (`/dashboard/live-queue`) with 3 columns (Kutmoqda/Xizmatda/Yakunlandi). State in `components/live-queue/queue-context.tsx`.
- `apps/web` — Original template web app.

**Packages:**

- `packages/ui` — Shared UI component library (shadcn/ui + Radix UI + CVA). Components in `src/components/`, hooks in `src/hooks/`, utils in `src/lib/`. Brand CSS variables defined in `src/styles/globals.css`.
- `packages/types` — Shared TypeScript interfaces: Branch, Service, Booking, Organization, StaffMember, UserRating.
- `packages/mock-data` — Seeded realistic demo data: Agrobank org with 3 Tashkent branches, 100 bookings, Uzbek names. Used by both apps.
- `packages/eslint-config` — Shared ESLint configs (`base.js`, `next.js`, `react-internal.js`)
- `packages/typescript-config` — Shared tsconfig bases (`base.json`, `nextjs.json`, `react-library.json`)

**Import conventions:**

```ts
import { Button } from "@workspace/ui/components/button"
import { cn } from "@workspace/ui/lib/utils"
import type { Branch } from "@workspace/types"
import { mockBranches } from "@workspace/mock-data"
```

## Design System

Brand colors available as CSS vars and Tailwind classes (`bg-brand-primary`, `text-brand-accent`, etc.):

- `--brand-primary: #2563EB` (blue — trust, action)
- `--brand-accent: #10B981` (green — success, live status)
- `--brand-warning: #F59E0B` (amber — busy, medium load)
- `--brand-danger: #EF4444` (red — overloaded, no-show)

Busy index convention: green (0-40%), amber (41-70%), red (71-100%).

All UI text is in Uzbek language.

## Code Style

- Prettier: no semicolons, double quotes, 2-space indent, trailing commas (es5)
- Tailwind CSS 4 with OKLCH color system + brand CSS variables
- `cn()` utility (clsx + tailwind-merge) for class merging
- `cva()` for component variant definitions
- TypeScript strict mode with `noUncheckedIndexedAccess`
- Framer Motion for animations, react-leaflet for maps, Recharts for charts
- Node >=20, pnpm@9.15.9
