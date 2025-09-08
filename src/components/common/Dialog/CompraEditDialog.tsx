import { useState, useEffect } from "react";
import type { Compra } from "@/components/common/Logistica/ComprasTable";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface CompraEditDialogProps {
  open: boolean;
  compra: Compra;
  onClose: () => void;
  onSave: (updatedCompra: Compra) => void;
}

export function CompraEditDialog({
  open,
  compra,
  onClose,
  onSave,
}: CompraEditDialogProps) {
  const [form, setForm] = useState<Compra>(compra);

  useEffect(() => {
    setForm(compra);
  }, [compra]);

  const handleChange = (field: keyof Compra, value: any) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = () => {
    onSave(form);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Editar Compra</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-1">
            <Label>ID</Label>
            <Input value={form.id} disabled />
          </div>

          <div className="grid gap-1">
            <Label>Importación</Label>
            <Input
              value={form.importacion}
              onChange={(e) => handleChange("importacion", e.target.value)}
            />
          </div>

          <div className="grid gap-1">
            <Label>Descripción</Label>
            <Input
              value={form.descripcion}
              onChange={(e) => handleChange("descripcion", e.target.value)}
            />
          </div>

          <div className="grid gap-1">
            <Label>Proveedor</Label>
            <Input
              value={form.proveedor}
              onChange={(e) => handleChange("proveedor", e.target.value)}
            />
          </div>

          <div className="grid gap-1">
            <Label>Origen</Label>
            <Input
              value={form.origen}
              onChange={(e) => handleChange("origen", e.target.value)}
            />
          </div>

          <div className="grid gap-1">
            <Label>Destino</Label>
            <Input
              value={form.destino}
              onChange={(e) => handleChange("destino", e.target.value)}
            />
          </div>

          <div className="grid gap-1">
            <Label>Estado</Label>
            <Select
              value={form.estado}
              onValueChange={(value) => handleChange("estado", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="En transito">En tránsito</SelectItem>
                <SelectItem value="Entregado">Entregado</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-1">
            <Label>Fecha de Entrega</Label>
            <Input
              type="date"
              value={form.fechaEntrega}
              onChange={(e) => handleChange("fechaEntrega", e.target.value)}
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
