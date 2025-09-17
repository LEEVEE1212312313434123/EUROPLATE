import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Toolbar } from "@/components/common/Toolbar";
import { ComprasTable } from "@/components/common/Logistica/ComprasTable";
import { CompraDetail } from "@/components/common/Logistica/CompraDetail";
import { CompraEditDialog } from "@/components/common/Dialog/CompraEditDialog";
import type { Compra } from "@/types/logistica.types";
import { useLogistica } from "@/hooks/useLogistica";

export default function ComprasLogistica() {
  const { compras, loading, error, handleDeleteCompra, handleSaveCompra } = useLogistica();

  const [filterType, setFilterType] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCompra, setSelectedCompra] = useState<Compra | null>(null);
  const [editingCompra, setEditingCompra] = useState<Compra | null>(null);


    const navigate = useNavigate();
  const FILTER_TYPE_MAP: Record<string, string | null> = {
    all: null,
    import: "importación",
    nacional: "nacional",
  };

  const STATUS_MAP: Record<string, string | null> = {
    all: null,
    transito: "En tránsito",
    entregado: "Entregado",
  };

  const filteredCompras = useMemo(() => {
    return compras.filter((c) => {
      if (
        searchTerm &&
        !c.descripcion.toLowerCase().includes(searchTerm.toLowerCase())
      ) {
        return false;
      }

      const tipoFilter = FILTER_TYPE_MAP[filterType];
      if (tipoFilter && c.tipo !== tipoFilter) {
        return false;
      }

      const statusFilter = STATUS_MAP[filterStatus];
      if (statusFilter && c.logistica.estado !== statusFilter) {
        return false;
      }

      return true;
    });
  }, [compras, searchTerm, filterType, filterStatus]);

  if (loading) return <div className="p-6">Cargando compras...</div>;
  if (error) return <div className="p-6 text-red-500">{error}</div>;

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold">Compras</h2>
          <p className="text-muted-foreground text-sm">
            Administra tus importaciones y compras nacionales
          </p>
        </div>
        <Button
          onClick={() => navigate("/logistica/addimport")}
          className="flex items-center gap-2 cursor-pointer"
        >
          + Registrar Importación
        </Button>
      </div>
      <div className="relative">
        <div className={`${selectedCompra ? "lg:pr-[380px]" : ""}`}>
          <Toolbar
            filterType={filterType}
            filterStatus={filterStatus}
            tabs={[
              { value: "all", label: `Todos (${compras.length})` },
              { value: "import", label: "Importación" },
              { value: "nacional", label: "Compra Nacional" },
            ]}
            selectOptions={[
              { value: "all", label: "Todos" },
              { value: "transito", label: "En Tránsito" },
              { value: "entregado", label: "Entregado" },
            ]}
            searchTerm={searchTerm}
            searchPlaceholder="Buscar compra..."
            onFilterTypeChange={setFilterType}
            onFilterStatusChange={setFilterStatus}
            onSearchChange={setSearchTerm}
          />

          <div className="mt-6">
            <ComprasTable
              compras={filteredCompras}
              onEdit={(c) => setEditingCompra(c)}
              onDelete={(c) => handleDeleteCompra(c.importacion_id)}
              onView={(c) => setSelectedCompra(c)}
            />
          </div>
        </div>
        {selectedCompra && (
          <div className="absolute top-0 right-0 h-full w-[320px] border-l bg-transparent">
            <CompraDetail
              compra={selectedCompra}
              onClose={() => setSelectedCompra(null)}
            />
          </div>
        )}
      </div>
      {editingCompra && (
        <CompraEditDialog
          open={!!editingCompra}
          compra={editingCompra}
          onClose={() => setEditingCompra(null)}
          onSave={handleSaveCompra}
        />
      )}
    </div>
  );
}
