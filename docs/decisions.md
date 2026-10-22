# Fitency: Frontend Decisions Record

**Purpose of this file:** a complete record of every decision made while planning Fitency's frontend. It is the source of truth for generating `PRD.md`. If a conversation runs out of context, give this file to Claude and ask: *"Generate the full frontend-only PRD.md from this decisions file, exactly as decided, adding nothing new."*

**Status:** all steps (1 to 6) are decided. The user was asked to say "final" before PRD generation; this file captures the agreed state at that point.

**Scope rule for the PRD:** frontend only. It covers layout, UI, components, states, frontend tech stack, and frontend logic. It must NOT define backend choices, API endpoints, databases, or server architecture. The user's friend is the backend developer and will decide all of that.

---

## 1. App overview

- **Name:** Fitency
- **What it is:** a personal fitness exercise habit tracker. Users create habits, check them off each day, and see their progress over time.
- **Audience:** just the user and their friend for now (two people).
- **Privacy:** accounts are private. No sharing of progress between users.
- **Platform priority:** mobile-first, and fully responsive (phone, tablet, desktop).
- **Build approach:** MVP first, with features added later. The frontend is built against mock data so the backend can be plugged in later.
- **One-line goal:** help users stay consistent with their fitness habits without friction.

---

## 2. MVP scope: pages

| # | Page | Purpose |
|---|---|---|
| 1 | Home (Dashboard) | Today's habits (done vs left), streak, overall completion % |
| 2 | Analytics | Detailed progress over time |
| 3 | Habits (Add / Edit Habit) | Create habits, edit or delete existing ones |
| 4 | Account | Simple profile and settings |
| + | Login and Sign up | Public auth screens (mock auth) |

### Core habit model (MVP)
- A habit is a **simple daily yes/no check-off** (done / not done). Target-based habits (like "Run 30 min") are out of scope for the MVP.
- Each habit runs on **chosen weekdays** (daily = all 7 selected).
- Habit fields: **name, icon, color, weekdays**. Nothing else.

---

## 3. Page specs

### 3.1 Home (Dashboard)
Layout, mobile-first, top to bottom:
1. **Header:** greeting, today's date, account avatar.
2. **Today's progress card:** progress ring with "X / Y done" and a percentage.
3. **Streak badge:** small, showing the current streak.
4. **Today's habits list:**
   - **Pending** section with tap-to-complete checkboxes.
   - **Completed** section; done habits move down and can be un-checked.
5. **Overall progress card:** completed % vs left %, with a **Week / Month / All** toggle (default **Week**), shown as a donut or bar.
6. **Navigation:** bottom tab bar on mobile (Home, Analytics, Habits, Account); left sidebar on desktop.
7. **Empty state:** friendly prompt with an "Add your first habit" button.

Rules:
- **Today only:** the user can check off or un-check only today's habits. Past days are view-only (visible in Analytics).
- Only habits scheduled for today's weekday appear in today's list.

### 3.2 Habits page (Add / Edit Habit)
**Habits page (the tab):**
- List of all habits. Each shows icon, name, and weekday chips, with **Edit** and **Delete** actions.
- Fixed **floating action button (FAB)** in the bottom-right with a plus icon and an accessible "New habit" label; it stays visible while scrolling and clears the mobile tab bar.
- Empty state: "No habits yet" with a call to action.

**Habit form** (shared for add and edit; full screen on mobile, modal on desktop):
- **Name:** required, trimmed, max 40 characters, no duplicate names.
- **Icon:** grid picker using a **preset fitness icon set** (consistent look, not an emoji picker).
- **Color:** small palette.
- **Weekdays:** 7 toggle chips, at least one required, with quick "Every day" and "Weekdays" shortcuts.
- **Save** and **Cancel** buttons, with inline validation errors and a disabled submit while saving.

**Delete:** **hard delete with a confirm dialog.** (Archive/pause is future scope.)

