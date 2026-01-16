"use client";

import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

interface EstadoImportacionDialogProps {
  open: boolean;
  onClose: () => void;
  estadoActual: string;
  estadosPosibles: string[];
  importacionId: number;
  almacenes?: { id: number; ubicacion: string }[];
  onSubmit: (estado: string, options?: any) => Promise<void>;
}

export default function EstadoImportacionDialog({
  open,
  onClose,
  estadoActual,
  estadosPosibles,
  almacenes = [],
  onSubmit,
}: EstadoImportacionDialogProps) {

  const [nuevoEstado, setNuevoEstado] = useState(estadoActual);
  const [motivo, setMotivo] = useState("");
  const [selectedAlmacen, setSelectedAlmacen] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setNuevoEstado(estadoActual);
    setMotivo("");
    setSelectedAlmacen("");
  }, [open, estadoActual]);

  const handleSave = async () => {
    try {
      setSaving(true);

      if (estadoActual === "Entregado" && nuevoEstado === "Cancelado") {
        toast.error("No puedes cancelar una importación ya entregada.");
        return;
      }

      if (nuevoEstado === "Entregado") {
        if (!selectedAlmacen) {
          toast.error("Seleccione un almacén.");
          return;
        }
        await onSubmit("Entregado", { almacenId: Number(selectedAlmacen) });
      }
      else if (nuevoEstado === "Cancelado") {
        if (!motivo.trim()) {
          toast.error("Debe ingresar un motivo.");
          return;
        }
        await onSubmit("Cancelado", { motivo: motivo.trim() });
      }
      else {
        await onSubmit(nuevoEstado);
      }

      toast.success("Estado actualizado correctamente.");
      onClose();

    } catch (err: any) {
      toast.error("Error: " + (err?.message || "No se pudo actualizar."));
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Cambiar estado</DialogTitle>
        </DialogHeader>
        <div className="space-y-3 mt-2">
          <Label>Nuevo Estado</Label>
          <Select value={nuevoEstado} onValueChange={setNuevoEstado}>
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar estado" />
            </SelectTrigger>
            <SelectContent>
              {estadosPosibles.map((estado) => (
                <SelectItem key={estado} value={estado}>
                  {estado}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {nuevoEstado === "Entregado" && (
          <div className="space-y-3">
            <Label>Seleccionar almacén</Label>
            <Select value={selectedAlmacen} onValueChange={setSelectedAlmacen}>
              <SelectTrigger>
                <SelectValue placeholder="Seleccione un almacén" />
              </SelectTrigger>
              <SelectContent>
                {almacenes.map((a) => (
                  <SelectItem key={a.id} value={String(a.id)}>
                    {a.ubicacion}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {nuevoEstado === "Cancelado" && (
          <div className="space-y-3">
            <Label>Motivo</Label>
            <Input
              placeholder="Motivo de cancelación"
              value={motivo}
              onChange={(e) => setMotivo(e.target.value)}
            />
          </div>
        )}

        <div className="flex justify-end space-x-3 mt-6">
          <Button variant="outline" onClick={onClose} disabled={saving}>
            Cerrar
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? "Guardando..." : "Guardar"}
          </Button>
        </div>

      </DialogContent>
    </Dialog>
  );
}
