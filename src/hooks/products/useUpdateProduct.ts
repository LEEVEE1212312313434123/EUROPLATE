import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ProductsService } from "@/services/products/products.service";
import type { CreateProductDTO } from "@/types/products/product.dto";

export function useUpdateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, dto }: { id: number; dto: CreateProductDTO }) =>
      ProductsService.update(id, dto),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
}
