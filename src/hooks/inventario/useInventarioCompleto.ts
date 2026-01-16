import { useQuery } from "@tanstack/react-query";
import { ImportacionInventarioService } from "@/services/importacion/importacion.inventario.service";

export function useInventarioCompleto() {
  return useQuery({
    queryKey: ["inventario", "completo"],
    queryFn: () => ImportacionInventarioService.getInventarioCompleto(),
    staleTime: 1000 * 60 * 5,
  });
}
