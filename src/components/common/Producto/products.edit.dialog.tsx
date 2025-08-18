import { useState, useEffect } from "react";
import type { Product } from "@/types/product.types";
import { ProductService } from "@/services/products.service";
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
  const [nombreProducto, setNombreProducto] = useState(product.nombre_producto);
  const [precioMin, setPrecioMin] = useState(product.precio.precio_min);
  const [precioMax, setPrecioMax] = useState(product.precio.precio_max);
  const [stockActual, setStockActual] = useState(product.almacen.stock_actual);

  // 🔹 Reset form cuando cambie el producto
  useEffect(() => {
    setNombreProducto(product.nombre_producto);
    setPrecioMin(product.precio.precio_min);
    setPrecioMax(product.precio.precio_max);
    setStockActual(product.almacen.stock_actual);
  }, [product]);

  const handleSave = async () => {
    // Crear el objeto de producto actualizado
    const updatedProduct: Product = {
      ...product,
      nombre_producto: nombreProducto,
      precio: {
        ...product.precio,
        precio_min: precioMin,
        precio_max: precioMax,
      },
      almacen: {
        ...product.almacen,
        stock_actual: stockActual,
      },
    };

    // Actualizar el producto en el servicio
    await ProductService.update(product.id, updatedProduct);

    // Llamar a la función onSave para notificar al componente padre
    onSave(updatedProduct);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Editar Producto</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {/* ID del producto (no editable) */}
          <div className="grid gap-1">
            <Label htmlFor="id">ID (no editable)</Label>
            <Input id="id" value={product.id} disabled />
          </div>

          {/* Nombre del Producto */}
          <div className="grid gap-1">
            <Label htmlFor="nombreProducto">Nombre del Producto</Label>
            <Input
              id="nombreProducto"
              value={nombreProducto}
              onChange={(e) => setNombreProducto(e.target.value)}
              autoFocus
            />
          </div>

          {/* Precio Mínimo */}
          <div className="grid gap-1">
            <Label htmlFor="precioMin">Precio Mínimo</Label>
            <Input
              id="precioMin"
              type="number"
              value={precioMin}
              onChange={(e) => setPrecioMin(Number(e.target.value))}
              min={0}
              step="0.01"
            />
          </div>

          {/* Precio Máximo */}
          <div className="grid gap-1">
            <Label htmlFor="precioMax">Precio Máximo</Label>
            <Input
              id="precioMax"
              type="number"
              value={precioMax}
              onChange={(e) => setPrecioMax(Number(e.target.value))}
              min={precioMin}
              step="0.01"
            />
          </div>

          {/* Stock Actual */}
          <div className="grid gap-1">
            <Label htmlFor="stockActual">Stock Actual</Label>
            <Input
              id="stockActual"
              type="number"
              value={stockActual}
              onChange={(e) => setStockActual(Number(e.target.value))}
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