### 3.3 Analytics
Layout, mobile-first, top to bottom:
1. **Range switcher:** Week / Month / Year (default **Month**).
2. **Summary cards** (2x2 grid on mobile): Completion rate %, Current streak, Best streak, Total check-ins.
3. **Consistency heatmap:** calendar grid, each day shaded by completion %, like GitHub's contribution graph. **Tapping a day opens a read-only bottom sheet** (modal on desktop) listing which habits were done that day.
4. **Completion trend:** line or bar chart of completion % over the selected range.
5. **Per-habit breakdown:** each habit's completion %, so the user sees which habits they keep and which they skip.
6. **Empty state:** "Complete a few habits to see your analytics", with a link to Home.

Explicitly NOT in MVP: "most consistent day" insight, per-habit detail/drill-down page.

### 3.4 Account
1. **Profile card:** avatar (initials fallback), name, email.
2. **Edit name** (inline or small form).
3. **Appearance:** theme toggle **Light / Dark**.
4. **Log out** button.
5. **Delete account** in a danger zone, with a confirm dialog.

Not in MVP: week-start-day setting (Monday is the default).

### 3.5 Login and Sign up (public screens)
- **Email + password only** (UI only, mock auth). No Google or social sign-in.
- Validation and error states on both forms.
- Pages inside the app are behind a client-side route guard (placeholder for real auth later).

---

## 4. Frontend logic rules

- **Streak:** a day counts toward the streak only if **every habit scheduled that day is completed**. Days with no scheduled habits are **skipped** and do not break the streak.
- **Completion %:** **completed check-ins ÷ scheduled check-ins** within the selected range. A habit counts only from the day it was created.
- **Dates:** use the **device's local date and timezone**. "Today" rolls over at local midnight.
- **Week start:** Monday.
- **Habit name validation:** required, trimmed, max 40 characters, unique.

---

## 5. Design and UI

- **Vibe:** clean, motivating, uncluttered, with lots of white space and big thumb-friendly tap targets.
- **Reference app:** **Streaks.** The user chose to have the style **described in words**, with no screenshots. The PRD should describe a simple, bold, minimal habit-grid feel with round progress rings and colored round habit icons. Streaks should not be copied directly.
- **Accent color:** **energetic orange.** Green is reserved to mean "completed" (success). The exact hex is not decided; the PRD may suggest one (for example a vibrant orange around `#F97316`) and mark it as a suggestion.
- **Fonts:** **Roboto Condensed** for headings and numbers/stats; regular **Roboto** for body text, labels, and small text.
- **Shape language:** **soft and rounded** (rounded cards, soft shadows, clear hierarchy).
- **Theming:** **light + dark mode**, with dark as **soft charcoal** (not true black). Use **CSS-variable color tokens** from the start. Theme options: **Light / Dark** only. A new install starts in Light. The choice is stored under `fitency-theme`; legacy `system` values are resolved once to an explicit theme.
- **Icons:** `lucide-react` for UI icons, plus the preset fitness icon set for habits.
- **Charts:** simple, readable, color-coded.
- **Accessibility:** semantic HTML, WCAG AA contrast in both themes, full keyboard support, ARIA labels on icon buttons and charts, visible focus rings, respect for reduced-motion.

---

## 6. Responsive behavior

- **Below 768px:** single column, **bottom tab bar** (Home, Analytics, Habits, Account).
- **768px and up:** **left sidebar**, content capped at a max width, cards arranged in a grid.
- Forms: full screen on mobile, modal on desktop. Day-detail view: bottom sheet on mobile, modal on desktop.

---

## 7. Components and states

| Area | Components |
|---|---|
| **Global** | BottomTabBar, Sidebar (desktop), PageHeader, Button, Input, BottomSheet/Modal, ConfirmDialog, Toast, ProgressRing, EmptyState, Skeleton |
| **Home** | GreetingHeader, TodayProgressCard, StreakBadge, HabitItem (checkbox), Pending/Completed lists, OverallProgressCard with Week/Month/All toggle |
| **Habits** | HabitList, HabitCard, HabitForm, IconPicker, ColorPicker, WeekdayPicker |
| **Analytics** | RangeSwitcher, StatCard, Heatmap, TrendChart, HabitBreakdown, DayDetailSheet |
| **Account** | ProfileCard, NameEditForm, ThemeSelect, DangerZone |
| **Auth** | LoginForm, SignupForm |

