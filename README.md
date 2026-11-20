# Everyday

A personal fitness habit tracker. Create habits that run on chosen weekdays, check them off each day, and watch your streaks and completion rates build up over time.

Everyday is a **frontend-only** app: it runs entirely against a mock service layer backed by `localStorage`. There is no backend, API, or database code in this repository, and no data leaves the device.

## Screens

| Screen | What it shows |
| --- | --- |
| **Home** (`/`) | Greeting, today's progress ring, current streak, pending and completed habits, overall progress (Week / Month / All) |
| **Analytics** (`/analytics`) | Week / Month / Year range, completion-rate and streak stat cards, consistency heatmap, completion trend chart, per-habit breakdown, day detail sheet |
| **Habits** (`/habits`) | All habits with edit and delete, floating **New habit** button, add/edit form |
| **Account** (`/account`) | Profile, name edit, theme (Light / Dark), reset app data, delete account |

Below 768px the app uses a bottom tab bar; from 768px up it uses a left sidebar (an icon rail between 768px and 1024px).

## Features

- **Habits** with a name (max 40 characters, unique), a preset icon, a color, and weekday selection with "Every day" / "Weekdays" shortcuts.
- **Daily check-off** — habits move between Pending and Completed, and the ring, streak, and percentages update immediately.
- **Streaks** that only count days where every scheduled habit was completed, and skip days with nothing scheduled.
- **Analytics** with a month calendar heatmap and a GitHub-style year heatmap; selecting a day opens a read-only detail sheet listing what was done and not done.
- **Light and dark themes** applied before first paint, so there is no flash of the wrong theme.
- **Honest states** everywhere: loading skeletons, empty states with a next step, and error messages with retry.
- **Accessible by default**: semantic landmarks, keyboard support with roving focus on the heatmap, visible focus rings, WCAG AA contrast, reduced-motion support, and ~44px touch targets.

## Tech stack

| Concern | Choice |
| --- | --- |
| Framework | React 19 + Vite 8 (SPA, no SSR) |
| Language | TypeScript (strict) |
| Routing | React Router 8 |
| Styling | Tailwind CSS 4 with CSS-variable color tokens |
| UI primitives | shadcn/ui (Radix UI, Vaul for bottom sheets) |
| Icons | lucide-react |
| Charts | Recharts |
| Heatmap | Custom CSS grid (no library) |
| State | Zustand |
| Forms | react-hook-form + zod |
| Dates | date-fns |
| Toasts | sonner |
| Fonts | @fontsource (Roboto, Roboto Condensed) |
| Tests | Vitest |
| Code quality | ESLint + Prettier |

## Getting started

Requirements: Node.js `^20.19.0` or `>=22.12.0`, and npm.

The app lives in `frontend/`:

```bash
cd frontend
npm install
npm run dev
```

Then open http://localhost:5173.

| Script | What it does |
| --- | --- |
| `npm run dev` | Start the Vite dev server |
| `npm run build` | Type-check (`tsc -b`) and build for production into `dist/` |
| `npm run preview` | Serve the production build locally |
| `npm run lint` | Run ESLint |
| `npm run test` | Run the Vitest tests for the habit, streak, and completion helpers |
| `npm run format` | Format all files with Prettier |

## Project structure

```
frontend/
  src/
    components/ui/     # shadcn/ui primitives
    components/        # shared components (ProgressRing, EmptyState, layout, dialogs)
    features/
      home/            # dashboard
      habits/          # list, form, icon/color/weekday pickers
      analytics/       # stats, heatmap, trend chart, day detail sheet
      account/         # profile, name edit, theme, reset, danger zone
      auth/            # login/signup screens, kept but not routed
    lib/
      services/        # mock data layer (localStorage)
      utils/           # date, streak, and completion helpers
    store/             # Zustand stores
    routes/            # router, bootstrap, 404
    styles/            # Tailwind entry, design tokens, fonts
    main.tsx
```

## Data layer

Components and stores never touch `localStorage` directly. Everything goes through `frontend/src/lib/services/`, which is async and validates saved data so corrupted storage produces an error state instead of a crash.

| File | Responsibility |
| --- | --- |
| `auth.ts` | `signUp`, `logIn`, `logOut`, `getCurrentUser`, `updateName`, `deleteAccount` |
| `habits.ts` | `getHabits`, `createHabit`, `updateHabit`, `deleteHabit` |
| `completions.ts` | `getCompletions`, `toggleCompletion` |
| `storage.ts` | localStorage adapter, keys, validation, simulated latency |
| `errors.ts` | `ServiceError` and the user-facing error message helper |

Storage keys: `everyday:auth`, `everyday:data:<userId>:habits`, `everyday:data:<userId>:completions`, and `everyday-theme` for the theme. Keys from before the rename to Everyday (`fitency:*`, `fitency-theme`) are migrated once on first load.

To connect a real backend, replace only the service functions. Their signatures and the `Habit`, `Completion`, and `User` types in `frontend/src/lib/types.ts` are the seam; nothing else in the app needs to change.

## Sign-in is disabled

The app boots with a local device profile: it adopts the most recently saved account, or creates one named "You". The Login and Signup screens and the mock auth functions still exist in `src/features/auth/` but are not routed, so there is nothing to sign in to or sign out of yet. Account settings, including delete account (which removes the local profile, habits, and history and starts fresh), work against that local profile.

## Docs

- [`docs/PRD.md`](docs/PRD.md) — product requirements, design system, and scope.
- [`docs/decisions.md`](docs/decisions.md) — background on product and technical decisions.
