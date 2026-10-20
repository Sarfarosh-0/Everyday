# Fitency: Frontend Product Requirements Document

**Audience:** an AI coding agent that will build the Fitency frontend.
**Scope:** frontend only (layout, UI, components, states, frontend tech stack, frontend logic). Backend choices, API endpoints, databases, and server architecture are **out of scope** and will be decided separately by the backend developer. Do not invent any of them.
**Rule for the agent:** build exactly what is described here. Do not add features, pages, or libraries that are not listed. Anything under "Future / out of scope" must NOT be built.

---

## 1. Overview

**Fitency** is a personal fitness exercise habit tracker. Users create habits, check them off each day, and see their progress over time.

- **Platform priority:** mobile-first, fully responsive (phone, tablet, desktop).
- **Privacy:** accounts are private. There is no sharing of progress between users.
- **Initial users:** two people (the product owner and their friend).
- **Goal:** help users stay consistent with their fitness habits without friction.
- **Build approach:** MVP first. The frontend runs entirely on mock data behind a service layer, so a real backend can be plugged in later by replacing only that layer.

---

## 2. MVP scope

### Pages
| # | Page | Purpose |
|---|---|---|
| 1 | Home (Dashboard) | Today's habits (done vs left), streak, overall completion % |
| 2 | Analytics | Detailed progress over time |
| 3 | Habits | Create habits; edit or delete existing ones |
| 4 | Account | Simple profile and settings |
| 5 | Login / Sign up | Public auth screens (mock auth) |

### Habit model
- A habit is a **simple daily yes/no check-off** (done / not done).
- Each habit runs on **chosen weekdays** (daily = all 7 selected).
- Habit fields: **name, icon, color, weekdays**. Nothing else.

---

## 3. Tech stack

| Concern | Choice |
|---|---|
| Framework | **React + Vite** (single-page app, no SSR) |
| Language | **TypeScript** |
| Routing | **React Router** |
| Styling | **Tailwind CSS** with CSS-variable color tokens |
| UI primitives | **shadcn/ui** (Radix, plus Vaul for bottom sheets) |
| Icons | **lucide-react** |
| Charts | **Recharts** |
| Heatmap | Custom CSS grid component (no library) |
| State | **Zustand** (with `persist`) |
| Forms and validation | **react-hook-form + zod** |
| Dates | **date-fns** |
| Theming | `next-themes` (works in Vite) or a small custom ThemeProvider that toggles a class on `<html>` |
| Fonts | **@fontsource** packages for Roboto Condensed and Roboto (self-hosted) |
| Toasts | **sonner** |
| Config | `import.meta.env` |
| Code quality | **ESLint + Prettier** |

---

## 4. Folder structure

Use a feature-based layout:

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

## 5. Design system

### Vibe
Clean, motivating, and uncluttered, with plenty of white space and large thumb-friendly tap targets.

### Style reference: "Streaks" (described in words)
Use the *feel* of a simple, bold, minimal habit app: habits shown as round, colored icon buttons; round progress rings as the main progress visual; very little chrome; one clear action per screen. Do not copy any app's assets or branding.

### Color
- **Accent:** energetic orange. Suggested starting value `#F97316` (a suggestion; adjust for contrast).
- **Green** is reserved to mean **"completed"** (success). Do not use green as a general accent.
- Define all colors as **CSS variables (tokens)** so light and dark themes share the same component code.

### Theming
- **Light and dark mode**, with options **Light / Dark / System**.
- Dark mode uses **soft charcoal** backgrounds, not true black.
- No flash of the wrong theme on load.

### Typography
- **Roboto Condensed:** headings, numbers, stats, percentages.
- **Roboto (regular):** body text, labels, small text, form fields.

### Shape
- **Soft and rounded:** rounded cards and buttons, soft shadows, clear visual hierarchy.

### Icons
- `lucide-react` for UI icons.
- A **preset fitness icon set** for habit icons (consistent look across devices; not an emoji picker).

### Charts
Simple, readable, and color-coded. Never rely on color alone to convey meaning.

### Accessibility (applies to every screen)
- Semantic HTML (`nav`, `main`, `button`, `form`, headings in order).
- WCAG AA contrast in both themes.
- Full keyboard support; visible focus rings.
- ARIA labels on icon-only buttons and on charts (provide a text summary or accessible description).
- Respect `prefers-reduced-motion`.

---

## 6. Navigation and responsive layout

| Viewport | Navigation | Layout |
|---|---|---|
| **Below 768px** | **Bottom tab bar** with four tabs: Home, Analytics, Habits, Account | Single column |
| **768px and up** | **Left sidebar** with the same four destinations | Content capped at a max width; cards in a grid |

