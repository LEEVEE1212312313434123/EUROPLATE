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
          <DialogTitle>Product Details</DialogTitle>
        </DialogHeader>

        {/* Información del producto */}
        <div className="space-y-4 py-4">
          <div className="flex justify-center">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-48 object-cover rounded-md"
            />
          </div>

          <div className="grid gap-2">
            <div className="flex justify-between">
              <strong>Name:</strong>
              <span>{product.name}</span>
            </div>

            <div className="flex justify-between">
              <strong>Price:</strong>
              <span>${product.price.toFixed(2)}</span>
            </div>

            <div className="flex justify-between">
              <strong>Stock:</strong>
              <span>{product.stock}</span>
            </div>

            <div className="flex justify-between">
              <strong>Discount:</strong>
              <span>
                {product.discount
                  ? `${(product.discount * 100).toFixed(0)}%`
                  : "No discount"}
              </span>
            </div>

            <div className="flex justify-between">
              <strong>Date Added:</strong>
              <span>{new Date(product.dateAdded).toLocaleDateString()}</span>
            </div>

            <div className="flex justify-between">
              <strong>ID:</strong>
              <span>{product.id}</span>
            </div>
          </div>
        </div>

        {/* Pie de página con los botones */}
        <DialogFooter className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
