import { useQuery } from "@tanstack/react-query";
import { ImportacionComprasService } from "@/services/importacion/importacion.compras.service";

export function useComprasBase() {
  return useQuery({
    queryKey: ["compras", "base"],
    queryFn: () => ImportacionComprasService.getComprasBase(),
    staleTime: 1000 * 60 * 2, // evita recargar por 2min
  });
}
