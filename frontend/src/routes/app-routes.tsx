import { BrowserRouter, Route, Routes } from "react-router"
import { AppShell } from "@/components/layout/app-shell"
import { AccountPage } from "@/features/account/account-page"
import { AnalyticsPage } from "@/features/analytics/analytics-page"
import { LoginPage } from "@/features/auth/login-page"
import { SignupPage } from "@/features/auth/signup-page"
import { HabitsPage } from "@/features/habits/habits-page"
import { HomePage } from "@/features/home/home-page"
import { NotFoundPage } from "@/routes/not-found-page"
import { PublicOnly } from "@/routes/public-only"
import { RequireAuth } from "@/routes/require-auth"

export function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<PublicOnly />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
        </Route>
        <Route element={<RequireAuth />}>
          <Route element={<AppShell />}>
            <Route index element={<HomePage />} />
            <Route path="analytics" element={<AnalyticsPage />} />
            <Route path="habits" element={<HabitsPage />} />
            <Route path="account" element={<AccountPage />} />
          </Route>
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  )
}
