import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Toolbar } from "@/components/common/Toolbar";
import { ComprasTable } from "@/components/common/Logistica/ComprasTable";
import { CompraDetail } from "@/components/common/Logistica/CompraDetail";
import type { Compra } from "@/components/common/Logistica/ComprasTable";
import { CompraEditDialog } from "@/components/common/Dialog/CompraEditDialog";

export default function ComprasLogistica() {
  const [filterType, setFilterType] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCompra, setSelectedCompra] = useState<Compra | null>(null);
  const [editingCompra, setEditingCompra] = useState<Compra | null>(null);

  const [compras, setCompras] = useState<Compra[]>([
    {
      id: "1",
      importacion: "IMP-2024-001",
      descripcion: "Compra de insumos médicos",
      proveedor: "Proveedor XYZ",
      origen: "China",
      destino: "Lima",
      estado: "En transito",
      fechaEntrega: "2024-09-15",
    },
    {
      id: "2",
      importacion: "IMP-2024-002",
      descripcion: "Equipos electrónicos",
      proveedor: "Proveedor ABC",
      origen: "USA",
      destino: "Callao",
      estado: "Entregado",
      fechaEntrega: "2024-09-20",
    },
  ]);

  const handleEdit = (c: Compra) => {
    setEditingCompra(c);
  };

  const handleDelete = (c: Compra) => {
    setCompras((prev) => prev.filter((item) => item.id !== c.id));
  };

  return (
    <div className="p-6">
      {/* Header principal */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold">Compras</h2>
          <p className="text-muted-foreground text-sm">
            Administra tus importaciones y compras Nacionales
          </p>
        </div>
        <Button className="flex items-center gap-2 cursor-pointer">
          + Registrar Importación
        </Button>
      </div>

      {/* Layout con 2 columnas (si hay detalle) */}
      <div className={`grid gap-6 ${selectedCompra ? "lg:grid-cols-3" : "grid-cols-1"}`}>
        {/* Columna izquierda */}
        <div className={`${selectedCompra ? "lg:col-span-2" : "col-span-1"}`}>
          {/* Toolbar arriba */}
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

          {/* Tabla */}
          <div className="mt-6">
            <ComprasTable
              compras={compras}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onView={(c) => setSelectedCompra(c)}
            />
          </div>
        </div>

        {/* Columna derecha (detalle con borde divisor) */}
        {selectedCompra && (
          <div className="lg:col-span-1 lg:border-l lg:pl-6">
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
          onSave={(updated) => {
            setCompras((prev) =>
              prev.map((c) => (c.id === updated.id ? updated : c))
            );
          }}
        />
      )}
    </div>
  );
}
