import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ImportacionComprasService } from "@/services/importacion/importacion.compras.service";

export function useRegistrarEntrega() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: { importacionId: number; almacenId: number }) =>
      ImportacionComprasService.registrarEntrega(
        params.importacionId,
        params.almacenId
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["compras"] });
    },
  });
}
