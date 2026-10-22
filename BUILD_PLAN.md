# Fitency: Frontend Build Plan

**Source of truth:** `PRD.md`. This file only says *what order to build in* and *tracks progress*. If this plan and the PRD disagree, the PRD wins. Log the conflict under "Blockers and questions".

**Scope:** frontend only. No backend, API, or database work. Do not build anything listed under "Future / out of scope" in the PRD.

---

## How the agent must use this file

1. **At the start of every session:** read `PRD.md`, then this file. Find the first unchecked task and continue from there.
2. **Work in phase order.** Do not start a phase until the previous phase's "Done when" is met.
3. **Status markers** (use exactly these):
   - `[ ]` not started
   - `[~]` in progress (only one task at a time should be `[~]`)
   - `[x]` done and verified
   - `[!]` blocked (explain in "Blockers and questions")
4. **Verify before checking off.** A task is `[x]` only when it works, `npm run lint` and `npm run build` pass, and (for UI tasks) it looks right at **375px wide** and at **1280px wide**, in **both light and dark themes**.
5. **After finishing each task:** change its marker to `[x]` and add one line to the **Progress log** (date, task id, what was done, key files).
6. **After finishing each phase:** update the **Progress tracker** table, then make a commit using the suggested message.
7. **Never expand scope.** No extra pages, features, or libraries beyond the PRD stack. If something seems missing, log it as a question instead of building it.
8. **If the PRD is ambiguous or you are blocked:** mark the task `[!]`, log the question, and move to the next independent task. Do not guess on anything that changes behavior.
9. **Keep code clean:** TypeScript strict, small modular components, semantic HTML, brief meaningful comments, no unused code.

---

## Progress tracker

| Phase | Name | Status | Done / Total |
|---|---|---|---|
| 0 | Project setup | Done | 7 / 7 |
| 1 | Design system foundation | Done | 8 / 8 |
| 2 | Data layer and logic | Done | 8 / 8 |
| 3 | App shell, routing, and auth | Done | 7 / 7 |
| 4 | Habits page | Done | 8 / 8 |
| 5 | Home (Dashboard) | Done | 7 / 7 |
| 6 | Analytics | Done | 8 / 8 |
| 7 | Account | Done | 5 / 5 |
| 8 | Polish: states, responsive, accessibility | Done | 6 / 6 |
| 9 | Final QA | Done | 6 / 6 |

Status values: Not started, In progress, Done.

---

## Phase 0: Project setup
*PRD refs: sections 3 and 4.*

- [x] **0.1** Scaffold a **React + Vite + TypeScript** project (strict mode on).
- [x] **0.2** Install and configure **Tailwind CSS**.
- [x] **0.3** Initialize **shadcn/ui** (with Radix and Vaul) and confirm one component renders.
- [x] **0.4** Install the remaining PRD stack: React Router, Zustand, react-hook-form, zod, date-fns, Recharts, lucide-react, sonner, `@fontsource` (Roboto Condensed, Roboto), and the theme library (`next-themes` or a custom ThemeProvider).
- [x] **0.5** Configure **ESLint + Prettier**, and add `lint`, `format`, and `build` scripts.
- [x] **0.6** Create the **folder structure** from PRD section 4 (empty folders get a placeholder file only if needed).
- [x] **0.7** Set up path alias (`@/`), `import.meta.env` typing, and a clean `README` with run instructions.

**Done when:** `npm run dev`, `npm run lint`, and `npm run build` all succeed on the empty app.
**Commit:** `chore: scaffold Fitency with Vite, React, TypeScript, and Tailwind`

---

## Phase 1: Design system foundation
*PRD refs: section 5.*

- [x] **1.1** Define **CSS-variable color tokens** for light and dark (soft charcoal dark), including accent orange, completed green, surfaces, text, borders, and chart colors.
- [x] **1.2** Load fonts: **Roboto Condensed** (headings, numbers) and **Roboto** (body). Add Tailwind font families and utility classes for each.
- [x] **1.3** Implement **theming** (Light / Dark / System) with no flash on load, persisted across reloads.
- [x] **1.4** Set the soft, rounded shape language (radius, shadow tokens) in the Tailwind config.
- [x] **1.5** Build base UI components: **Button, Input, Skeleton, EmptyState, Toast (sonner setup)**.
- [x] **1.6** Build **ProgressRing** (accessible, accepts value and label).
- [x] **1.7** Build **BottomSheet/Modal** (bottom sheet on mobile, modal on desktop) and **ConfirmDialog**.
- [x] **1.8** Create a temporary dev-only **style preview** route to eyeball all components in both themes, then remove it before Phase 9 ends.

**Done when:** every base component renders correctly in light and dark at 375px and 1280px, with visible focus states.
**Commit:** `feat: add design tokens, theming, and base UI components`

---

## Phase 2: Data layer and logic
*PRD refs: sections 8, 9, and the placeholder data shapes.*

- [x] **2.1** Add the placeholder **types** (`Habit`, `Completion`, `User`) in a shared types file.
- [x] **2.2** Build **date helpers** (local `YYYY-MM-DD`, weekday numbering Mon=1 to Sun=7, range builders for week, month, year, all).
- [x] **2.3** Build **logic helpers** in `lib/utils/`: `isScheduled`, `completionRate`, `currentStreak`, `bestStreak`, and per-day completion %, exactly following PRD section 8 (including zero-scheduled handling with no NaN).
- [x] **2.4** Verify the helpers with **unit tests** covering: habit created mid-range, days with no scheduled habits (skipped in streaks), unfinished today not breaking a streak, empty ranges, and weekday filtering. (Vitest is the Vite-native choice and is a dev-only dependency; if not permitted, use a plain verification script and note it in the log.)
- [x] **2.5** Build the **service layer** in `lib/services/` with simulated delay and `localStorage` persistence: habits (`getHabits`, `createHabit`, `updateHabit`, `deleteHabit`), completions (`getCompletions`, `toggleCompletion`), and mock auth (`signUp`, `logIn`, `logOut`, `getCurrentUser`, `updateName`, `deleteAccount`).
- [x] **2.6** Make the service layer **fail gracefully** if `localStorage` is unavailable or corrupted (return an error, never crash).
- [x] **2.7** Build **Zustand stores** (habits, completions, auth) that call only the service layer, expose loading and error state, and use `persist` only where appropriate.
- [x] **2.8** Enforce validation rules in one place (zod schemas): habit name required, trimmed, max 40 chars, unique (case-insensitive), at least one weekday.

**Done when:** logic helpers pass their tests, and the stores can create a habit, toggle a completion, and recompute stats in a quick throwaway check.
**Commit:** `feat: add types, logic helpers, mock service layer, and stores`

---

## Phase 3: App shell, routing, and auth
*PRD refs: sections 6 and 7.5.*

- [x] **3.1** Set up **React Router** with routes: `/` (Home), `/analytics`, `/habits`, `/account`, `/login`, `/signup`, and a not-found route.
- [x] **3.2** Build the **route guard**: unauthenticated users go to Login; authenticated users skip Login and Sign up.
- [x] **3.3** Build the **app shell**: **BottomTabBar** below 768px, **Sidebar** at 768px and up, **PageHeader**, content max-width and grid behavior.
- [x] **3.4** Build **LoginForm** (email, password) with validation, disabled submit while submitting, and clear errors such as "Incorrect email or password".
- [x] **3.5** Build **SignupForm** (name, email, password) with the same standards.
- [x] **3.6** Wire both forms to the mock auth service and redirect to Home on success.
- [x] **3.7** Add placeholder pages for Home, Analytics, Habits, and Account so navigation can be tested end to end.

