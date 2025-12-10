import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ProductsService } from "@/services/products/products.service";
import type { CreateProductDTO } from "@/types/products/product.dto";

export function useCreateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dto: CreateProductDTO) => ProductsService.create(dto),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
}
