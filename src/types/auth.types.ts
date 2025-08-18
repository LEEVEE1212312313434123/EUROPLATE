// src/types/auth.types.ts
export interface User {
  id: number;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  profileIcon: string;
  role: "admin" | "user";
  lastLogin: string;
}