**Done when:** a user can sign up, land on Home, move between all four tabs on mobile and desktop, log out, and be redirected to Login.
**Commit:** `feat: add routing, app shell, and mock auth screens`

---

## Phase 4: Habits page
*PRD refs: section 7.2.*

*(Built before Home because Home depends on habits existing.)*

- [x] **4.1** Build **HabitList** and **HabitCard** (icon, name, weekday chips, Edit and Delete actions; long names truncate with ellipsis).
- [x] **4.2** Add the preset **fitness icon set** and the **IconPicker** grid.
- [x] **4.3** Build **ColorPicker** (small palette).
- [x] **4.4** Build **WeekdayPicker** (7 toggle chips, plus "Every day" and "Weekdays" shortcuts).
- [x] **4.5** Build **HabitForm** (shared for add and edit; full screen on mobile, modal on desktop) with react-hook-form + zod, inline errors, disabled submit while saving, and a success toast.
- [x] **4.6** Wire **"+ New habit"**, **Edit**, and **Delete** (hard delete with ConfirmDialog; completions for that habit are removed too).
- [x] **4.7** Add **loading** (skeleton), **empty** ("No habits yet" with a call to action), and **error** states.
- [x] **4.8** Check keyboard access and screen-reader labels for all controls on this page.

**Done when:** a user can add, edit, and delete habits with every validation rule enforced, and data persists across reloads.
**Commit:** `feat: add Habits page with create, edit, and delete`

---

## Phase 5: Home (Dashboard)
*PRD refs: section 7.1.*

