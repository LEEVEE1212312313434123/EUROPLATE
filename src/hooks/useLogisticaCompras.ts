import { useState, useEffect } from "react";
import { ImportacionService } from "@/services/editimportacion.service";
import type { Importacion } from "@/types/editimportacion.type";
import { toast } from "sonner";

export function useLogisticaCompras() {
  const [compras, setCompras] = useState<Importacion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadCompras();
  }, []);

  const loadCompras = async () => {
    try {
      setLoading(true);
      // ✅ Usamos getAll para traer todas las importaciones
      const data = await ImportacionService.getAll();
      setCompras(data);
    } catch (err: any) {
      setError(err.message ?? "Error al cargar las compras");
      toast.error("Error al cargar las compras");
    } finally {
      setLoading(false);
    }
  };

  return { compras, loading, error, reload: loadCompras };
}
