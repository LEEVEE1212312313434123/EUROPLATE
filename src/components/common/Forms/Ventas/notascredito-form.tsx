import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { ResourcePage } from "@/components/common/ResourcePage";
import { Button } from "@/components/ui/button";
import { Toolbar } from "@/components/common/Toolbar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { NotasCreditoTable } from "./NotasCreditoTable";
import { NotasCreditoService } from "@/services/ventas/notas_credito.service";
import { toast } from "sonner";
import { NotaDetalleModal } from "@/components/common/Forms/Ventas/NotaDetalleModal";

export function NotasCreditoForm() {
  const navigate = useNavigate();

  // Estados
  const [loading, setLoading] = useState(true);
  const [notas, setNotas] = useState<any[]>([]);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedNota, setSelectedNota] = useState<any | null>(null);
  const [viewOpen, setViewOpen] = useState(false);
  // Carga de datos
  const fetchNotas = async () => {
    try {
      setLoading(true);
      const data = await NotasCreditoService.getNotasCredito();
      setNotas(data);
    } catch (error) {
      console.error(error);
      toast.error("Error al cargar las notas de crédito");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotas();
  }, []);

  // Handlers de la Tabla
  const handleView = (nota: any) => {
    setSelectedNota(nota);
    setViewOpen(true);
  };
  const handleDeleteClick = (nota: any) => {
    setSelectedNota(nota);
    setDeleteOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedNota) return;
    try {
      await NotasCreditoService.eliminarNota(selectedNota.id);
      toast.success("Nota de crédito eliminada");
      setDeleteOpen(false);
      fetchNotas();
    } catch (error) {
      toast.error("No se pudo eliminar el documento");
    }
  };

  return (
    <ResourcePage
      title="Notas de Crédito"
      subtitle="Administra todas las notas de crédito y devoluciones"
      isLoading={loading} // CORREGIDO: Ahora usa el estado real
      error={null}
      headerActions={
        <Button onClick={() => navigate("/ventas")} className="bg-rose-600 hover:bg-rose-700">
          + Nueva Nota
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
            { value: "NC01", label: "Serie NC01" },
          ]}
          onExport={() => { }}
        />
      }
    >
      <div className="mt-4">
        <NotasCreditoTable
          data={notas}
          onDelete={handleDeleteClick}
          onView={handleView}
        />
      </div>

      {/* AGREGAR AQUÍ */}
      <NotaDetalleModal
        isOpen={viewOpen}
        onClose={() => setViewOpen(false)}
        nota={selectedNota}
      />
      {/* Modal de Confirmación de Eliminación */}
      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Eliminar Nota de Crédito</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-muted-foreground">
              ¿Estás seguro de que deseas eliminar la nota <span className="font-bold text-slate-900">{selectedNota?.serie_correlativo}</span>?
            </p>
            <p className="text-xs text-rose-500 mt-2 italic">
              * Esta acción no restaurará automáticamente el stock en el almacén.
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteOpen(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Confirmar Eliminación
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </ResourcePage>
  );
}