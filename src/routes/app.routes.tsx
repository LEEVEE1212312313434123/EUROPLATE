import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import AuthenticationLayout from "@/layout/authentication-layout"
import LoginPage from "@/pages/login.page"
import PasswordRecoveryForm from "@/pages/PasswordRecovery.page"

export function AppRoutes() {
  return (
    <Router>
      <Routes>
        <Route element={<AuthenticationLayout />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/recovery-password" element={<PasswordRecoveryForm />} />
        </Route>
      </Routes>
    </Router>
  )
}
