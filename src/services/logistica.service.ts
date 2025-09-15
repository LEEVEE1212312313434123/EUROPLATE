import { LOGISTICA_CONFIG } from "@/config/logistica.config";
import type { Compra } from "@/types/logistica.types";

export const LogisticaService = {
  async getAll(): Promise<Compra[]> {
    const res = await fetch(LOGISTICA_CONFIG.LOGISTICA_JSON_PATH);
    if (!res.ok) throw new Error("Error al cargar compras");
    return res.json();
  },

  async add(compra: Compra): Promise<void> {
    // Aquí normalmente harías POST a la API
    console.log("Añadiendo compra:", compra);
  },

  async update(id: string, compra: Compra): Promise<void> {
    // Aquí harías PUT/PATCH a la API
    console.log("Actualizando compra:", id, compra);
  },

  async delete(id: string): Promise<void> {
    // Aquí harías DELETE a la API
    console.log("Eliminando compra:", id);
  },
};
