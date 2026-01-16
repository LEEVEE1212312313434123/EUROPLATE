import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { ResourcePage } from "@/components/common/ResourcePage";
import { Button } from "@/components/ui/button";
import { Toolbar } from "@/components/common/Toolbar";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

type VentaUI = {
  id: number;
  cliente: string;
  total: string;
  tipoPago: string;
  estado: string;
  fecha: string;
};

export function NotasDebitoForm() {
  const navigate = useNavigate();
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedVenta,] = useState<VentaUI | null>(null);

  return (
    <ResourcePage
      title="Notas de Débito"
      subtitle="Administra todas las notas de débito"
      isLoading={false}
      error={null}
      headerActions={
        <Button onClick={() => navigate("/ventas/add")}>
          + Registrar venta
        </Button>
      }
      toolbar={
        <Toolbar
          filterType="all"
          filterStatus="all"
          searchTerm=""
          onFilterTypeChange={() => {}}
          onFilterStatusChange={() => {}}
          onSearchChange={() => {}}
          tabs={[
            { value: "all", label: "Todas" },
            { value: "contado", label: "Contado" },
            { value: "credito", label: "Crédito" },
          ]}
          selectOptions={[
            { value: "all", label: "Todos los estados" },
            { value: "Paid", label: "Pagadas" },
            { value: "Pending", label: "Pendientes" },
            { value: "Canceled", label: "Anuladas" },
          ]}
          onExport={() => {}}
        />
      }
    >
    <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Venta</DialogTitle>
          </DialogHeader>
          {selectedVenta && (
            <div className="space-y-2 text-sm">
              <p><strong>Cliente:</strong> {selectedVenta.cliente}</p>
              <p><strong>Total:</strong> {selectedVenta.total}</p>
              <p><strong>Tipo de pago:</strong> {selectedVenta.tipoPago}</p>
              <p><strong>Estado:</strong> {selectedVenta.estado}</p>
            </div>
          )}
        </DialogContent>
      </Dialog>
      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Eliminar Venta</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            ¿Estás seguro de que deseas eliminar esta venta? Esta acción no se puede deshacer.
          </p>
        </DialogContent>
      </Dialog>
    </ResourcePage>
  );
}