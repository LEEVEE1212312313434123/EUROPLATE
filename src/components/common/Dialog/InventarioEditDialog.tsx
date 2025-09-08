import { useEffect, useState } from "react";
import type { InventarioItem } from "@/components/common/Logistica/InventarioTable";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface InventarioEditDialogProps {
  open: boolean;
  item: InventarioItem;
  onClose: () => void;
  onSave: (updatedItem: InventarioItem) => void;
}

export function InventarioEditDialog({
  open,
  item,
  onClose,
  onSave,
}: InventarioEditDialogProps) {
  const [form, setForm] = useState<InventarioItem>(item);

  useEffect(() => {
    setForm(item);
  }, [item]);

  const handleChange = (field: keyof InventarioItem, value: any) => {
    setForm((prev) => ({
      ...prev,
      [field]: typeof value === "string" && !isNaN(Number(value))
        ? Number(value)
        : value,
    }));
  };

  const handleSave = () => {
    onSave(form);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Editar Producto del Inventario</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-4 py-4">
          <div className="grid gap-1">
            <Label htmlFor="id">ID</Label>
            <Input id="id" value={form.id} disabled />
          </div>

          <div className="grid gap-1">
            <Label htmlFor="importacion">Importación (fecha)</Label>
            <Input
              id="importacion"
              type="date"
              value={form.importacion}
              onChange={(e) => handleChange("importacion", e.target.value)}
            />
          </div>

          <div className="grid gap-1">
            <Label htmlFor="container">Container</Label>
            <Input
              id="container"
              value={form.container}
              onChange={(e) => handleChange("container", e.target.value)}
            />
          </div>

          <div className="grid gap-1">
            <Label htmlFor="purchaseOrder">Purchase Order</Label>
            <Input
              id="purchaseOrder"
              value={form.purchaseOrder}
              onChange={(e) => handleChange("purchaseOrder", e.target.value)}
            />
          </div>

          <div className="grid gap-1">
            <Label htmlFor="seal">Seal</Label>
            <Input
              id="seal"
              value={form.seal}
              onChange={(e) => handleChange("seal", e.target.value)}
            />
          </div>

          <div className="grid gap-1">
            <Label htmlFor="grade">Grade</Label>
            <Input
              id="grade"
              value={form.grade}
              onChange={(e) => handleChange("grade", e.target.value)}
            />
          </div>

          <div className="grid gap-1">
            <Label htmlFor="type">Type</Label>
            <Input
              id="type"
              value={form.type}
              onChange={(e) => handleChange("type", e.target.value)}
            />
          </div>

          <div className="grid gap-1">
            <Label htmlFor="width">Width</Label>
            <Input
              id="width"
              type="number"
              value={form.width}
              onChange={(e) => handleChange("width", e.target.value)}
            />
          </div>

          <div className="grid gap-1">
            <Label htmlFor="gsm">GSM</Label>
            <Input
              id="gsm"
              type="number"
              value={form.gsm}
              onChange={(e) => handleChange("gsm", e.target.value)}
            />
          </div>

          <div className="grid gap-1">
            <Label htmlFor="lmetre">L. Metre</Label>
            <Input
              id="lmetre"
              type="number"
              value={form.lmetre}
              onChange={(e) => handleChange("lmetre", e.target.value)}
            />
          </div>

          <div className="grid gap-1">
            <Label htmlFor="productId">Product ID</Label>
            <Input
              id="productId"
              value={form.productId}
              onChange={(e) => handleChange("productId", e.target.value)}
            />
          </div>

          <div className="grid gap-1">
            <Label htmlFor="grossNetWt">Peso (Kg)</Label>
            <Input
              id="grossNetWt"
              type="number"
              value={form.grossNetWt}
              onChange={(e) => handleChange("grossNetWt", e.target.value)}
            />
          </div>

          <div className="grid gap-1 col-span-2">
            <Label htmlFor="estado">Estado</Label>
            <Select
              value={form.estado}
              onValueChange={(value) => handleChange("estado", value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="En tránsito">En tránsito</SelectItem>
                <SelectItem value="En stock">En stock</SelectItem>
                <SelectItem value="Vendido">Vendido</SelectItem>
              </SelectContent>
            </Select>
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
