// @/components/common/Forms/Ventas/ventas-form.tsx
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { ResourcePage } from "@/components/common/ResourcePage";
import { Button } from "@/components/ui/button";
import { Toolbar } from "@/components/common/Toolbar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { VentasTable } from "@/components/common/Ventas/VentaTable";
import { VentasService } from "@/services/ventas/venta.service";
import { VentaDetalleModal } from "@/components/common/Ventas/VentaDetalleModal";
import { DebugRepository } from "@/repository/debug/debug.repository";
export function VentasForm() {
  const navigate = useNavigate();

  // Estados para modales
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [noteSelectorOpen, setNoteSelectorOpen] = useState(false);

  // Estados para datos seleccionados
  const [selectedVenta, setSelectedVenta] = useState<any>(null);

  const handleDebug = () => {
    DebugRepository.inspeccionarBaseDeDatos();
  };
  // Handlers
  const handleView = (venta: any) => {
    setSelectedVenta(venta);
    setViewOpen(true);
  };

  const handleDeleteClick = (venta: any) => {
    setSelectedVenta(venta);
    setDeleteOpen(true);
  };

  const irANota = (tipo: 'credito' | 'debito') => {
    setNoteSelectorOpen(false);
    navigate(`/ventas/nota-${tipo}/${selectedVenta.id}`);
  };

  const confirmarEliminacion = async () => {
    if (!selectedVenta) return;
    try {
      await VentasService.eliminarVenta(selectedVenta.id);
      setDeleteOpen(false);
      window.location.reload();
    } catch (error) {
      alert("Error al eliminar la venta");
    }
  };

  return (
    <ResourcePage
      title="Ventas"
      subtitle="Administra todas las ventas y documentos de ajuste"
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
            { value: "Completado", label: "Completadas" },
            { value: "Pendiente", label: "Pendientes" },
            { value: "Cancelado", label: "Canceladas" },
          ]}
          onExport={() => { }}
        />
      }
    >
      {/* Tabla con sus acciones conectadas a los estados del padre */}
      <VentasTable
        showView={true}
        showDelete={true}
        onView={handleView}
        onDelete={handleDeleteClick}
      />

      <Button onClick={handleDebug}>Inspeccionar DB</Button>

      {/* 1. Modal Detalle */}
      <VentaDetalleModal
        ventaId={selectedVenta?.id}
        open={viewOpen}
        onOpenChange={setViewOpen}
      />


      {/* 2. Modal Selector de Notas (Traspasado desde la tabla) */}
      <Dialog open={noteSelectorOpen} onOpenChange={setNoteSelectorOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Emitir Documento de Ajuste</DialogTitle>
            <DialogDescription>
              Seleccione el tipo de nota para la venta <strong>#{selectedVenta?.id}</strong> de {selectedVenta?.cliente}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Button
              variant="outline"
              className="h-20 flex flex-col gap-1 border-blue-200 hover:bg-blue-50 hover:border-blue-300 transition-all"
              onClick={() => irANota('credito')}
            >
              <span className="font-bold text-blue-700">Nota de Crédito</span>
              <span className="text-xs text-muted-foreground font-normal text-center">
                Para devoluciones totales/parciales o descuentos.
              </span>
            </Button>

            <Button
              variant="outline"
              className="h-20 flex flex-col gap-1 border-orange-200 hover:bg-orange-50 hover:border-orange-300 transition-all"
              onClick={() => irANota('debito')}
            >
              <span className="font-bold text-orange-700">Nota de Débito</span>
              <span className="text-xs text-muted-foreground font-normal text-center">
                Para cobros adicionales, intereses o errores de precio.
              </span>
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* 3. Modal de Eliminación */}
      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-destructive">¿Eliminar Venta?</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p>¿Estás seguro de eliminar la venta <strong>#{selectedVenta?.id}</strong>?</p>
            <p className="text-sm text-muted-foreground mt-2">
              Esta acción no se puede deshacer y afectará los reportes financieros.
            </p>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setDeleteOpen(false)}>Cancelar</Button>
            <Button variant="destructive" onClick={confirmarEliminacion}>Confirmar Eliminar</Button>
          </div>
        </DialogContent>
      </Dialog>
    </ResourcePage>
  );
}