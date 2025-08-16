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

interface ProductViewDialogProps {
  product: Product | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ProductViewDialog({
  product,
  open,
  onOpenChange,
}: ProductViewDialogProps) {
  if (!product) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Detalles del Producto</DialogTitle>
        </DialogHeader>

        {/* Información del producto */}
        <div className="space-y-4 py-4">
          <div className="flex justify-center">
            <img
              src={product.image}
              alt={product.productName}
              className="w-full h-48 object-cover rounded-md"
            />
          </div>

          <div className="grid gap-2">
            <div className="flex justify-between">
              <strong>Nombre:</strong>
              <span>{product.productName}</span>
            </div>

            <div className="flex justify-between">
              <strong>Precio mínimo:</strong>
              <span>${product.minPrice.toFixed(2)}</span>
            </div>

            <div className="flex justify-between">
              <strong>Precio máximo:</strong>
              <span>${product.maxPrice.toFixed(2)}</span>
            </div>

            <div className="flex justify-between">
              <strong>Stock:</strong>
              <span>{product.stock}</span>
            </div>

            <div className="flex justify-between">
              <strong>Estado:</strong>
              <span>{product.status}</span>
            </div>

            <div className="flex justify-between">
              <strong>Fecha de alta:</strong>
              <span>{new Date(product.dateAdded).toLocaleDateString()}</span>
            </div>

            {/* No hay campo descuento en tu JSON, así que lo omitimos */}

            <div className="flex justify-between">
              <strong>Acción:</strong>
              <span>{product.action}</span>
            </div>
          </div>
        </div>

        {/* Pie de página con botón cerrar */}
        <DialogFooter className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cerrar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
