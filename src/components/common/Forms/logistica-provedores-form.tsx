"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Toolbar } from "@/components/common/Toolbar";
import { ProveedoresTable, type ProveedorItem } from "@/components/common/Logistica/ProveedoresTable";
import { toast } from "sonner";

export default function ProveedoresPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");

  // 🔹 Datos estáticos simulando proveedores de cartón, papel, etc.
  const proveedores: ProveedorItem[] = [
    {
      id: "1",
      nombre: "Cartonera Andina S.A.",
      pais: "Perú",
      telefono: "+51 987 654 321",
      correo: "contacto@cartoneraandina.pe",
      categoria: "Cartón Corrugado",
      estado: "Activo",
    },
    {
      id: "2",
      nombre: "Papeles del Norte SAC",
      pais: "Chile",
      telefono: "+56 9 5678 4321",
      correo: "ventas@papelesnorte.cl",
      categoria: "Papel Bond",
      estado: "Activo",
    },
    {
      id: "3",
      nombre: "Industrias RecyPack",
      pais: "Colombia",
      telefono: "+57 301 234 5678",
      correo: "info@recypack.co",
      categoria: "Cartón Reciclado",
      estado: "Inactivo",
    },
    {
      id: "4",
      nombre: "EcoCarton Import",
      pais: "Ecuador",
      telefono: "+593 98 456 7890",
      correo: "ventas@ecocarton.ec",
      categoria: "Cartón Doble Capa",
      estado: "Activo",
    },
    {
      id: "5",
      nombre: "Papelería Global",
      pais: "México",
      telefono: "+52 55 1234 5678",
      correo: "soporte@papeleriaglobal.mx",
      categoria: "Papel Kraft",
      estado: "Activo",
    },
  ];

  // 🔹 Filtrado básico
  const filtered = proveedores.filter((p) =>
    p.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold">Proveedores</h2>
          <p className="text-muted-foreground text-sm">
            Administra los proveedores de materiales de cartón y papel
          </p>
        </div>
        <Button
          onClick={() => toast.info("Función de registrar proveedor en desarrollo")}
          className="flex items-center gap-2 cursor-pointer"
        >
          + Registrar Proveedor
        </Button>
      </div>

      <Toolbar
        filterType={filterType}
        filterStatus={filterStatus}
        tabs={[
          { value: "all", label: `Todos (${proveedores.length})` },
          { value: "activos", label: "Activos" },
          { value: "inactivos", label: "Inactivos" },
        ]}
        selectOptions={[
          { value: "all", label: "Todos" },
          { value: "activo", label: "Activo" },
          { value: "inactivo", label: "Inactivo" },
        ]}
        searchTerm={searchTerm}
        searchPlaceholder="Buscar proveedor..."
        onFilterTypeChange={setFilterType}
        onFilterStatusChange={setFilterStatus}
        onSearchChange={setSearchTerm}
      />

      <div className="mt-6 overflow-x-auto">
        <ProveedoresTable
          proveedores={filtered}
          onEdit={(p) => toast.info(`Editar proveedor: ${p.nombre}`)}
          onDelete={(p) => toast.warning(`Eliminar proveedor: ${p.nombre}`)}
        />
      </div>
    </div>
  );
}
