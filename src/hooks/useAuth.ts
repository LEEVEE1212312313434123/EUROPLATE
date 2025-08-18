import { useEffect, useState } from "react";
import type { User } from "@/types/auth.types";
import { authService } from "@/services/auth.service";

export function useAuth() {
  const [user, setUser] = useState<User | null>(authService.getCurrentUser());

  async function login(email: string, password: string) {
    const foundUser = await authService.login(email, password);
    if (foundUser) {
      setUser(foundUser);
      return { success: true, message: "Inicio de sesión exitoso" };
    }
    return { success: false, message: "Credenciales incorrectas" };
  }

  function logout() {
    authService.logout();
    setUser(null);
  }

  useEffect(() => {
    const current = authService.getCurrentUser();
    if (current) setUser(current);
  }, []);

  return { user, login, logout, isAuthenticated: !!user };
}
