import { toast } from "sonner";
import {
  useActualizarEstadoCompra,
  type CompraEstado
} from "@/hooks/Compras/useActualizarEstadoCompra";

interface CompraBase {
  id: number;
  estado: CompraEstado;
}

export function useComprasActions() {
  const actualizarEstado = useActualizarEstadoCompra();

  const updateEstado = async (
    compra: CompraBase,
    estado: CompraEstado,
    onSuccess?: () => void
  ) => {
    try {
      await actualizarEstado.mutateAsync({
        id: compra.id,
        estado,
        options: {}
      });

      toast.success(`Estado actualizado a: ${estado}`);
      onSuccess?.();
    } catch (err) {
      console.error("Error actualizando estado:", err);
      toast.error("No se pudo actualizar el estado");
    }
  };

  // Acción específica
  const handleCancel = (compra: CompraBase, onSuccess?: () => void) =>
    updateEstado(compra, "Cancelado", onSuccess);

  return {
    updateEstado,
    handleCancel
  };
}
