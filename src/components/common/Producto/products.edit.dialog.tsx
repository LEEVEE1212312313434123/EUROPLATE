import { useState, useEffect } from "react";
import type { ProductWithRelations } from "@/types/products/product.relations";

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
  product: ProductWithRelations;
  onClose: () => void;
  onSave: (updated: ProductWithRelations) => void;
}

export function ProductEditDialog({
  open,
  product,
  onClose,
  onSave,
}: ProductEditDialogProps) {
  const price = product.precios[0];
  const stock = product.almacenes[0];

  const [nombreProducto, setNombreProducto] = useState(product.nombre_producto);
  const [precioMin, setPrecioMin] = useState(price?.precio_min ?? 0);
  const [precioMax, setPrecioMax] = useState(price?.precio_max ?? 0);
  const [stockActual, setStockActual] = useState(stock?.stock_actual ?? 0);

  useEffect(() => {
    setNombreProducto(product.nombre_producto);
    setPrecioMin(price?.precio_min ?? 0);
    setPrecioMax(price?.precio_max ?? 0);
    setStockActual(stock?.stock_actual ?? 0);
  }, [product]);

  const handleSave = () => {
    const updated: ProductWithRelations = {
      ...product,
      nombre_producto: nombreProducto,
      precios: [
        {
          ...price,
          precio_min: precioMin,
          precio_max: precioMax,
        },
      ],
      almacenes: [
        {
          ...stock,
          stock_actual: stockActual,
        },
      ],
    };

    onSave(updated);
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
            <Label>ID (no editable)</Label>
            <Input value={product.id} disabled />
          </div>
          <div className="grid gap-1">
            <Label>Nombre del Producto</Label>
            <Input
              value={nombreProducto}
              onChange={(e) => setNombreProducto(e.target.value)}
              autoFocus
            />
          </div>
          <div className="grid gap-1">
            <Label>Precio mínimo</Label>
            <Input
              type="number"
              min={0}
              step="0.01"
              value={precioMin}
              onChange={(e) => setPrecioMin(Number(e.target.value))}
            />
          </div>
          <div className="grid gap-1">
            <Label>Precio máximo</Label>
            <Input
              type="number"
              min={precioMin}
              step="0.01"
              value={precioMax}
              onChange={(e) => setPrecioMax(Number(e.target.value))}
            />
          </div>
          <div className="grid gap-1">
            <Label>Stock actual</Label>
            <Input
              type="number"
              min={0}
              value={stockActual}
              onChange={(e) => setStockActual(Number(e.target.value))}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleSave}>Guardar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
