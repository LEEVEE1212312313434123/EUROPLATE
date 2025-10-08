import { useState, useEffect } from "react";
import { ImportacionService } from "@/services/logistica.importacion.service";
import { toast } from "sonner";

export function useLogisticaCompras() {
  const [compras, setCompras] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadCompras();
  }, []);

  const loadCompras = async () => {
    try {
      setLoading(true);
      const data = await ImportacionService.getComprasBase();
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
