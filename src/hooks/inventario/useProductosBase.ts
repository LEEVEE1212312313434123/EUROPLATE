import { useQuery } from "@tanstack/react-query";
import { ImportacionInventarioService } from "@/services/importacion/importacion.inventario.service";

export function useProductosBase() {
  return useQuery({
    queryKey: ["inventario", "productosBase"],
    queryFn: () => ImportacionInventarioService.getProductosBase(),
  });
}
