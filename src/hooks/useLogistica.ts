import { useEffect, useState } from "react";
import type { Compra, Producto, Proveedor } from "@/types/logistica.types";
import { toast } from "sonner";
import { LogisticaService } from "@/services/logistica.service";

export function useLogistica() {
  const [compras, setCompras] = useState<Compra[]>([]);
  const [proveedores, setProveedores] = useState<Proveedor[]>([]);
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 🔹 Cargar datos iniciales
  useEffect(() => {
    LogisticaService.getAll()
      .then((data) => {
        // Recuperar de localStorage si existe
        const localData = localStorage.getItem("compras");
        if (localData) {
          const parsed: Compra[] = JSON.parse(localData);
          setCompras(parsed);

          // Extraer proveedores únicos
          const uniqueProveedores = Array.from(
            new Map(
              parsed.map((c) => [c.proveedor.nombre, c.proveedor])
            ).values()
          );
          setProveedores(uniqueProveedores);

          // Extraer productos
          const allProductos = parsed.flatMap((c) => c.productos);
          setProductos(allProductos);
        } else {
          setCompras(data);

          const uniqueProveedores = Array.from(
            new Map(
              data.map((c) => [c.proveedor.nombre, c.proveedor])
            ).values()
          );
          setProveedores(uniqueProveedores);

          const allProductos = data.flatMap((c) => c.productos);
          setProductos(allProductos);
        }
      })
      .catch(() => setError("No se pudieron cargar los datos de logística."))
      .finally(() => setLoading(false));
  }, []);

  // 🔹 Guardar cambios (Compra)
  const handleSaveCompra = async (updated: Compra) => {
    try {
      if (compras.some((c) => c.importacion_id === updated.importacion_id)) {
        await LogisticaService.update(updated.importacion_id, updated);
        setCompras((prev) =>
          prev.map((c) =>
            c.importacion_id === updated.importacion_id ? updated : c
          )
        );
        toast.success("Compra actualizada correctamente");
      } else {
        await LogisticaService.add(updated);
        setCompras((prev) => [...prev, updated]);
        toast.success("Compra registrada correctamente");
      }
    } catch {
      toast.error("Error al guardar la compra");
    }
  };

  // 🔹 Eliminar compra
  const handleDeleteCompra = async (id: string) => {
    try {
      await LogisticaService.delete(id);
      setCompras((prev) => prev.filter((c) => c.importacion_id !== id));
      toast.success("Compra eliminada correctamente");
    } catch {
      toast.error("Error al eliminar la compra");
    }
  };

  return {
    // Estados
    compras,
    proveedores,
    productos,
    loading,
    error,
    // Acciones
    setCompras,
    handleSaveCompra,
    handleDeleteCompra,
  };
}
