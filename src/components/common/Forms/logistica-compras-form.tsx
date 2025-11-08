import { motion, AnimatePresence } from "framer-motion";
import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Toolbar } from "@/components/common/Toolbar";
import { ComprasTable } from "@/components/common/Logistica/ComprasTable";
import { CompraDetail } from "@/components/common/Logistica/CompraDetail";
import { CompraEditDialog } from "@/components/common/Dialog/CompraEditDialog";
import { useLogisticaCompras } from "@/hooks/useLogisticaCompras";
import type { Importacion } from "@/types/importacion.types";
import { ImportacionService } from "@/services/logistica.importacion.service";

export default function ComprasLogistica() {
  const navigate = useNavigate();
  const { compras: importaciones, loading, error, reload: handleSave } =
    useLogisticaCompras();

  const [filterType, setFilterType] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCompra, setSelectedCompra] = useState<any>(null);
  const [editingCompra, setEditingCompra] = useState<Importacion | null>(null);

  const handleView = async (compraId: number) => {
    const detail = await ImportacionService.getCompraDetailById(compraId);
    if (detail) {
      setSelectedCompra(detail);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await ImportacionService.delete(id);
      await handleSave();
    } catch (err) {
      console.error("Error eliminando la importación:", err);
    }
  };

  const filteredCompras = useMemo(() => {
    return importaciones.filter((c) => {
      if (
        searchTerm &&
        !(c.detalle ?? "").toLowerCase().includes(searchTerm.toLowerCase())
      )
        return false;

      if (filterType === "import" && c.pais_origen === "Perú") return false;
      if (filterType === "nacional" && c.pais_origen !== "Perú") return false;
      if (filterStatus === "entregado" && c.estado !== "Entregado") return false;
      if (filterStatus === "cancelado" && c.estado !== "Cancelado") return false;

      return true;
    });
  }, [importaciones, filterType, filterStatus, searchTerm]);

  if (loading)
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-primary border-t-transparent"></div>
      </div>
    );

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
              { value: "all", label: `Todos (${importaciones.length})` },
              { value: "import", label: "Importación" }
            ]}
            selectOptions={[
              { value: "all", label: "Todos" },
              { value: "entregado", label: "Entregado" },
              { value: "cancelado", label: "Cancelado" },
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
              onDelete={(c) => handleDelete(c.id)}
              onView={(c) => handleView(c.id)}
            />
          </div>
        </div>

        {/* 🔹 Transición suave para CompraDetail */}
        <AnimatePresence>
          {selectedCompra && (
            <motion.div
              key="compra-detail"
              initial={{ x: 320, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 320, opacity: 0 }}
              transition={{ duration: 0.35, ease: "easeInOut" }}
              className="absolute top-0 right-0 h-full w-[320px] border-l bg-transparent"
            >
              <CompraDetail
                compra={selectedCompra}
                onClose={() => setSelectedCompra(null)}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {editingCompra && (
        <CompraEditDialog
          open={!!editingCompra}
          importacion={editingCompra}
          onClose={() => setEditingCompra(null)}
          onSave={handleSave}
        />
      )}
    </div>
  );
}
