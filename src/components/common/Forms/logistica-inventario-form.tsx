// src/app/(main)/logistica-inventario-form.tsx

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Toolbar } from "@/components/common/Toolbar";
import {
  InventarioTable,
  type InventarioItem,
} from "@/components/common/Logistica/InventarioTable";
import { InventarioEditDialog } from "@/components/common/Dialog/InventarioEditDialog";
import { Item } from "@radix-ui/react-select";

export default function InventarioLogistica() {
  const [filterType, setFilterType] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [editingItem, setEditingItem] = useState<InventarioItem | null>(null);
  const [items, setItems] = useState<InventarioItem[]>([
    {
      id: "1",
      importacion: "2024-09-01",
      container: "ELOF",
      purchaseOrder: "CA036110/PQ044553",
      seal: "SAL915610",
      grade: "COATED KRAFTBACK BOARD - SHERPA",
      type: "ROLL",
      width: 1280,
      gsm: 448,
      lmetre: 1200,
      productId: "SHRP-445A2",
      grossNetWt: 1211.4,
      estado: "En tránsito",
    },
    {
      id: "2",
      importacion: "2024-08-20",
      container: "SE",
      purchaseOrder: "CA036200/PQ044600",
      seal: "SAL915611",
      grade: "COATED KRAFTBACK BOARD - SHERPA",
      type: "ROLL",
      width: 1300,
      gsm: 450,
      lmetre: 1100,
      productId: "SHRP-450B1",
      grossNetWt: 1150.0,
      estado: "En stock",
    },
  ]);

  const handleEdit = (item: InventarioItem) => {
    console.log("Editar producto:", item);
  };

  const handleDelete = (item: InventarioItem) => {
    setItems((prev) => prev.filter((i) => i.id !== item.id));
  };

  return (
    <div className="p-6">
      {/* Header principal */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold">Inventario</h2>
          <p className="text-muted-foreground text-sm">
            Administra los materiales y productos de tu empresa
          </p>
        </div>
        <Button className="flex items-center gap-2 cursor-pointer">
          + Registrar Importación
        </Button>
      </div>

      {/* Filtros */}
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
        ]}
        searchTerm={searchTerm}
        searchPlaceholder="Buscar producto..."
        onFilterTypeChange={setFilterType}
        onFilterStatusChange={setFilterStatus}
        onSearchChange={setSearchTerm}
      />

      {/* Tabla */}
      <div className="mt-6">
        <InventarioTable
          items={items}
          onEdit={(Item) => setEditingItem(Item)}
          onDelete={handleDelete}
        />
      </div>


    {editingItem && (
    <InventarioEditDialog
        open={!!editingItem}
        item={editingItem}
        onClose={() => setEditingItem(null)}
        onSave={(updatedItem) => {
        setItems((prev) =>
            prev.map((i) => (i.id === updatedItem.id ? updatedItem : i))
        );
        }}
    />
    )}

    </div>
  );
}
