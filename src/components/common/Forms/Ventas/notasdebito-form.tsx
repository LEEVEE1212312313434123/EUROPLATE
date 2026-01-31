import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { ResourcePage } from "@/components/common/ResourcePage";
import { Button } from "@/components/ui/button";
import { Toolbar } from "@/components/common/Toolbar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { NotasDebitoTable } from "./NotasDebitoTable";
import { NotasDebitoService } from "@/services/ventas/notas_debito.service";
import { toast } from "sonner";
import { NotaDetalleModal } from "@/components/common/Forms/Ventas/NotaDetalleModal";

export function NotasDebitoForm() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [notas, setNotas] = useState<any[]>([]);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedNota, setSelectedNota] = useState<any | null>(null);
  const [viewOpen, setViewOpen] = useState(false);

  const fetchNotas = async () => {
    try {
      setLoading(true);
      const data = await NotasDebitoService.getNotasDebito();
      setNotas(data);
    } catch (error) {
      console.error(error);
      toast.error("Error al cargar las notas de débito");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotas();
  }, []);

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
      await NotasDebitoService.eliminarNota(selectedNota.id);
      toast.success("Nota de débito eliminada");
      setDeleteOpen(false);
      fetchNotas();
    } catch (error) {
      toast.error("No se pudo eliminar el documento");
    }
  };

  return (
    <ResourcePage
      title="Notas de Débito"
      subtitle="Gestión de cargos adicionales y penalidades"
      isLoading={loading}
      error={null}
      headerActions={
        <Button onClick={() => navigate("/ventas")} className="bg-blue-600 hover:bg-blue-700">
          + Registrar Cargo
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
            { value: "all", label: "Todos los cargos" },
            { value: "ND01", label: "Serie ND01" },
          ]}
          onExport={() => console.log("Exportando...")}
        />
      }
    >
      <div className="mt-4">
        <NotasDebitoTable
          data={notas}
          onDelete={handleDeleteClick}
          onView={handleView}
        />
      </div>

      <NotaDetalleModal
        isOpen={viewOpen}
        onClose={() => setViewOpen(false)}
        nota={selectedNota}
      />

      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Eliminar Nota de Débito</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-muted-foreground">
              ¿Estás seguro de eliminar el cargo <span className="font-bold text-slate-900">{selectedNota?.serie_correlativo}</span>?
            </p>
            <p className="text-xs text-amber-600 mt-2">
              * El monto total de la venta original se recalculará automáticamente.
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