**States every screen needs:**
- **Loading:** skeleton placeholders.
- **Empty:** friendly message with one clear action.
- **Error:** inline message with a retry button, or a toast.
- **Forms:** inline validation, disabled submit while saving, success toast.

---

## 8. Tech stack (frontend only)

| Concern | Choice |
|---|---|
| Framework | **React + Vite** (SPA). Changed from Next.js. No SSR. |
| Language | **TypeScript** |
| Routing | **React Router** (routes: Home, Analytics, Habits, Account, Login, Signup, plus a route guard) |
| Styling | **Tailwind CSS** with CSS-variable color tokens |
| UI primitives | **shadcn/ui** (Radix, plus Vaul for bottom sheets) |
| Icons | `lucide-react` |
| Charts | **Recharts** |
| Heatmap | Custom CSS grid component (no library) |
| State | **Zustand** (with `persist`) |
| Forms / validation | **react-hook-form + zod** |
| Dates | **date-fns** |
| Theming | `next-themes` (works in Vite) or a small custom ThemeProvider (class on `<html>`) |
| Fonts | `@fontsource` packages (Roboto Condensed + Roboto), self-hosted |
| Toasts | **sonner** |
| Config | `import.meta.env` |
| Code quality | **ESLint + Prettier** |

### Mock data approach (backend-neutral)
- All data access goes through **one service layer** (for example `src/lib/services/`) of async functions like `getHabits()`, `createHabit()`, `updateHabit()`, `deleteHabit()`, `toggleCompletion()`, plus mock auth functions.
- For now, these read and write **mock data persisted in `localStorage`**, with a small simulated delay so loading states are real.
- The PRD must NOT define API endpoints or backend details. When the friend decides the backend, only the service layer gets swapped.

### Placeholder data shapes (frontend typing only; the friend may change them)
```ts
type Habit = {
  id: string;
  name: string;        // 1-40 chars, unique
  icon: string;        // key from the preset fitness icon set
  color: string;       // key or hex from the palette
  weekdays: number[];  // e.g. 1-7 (Mon-Sun), at least one
  createdAt: string;   // ISO date
};

type Completion = {
  habitId: string;
  date: string;        // YYYY-MM-DD, device-local
};

type User = {
  id: string;
  name: string;
  email: string;
};
```

### Proposed folder structure (feature-based)
```
src/
  components/ui/        # shadcn/ui primitives
  components/           # shared: ProgressRing, EmptyState, layout pieces
  features/
    home/
    habits/
    analytics/
    account/
    auth/
  lib/
    services/           # data access layer (localStorage mock)
    utils/              # date, streak, completion helpers
  store/                # Zustand stores
  routes/               # router setup and route guard
  styles/               # Tailwind config, tokens, fonts
  main.tsx
```

---

## 9. Future / out of scope for the MVP
The PRD must list these under "Future / out of scope" so the agent does not build them:
- Workout logging (sets, reps, weight, duration)
- Exercise library and custom exercises
- Body stats and measurements
- Workout routines (like "Push day")
- Target-based habits (like "Run 30 min")
- Reminders and notifications
- Archive/pause habits
- Per-habit detail page
- "Most consistent day" insight
- Google / social sign-in
- Week start day setting
- Social features (sharing progress with a friend)
- Installable PWA / offline support

---

## 10. Instructions for generating the PRD from this file

1. Produce a single `PRD.md`, **frontend only**, written for an AI coding agent.
2. Use these sections in order: Overview; Goals and users; Tech stack; Folder structure; Design system (colors, type, shape, theming, accessibility); Navigation and layout (breakpoints); Pages and screens (Home, Habits, Analytics, Account, Auth, each with layout, components, behavior, and states); Frontend logic rules (streak, completion %, dates, validation); Mock data and service layer; Placeholder data shapes; Component list; Edge cases and states; Future / out of scope.
3. Use only what is in this file. Do not invent features, pages, or backend details.
4. Keep the wording clear and unambiguous so an agent can build without asking questions.