- Forms (habit form): **full screen on mobile, modal on desktop**.
- Day detail (Analytics): **bottom sheet on mobile, modal on desktop**.
- Login and Sign up are public screens with no tab bar or sidebar.
- All pages except Login and Sign up sit behind a **client-side route guard** (a placeholder for real auth later). Unauthenticated users are redirected to Login.

---

## 7. Pages and screens

### 7.1 Home (Dashboard)

**Layout, mobile-first, top to bottom:**
1. **Header:** greeting, today's date, account avatar.
2. **Today's progress card:** progress ring showing "X / Y done" and a percentage.
3. **Streak badge:** small badge showing the current streak.
4. **Today's habits list:**
   - **Pending** section: habits not yet done, each with a tap-to-complete checkbox.
   - **Completed** section: done habits move here and can be un-checked.
5. **Overall progress card:** completed % vs left %, shown as a donut or bar, with a **Week / Month / All** toggle (default **Week**).
6. **Navigation:** per section 6.

**Behavior:**
- Only habits **scheduled for today's weekday** appear in today's list.
- **Today only:** the user can check off or un-check only today's habits. Past days are view-only (visible in Analytics).
- Checking a habit moves it between Pending and Completed and updates the progress ring, percentages, and streak immediately.

**States:**
- **Loading:** skeleton placeholders for the cards and list.
- **Empty (no habits at all):** friendly message with an **"Add your first habit"** button linking to the Habits page.
- **Empty today (habits exist but none scheduled today):** friendly message saying nothing is scheduled today.
- **Error:** inline message with a retry button, or a toast.

### 7.2 Habits page (add / edit / delete)

**Habits list (the tab):**
- List of all habits. Each row shows the **icon, name, and weekday chips**, with **Edit** and **Delete** actions.
- A prominent **"+ New habit"** button.
- **Empty state:** "No habits yet" with a call to action to create one.

**Habit form** (one shared form for add and edit; full screen on mobile, modal on desktop):
| Field | Rules |
|---|---|
| **Name** | Required, trimmed, max **40 characters**, **no duplicate names** |
| **Icon** | Grid picker using the preset fitness icon set |
| **Color** | Small palette picker |
| **Weekdays** | 7 toggle chips (Mon to Sun); at least one required; quick shortcuts **"Every day"** and **"Weekdays"** |

- **Save** and **Cancel** buttons.
- Inline validation errors under each field; submit disabled while saving; success toast on save.

**Delete:**
- **Hard delete** with a **confirm dialog** ("Delete this habit?"). Deleting a habit also removes its completion records, and all stats recalculate.
- Archive/pause is future scope.

**States:** loading (skeleton list), empty, error (inline or toast).

### 7.3 Analytics

**Layout, mobile-first, top to bottom:**
1. **Range switcher:** Week / Month / Year (default **Month**).
2. **Summary cards** (2x2 grid on mobile): **Completion rate %**, **Current streak**, **Best streak**, **Total check-ins**.
3. **Consistency heatmap:** calendar grid where each day is shaded by that day's completion %, like a contribution graph. **Tapping a day opens a read-only bottom sheet** (modal on desktop) listing which habits were done and not done that day.
4. **Completion trend:** line or bar chart of completion % across the selected range.
5. **Per-habit breakdown:** each habit's completion %, so the user can see which habits they keep and which they skip.

**Behavior:**
- All figures respect the selected range and follow the logic rules in section 8.
- Past days are **view-only** here.

**States:**
- **Loading:** skeletons for cards and charts.
- **Empty:** "Complete a few habits to see your analytics", with a link to Home.
- **Error:** inline message with retry, or a toast.

**Not in MVP:** "most consistent day" insight; a per-habit detail page.

### 7.4 Account

