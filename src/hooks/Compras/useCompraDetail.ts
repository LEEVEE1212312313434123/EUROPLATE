import { useQuery } from "@tanstack/react-query";
import { ImportacionComprasService } from "@/services/importacion/importacion.compras.service";

export function useCompraDetail(id?: number) {
  return useQuery({
    queryKey: ["compras", "detail", id],
    queryFn: () => {
      if (!id) return null;
      return ImportacionComprasService.getCompraDetailById(id);
    },
    enabled: !!id,
  });
}
