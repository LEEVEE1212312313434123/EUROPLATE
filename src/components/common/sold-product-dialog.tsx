"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import type { SoldProduct } from "@/types/sold-product.types";

interface SoldProductDialogProps {
  product: SoldProduct | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SoldProductDialog({
  product,
  open,
  onOpenChange,
}: SoldProductDialogProps) {
  if (!product) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Detalles del Producto Vendido</DialogTitle>
        </DialogHeader>

        {/* Imagen del producto */}
        <div className="space-y-4 py-4">
          <div className="flex justify-center">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-48 object-cover rounded-md"
            />
          </div>

          {/* Detalles */}
          <div className="grid gap-2">
            <div className="flex justify-between">
              <strong>Nombre:</strong>
              <span>{product.name}</span>
            </div>

            <div className="flex justify-between">
              <strong>Precio unitario:</strong>
              <span>${product.soldPrice.toFixed(2)}</span>
            </div>

            <div className="flex justify-between">
              <strong>Unidades vendidas:</strong>
              <span>{product.stockSold}</span>
            </div>

            <div className="flex justify-between">
              <strong>Subtotal:</strong>
              <span>${product.subtotal.toFixed(2)}</span>
            </div>

            <div className="flex justify-between">
              <strong>Descuento:</strong>
              <span>
                {product.discount > 0
                  ? `${(product.discount * 100).toFixed(0)}%`
                  : "Sin descuento"}
              </span>
            </div>

            <div className="flex justify-between">
              <strong>Total:</strong>
              <span>${product.total.toFixed(2)}</span>
            </div>

            <div className="flex justify-between">
              <strong>Fecha de venta:</strong>
              <span>{new Date(product.saleDate).toLocaleString()}</span>
            </div>

            <div className="flex justify-between">
              <strong>ID:</strong>
              <span>{product.id}</span>
            </div>
          </div>
        </div>

        {/* Footer con botón de cierre */}
        <DialogFooter className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cerrar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
