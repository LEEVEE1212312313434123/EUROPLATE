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
import { updateProduct } from "@/services/products.service";

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
  const [productName, setProductName] = useState(product.productName);
  const [minPrice, setMinPrice] = useState(product.minPrice);
  const [maxPrice, setMaxPrice] = useState(product.maxPrice);
  const [stock, setStock] = useState(product.stock);

  // Update state when product changes
  useEffect(() => {
    setProductName(product.productName);
    setMinPrice(product.minPrice);
    setMaxPrice(product.maxPrice);
    setStock(product.stock);
  }, [product]);

  const handleSave = () => {
    const updatedProduct: Product = {
      ...product,
      productName,
      minPrice,
      maxPrice,
      stock,
    };

    updateProduct(updatedProduct); // 👈 actualizamos la copia del servicio

    onSave(updatedProduct); // 👈 si el componente padre necesita enterarse
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Edit Product</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-1">
            <Label htmlFor="id">ID (not editable)</Label>
            <Input id="id" value={product.id} disabled />
          </div>

          <div className="grid gap-1">
            <Label htmlFor="productName">Product Name</Label>
            <Input
              id="productName"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              autoFocus
            />
          </div>

          <div className="grid gap-1">
            <Label htmlFor="minPrice">Min Price</Label>
            <Input
              id="minPrice"
              type="number"
              value={minPrice}
              onChange={(e) => setMinPrice(Number(e.target.value))}
              min={0}
              step="0.01"
            />
          </div>

          <div className="grid gap-1">
            <Label htmlFor="maxPrice">Max Price</Label>
            <Input
              id="maxPrice"
              type="number"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              min={minPrice}
              step="0.01"
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
            Cancel
          </Button>
          <Button onClick={handleSave}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
