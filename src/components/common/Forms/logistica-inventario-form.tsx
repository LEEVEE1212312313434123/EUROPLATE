import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Toolbar } from "@/components/common/Toolbar";
import {
  InventarioTable,
  type InventarioItem,
} from "@/components/common/Logistica/InventarioTable";
import { toast } from "sonner";
import { useLogistica } from "@/hooks/useLogistica";

export default function InventarioLogistica() {
  const { productos, loading, error } = useLogistica();

  const [filterType, setFilterType] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [,setEditingItem] = useState<InventarioItem | null>(null);
  const mapEstado = (estado: string): "En tránsito" | "En stock" | "Vendido" => {
    if (estado === "En stock") return "En stock";
    if (estado === "Vendido") return "Vendido";
    return "En tránsito"; 
  };
  const STATUS_MAP: Record<string, string | null> = {
    all: null,
    transito: "En tránsito",
    entregado: "Entregado",
    stock: "En stock",
  };

  const items: InventarioItem[] = productos.map((p) => ({
    id: p.producto_id,
    importacion: p.purchase_order,
    container: p.container,
    purchaseOrder: p.purchase_order,
    seal: p.seal,
    grade: p.material.grade,
    type: p.material.tipo,
    width: p.material.dimensiones.ancho_mm,
    gsm: p.material.gramaje_gsm,
    lmetre: p.material.longitud_m,
    productId: p.producto_id,
    grossNetWt: p.material.peso_bruto_kg,
    estado: mapEstado(p.estado),
  }));

  const filteredItems = useMemo(() => {
    return items.filter((i) => {
      if (
        searchTerm &&
        !i.grade.toLowerCase().includes(searchTerm.toLowerCase())
      ) {
        return false;
      }

      if (filterType === "importación" && !i.purchaseOrder) return false;
      if (filterType === "nacional" && i.purchaseOrder) return false;

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
          { value: "entregado", label: "Entregado" },
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