- [x] **5.1** Build **GreetingHeader** (greeting, today's date, avatar).
- [x] **5.2** Build **TodayProgressCard** (ProgressRing with "X / Y done" and percentage).
- [x] **5.3** Build **StreakBadge** using the PRD streak rule.
- [x] **5.4** Build **HabitItem** (accessible checkbox) and the **Pending / Completed** lists. Only habits scheduled today appear; checking and un-checking is **today only**.
- [x] **5.5** Build **OverallProgressCard** (completed % vs left %, donut or bar) with the **Week / Month / All** toggle (default Week).
- [x] **5.6** Add states: **loading** (skeletons), **empty, no habits** ("Add your first habit" button), **empty, nothing scheduled today**, **all done** (positive message), and **error**.
- [x] **5.7** Confirm that every check or un-check updates the ring, lists, percentages, and streak immediately.

**Done when:** the full Home flow works end to end against mock data at 375px and 1280px, in both themes.
**Commit:** `feat: add Home dashboard with today's habits, streak, and overall progress`

---

## Phase 6: Analytics
*PRD refs: section 7.3.*

- [x] **6.1** Build **RangeSwitcher** (Week / Month / Year, default Month).
- [x] **6.2** Build **StatCard** and the 2x2 summary grid: completion rate, current streak, best streak, total check-ins.
- [x] **6.3** Build the custom **Heatmap** (CSS grid, days shaded by completion %, keyboard-focusable cells, accessible labels).
- [x] **6.4** Build **DayDetailSheet** (read-only; bottom sheet on mobile, modal on desktop) listing which habits were done and not done that day.
- [x] **6.5** Build **TrendChart** with Recharts, including an accessible text summary.
- [x] **6.6** Build **HabitBreakdown** (per-habit completion %).
- [x] **6.7** Add states: **loading** (skeletons), **empty** ("Complete a few habits to see your analytics" with a link to Home), and **error**.
- [x] **6.8** Cross-check every figure against the logic helpers on a small hand-calculated dataset.

**Done when:** all Analytics sections respond correctly to the range switcher, and numbers match the hand-calculated check.
**Commit:** `feat: add Analytics with heatmap, trend chart, and per-habit breakdown`

---

## Phase 7: Account
*PRD refs: section 7.4.*

- [x] **7.1** Build **ProfileCard** (avatar with initials fallback, name, email).
- [x] **7.2** Build **NameEditForm** (required, trimmed, validation, success toast).
- [x] **7.3** Build **ThemeSelect** (Light / Dark / System), wired to the theme system.
- [x] **7.4** Wire **Log out** (clear mock session, redirect to Login).
- [x] **7.5** Build the **DangerZone** with **Delete account** behind a ConfirmDialog (clears the user's mock data and session, then redirects).

**Done when:** all Account actions work and persist correctly, including theme across reloads.
**Commit:** `feat: add Account page with profile, theme, logout, and delete account`

---

## Phase 8: Polish: states, responsive, accessibility
*PRD refs: sections 5, 6, and 11.*

- [x] **8.1** Walk every screen and confirm **loading, empty, and error** states exist and look right.
- [x] **8.2** Responsive pass at **375px, 768px, and 1280px**: no horizontal scroll, comfortable tap targets, correct nav switch at 768px.
- [x] **8.3** Accessibility pass: semantic landmarks and heading order, WCAG AA contrast in both themes, visible focus rings, ARIA labels on icon buttons and charts, full keyboard use of checkboxes, heatmap cells, and sheets.
- [x] **8.4** Respect **`prefers-reduced-motion`** for all animations and transitions.
- [x] **8.5** Go through the PRD **edge case list** (section 11) and confirm each one is handled.
- [x] **8.6** Remove the dev-only style preview route and any dead code or leftover logs.

**Done when:** all edge cases in the PRD are handled and the audit finds no open accessibility or responsive issues.
**Commit:** `fix: polish states, responsiveness, and accessibility`

---

## Phase 9: Final QA

- [x] **9.1** `npm run lint` passes with no warnings.
- [x] **9.2** `npm run build` passes with no errors, and `npm run preview` works.
- [x] **9.3** Full manual walkthrough as a new user: sign up, create habits, check them off, view Analytics, change theme, edit name, log out, log back in, delete a habit, delete the account.
- [x] **9.4** Confirm **no backend or API code** exists and the service layer is the only data access point.
- [x] **9.5** Confirm **nothing from "Future / out of scope"** was built.
- [x] **9.6** Update `README` with setup steps, scripts, and a short note on the service layer (so the backend developer knows what to replace).

**Done when:** every box in this file is `[x]` or has a logged reason.
**Commit:** `docs: finalize README and complete MVP frontend`

---

## Progress log

*Add one line per completed task, newest at the bottom. Format:*
`YYYY-MM-DD | task id | what was done | key files`

| Date | Task | What was done | Key files |
|---|---|---|---|
| 2026-10-20 | 0.1 | Scaffolded React + Vite + TS (strict) in `frontend/`; pinned TypeScript ~6.0.3 because typescript-eslint does not support TS 7 yet. Lint + build pass. | frontend/package.json, frontend/tsconfig.app.json |
| 2026-10-20 | 0.2 | Installed Tailwind CSS v4 + @tailwindcss/vite; wired Vite plugin; global CSS at src/styles/index.css. Lint + build pass. | frontend/vite.config.ts, frontend/src/styles/index.css |
| 2026-10-20 | 0.3 | Initialized shadcn/ui (radix base, nova preset); Button renders in dev verified at 375px and 1280px via iframe harness. | frontend/components.json, frontend/src/components/ui/button.tsx |
| 2026-10-20 | 0.4 | Installed react-router, zustand, react-hook-form, zod, date-fns, recharts, sonner, @fontsource roboto + roboto-condensed. Theme provider deferred to Phase 1 (custom). | frontend/package.json |
| 2026-10-20 | 0.5 | Added Prettier with .prettierrc/.prettierignore and `format` script; scoped react-refresh rule exception for generated shadcn primitives. Lint + build pass. | frontend/eslint.config.js, frontend/.prettierrc, frontend/package.json |
| 2026-10-20 | 0.6 | Created PRD folder structure (features, lib/services, store, routes, styles) with .gitkeep; moved the Tailwind entry to src/styles/index.css and updated components.json. | frontend/src/**, frontend/components.json |
| 2026-10-20 | 0.7 | `@/` alias in tsconfigs and Vite; import.meta.env typing via `types: ["vite/client"]`; README rewritten; .gitignore now covers .env files. | frontend/README.md, frontend/.gitignore, frontend/tsconfig.app.json |
| 2026-10-20 | 1.1 | Defined light + dark CSS-variable tokens (warm neutral surfaces, orange primary, green success, destructive, 5 chart colors, input/border/ring, sidebar). Key text pairs checked with a WCAG contrast script: body 16.4:1 / muted 5.2:1 / white-on-primary 5.2:1 (light), all ≥4.5:1; dark equivalents ≥6:1; input borders ≥3:1. Verified rendered tokens in both themes. | frontend/src/styles/index.css |
| 2026-10-20 | 1.2 | Loaded Roboto (400/500/700) and Roboto Condensed (400/500/600/700) via @fontsource; removed Geist; added `font-sans`/`font-heading` theme tokens. Verified computed fonts in the browser (h1 = Roboto Condensed, body = Roboto) and woff2 files in the build. | frontend/src/styles/index.css, frontend/package.json |
| 2026-10-20 | 1.3 | Custom ThemeProvider (Light/Dark/System, class on `<html>`), persisted in localStorage under `fitency-theme`; inline script in index.html applies the theme before first paint (no flash). System mode reacts to OS changes. Verified toggle, reload persistence, and system mode in the browser with a clean console. | frontend/src/components/theme/**, frontend/index.html, frontend/src/main.tsx |
| 2026-10-20 | 1.4 | Set `--radius: 1rem` and theme-dependent `--shadow-soft`/`--shadow-float`; exposed them as `shadow-soft`/`shadow-float` utilities. Verified computed shadows differ correctly between light and dark. | frontend/src/styles/index.css |
| 2026-10-20 | 1.5 | Added shadcn Input, Skeleton, sonner Toaster (adapted to the custom theme hook), plus Button sizes bumped for touch (default h-10, lg h-11, icon size-10; Input h-10), EmptyState, and mounted the Toaster at app root. Verified all states in both themes. | frontend/src/components/ui/**, frontend/src/components/empty-state.tsx, frontend/src/App.tsx |
| 2026-10-20 | 1.6 | Built ProgressRing (SVG, clamps value, `role="progressbar"` with aria value min/max/now and label, themed track/progress, reduced-motion guard). Verified semantics and visuals at 0/40/100%. | frontend/src/components/progress-ring.tsx |
| 2026-10-20 | 1.7 | Built BottomSheet (Vaul drawer below 768px, Radix dialog at ≥768px, shared title/description/content/footer) and ConfirmDialog (AlertDialog). Verified drawer at 375px, centered modal at 1280px, and confirm/cancel behavior. | frontend/src/components/bottom-sheet.tsx, frontend/src/components/confirm-dialog.tsx, frontend/src/components/use-media-query.ts |
| 2026-10-20 | 1.8 | Added temporary dev-only style preview at `?preview` (StylePreview) covering tokens, type, buttons, inputs, skeleton, ring, empty state, sheet/modal, confirm, and toasts. Verified in the browser at 375px and 1280px, light and dark, with visible focus ring. To be removed in Phase 8. | frontend/src/components/style-preview.tsx, frontend/src/App.tsx |
| 2026-10-20 | 2.1 | Added the shared `Habit`, `Completion`, and `User` types matching PRD section 9. Lint + build pass. | frontend/src/lib/types.ts |
| 2026-10-20 | 2.2 | Added local `YYYY-MM-DD` helpers, Monday=1 weekday numbering, and week/month/year/all range builders that separate full-period days from elapsed days (future days excluded from stats). Lint + build pass. | frontend/src/lib/utils/date.ts |
| 2026-10-20 | 2.3 | Added `isScheduled`, `completionRate`, `perDayCompletion`, `currentStreak`, and `bestStreak` with creation-date capping, weekday filtering, skipped unscheduled days, unfinished-today handling, and `null` percentages when nothing is scheduled. | frontend/src/lib/utils/habits.ts |
| 2026-10-20 | 2.4 | Added Vitest (dev-only, plan-approved) with a `test` script and 25 unit tests covering mid-range creation, weekday filtering, zero-scheduled/empty ranges, streak gaps, unfinished today, and all-habits-required days. `npm run test`, lint, and build pass. | frontend/src/lib/utils/habits.test.ts, frontend/package.json |
| 2026-10-20 | 2.5 | Built the mock service layer for auth, habits, and completions with 200-500ms simulated delay, per-user localStorage keys, ISO `createdAt`, duplicate-name checks, and cascade delete of completions. Verified with a temporary in-memory-storage check (signup/login, CRUD, toggle, stats); check file removed afterwards. | frontend/src/lib/services/** |
| 2026-10-20 | 2.6 | Added typed `ServiceError` and guarded storage reads/writes with validators; unavailable or corrupted localStorage rejects with a user-facing message instead of crashing. Temporary check verified both paths. | frontend/src/lib/services/storage.ts, frontend/src/lib/services/errors.ts |
| 2026-10-20 | 2.7 | Added habits, completions, and auth Zustand stores with loading/error state, optimistic completion toggle with rollback, and reset actions for account deletion. Temporary store check confirmed habit creation, check-in toggle, 100% recompute, and rollback on an invalid date. | frontend/src/store/** |
| 2026-10-20 | 2.8 | Added `habitFieldsSchema` plus `createHabitSchema` (trim, required, max 40, case-insensitive unique, at least one weekday) and wired the habit service to it. Rules verified in the temporary check. | frontend/src/lib/schemas.ts, frontend/src/lib/services/habits.ts |
| 2026-10-20 | 3.1 | Wired React Router (v8) with `/`, `/analytics`, `/habits`, `/account`, `/login`, `/signup`, and a not-found route; added temporary placeholder pages for the four tab destinations. Verified live: guest at `/` lands on `/login`, `/nope` renders the 404 page, no console errors. | frontend/src/routes/app-routes.tsx, frontend/src/routes/not-found-page.tsx, frontend/src/features/** |
| 2026-10-20 | 3.2 | Added `RequireAuth` and `PublicOnly` layout-route guards backed by an `initialized` flag in the auth store (one session check per load, no redirect flash). Verified live at 375px and 1280px: signed-out users are sent to Login, signed-in users visiting `/signup` bounce back to Home. | frontend/src/routes/require-auth.tsx, frontend/src/routes/public-only.tsx, frontend/src/store/auth-store.ts |
| 2026-10-20 | 3.3 | Built AppShell with a 240px sidebar at ≥768px and a bottom tab bar below it (NavLink active states, safe-area padding), plus PageHeader and a shared nav item list. Verified live: at 375px the sidebar is `display:none` and the tab bar is visible; at 1280px the reverse; both themes and no console warnings. | frontend/src/components/layout/**, frontend/src/components/full-page-loader.tsx |
| 2026-10-20 | 3.4 | Built LoginForm with react-hook-form + zod inline errors, `aria-invalid`/`aria-describedby`, focus moved to the first invalid field, disabled submit while saving, and store errors shown in a `role="alert"` message. Verified live: empty submit shows both inline errors; wrong password shows "Incorrect email or password." while staying on `/login`; submit is disabled with a "Signing in…" label mid-request. | frontend/src/features/auth/login-form.tsx, frontend/src/features/auth/auth-field.tsx |
| 2026-10-20 | 3.5 | Built SignupForm (name, email, password) to the same standards, sharing AuthField and AuthShell. Verified live: created an account from the 375px frame with inline validation and a disabled submitting state. | frontend/src/features/auth/signup-form.tsx, frontend/src/features/auth/auth-shell.tsx |
| 2026-10-20 | 3.6 | Wired both forms to the mock auth store/service; success shows a toast, redirects to Home, and persists the session (`fitency:auth`). Verified live: sign up and log in both land on `/` with the session stored. | frontend/src/features/auth/**, frontend/src/store/auth-store.ts |
| 2026-10-20 | 3.7 | Added placeholder Home, Analytics, Habits, and Account pages so all four destinations navigate end to end. Verified live: clicking each tab updates the URL, heading, and `aria-current` at both widths. | frontend/src/features/*/*-page.tsx |
| 2026-10-20 | 4.1 | Built HabitList/HabitCard: colored icon chip, name with ellipsis, weekday chips ("Every day" when all seven), Edit/Delete icon buttons with `aria-label`s. Verified live at 375px and 1280px: a 36-character name truncates (scrollWidth 257 vs clientWidth 174, `text-overflow: ellipsis`, `title` holds the full name), chips render Mon-Fri or Every day. | frontend/src/features/habits/habit-list.tsx, frontend/src/features/habits/habit-card.tsx |
| 2026-10-20 | 4.2 | Added a 17-icon fitness preset (lucide keys stored in `Habit.icon`, unknown keys fall back to Dumbbell) and the IconPicker grid with `aria-pressed` and per-icon labels. Verified live: 17 buttons in the "Icon" group, selection moves on click. | frontend/src/features/habits/habit-icons.ts, frontend/src/features/habits/icon-picker.tsx |
| 2026-10-20 | 4.3 | Built ColorPicker with an 8-color palette (green deliberately excluded) and an auto-picked white/charcoal glyph color. Verified live: 8 swatches in the "Color" group; the saved teal chip renders rgb(13,148,136) with a charcoal glyph, purple with white (both ≥4.6:1). | frontend/src/features/habits/habit-colors.ts, frontend/src/features/habits/color-picker.tsx |
| 2026-10-20 | 4.4 | Built WeekdayPicker: 7 toggle chips (Mon-Sun) plus "Every day" and "Weekdays" shortcuts, `aria-pressed`, full weekday names as labels, and an inline error when nothing is selected. Verified live: shortcuts select 5/7 days, deselecting all shows "Choose at least one weekday." | frontend/src/features/habits/weekday-picker.tsx, frontend/src/features/habits/weekdays.ts |
| 2026-10-20 | 4.5 | Built HabitForm (one Radix dialog styled full screen below 768px and a centered modal above) with RHF + zod, inline errors, disabled "Saving…" state, and success toasts. Verified live: at 375px the dialog measures 375x780 at (0,0) with radius 0 and a pinned footer; at 1280px it is a centered 448px modal; duplicate names (case-insensitive) and empty names show inline errors, Enter/Escape work. | frontend/src/features/habits/habit-form.tsx |
| 2026-10-20 | 4.6 | Wired "+ New habit" (header and empty state), Edit (pre-filled values) and Delete (ConfirmDialog naming the habit and its check-ins). Verified live: create/update/delete all toast and update the list and storage; a seeded check-in for the deleted habit was also removed from `completions`. | frontend/src/features/habits/habits-page.tsx, frontend/src/components/confirm-dialog.tsx |
| 2026-10-20 | 4.7 | Added the loading skeleton (`aria-busy`, "Loading habits"), the "No habits yet" empty state with a CTA, and an error state with "Try again". Verified live: the skeleton was observed during a reload, empty state on a fresh account, and a corrupted-storage reload showed the corrupted-data message, then recovered the list after restoring data and pressing Try again. | frontend/src/features/habits/habits-page.tsx |
| 2026-10-20 | 4.8 | Checked keyboard access and labels: full Tab traversal (name -> 17 icons -> 8 colors -> shortcuts -> 7 days -> Cancel -> submit), Escape closes, focus returns to the opener (custom `onCloseAutoFocus`, since Radix only restores with DialogTrigger), dialog labelled by title/description, groups labelled Icon/Color/Days, every icon button labelled; browser console clean. | frontend/src/features/habits/habits-page.tsx, frontend/src/features/habits/habit-form.tsx |
| 2026-10-20 | 5.1 | Built GreetingHeader: time-of-day greeting with the user's first name, formatted date, and initials avatar (decorative). Verified live at 375px and 1280px, light and dark: "Good morning, Alex", "Tuesday, 20 October", "AR". | frontend/src/features/home/greeting-header.tsx |
| 2026-10-20 | 5.2 | Built TodayProgressCard around ProgressRing with "X / Y done" and percentage. Verified live: 0/1 -> 0%, 1/1 -> 100%, 1/3 -> 33%, 3/3 -> 100%, with the aria-label and visual ring updating. | frontend/src/features/home/today-progress-card.tsx |
| 2026-10-20 | 5.3 | Built StreakBadge from currentStreak. Verified live: no completions -> "No streak yet"; all three habits completed today with the previous day missed -> "1 day streak". | frontend/src/features/home/streak-badge.tsx |
| 2026-10-20 | 5.4 | Built HabitItem with a Radix checkbox (`role="checkbox"`, "Check off/Uncheck {name}") and the Pending/Completed sections. Verified live: a Monday-only habit was absent on Tuesday; Space checked a habit into Completed (line-through) and back; only today's habits render. | frontend/src/features/home/habit-item.tsx, frontend/src/features/home/home-page.tsx |
| 2026-10-20 | 5.5 | Built OverallProgressCard with a stacked completed/left bar and Week/Month/All `aria-pressed` buttons (Week default). Verified against seeded history: Week 25%, Month/All 22%, all-done Week 75%; a range with no scheduled days shows "Nothing scheduled in this period." | frontend/src/features/home/overall-progress-card.tsx |
| 2026-10-20 | 5.6 | Added loading skeletons (`aria-busy`, "Loading your dashboard"), the no-habits empty state with an "Add your first habit" CTA, nothing-scheduled-today, all-done, and the corrupted-storage error with "Try again". Verified live: each state appeared; the CTA navigated to `/habits`; retry recovered after restoring data. | frontend/src/features/home/home-page.tsx |
| 2026-10-20 | 5.7 | Confirmed every check/uncheck updates the ring, Pending/Completed lists, percentages, streak, and storage without a reload, and survives a reload. Screenshots checked at 375px and 1280px in light and dark; console had no errors or warnings. | frontend/src/features/home/home-page.tsx, frontend/src/store/completions-store.ts |
| 2026-10-20 | 6.1 | Built RangeSwitcher (Week / Month / Year segmented control, `aria-pressed`, 36px targets), defaulting to Month. Verified in iframes at 375px and 1280px in both themes: Month is selected on load, clicking Year moves the pressed state, no horizontal scroll, sidebar/tab-bar switch correct. | frontend/src/features/analytics/range-switcher.tsx, frontend/src/features/analytics/analytics-page.tsx |
| 2026-10-20 | 6.2 | Built StatCard and the 2x2 summary grid (completion rate, current streak, best streak, total check-ins). Verified against a hand-built dataset at 375px and 1280px in both themes: Month 86% (38 of 44), 4-day current streak, 6-day best streak, 38 check-ins; Week 100% (5 of 5), 2/2-day streaks, 5 check-ins; no horizontal scroll. | frontend/src/features/analytics/stat-card.tsx, frontend/src/features/analytics/analytics-page.tsx, frontend/src/lib/utils/habits.ts |
| 2026-10-20 | 6.3 | Built the custom Heatmap: a Monday-first calendar grid for Week/Month with day numbers, and a horizontally scrolling contribution grid for Year with month labels and auto-scroll to current data. Six shade levels (future/none/0%/1-49%/50-99%/100%), disabled future and unscheduled cells, full date + count labels on every cell. Verified at 375px and 1280px in both themes: 31 month cells (20 enabled, 11 future), 365 year cells, 12 month labels, page never scrolls horizontally, programmatic focus reaches the first enabled cell. | frontend/src/features/analytics/heatmap.tsx, frontend/src/features/analytics/analytics-page.tsx |
| 2026-10-20 | 6.4 | Built the read-only DayDetailSheet with Done/Not done lists. Verified live at 375px (375x331 bottom drawer, auto-focused Close) and 1280px (384px centered modal) in light and dark: Oct 16 showed "1 of 3 habits completed (33%)." with Morning run done and both other habits not done; Escape and Close both closed it and returned focus to the triggering heatmap cell; no horizontal scroll. | frontend/src/features/analytics/day-detail-sheet.tsx, frontend/src/features/analytics/analytics-page.tsx, frontend/src/components/bottom-sheet.tsx |
| 2026-10-20 | 6.5 | Built TrendChart with Recharts (line, 0-100% axis, no dots in Year, gaps for unscheduled days) and a visible figcaption summary. Verified live at 375px and 1280px in light and dark across all three ranges: Month showed "1 Oct to 20 Oct: 20 days ... 16 at 100%, lowest 0%", Week 2 fully-completed elapsed days, Year 81 scheduled days; chart re-rendered on each range switch, no horizontal overflow. | frontend/src/features/analytics/trend-chart.tsx, frontend/src/features/analytics/analytics-page.tsx |
| 2026-10-20 | 6.6 | Built HabitBreakdown with a color-matched progress bar and "completed of scheduled" detail for every habit. Verified live at 375px and 1280px in light and dark: Month showed Morning run 90% (18/20), Strength training 88% (7/8), Evening walk 81% (13/16); Week 100% for all, Year 22% (18/81), 33% (7/21), 81% (13/16), summing to the 32% Year summary; no horizontal overflow. | frontend/src/features/analytics/habit-breakdown.tsx, frontend/src/features/analytics/analytics-page.tsx |
| 2026-10-20 | 6.7 | Added the loading skeletons (range, 2x2 cards, heatmap, trend, breakdown; `aria-busy` + "Loading your analytics"), the empty state with the exact copy and a "Go to Home" link to `/`, and an error card with "Try again". Verified live: 8 skeletons appeared during reloads at 375px and 1280px; empty state in both themes at both widths with no charts/range shown; a corrupted completions read showed the storage error, then restoring the data and pressing Try again brought back 86% / 38 of 44; no horizontal overflow. | frontend/src/features/analytics/analytics-page.tsx |
| 2026-10-20 | 6.8 | Added range-bounded streak tests and a hand-calculated 3-habit, 7-day dataset (scheduled 15, completed 11 = 73%; daily 6/7 = 86%, MWF 2/3 = 67%, late habit 3/5 = 60%; per-day 100/100/67/100/0/100/50%; best streak 2, current 1). Every summary, heatmap, trend, streak, and breakdown figure is produced by the same helpers. `npm run test` passes 30/30, plus lint and build. | frontend/src/lib/utils/habits.test.ts |
| 2026-10-20 | 7.1 | Built ProfileCard with a 64px initials avatar, name, and email. Verified in 375px and 1280px iframes in light and dark: the seeded account showed "AT", "Analytics Tester", and the email; name/email truncate without layout overflow, and the console had no errors. | frontend/src/features/account/profile-card.tsx, frontend/src/features/account/account-page.tsx |
| 2026-10-20 | 7.2 | Built the NameEditForm with zod validation (required after trim), a disabled submit showing "Saving…", an inline service error, and a "Name updated." toast. Verified at 375px and 1280px in both themes: whitespace-only input showed "Enter your name."; "  Analytics Tester II  " saved trimmed, updated the profile card and Home greeting, and survived a reload; corrupting auth storage showed the inline corrupted-data error, and restoring it recovered. | frontend/src/features/account/name-edit-form.tsx, frontend/src/features/account/account-page.tsx, frontend/src/lib/schemas.ts |
| 2026-10-20 | 7.3 | Built ThemeSelect as a three-option Light / Dark / System segmented group with icons, `aria-pressed`, and 40px targets, wired to the existing ThemeProvider. Verified live at 375px and 1280px in both themes: selecting Light/Dark/System updates `<html class="dark">` and `fitency-theme`, System matches the OS preference, the selection survives a reload, and icons/labels fit without overflow. | frontend/src/features/account/theme-select.tsx, frontend/src/features/account/account-page.tsx |
| 2026-10-20 | 7.4 | Added the Session card with a Log out button. Verified live at 375px and 1280px: the button showed "Logging out…" and disabled while working, the mock session's `sessionUserId` became `null`, and the app redirected to `/login` with no app navigation; signing back in returned to Home. Corrupting auth storage showed the inline storage error and re-enabled the button, then restoring the session recovered. | frontend/src/features/account/account-page.tsx |
| 2026-10-20 | 7.5 | Built the DangerZone with a destructive **Delete account** button and a ConfirmDialog (Cancel / Delete account). Verified at 375px and 1280px in both themes with no horizontal overflow and 40px targets: Cancel and Escape closed the dialog and returned focus to the trigger; deleting a disposable account with 1 habit and 1 completion removed its habits/completions keys, removed the user from auth, cleared the session, preserved the theme, and redirected to Sign up. Signing back into the seeded account showed its 3 habits and 38 completions intact. | frontend/src/features/account/danger-zone.tsx, frontend/src/features/account/account-page.tsx |
| 2026-10-20 | 8.1 | Audited loading, empty, and error states on Home, Habits, Analytics, Account, and Login: skeletons, no-habits/rest-day/all-done states, the first-use Analytics empty state, corrupted-storage errors with retry, and inline form errors. Fixed Home so any load error shows a retry card instead of stale stats, and added a retry button to the Habits partial-error state. | frontend/src/features/home/home-page.tsx, frontend/src/features/habits/habits-page.tsx |
| 2026-10-20 | 8.2 | Responsive pass at exact 375px, 768px, and 1280px in light and dark: measured `innerWidth`/`clientWidth`/`scrollWidth` on every screen and confirmed no horizontal overflow; the sidebar is visible at 768px and the bottom tab bar below it; active nav is not color-only; nav, range controls, habit actions, swatches, weekday chips, and dialog close meet 40px targets. | frontend/src/styles/index.css, frontend/src/components/layout/**, frontend/src/features/** |
| 2026-10-20 | 8.3 | Accessibility pass: one h1 per screen with ordered h2/h3 sections; header/nav/main landmarks; Lighthouse accessibility 1.0 on Home, Habits, Analytics, Account, and Login; fixed the account avatar and destructive-text contrast (light `--destructive` now `#B91C1C`); visible 3px focus rings; Space toggles a habit and focus follows it between Pending and Completed; Enter opens a heatmap day and Escape restores focus to the cell; the habit dialog traps focus and returns it to the opener. | frontend/src/styles/index.css, frontend/src/features/home/**, frontend/src/features/account/profile-card.tsx |
| 2026-10-20 | 8.4 | Added a global `prefers-reduced-motion: reduce` rule that collapses animations, transitions, and smooth scrolling to 0.01ms for all elements and pseudo-elements; Recharts animations are already disabled. | frontend/src/styles/index.css |
| 2026-10-20 | 8.5 | Walked PRD section 11 and confirmed each case: no-habits, none-scheduled, and all-done states; mid-range creation and zero-scheduled ranges covered by 30 unit tests; duplicate/over-length/no-weekday validation; habit delete cascades completions; long names truncate with a full-name tooltip; Analytics first-use empty state; corrupted localStorage errors; no-flash theme persistence; keyboard and screen-reader use of checkboxes, heatmap cells, and sheets. | frontend/src/lib/utils/habits.test.ts, frontend/src/lib/services/** |
| 2026-10-20 | 8.6 | Removed the dev-only style preview component/route and the temporary `public/__audit.html` harness; searched `src/` for preview code and console statements (none left). `npm run lint`, 30/30 tests, and `npm run build` pass. | frontend/src/App.tsx, frontend/src/components/style-preview.tsx (deleted) |
| 2026-10-20 | 9.1 | `npm run lint` produced no output, and `npx eslint . --max-warnings 0` exited 0. | frontend/eslint.config.js |
| 2026-10-20 | 9.2 | `npm run build` passed TypeScript and Vite (3154 modules); only Vite's advisory chunk-size warning appeared. `npm run preview -- --port 4173 --strictPort` served the production build with HTTP 200 at `localhost:4173`. | frontend/dist/**, frontend/package.json |
| 2026-10-20 | 9.3 | Full new-user walkthrough against the production preview: signed up; saw the no-habits Home empty state; created "Morning run" (daily) and "Strength training" (Mon/Wed/Fri); confirmed only today's habit showed; checked it off (100%, 1-day streak, all-done state); reviewed Analytics Month/Week/Year, today's heatmap cell and DayDetailSheet; switched to Dark and reloaded; renamed the profile; logged out and back in; deleted Strength training with its confirmation; deleted the account and landed on Sign up. Console was clean and the only network requests were the preview origin's static assets. | frontend/src/features/** |
| 2026-10-20 | 9.4 | Searched `src/` for `fetch(`, axios, XMLHttpRequest, WebSocket, EventSource, `/api/`, and `http(s)://` (no matches). Habit/completion/auth data access only appears in `src/lib/services/**`; the only other storage user is the documented theme preference in `components/theme/theme-storage.ts`. | frontend/src/lib/services/**, frontend/src/store/** |
| 2026-10-20 | 9.5 | Confirmed the router has only `/`, `/analytics`, `/habits`, `/account`, `/login`, `/signup`, and a not-found route. No PWA manifest, service worker, or install prompt exists, and searches found none of the out-of-scope features (workout logging, exercise library, body stats, routines, targets, reminders, archive, per-habit detail, social sign-in, week-start setting). | frontend/src/routes/app-routes.tsx, frontend/public/ |
| 2026-10-20 | 9.6 | README now lists `npm run test`, the production preview steps, and a service-layer table naming each file's functions and the current mock keys, plus the note that only the service layer needs replacing for a real backend. Prettier check passes; lint, 30/30 tests, and build pass. | frontend/README.md |
| 2026-10-22 | post-MVP | Per user request, hid Login/Signup from the running app (auth routes removed; screens kept in `src/features/auth/`) and added a local-profile bootstrap that adopts the latest saved account or creates "You". The Account tab now shows profile name + theme only (log out and delete-account UI removed; files kept). Lint, 30/30 tests, and build pass; verified live at 375px and 1280px in light and dark, including account adoption and check-in persistence. | frontend/src/routes/app-routes.tsx, frontend/src/routes/app-bootstrap.tsx, frontend/src/lib/services/auth.ts, frontend/src/store/auth-store.ts, frontend/src/features/account/** |
| 2026-10-23 | post-MVP | Cached successful habit/completion loads so tab switches no longer refetch and flash skeletons (retries force a refresh; habit deletes prune cached check-ins). Added a confirmed **Reset app data** action to Account that clears habits and history but keeps the profile/theme. The default "You" profile no longer appears in the greeting, and `/login` + `/signup` now redirect to Home. Lint, 30/30 tests, and build pass; verified live at 375px and 1280px in light and dark. | frontend/src/store/**, frontend/src/features/account/**, frontend/src/features/home/greeting-header.tsx, frontend/src/routes/app-routes.tsx, frontend/src/lib/services/auth.ts |

---

## Blockers and questions

*Log anything ambiguous or blocking here. Format:*
`YYYY-MM-DD | task id | question or blocker | status (open / resolved + answer)`

| Date | Task | Question or blocker | Status |
|---|---|---|---|
| 2026-10-20 | 0.1 | This plan references `PRD.md` (sections 7.1 Home, 7.2 Habits, 7.3 Analytics, 7.4 Account, 11 edge cases; stack: Zustand, shadcn/ui + Radix + Vaul, Recharts, Roboto fonts, light + dark themes, Login/Signup/Account screens). The only PRD present is `docs/PRD.md`, which specifies different screens (Home / Analytics / New Habit / Rewards), a different stack (Context + useReducer, custom SVG chart, no component library), Plus Jakarta Sans, and a dark-only theme with no auth UI. The referenced `PRD.md` may be missing from the repo. Cannot start Phase 0 until the correct source of truth is confirmed. | resolved: stale entry from an earlier session, written before commit 003c4e8 replaced the old design-doc-era PRD. The current committed `docs/PRD.md` matches this plan exactly (Home/Analytics/Habits/Account, Login/Signup, Zustand, shadcn/ui + Radix + Vaul, Recharts, Roboto, light + dark). User confirmed: build from `docs/PRD.md`. |
| 2026-10-20 | 0.1 | Where should the frontend app live? The repo has an empty `frontend/` folder. | resolved: scaffold inside `frontend/` |
| 2026-10-20 | 3.4 | PRD requires a minimum password length but gives no number. | resolved: 8 characters |
| 2026-10-20 | 2.3 / 5.5 / 6 | Do future days in the current Week/Month/Year count toward completion %? | resolved: count only through today; heatmap shows the full period with future days neutral and not clickable |
| 2026-10-20 | 2.8 / 4.5 | @hookform/resolvers (zodResolver) is not in the PRD stack list, but react-hook-form cannot consume zod schemas without a resolver; shadcn's official RHF guide uses it. Add it, or write a small custom resolver against the same zod schemas? | resolved: user approved adding `@hookform/resolvers` |
| 2026-10-22 | post-MVP | The PRD requires Login/Signup and a route guard, but the user asked to remove the account section (login/signup) from the running app while keeping the source. | resolved: user chose to hide Login/Signup only and keep the Account tab, using the latest saved local account or a new "You" profile. |

---

## Decisions made during the build

*Record any small implementation choice not covered by the PRD (for example, a specific icon list or palette values), so the next session stays consistent.*

| Date | Decision | Reason |
|---|---|---|
| 2026-10-20 | Tailwind CSS v4 (CSS-first tokens in `src/styles/index.css`; no `tailwind.config.js`). | Current stable; the shadcn CLI validated v4. Needs no separate config file, tokens stay as CSS variables. |
| 2026-10-20 | Custom ThemeProvider (class on `<html>` + pre-hydration script) instead of `next-themes`. | PRD allows either; avoids an extra dependency. |
| 2026-10-20 | TypeScript pinned to `~6.0.3` (template default was ~7.0.2). | typescript-eslint@8 does not support TS 7 yet (peer `<6.1.0`); ESLint is required. |
| 2026-10-20 | shadcn preset `nova` (neutral base color, lucide icons) as the starting point. | PRD requires lucide-react; the starting palette is replaced by Fitency tokens in Phase 1. |
| 2026-10-20 | `react-refresh/only-export-components` disabled for `src/components/ui/**` only. | Generated shadcn primitives intentionally export variant helpers next to components. |
| 2026-10-20 | Global CSS lives at `src/styles/index.css` (moved from `src/index.css`). | Matches PRD folder structure (`styles/`); `components.json` updated so future `shadcn add` appends there. |
| 2026-10-20 | Fitency palette: light bg `#FAF9F7`, card `#FFFFFF`, primary `#C2410C`, success `#15803D`, input border `#948C82`; dark bg `#1C1A17`, card `#262320`, primary `#FB923C`, success `#4ADE80`, input border `#766F66`; chart colors orange/blue/green/purple/pink. | Warm neutrals + orange accent per PRD; darker light-mode orange and lighter dark-mode orange keep white/dark button labels ≥4.5:1. Input borders meet 3:1. Contrast checked numerically. |
| 2026-10-20 | Theme preference (`light`/`dark`/`system`) stored directly in localStorage under `fitency-theme`, read by an inline script in index.html. | Theme is presentation state, not app data; the no-flash requirement needs a synchronous read before React mounts. Service layer remains the only path for habits/auth data. |
| 2026-10-20 | Font weights: Roboto 400/500/700; Roboto Condensed 400/500/600/700. Default UI font is Roboto; headings and numbers use `font-heading`. | Covers body, labels, bold headings, and large stat numbers; avoids loading unused weights/italics. |
| 2026-10-20 | Radius 1rem (soft rounded); two shadow tokens (`shadow-soft` for cards, `shadow-float` for overlays), both theme-dependent CSS vars. | PRD asks for soft rounded shapes and gentle depth; vars let dark mode use stronger shadows. |
| 2026-10-20 | shadcn Button/Input sizes increased for touch: default h-10, sm h-9, lg h-11, icon size-10; Input h-10. | PRD requires large thumb-friendly tap targets on mobile; generated defaults were 32px. |
| 2026-10-20 | `@hookform/resolvers` pinned to v5.9.2 (not v6). | v6's optional peer set conflicts with `effect@4` under npm's resolver; v5.9 supports zod 4 and the same `zodResolver` API. |
| 2026-10-20 | Responsive overlay: `BottomSheet` renders a Vaul drawer below 768px and a Radix dialog at ≥768px; media query via `useMediaQuery`. | Matches PRD (bottom sheet on mobile, modal on desktop) and the 768px breakpoint used by navigation. |
| 2026-10-20 | Dev style preview lives at `src/components/style-preview.tsx`, shown when `?preview` is present in dev builds. | Temporary per plan; easy to find and delete in Phase 8. Not included in production routing. |
| 2026-10-20 | shadcn's sonner wrapper imports the custom `useTheme` instead of `next-themes`. | Keeps a single theme source; `next-themes` is not installed. |
| 2026-10-20 | Shared app types live in `src/lib/types.ts`; `HabitInput` is derived from `Habit` for forms and the service. | One place for the PRD's data shapes plus the create/edit payload without repeating fields. |
| 2026-10-20 | `Habit.createdAt` is stored as a full ISO timestamp (`new Date().toISOString()`) and converted to a local `YYYY-MM-DD` key for scheduling. | Matches the PRD's "ISO date" shape while keeping weekday/creation comparisons in device-local time. |
| 2026-10-20 | Mock data is namespaced per user under `fitency:data:<userId>:habits|completions`; the mock session and credentials live under `fitency:auth`. | Keeps accounts private if two people use the same browser and lets delete-account remove only that user's data. |
| 2026-10-20 | Zustand stores use no `persist` middleware. | The service layer already owns localStorage; persisting store snapshots would create a second source of truth and bypass the single data-access point. |
| 2026-10-20 | Completion toggles update the store optimistically and roll back to the previous list if the service fails. | PRD requires check-off updates immediately; the 200-500ms mock delay would otherwise make the UI feel unresponsive. |
| 2026-10-20 | Habit validation lives in `src/lib/schemas.ts`; `createHabitSchema(habits, editingId?)` covers field rules plus case-insensitive uniqueness, and the service parses inputs through it. | PRD 2.8 asks for one validation source shared by the future form and the service. |
| 2026-10-20 | Vitest 5 added as a dev-only dependency with `npm run test`. | Plan 2.4 explicitly allows Vitest; helpers are pure and need no DOM environment. |
| 2026-10-20 | Mock auth stores the typed password as-is in localStorage and returns only `User` fields to the UI. | It is a fake auth layer for the MVP; no real credentials or backend exist. To be replaced by the real auth service later. |
| 2026-10-20 | Routing uses one `AppRoutes` component with `BrowserRouter` and nested layout routes; `RequireAuth` and `PublicOnly` are layout routes that render `Outlet`. | Keeps guarded/public areas declared once instead of wrapping every page. |
| 2026-10-20 | Auth store exposes an `initialized` flag; guards trigger the session check once and render `FullPageLoader` until it finishes. | Prevents a redirect-to-Login flash on first paint and avoids a duplicate session read when moving between Login and the protected shell. |
| 2026-10-20 | Navigation lives in `src/components/layout/nav-items.ts` with lucide icons House, ChartColumn, ListChecks, UserRound. | Sidebar and bottom tab bar must render the same four destinations in the same order. |
| 2026-10-20 | Auth validation schemas (`loginSchema`, `signupSchema`, `MIN_PASSWORD_LENGTH = 8`) live in `src/lib/schemas.ts` beside the habit schema. | Keeps every zod rule in the "one place" the plan asks for; 8 characters comes from the resolved blocker entry. |
| 2026-10-20 | Login/Sign up share `AuthShell` (centered card, no nav) and `AuthField` (label + input + inline error). | PRD requires public screens without tab bar or sidebar, and both forms need identical field markup. |
| 2026-10-20 | Habit icon is a preset key from a 17-icon lucide set in `habit-icons.ts`; unknown keys fall back to the dumbbell. | The PRD asks for a preset set, and the fallback keeps hand-edited or corrupted `localStorage` data from crashing a card. |
| 2026-10-20 | Habit colors are the 8 hex values in `habit-colors.ts` (orange, amber, red, pink, purple, blue, cyan, teal); the glyph color is auto-picked (white or `#1C1B19`) from luminance. | One stored hex must stay legible in both themes; green is left out because the PRD reserves it for "completed". |
| 2026-10-20 | New habits default to all seven days; the card shows one "Every day" chip when all are selected, otherwise the short day names. | Daily is the safest default for a habit tracker and keeps long weekday rows readable at 375px. |
| 2026-10-20 | HabitForm uses one Radix dialog styled as a full-screen sheet below 768px and a centered `max-w-md` modal above. | PRD asks for "full screen on mobile, modal on desktop" without the extra complexity of a second component. |
| 2026-10-20 | Focus after closing the habit form/delete confirms is restored by an `onCloseAutoFocus` handler that remembers the opener; after a delete it falls back to the "New habit" button. | Radix only restores focus when a `DialogTrigger` is used and our dialogs are opened from external buttons (and the deleted row disappears). |
| 2026-10-20 | The form reads picker values with `useWatch` instead of RHF `watch`. | `watch()` trips the React Compiler lint rule (`react-hooks/incompatible-library`); `useWatch` is the compiler-safe API. |
| 2026-10-22 | Auth hidden: no `/login` or `/signup` routes; `AppBootstrap` loads a local profile that adopts the latest saved mock account, otherwise creates "You". Account keeps profile/theme; log out and delete account are hidden. | User requested removing the login/signup section for now while keeping the source for later re-use. |
| 2026-10-23 | Habit and completion stores keep a `loaded` flag and skip refetching on tab switches; retry buttons pass `force=true`. Deleting a habit prunes its cached completions, and auth transitions reset both stores. | The 200-500 ms mock delay made every navigation flash skeletons; caching removes that without touching the service layer. Resetting on auth changes keeps the cache safe if sign-in is re-enabled later. |
| 2026-10-23 | **Reset app data** clears habits/completions and resets both stores, but keeps the local profile and theme. The auth record is untouched. | Delete account is hidden, so the UI needs a way to clear tracking data without wiping the profile. |
| 2026-10-23 | The greeting omits the name while the profile is the default "You"; `/login` and `/signup` redirect to Home. | A fresh install read "Good morning, You", and old auth links should not land on the 404 page. |
| 2026-10-20 | Home completions use the already-installed `radix-ui` `Checkbox.Root` in HabitItem, labelled "Check off {name}" / "Uncheck {name}". | PRD asks for a tap-to-complete checkbox; Radix was already installed through shadcn and provides keyboard/focus behavior without a new dependency. |
| 2026-10-20 | Greeting is "Good morning" before 12:00, "Good afternoon" before 18:00, and "Good evening" after; it uses the user's first name, and the initials avatar is decorative (`aria-hidden`, no click action). | PRD only asks for a greeting, date, and avatar; the Account tab already provides account access, so no undefined avatar action was added. |
| 2026-10-20 | A zero current streak renders "No streak yet" instead of "0 days". | Friendly empty label for the badge while the PRD gives no zero-streak copy. |
| 2026-10-20 | When no habits are scheduled today, the Today's progress card is replaced by the "Nothing scheduled today" empty state; the streak badge and overall card remain. | A 0/0 ring would be misleading, and overall progress is still meaningful on a rest day. |
| 2026-10-20 | Overall progress is a stacked completed/left bar with Week/Month/All segmented buttons (`aria-pressed`); an empty range says "Nothing scheduled in this period." | PRD allows a donut or bar, asks for completed vs left, and requires the three ranges, default Week. |
| 2026-10-20 | Home keeps the app shell's single capped content column at 768px and up, with cards stacked in the PRD's top-to-bottom order, instead of a multi-column dashboard grid. | PRD section 7.1 fixes the Home order; the single column matches the already-approved shell. Flagged for the user if a desktop card grid is preferred. |
| 2026-10-20 | Analytics uses an optional `fromKey` argument on `currentStreak`/`bestStreak` so both are bounded by the selected Week/Month/Year start; completion rate and total check-ins use elapsed days only. | PRD 7.3 says all figures respect the selected range, and the resolved question says future days are excluded from stats. Existing callers keep the old all-history behaviour by omitting the argument. |
| 2026-10-20 | Heatmap layout: calendar grid (7 columns, day numbers) for Week and Month, contribution grid (7 weekday rows, week columns) for Year, with the year view auto-scrolled to today. Shade levels are neutral (no habits), success/10 (0%), success/25 (1-49%), success/45 (50-99%), solid success (100%). | The calendar is easier to scan for short ranges; the contribution grid keeps a whole year visible at a glance. Auto-scroll avoids opening on months before the account existed. Future days and days with nothing scheduled are disabled, per the resolved plan question. |
| 2026-10-20 | The mobile `BottomSheet` sets Vaul's `autoFocus`, moving focus to the sheet's first control; `DayDetailSheet` uses the same `onCloseAutoFocus` opener-restore pattern as the habit dialogs. | Vaul defaults `autoFocus` to false, leaving keyboard focus on the page behind the modal; closing must return focus to the heatmap cell that opened it. |
| 2026-10-20 | Completion trend uses a line chart for all ranges; elapsed days with no scheduled habits are gaps, and a visible `figcaption` gives the period, scheduled-day count, number of 100% days, and the lowest day. | A line stays readable for a year's elapsed days where bars would be too narrow; the caption is the accessible summary required by the plan. |
| 2026-10-20 | Habit breakdown keeps the habit list order, uses each habit's saved color for its bar, and shows both the rounded percentage and `completed of scheduled`. | Matches the order users see on the Habits page; the count makes a rounded percentage auditable, and the per-habit figures sum to the summary totals. |
| 2026-10-20 | Analytics shows the empty state when the user has no habits **or** no completions at all; an error replaces the analytics content with a retry card instead of showing partial or stale figures. | Both cases mean there is no progress to analyse, and hiding sections on failure prevents a failed completions read from looking like 0% progress. |
| 2026-10-20 | Account is a single-column stack of cards: profile, always-visible name form, appearance, session, and danger zone. The theme selector is a three-option `aria-pressed` segmented control with icons. | PRD allows an inline edit or small form; the single column matches the shell, and the segmented control matches the app's existing range controls while keeping all three options visible. |
| 2026-10-20 | Deleting an account redirects to `/signup` after the user, habits, completions, and session are cleared. | PRD allows Sign up or Login; the account no longer exists, so the Sign up screen is the clearer next step. |
| 2026-10-20 | Account action errors are tagged with the action that produced them and shown only inside that action's card; the DangerZone restores focus to its Delete account button when the confirm dialog closes. | The auth store has a single error field, so tagging avoids showing a name error in the danger zone. Radix does not restore focus to a non-trigger opener, which would otherwise leave focus on the page body. |
| 2026-10-20 | Toggling a Home habit sets a `focusHabitId` and passes `autoFocus` to the moved row, so keyboard focus follows the habit between Pending and Completed. | Radix keeps focus on a checkbox that stays mounted, but the row remounts in the other list; without this, focus fell back to the page body after every Space press. |
| 2026-10-20 | Light `--destructive` is `#B91C1C` and the Account avatar tint is `primary/5`. | Lighthouse found 4.25:1 and 3.66:1 destructive text and 4.48:1 avatar initials on tinted surfaces; the darker red and lighter tint clear 4.5:1 without changing the palette's hue. |
| 2026-10-20 | Active navigation uses `font-semibold` (plus the existing sidebar filled pill) in addition to the primary color. | WCAG 1.4.1: active state must not rely on color alone; weight and the pill remain visible in both themes. |
| 2026-10-20 | The production build keeps a single ~936 kB JS chunk (285 kB gzip) and the Vite >500 kB advisory warning is left unaddressed. | The MVP has two users and no observed loading problem; code-splitting would be speculative optimization, which AGENTS.md forbids without a real need. Logged here so the warning is not mistaken for a failure. |
