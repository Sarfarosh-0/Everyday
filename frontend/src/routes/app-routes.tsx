import { BrowserRouter, Navigate, Route, Routes } from "react-router"
import { AppShell } from "@/components/layout/app-shell"
import { AccountPage } from "@/features/account/account-page"
import { AnalyticsPage } from "@/features/analytics/analytics-page"
import { HabitsPage } from "@/features/habits/habits-page"
import { HomePage } from "@/features/home/home-page"
import { AppBootstrap } from "@/routes/app-bootstrap"
import { NotFoundPage } from "@/routes/not-found-page"

export function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppBootstrap />}>
          <Route element={<AppShell />}>
            <Route index element={<HomePage />} />
            <Route path="analytics" element={<AnalyticsPage />} />
            <Route path="habits" element={<HabitsPage />} />
            <Route path="account" element={<AccountPage />} />
          </Route>
        </Route>
        <Route path="/login" element={<Navigate to="/" replace />} />
        <Route path="/signup" element={<Navigate to="/" replace />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  )
}
