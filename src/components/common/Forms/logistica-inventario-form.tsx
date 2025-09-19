import { useState, useMemo, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Toolbar } from "@/components/common/Toolbar";
import {
  InventarioTable,
  type InventarioItem,
} from "@/components/common/Logistica/InventarioTable";
import { toast } from "sonner";

export default function InventarioLogistica() {
  const [items, setItems] = useState<InventarioItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [filterType, setFilterType] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [, setEditingItem] = useState<InventarioItem | null>(null);

  // Mapeo de estado para InventarioTable
  const STATUS_MAP: Record<string, "En stock" | "En tránsito" | "Vendido" | null> = {
    all: null,
    transito: "En tránsito",
    entregado: "Vendido",
    stock: "En stock",
  };

  // Cargar productos desde localStorage al montar
  useEffect(() => {
    try {
      const comprasStr = localStorage.getItem("importaciones") || "[]";
      const compras = JSON.parse(comprasStr);

      const productosMap: InventarioItem[] = [];

      compras.forEach((compra: any) => {
        const importacionId = compra.datosGenerales?.numImportacion || "N/A";
        const purchaseOrder = compra.datosGenerales?.purchaseOrder || "N/A";
        const container = compra.datosImportacion?.container || "N/A"; // 🔹 container

        compra.productos.forEach((producto: any, index: number) => {
          productosMap.push({
            id: `${producto.tempId}-${index}`, // tempId único
            importacion: importacionId,
            container: container, // 🔹 container agregado
            order: producto.order || "N/A",
            purchaseOrder: purchaseOrder,
            seal: "Generado",
            grade: producto.gradeTypeWidthGsm || "N/A",
            type: producto.material?.tipo || "Bobina",
            width: producto.material?.dimensiones?.ancho_mm || 0,
            gsm: producto.material?.gramaje_gsm || 0,
            lmetre: parseFloat(producto.lMetre || "0"),
            productId: producto.productId,
            grossNetWt: parseFloat(producto.grossNetWt || "0"),
            estado: "En tránsito", // compatible con InventarioTable
          });
        });
      });

      setItems(productosMap);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setError("Error cargando inventario desde localStorage");
      setLoading(false);
    }
  }, []);

  const filteredItems = useMemo(() => {
    return items.filter((i) => {
      // Filtro por search term (grade)
      if (searchTerm && !i.grade.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false;
      }

      // Filtro por tipo
      if (filterType === "importación" && !i.purchaseOrder) return false;
      if (filterType === "nacional" && i.purchaseOrder) return false;

      // Filtro por estado
      if (filterStatus !== "all" && i.estado !== STATUS_MAP[filterStatus]) {
        return false;
      }

      return true;
    });
  }, [items, searchTerm, filterType, filterStatus]);

  if (loading) return <div className="p-6">Cargando inventario...</div>;
  if (error) return <div className="p-6 text-red-500">{error}</div>;

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold">Inventario</h2>
          <p className="text-muted-foreground text-sm">
            Administra los materiales y productos de tu empresa
          </p>
        </div>
        <Button
          onClick={() => toast.info("Función de registrar producto en desarrollo")}
          className="flex items-center gap-2 cursor-pointer"
        >
          + Registrar Compra
        </Button>
      </div>

      <Toolbar
        filterType={filterType}
        filterStatus={filterStatus}
        tabs={[
          { value: "all", label: `Todos (${items.length})` },
          { value: "import", label: "Importación" },
          { value: "nacional", label: "Compra Nacional" },
        ]}
        selectOptions={[
          { value: "all", label: "Todos" },
          { value: "transito", label: "En Tránsito" },
          { value: "entregado", label: "Vendido" },
          { value: "stock", label: "En Stock" },
        ]}
        searchTerm={searchTerm}
        searchPlaceholder="Buscar producto..."
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
