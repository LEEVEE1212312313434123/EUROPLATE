import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { ResourcePage } from "@/components/common/ResourcePage";
import { Button } from "@/components/ui/button";
import { Toolbar } from "@/components/common/Toolbar";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { VentasTable } from "@/components/common/Ventas/VentaTable"; // 👈 ajusta la ruta si es necesario
import { VentasService } from "@/services/ventas/venta.service";

type VentaUI = {
  id: number;
  cliente: string;
  total: string;
  tipoPago: string;
  estado: string;
  fecha: string;
};

export function VentasForm() {
  const navigate = useNavigate();
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedVenta, setSelectedVenta] = useState<VentaUI | null>(null);

  const handleEdit = (venta: any) => {
    setSelectedVenta(venta);
    setEditOpen(true);
  };

  const handleDelete = (venta: any) => {
    setSelectedVenta(venta);
    setDeleteOpen(true);
  };

  const confirmarEliminacion = async () => {
    if (!selectedVenta) return;
    try {
      await VentasService.eliminarVenta(selectedVenta.id);
      setDeleteOpen(false);
      window.location.reload(); // Recarga simple para actualizar la lista
    } catch (error) {
      alert("Error al eliminar");
    }
  };

  return (
    <ResourcePage
      title="Ventas"
      subtitle="Administra todas las ventas"
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
          onFilterTypeChange={() => { }}
          onFilterStatusChange={() => { }}
          onSearchChange={() => { }}
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
          onExport={() => { }}
        />
      }
    >
      <VentasTable onEdit={handleEdit} onDelete={handleDelete} />

      {/* Dialogos de Shadcn UI */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Editar Venta #{selectedVenta?.id}</DialogTitle></DialogHeader>
          {/* Aquí iría tu formulario de edición */}
          <p>Funcionalidad de edición para {selectedVenta?.cliente}</p>
        </DialogContent>
      </Dialog>

      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>¿Eliminar Venta?</DialogTitle></DialogHeader>
          <p>¿Estás seguro de eliminar la venta de {selectedVenta?.cliente} por {selectedVenta?.total}?</p>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setDeleteOpen(false)}>Cancelar</Button>
            <Button variant="destructive" onClick={confirmarEliminacion}>Confirmar Eliminar</Button>
          </div>
        </DialogContent>
      </Dialog>
    </ResourcePage>
  );
}
