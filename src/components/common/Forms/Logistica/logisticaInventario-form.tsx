import { Button } from "@/components/ui/button";
import { Toolbar } from "@/components/common/Toolbar";
import {
  InventarioTable,
  type InventarioItem,
} from "@/components/common/Logistica/InventarioTable";

import { useInventarioCompleto } from "@/hooks/inventario/useInventarioCompleto";
import { useState, useMemo } from "react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

export default function InventarioLogistica() {
  const navigate = useNavigate();

  const { data, isLoading, error } = useInventarioCompleto();

  const [filterType, setFilterType] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const items: InventarioItem[] = useMemo(() => {
    if (!data) return [];

    return data.map((row) => ({
      id: row.id,
      importacion: row.num_dua ?? "N/A",
      purchaseOrder: row.orden_compra ?? "N/A",
      grade: row.nombre_producto ?? "Sin nombre",
      type: row.unidad_medida ?? "N/A",
      width: row.ancho ?? 0,
      gsm: row.gramaje ?? 0,
      lmetre: row.largo ?? 0,
      productId: row.producto_id?.toString() ?? "N/A",
      grossNetWt: row.peso ?? 0,
      almacen: row.ubicacion ?? "N/A",
      unidad: row.unidad_medida ?? "N/A",
      stockActual: row.stock_actual ?? 0,

      estado:
        row.stock_actual > 0
          ? "En stock"
          : "En tránsito",
    }));
  }, [data]);

  const filteredItems = useMemo(() => {
    return items.filter((i) => {
      const matchesSearch =
        !searchTerm ||
        i.grade.toLowerCase().includes(searchTerm.toLowerCase()) ||
        i.importacion.toLowerCase().includes(searchTerm.toLowerCase());

      if (!matchesSearch) return false;

      if (filterType === "import" && !i.purchaseOrder) return false;
      if (filterType === "nacional" && i.purchaseOrder) return false;

      if (filterStatus !== "all") {
        if (filterStatus === "transito" && i.estado !== "En tránsito") return false;
        if (filterStatus === "stock" && i.estado !== "En stock") return false;
        if (filterStatus === "vendido" && i.estado !== "Vendido") return false;
      }

      return true;
    });
  }, [items, searchTerm, filterType, filterStatus]);

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );

  if (error)
    return <div className="p-6 text-red-500">Error cargando inventario</div>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold">Inventario</h2>
          <p className="text-muted-foreground text-sm">
            Administra los materiales y productos registrados
          </p>
        </div>

        <Button onClick={() => navigate("/logistica/addimport")}>
          + Registrar Importación
        </Button>
      </div>

      <Toolbar
        filterType={filterType}
        filterStatus={filterStatus}
        tabs={[
          { value: "all", label: `Todos (${items.length})` },
          { value: "import", label: "Importación" },
        ]}
        selectOptions={[
          { value: "all", label: "Todos" },
          { value: "transito", label: "En Tránsito" },
          { value: "stock", label: "En Stock" },
          { value: "vendido", label: "Vendido" },
        ]}
        searchTerm={searchTerm}
        searchPlaceholder="Buscar producto o DUA..."
        onFilterTypeChange={setFilterType}
        onFilterStatusChange={setFilterStatus}
        onSearchChange={setSearchTerm}
      />

      <div className="mt-6 overflow-x-auto">
        <InventarioTable
          items={filteredItems}
          onEdit={() => toast.info("Función editar pendiente")}
          onDelete={(item) =>
            toast.warning(`Función eliminar pendiente para ${item.id}`)
          }
        />
      </div>
    </div>
  );
}
