"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Toolbar } from "@/components/common/Toolbar";
import { toast } from "sonner";
import { ClientesTable, type ClienteItem } from "@/components/common/Clientes/ClientesTable";

export default function ClientesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");

  const clientes: ClienteItem[] = [
    {
      id: "1",
      nombre: "Empaques del Sur SAC",
      pais: "Perú",
      telefono: "+51 987 111 222",
      correo: "contacto@empaquessur.pe",
      categoria: "Distribuidor",
      estado: "Activo",
    },
    {
      id: "2",
      nombre: "EcoPrint S.A.",
      pais: "Chile",
      telefono: "+56 9 7777 8888",
      correo: "ventas@ecoprint.cl",
      categoria: "Impresión y embalaje",
      estado: "Activo",
    },
    {
      id: "3",
      nombre: "LogiBox LTDA",
      pais: "Colombia",
      telefono: "+57 312 222 3333",
      correo: "info@logibox.co",
      categoria: "Logística",
      estado: "Inactivo",
    },
  ];

  const filtered = clientes.filter(
    (c) =>
      c.nombre.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (filterStatus === "all"
        ? true
        : filterStatus === "activo"
        ? c.estado === "Activo"
        : c.estado === "Inactivo")
  );

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold">Clientes</h2>
          <p className="text-muted-foreground text-sm">
            Administra los clientes asociados a Europlate
          </p>
        </div>

        <Button
          onClick={() => toast.info("Función de registrar cliente en desarrollo")}
          className="flex items-center gap-2 cursor-pointer"
        >
          + Registrar Cliente
        </Button>
      </div>

      <Toolbar
        filterType={filterType}
        filterStatus={filterStatus}
        tabs={[
          { value: "all", label: `Todos (${clientes.length})` },
          { value: "activos", label: "Activos" },
          { value: "inactivos", label: "Inactivos" },
        ]}
        selectOptions={[
          { value: "all", label: "Todos" },
          { value: "activo", label: "Activo" },
          { value: "inactivo", label: "Inactivo" },
        ]}
        searchTerm={searchTerm}
        searchPlaceholder="Buscar cliente..."
        onFilterTypeChange={setFilterType}
        onFilterStatusChange={setFilterStatus}
        onSearchChange={setSearchTerm}
      />

      <div className="mt-6 overflow-x-auto">
        <ClientesTable
          clientes={filtered}
          onEdit={(c) => toast.info(`Editar cliente: ${c.nombre}`)}
          onDelete={(c) => toast.warning(`Eliminar cliente: ${c.nombre}`)}
        />
      </div>
    </div>
  );
}
