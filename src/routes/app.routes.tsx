import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import AuthenticationLayout from "@/layout/authentication.layout"
import DashboardLayout from "@/layout/dashboard.layout"
import LoginPage from "@/pages/auth/login.page"
import PasswordRecoveryForm from "@/pages/auth/PasswordRecovery.page"

import { dashboardRoutes } from "@/config/dashboard.routes"

export function AppRoutes() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />

        <Route element={<AuthenticationLayout />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/recovery-password" element={<PasswordRecoveryForm />} />
        </Route>

        <Route element={<DashboardLayout />}>
          {dashboardRoutes.map((route) => (
            <Route key={route.path} path={route.path} element={route.element} />
          ))}
        </Route>
      </Routes>
    </Router>
  )
}
