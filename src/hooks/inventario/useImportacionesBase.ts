import { useQuery } from "@tanstack/react-query";
import { ImportacionInventarioService } from "@/services/importacion/importacion.inventario.service";

export function useImportacionesBase() {
  return useQuery({
    queryKey: ["inventario", "importacionesBase"],
    queryFn: () => ImportacionInventarioService.getImportacionesBase(),
  });
}
