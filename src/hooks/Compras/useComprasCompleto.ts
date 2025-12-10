import { useQuery } from "@tanstack/react-query";
import { ImportacionService } from "@/services/editimportacion.service";

export function useComprasCompleto() {
  return useQuery({
    queryKey: ["compras"],
    queryFn: async () => {
      const data = await ImportacionService.getAll();
      return data ?? [];
    },
    staleTime: 1000 * 60 * 5, // 5 min
  });
}
