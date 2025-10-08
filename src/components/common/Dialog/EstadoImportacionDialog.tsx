"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { ImportacionService } from "@/services/logistica.importacion.service";

interface EstadoImportacionDialogProps {
  open: boolean;
  onClose: () => void;
  estado: "Entregado" | "Cancelado";
  importacionId: number;
  almacenes?: { id: number; ubicacion: string }[];
  onSuccess: () => void;
}

export function EstadoImportacionDialog({
  open,
  onClose,
  estado,
  importacionId,
  almacenes = [],
  onSuccess,
}: EstadoImportacionDialogProps) {
  const [selectedAlmacen, setSelectedAlmacen] = useState<string>("");
  const [motivo, setMotivo] = useState("");
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    try {
      setSaving(true);

      if (estado === "Entregado") {
        if (!selectedAlmacen) {
          toast.error("Seleccione un almacén para continuar");
          return;
        }
        await ImportacionService.registrarEstadoEntrega(
          importacionId,
          Number(selectedAlmacen)
        );
      } else {
        if (!motivo.trim()) {
          toast.error("Ingrese el motivo de cancelación");
          return;
        }
        await ImportacionService.registrarEstadoCancelacion(
          importacionId,
          motivo
        );
      }

      toast.success(`Estado "${estado}" registrado correctamente`);
      onSuccess();
      onClose();
    } catch (err: any) {
      toast.error("Error al registrar el estado: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md rounded-2xl shadow-lg">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-primary">
            {estado === "Entregado"
              ? "Registrar entrega de importación"
              : "Cancelar importación"}
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            {estado === "Entregado"
              ? "Seleccione el almacén donde se entregará esta importación."
              : "Explique brevemente el motivo de la cancelación."}
          </DialogDescription>
        </DialogHeader>

        <div className="mt-5 space-y-5 text-left">
          {estado === "Entregado" ? (
            <div className="flex flex-col space-y-3">
              <Label className="font-medium">Almacén de destino</Label>
              <Select onValueChange={setSelectedAlmacen}>
                <SelectTrigger className="cursor-pointer">
                  <SelectValue placeholder="Seleccione un almacén" />
                </SelectTrigger>
                <SelectContent>
                  {almacenes.length > 0 ? (
                    almacenes.map((a) => (
                      <SelectItem
                        key={a.id}
                        value={String(a.id)}
                        className="cursor-pointer"
                      >
                        {a.ubicacion}
                      </SelectItem>
                    ))
                  ) : (
                    <div className="px-3 py-2 text-sm text-muted-foreground">
                      No hay almacenes disponibles
                    </div>
                  )}
                </SelectContent>
              </Select>
            </div>
          ) : (
            <div className="flex flex-col space-y-3">
              <Label className="font-medium">Motivo de cancelación</Label>
              <Textarea
                placeholder="Escriba aquí el motivo..."
                value={motivo}
                onChange={(e) => setMotivo(e.target.value)}
                className="cursor-text min-h-[100px] resize-none"
              />
            </div>
          )}
        </div>

        <DialogFooter className="mt-6 flex justify-end gap-2">
          <Button
            variant="outline"
            onClick={onClose}
            className="cursor-pointer"
          >
            Cancelar
          </Button>
          <Button
            onClick={handleSave}
            className="bg-primary text-white cursor-pointer hover:bg-primary/90"
            disabled={saving}
          >
            {saving ? "Guardando..." : "Guardar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
