import { useQuery } from "@tanstack/react-query";
import { ProductsService } from "@/services/products/products.service";

export function useProducts() {
  return useQuery({
    queryKey: ["products"],
    queryFn: () => ProductsService.getAll(),
  });
}
