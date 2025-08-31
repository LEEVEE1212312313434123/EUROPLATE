import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Toolbar } from "@/components/common/Toolbar";

export default function ComprasLogistica() {
  const [filterType, setFilterType] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="p-6">
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

      <Toolbar
        filterType={filterType}
        filterStatus={filterStatus}
        tabs={[
          { value: "all", label: "Todos" },
          { value: "import", label: "Importación" },
          { value: "nacional", label: "Compra Nacional" },
        ]}
        selectOptions={[
          { value: "all", label: "Todos" },
          { value: "transito", label: "En Transito" },
          { value: "entregado", label: "Entregado" },
        ]}
        searchTerm={searchTerm}
        searchPlaceholder="Buscar compra..."
        onFilterTypeChange={setFilterType}
        onFilterStatusChange={setFilterStatus}
        onSearchChange={setSearchTerm}
      />
    </div>
  );
}
