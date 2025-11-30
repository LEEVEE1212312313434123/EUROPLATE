"use client";

import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { ImportacionService } from "@/services/logistica.importacion.service";

interface EstadoImportacionDialogProps {
  open: boolean;
  onClose: () => void;
  estadoActual: string;
  estadosPosibles: string[];
  importacionId: number;
  almacenes?: { id: number; ubicacion: string }[];
  onSuccess: () => void;
}

export default function EstadoImportacionDialog({
  open,
  onClose,
  estadoActual,
  estadosPosibles,
  importacionId,
  almacenes = [],
  onSuccess,
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

      // ❌ No permitir cancelar si ya está entregado
      if (estadoActual === "Entregado" && nuevoEstado === "Cancelado") {
        toast.error("No puedes cancelar una importación ya entregada.");
        return;
      }

      // ✔ ENTREGADO → requiere almacén
      if (nuevoEstado === "Entregado") {
        if (!selectedAlmacen) {
          toast.error("Seleccione un almacén.");
          return;
        }

        await ImportacionService.actualizarEstado(importacionId, "Entregado", {
          almacenId: Number(selectedAlmacen),
        });
      }

      // ✔ CANCELADO → requiere motivo
      else if (nuevoEstado === "Cancelado") {
        if (!motivo.trim()) {
          toast.error("Debe ingresar un motivo.");
          return;
        }

        await ImportacionService.actualizarEstado(importacionId, "Cancelado", {
          motivo: motivo.trim(),
        });
      }

      // ✔ OTROS ESTADOS (Registrado / En tránsito)
      else {
        await ImportacionService.actualizarEstado(importacionId, nuevoEstado);
      }

      toast.success("Estado actualizado correctamente.");
      onSuccess();
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

        {/* Seleccionar Estado */}
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

        {/* ENTREGADO → requiere almacén */}
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

        {/* CANCELADO → requiere motivo */}
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

        {/* BOTONES */}
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
