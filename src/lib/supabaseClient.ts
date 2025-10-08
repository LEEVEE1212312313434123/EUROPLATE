import { createClient } from "@supabase/supabase-js";

// 🔹 Claves desde el panel de Supabase (Project Settings → API)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

// Cliente único para toda la app
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
