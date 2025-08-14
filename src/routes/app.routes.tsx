import { BrowserRouter as Router, Routes, Route } from "react-router-dom"

// Layouts
import AuthenticationLayout from "@/layout/authentication-layout"
import DashboardLayout from "@/layout/dashboard-layout"

import LoginPage from "@/pages/login.page"
import PasswordRecoveryForm from "@/pages/PasswordRecovery.page"

import { dashboardRoutes } from "@/config/dashboard-routes"

export function AppRoutes() {
  return (
    <Router>
      <Routes>
        {/* Auth */}
        <Route element={<AuthenticationLayout />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/recovery-password" element={<PasswordRecoveryForm />} />
        </Route>

        {/* Dashboard */}
        <Route element={<DashboardLayout />}>
          {dashboardRoutes.map((route) => (
            <Route key={route.path} path={route.path} element={route.element} />
          ))}
        </Route>
      </Routes>
    </Router>
  )
}
