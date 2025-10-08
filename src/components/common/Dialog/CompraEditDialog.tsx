import { useState, useEffect } from "react";
import type { Importacion } from "@/types/importacion.types";
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

interface ImportacionEditDialogProps {
  open: boolean;
  importacion: Importacion;
  onClose: () => void;
  onSave: (updatedImportacion: Importacion) => void;
}

export function CompraEditDialog({
  open,
  importacion,
  onClose,
  onSave,
}: ImportacionEditDialogProps) {
  const [form, setForm] = useState<Importacion>(importacion);

  useEffect(() => {
    setForm(importacion);
  }, [importacion]);

  const handleChange = (field: keyof Importacion, value: any) => {
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
          <DialogTitle>Editar Importación</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {/* ID */}
          <div className="grid gap-1">
            <Label>ID</Label>
            <Input value={form.id} disabled />
          </div>

          {/* Descripción */}
          <div className="grid gap-1">
            <Label>Descripción</Label>
            <Input
              value={form.detalle ?? ""}
              onChange={(e) => handleChange("detalle", e.target.value)}
            />
          </div>

          {/* Proveedor */}
          <div className="grid gap-1">
            <Label>Proveedor</Label>
            <Input
              value={form.proveedor ?? ""}
              onChange={(e) => handleChange("proveedor", e.target.value)}
            />
          </div>

          {/* Origen */}
          <div className="grid gap-1">
            <Label>Origen</Label>
            <Input
              value={form.pais_origen ?? ""}
              onChange={(e) => handleChange("pais_origen", e.target.value)}
            />
          </div>

          {/* Destino */}
          <div className="grid gap-1">
            <Label>Destino</Label>
            <Input
              value={form.puerto_destino ?? ""}
              onChange={(e) => handleChange("puerto_destino", e.target.value)}
            />
          </div>

          {/* Estado */}
          <div className="grid gap-1">
            <Label>Estado</Label>
            <Select
              value={
                form.fecha_entrega
                  ? "Entregado"
                  : "En tránsito"
              }
              onValueChange={(value) =>
                handleChange(
                  "fecha_entrega",
                  value === "Entregado"
                    ? new Date().toISOString().split("T")[0]
                    : ""
                )
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="En tránsito">En tránsito</SelectItem>
                <SelectItem value="Entregado">Entregado</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Fecha de Entrega */}
          <div className="grid gap-1">
            <Label>Fecha de Entrega</Label>
            <Input
              type="date"
              value={form.fecha_entrega ?? ""}
              onChange={(e) => handleChange("fecha_entrega", e.target.value)}
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
