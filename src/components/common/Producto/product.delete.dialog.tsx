"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { ProductService } from "@/services/products.service"; // Importa el servicio
import type { Product } from "@/types/product.types";

interface ProductDeleteDialogProps {
  product: Product | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDeleteConfirm: (productId: number) => void;
}

export function ProductDeleteDialog({
  product,
  open,
  onOpenChange,
  onDeleteConfirm,
}: ProductDeleteDialogProps) {
  if (!product) return null;

  const handleDelete = async () => {
    try {
      // Llamar al servicio para eliminar el producto
      await ProductService.delete(product.id);
      onDeleteConfirm(product.id); // Notificar al componente padre que el producto fue eliminado
      onOpenChange(false); // Cerrar el diálogo
    } catch (error) {
      console.error("Error al eliminar el producto:", error);
      // Aquí puedes mostrar un mensaje de error si lo deseas
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Confirmar eliminación</DialogTitle>
        </DialogHeader>

        <div className="py-4">
          <p>
            ¿Estás seguro que deseas eliminar el producto{" "}
            <strong>{product.nombre_producto}</strong>? Esta acción no se puede
            deshacer.
          </p>
        </div>

        <DialogFooter className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button variant="destructive" onClick={handleDelete}>
            Eliminar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
