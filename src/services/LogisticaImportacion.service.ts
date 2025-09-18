// utils/storage.ts

import type { OrdenImportacion } from "@/types/ImportacionLogistica.types"


export function guardarImportacion(orden: OrdenImportacion) {
    try {
        const data = localStorage.getItem("importaciones");
        const importaciones: OrdenImportacion[] = data ? JSON.parse(data) : [];

        importaciones.push(orden);

        localStorage.setItem("importaciones", JSON.stringify(importaciones));
    } catch (error) {
        console.error("❌ Error guardando importación:", error)
    }
}

// Obtener la orden de importación del localStorage
export function obtenerImportaciones(): OrdenImportacion[] {
    try {
        const data = localStorage.getItem("importaciones");
        return data ? (JSON.parse(data) as OrdenImportacion[]) : [];
    } catch (error) {
        console.error("Error leyendo importaciones:", error);
        return [];
    }
}

// Eliminar la orden de importación
export function eliminarImportacion() {
    try {
        localStorage.removeItem("importaciones")
        console.log("🗑️ Importación eliminada de localStorage")
    } catch (error) {
        console.error("❌ Error eliminando importación:", error)
    }
}
