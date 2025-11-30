"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
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

  const handleDelete = () => {
    onDeleteConfirm(product.id);   // ← Solo dispara el handler del hook
    onOpenChange(false);           // ← Cierra el modal
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
          <Button
            className="cursor-pointer"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Cancelar
          </Button>

          <Button className="cursor-pointer" onClick={handleDelete}>
            Eliminar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
