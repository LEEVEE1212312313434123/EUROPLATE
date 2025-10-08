import { useState, useEffect } from "react";
import { ImportacionService } from "@/services/logistica.importacion.service";
import { toast } from "sonner";

export function useLogisticaInventario() {
  const [inventario, setInventario] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadInventario();
  }, []);

  const loadInventario = async () => {
    try {
      setLoading(true);
      const data = await ImportacionService.getInventarioCompleto();
      setInventario(data);
    } catch (err: any) {
      setError(err.message ?? "Error al cargar el inventario");
      toast.error("Error al cargar inventario");
    } finally {
      setLoading(false);
    }
  };

  return { inventario, loading, error, reload: loadInventario };
}
