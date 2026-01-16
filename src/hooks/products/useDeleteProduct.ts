import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ProductsService } from "@/services/products/products.service";

export function useDeleteProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => ProductsService.delete(id),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
}
