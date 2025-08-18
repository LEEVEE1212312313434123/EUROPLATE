import type { User } from "@/types/auth.types";
import { AUTH_CONFIG } from "@/config/auth.config";

const USER_KEY = "auth_user";

export const authService = {
  async getUsers(): Promise<User[]> {
    const response = await fetch(AUTH_CONFIG.USERS_JSON_PATH);
    if (!response.ok) throw new Error("No se pudo obtener la lista de usuarios");
    return await response.json();
  },

  async login(email: string, password: string): Promise<User | null> {
    const users = await this.getUsers();
    const foundUser = users.find(
      (u) => u.email === email && u.password === password
    );

    if (foundUser) {
      // Guardar en localStorage
      localStorage.setItem(USER_KEY, JSON.stringify(foundUser));
      return foundUser;
    }
    return null;
  },

  logout() {
    localStorage.removeItem(USER_KEY);
  },

  getCurrentUser(): User | null {
    const stored = localStorage.getItem(USER_KEY);
    return stored ? JSON.parse(stored) : null;
  }
};