1. **Profile card:** avatar (initials fallback), name, email.
2. **Edit name:** inline edit or a small form (required, trimmed), with validation and a success toast.
3. **Appearance:** theme selector **Light / Dark / System**.
4. **Log out** button (clears the mock session and redirects to Login).
5. **Delete account** in a **danger zone**, behind a confirm dialog (clears the user's mock data and session, then redirects to Sign up or Login).

**Not in MVP:** week-start-day setting (Monday is the default).

### 7.5 Login and Sign up

- **Email + password only.** UI only, using **mock auth** through the service layer. No Google or other social sign-in.
- **Login form:** email, password, submit, link to Sign up.
- **Sign up form:** name, email, password, submit, link to Login.
- Inline validation (valid email format, required fields, minimum password length), disabled submit while submitting, and clear error messages (for example "Incorrect email or password").
- After success, redirect to Home.

---

## 8. Frontend logic rules

Implement these as pure, tested helper functions in `lib/utils/`.

- **Scheduled check-in:** a habit is scheduled on a date if that date's weekday is in the habit's `weekdays`, and the date is on or after the habit's creation date.
- **Completion %:** `completed check-ins ÷ scheduled check-ins` within the selected range. A habit counts only from the day it was created. If there are zero scheduled check-ins, show an empty or dash state rather than 0% or NaN.
- **Streak:** a day counts toward the streak only if **every habit scheduled that day is completed**. Days with **no scheduled habits are skipped** and do not break the streak. **Current streak** counts back from today (today counts once all of today's habits are done; an unfinished today does not break a streak that is otherwise intact). **Best streak** is the longest run in the user's history.
- **Dates:** use the **device's local date and timezone**. "Today" rolls over at local midnight. Store completion dates as `YYYY-MM-DD` strings in local time.
- **Week start:** Monday.
- **Habit name validation:** required, trimmed, max 40 characters, unique (case-insensitive comparison recommended).

---

## 9. Mock data and service layer

The frontend must not depend on any real backend.

- All data access goes through **one service layer** in `src/lib/services/` made of async functions, for example: `getHabits()`, `createHabit()`, `updateHabit()`, `deleteHabit()`, `getCompletions()`, `toggleCompletion()`, plus mock auth functions (`signUp()`, `logIn()`, `logOut()`, `getCurrentUser()`, `updateName()`, `deleteAccount()`).
- For now these read and write **mock data persisted in `localStorage`**, with a **small simulated delay** (for example 200 to 500 ms) so loading states are real.
- Components and stores call **only** the service layer. They never touch `localStorage` directly.
- Do **not** define API endpoints, request/response contracts, or backend technology. When the backend is chosen, only the service layer is replaced.
- Mock auth keeps a session in `localStorage`; the route guard reads from it.

### Placeholder data shapes
Frontend typing only. The backend developer may change these later.

```ts
type Habit = {
  id: string;
  name: string;        // 1-40 chars, unique
  icon: string;        // key from the preset fitness icon set
  color: string;       // key or hex from the palette
  weekdays: number[];  // 1-7 (Mon-Sun), at least one
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

---

## 10. Component list

| Area | Components |
|---|---|
| **Global** | BottomTabBar, Sidebar (desktop), PageHeader, Button, Input, BottomSheet/Modal, ConfirmDialog, Toast, ProgressRing, EmptyState, Skeleton |
| **Home** | GreetingHeader, TodayProgressCard, StreakBadge, HabitItem (checkbox), Pending/Completed lists, OverallProgressCard with Week/Month/All toggle |
| **Habits** | HabitList, HabitCard, HabitForm, IconPicker, ColorPicker, WeekdayPicker |
| **Analytics** | RangeSwitcher, StatCard, Heatmap, TrendChart, HabitBreakdown, DayDetailSheet |
| **Account** | ProfileCard, NameEditForm, ThemeSelect, DangerZone |
| **Auth** | LoginForm, SignupForm |

---

## 11. Edge cases and states

**Required on every screen:**
- **Loading:** skeleton placeholders.
- **Empty:** a friendly message with one clear action.
- **Error:** an inline message with a retry button, or a toast.
- **Forms:** inline validation, disabled submit while saving, success toast.

**Specific cases to handle:**
- No habits yet; habits exist but none scheduled today; all of today's habits completed (show a positive completed state).
- Habit created mid-week or today (counts only from its creation date).
- Zero scheduled check-ins in a range (avoid NaN and divide-by-zero).
- Duplicate or over-length habit names; no weekdays selected.
- Deleting a habit that has history (stats recalculate).
- Very long habit names (truncate with ellipsis in lists, keeping the full name accessible).
- First-time user with no analytics data (Analytics empty state).
- `localStorage` unavailable or corrupted (fail gracefully with an error state, no crash).
- Theme persistence across reloads without a flash.
- Keyboard-only and screen-reader use of the habit checkbox, heatmap cells, and sheets.

---

## 12. Future / out of scope (do NOT build)

- Workout logging (sets, reps, weight, duration)
- Exercise library and custom exercises
- Body stats and measurements
- Workout routines (such as "Push day")
- Target-based habits (such as "Run 30 min")
- Reminders and notifications
- Archive/pause habits
- Per-habit detail page
- "Most consistent day" insight
- Google or other social sign-in
- Week-start-day setting
- Social features (sharing progress with a friend)
- Installable PWA / offline support
- Any backend, API, or database work
