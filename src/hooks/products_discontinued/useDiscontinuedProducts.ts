import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ProductsService } from "@/services/products/products.service";
import { toast } from "sonner";

async function fetchDiscontinued() {
  const all = await ProductsService.getAll();
  return all.filter((p) => p.activo === false);
}

export function useDiscontinuedProducts() {
  const queryClient = useQueryClient();
  const {
    data: products = [],
    isLoading: loading,
    error,
  } = useQuery({
    queryKey: ["products", "discontinued"],
    queryFn: fetchDiscontinued,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => ProductsService.delete(id),
    onSuccess: () => {
      toast.success("Producto eliminado permanentemente");
      queryClient.invalidateQueries({ queryKey: ["products", "discontinued"] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
    onError: (err: any) => {
      toast.error(err.message ?? "Error al eliminar el producto");
    },
  });

  const restoreMutation = useMutation({
    mutationFn: (id: number) => ProductsService.updateActivo(id, true),
    onSuccess: () => {
      toast.success("Producto restaurado correctamente");
      queryClient.invalidateQueries({ queryKey: ["products", "discontinued"] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
    onError: () => {
      toast.error("Error al restaurar el producto");
    },
  });

  return {
    products,
    loading,
    error,
    handleDelete: (id: number) => deleteMutation.mutate(id),
    handleRestore: (id: number) => restoreMutation.mutate(id),
  };
}
