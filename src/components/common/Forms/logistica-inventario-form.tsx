import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Toolbar } from "@/components/common/Toolbar";
import {
  InventarioTable,
  type InventarioItem,
} from "@/components/common/Logistica/InventarioTable";
import { toast } from "sonner";
import { InventarioService } from "@/services/inventario.service"; // ✅ importa tu service

export default function InventarioLogistica() {
  const [inventario, setInventario] = useState<InventarioItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [filterType, setFilterType] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [, setEditingItem] = useState<InventarioItem | null>(null);

  // ✅ Cargar inventario usando el service
  useEffect(() => {
    const fetchInventario = async () => {
      setLoading(true);
      try {
        const data = await InventarioService.getAll();

        // Mapear tus datos al tipo InventarioItem para la tabla
        const mappedItems: InventarioItem[] = data.map((item) => ({
          id: item.importacion_producto_id,
          importacion: item.num_dua ?? "N/A",
          purchaseOrder: item.orden_compra ?? "N/A",
          grade: item.nombre_producto ?? "Sin nombre",
          type: item.unidad_medida ?? "N/A",
          width: item.ancho_cm ?? 0,
          gsm: item.gramaje_g ?? 0,
          lmetre: item.largo_cm ?? 0,
          productId: item.producto_id?.toString() ?? "N/A",
          grossNetWt: item.peso_kg ?? 0,
          almacen: item.ubicacion ?? "N/A",
          unidad: item.unidad_medida ?? "N/A",
          stockActual: item.stock_actual ?? 0,
          estado:
            item.stock_actual && item.stock_actual > 0
              ? "En stock"
              : "En tránsito",
        }));

        setInventario(mappedItems);
        setError(null);
      } catch (err: any) {
        console.error(err);
        setError("Error cargando inventario");
      } finally {
        setLoading(false);
      }
    };

    fetchInventario();
  }, []);

  // ✅ Filtro y búsqueda
  const filteredItems = useMemo(() => {
    return inventario.filter((i) => {
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
  }, [inventario, searchTerm, filterType, filterStatus]);

  // ✅ Vista de carga
  if (loading)
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );

  if (error) return <div className="p-6 text-red-500">{error}</div>;

  // ✅ Render principal
  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold">Inventario</h2>
          <p className="text-muted-foreground text-sm">
            Administra los materiales y productos registrados
          </p>
        </div>
        <Button
          onClick={() => toast.info("Función de registrar importación en desarrollo")}
          className="flex items-center gap-2 cursor-pointer"
        >
          + Registrar Importación
        </Button>
      </div>

      <Toolbar
        filterType={filterType}
        filterStatus={filterStatus}
        tabs={[
          { value: "all", label: `Todos (${inventario.length})` },
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
          onEdit={(item) => setEditingItem(item)}
          onDelete={(item) =>
            toast.warning(`Función eliminar pendiente para ${item.id}`)
          }
        />
      </div>
    </div>
  );
}
