# Fitency

Personal fitness habit tracker (frontend). Create weekday-based habits, check them off each day, and see streaks and progress over time.

This is the **frontend only**. It runs entirely against a mock service layer backed by `localStorage`; there is no backend, API, or database code in this repository.

> **Auth and Account are currently disabled in the UI.** `/login`, `/signup`, and `/account` are not routed; the first two redirect to Home. The app boots with a local device profile: it adopts the most recently saved account, or creates one named "You". The Login/Signup screens, the whole Account section, and all mock auth functions remain in `src/` so they can be re-enabled later. Theme selection (Light/Dark) lives in the app header; the bottom navigation has three tabs (Home, Analytics, Habits). New habits are created with the floating action button on the Habits page.

## Requirements

- Node.js `^20.19.0` or `>=22.12.0`
- npm

## Scripts

| Script            | What it does                                                |
| ----------------- | ----------------------------------------------------------- |
| `npm run dev`     | Start the dev server (http://localhost:5173)                |
| `npm run build`   | Type-check (`tsc -b`) and build for production into `dist/` |
| `npm run preview` | Serve the production build locally                          |
| `npm run lint`    | Run ESLint                                                  |
| `npm run test`    | Run the Vitest unit tests for the logic helpers             |
| `npm run format`  | Format all files with Prettier                              |

## Setup

```bash
npm install
npm run dev
```

Then open http://localhost:5173. To check the production build locally:

```bash
npm run build
npm run preview
```

## Data layer (for the backend developer)

All data access goes through `src/lib/services/` — async functions such as `getHabits()`, `createHabit()`, `toggleCompletion()`, and the mock auth functions (`signUp()`, `logIn()`, ...). Components and stores never touch `localStorage` directly; `storage.ts` is the only adapter that reads and writes app data, and it also validates saved data so corrupted storage fails with an error state instead of a crash.

| File             | Responsibility                                                               |
| ---------------- | ---------------------------------------------------------------------------- |
| `auth.ts`        | `signUp`, `logIn`, `logOut`, `getCurrentUser`, `updateName`, `deleteAccount` |
| `habits.ts`      | `getHabits`, `createHabit`, `updateHabit`, `deleteHabit`                     |
| `completions.ts` | `getCompletions`, `toggleCompletion`                                         |
| `storage.ts`     | localStorage adapter, keys, validation, simulated 200–500 ms delay           |
| `errors.ts`      | `ServiceError` and the user-facing error message helper                      |

Current mock keys: `fitency:auth`, `fitency:data:<userId>:habits`, and `fitency:data:<userId>:completions`. The theme preference is UI state stored separately under `fitency-theme` and is not part of the data service.

To plug in a real backend, replace only the service functions; their signatures and the `Habit`, `Completion`, and `User` types in `src/lib/types.ts` are the seam. Nothing else in the app needs to change.

## Project structure

```
src/
  components/ui/     # shadcn/ui primitives
  components/        # shared components
  features/          # home, habits, analytics (account/auth kept in source)
  lib/services/      # mock data layer (localStorage)
  lib/utils/         # date, streak, and completion helpers
  store/             # Zustand stores
  routes/            # router setup and local-profile bootstrap
  styles/            # Tailwind entry, tokens, fonts
  main.tsx
```
