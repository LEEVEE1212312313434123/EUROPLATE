import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ProductsService } from "@/services/products/products.service";

export function useToggleActive() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, activo }: { id: number; activo: boolean }) =>
      ProductsService.updateActivo(id, activo),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
}
