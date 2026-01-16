import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ImportacionComprasService } from "@/services/importacion/importacion.compras.service";

export type CompraEstado =
  | "Pendientes"
  | "Registrado"
  | "En Transito"
  | "Entregado"
  | "Cancelado";

export interface ActualizarEstadoParams {
  id: number;
  estado: CompraEstado;
  options?: Record<string, unknown>;
}

export function useActualizarEstadoCompra() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, estado, options }: ActualizarEstadoParams) => {
      return await ImportacionComprasService.actualizarEstado(id, estado, options);
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["compras"] });
    },

    onError: (error) => {
      console.error("[Actualizar Estado] Error:", error);
    }
  });
}
