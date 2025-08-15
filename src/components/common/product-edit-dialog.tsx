import { useState, useEffect } from "react";
import type { Product } from "@/types/product.types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ProductEditDialogProps {
  open: boolean;
  product: Product;
  onClose: () => void;
  onSave: (updatedProduct: Product) => void;
}

export function ProductEditDialog({
  open,
  product,
  onClose,
  onSave,
}: ProductEditDialogProps) {
  const [name, setName] = useState(product.name);
  const [price, setPrice] = useState(product.price);
  const [stock, setStock] = useState(product.stock);

  // Actualizar estado cuando cambie el producto (para reabrir con nuevo producto)
  useEffect(() => {
    setName(product.name);
    setPrice(product.price);
    setStock(product.stock);
  }, [product]);

  const handleSave = () => {
    onSave({
      ...product,
      name,
      price,
      stock,
    });
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Editar Producto</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-1">
            <Label htmlFor="id">ID (no editable)</Label>
            <Input id="id" value={product.id} disabled />
          </div>

          <div className="grid gap-1">
            <Label htmlFor="name">Nombre</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoFocus
            />
          </div>

          <div className="grid gap-1">
            <Label htmlFor="price">Precio</Label>
            <Input
              id="price"
              type="number"
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
              min={0}
            />
          </div>

          <div className="grid gap-1">
            <Label htmlFor="stock">Stock</Label>
            <Input
              id="stock"
              type="number"
              value={stock}
              onChange={(e) => setStock(Number(e.target.value))}
              min={0}
            />
          </div>
        </div>

        <DialogFooter className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleSave}>Guardar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
