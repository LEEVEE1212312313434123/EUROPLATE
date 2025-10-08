"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit, Trash, ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

export interface ClienteItem {
  id: string;
  nombre: string;
  pais: string;
  telefono: string;
  correo: string;
  categoria: string;
  estado: "Activo" | "Inactivo";
}

interface ClientesTableProps {
  clientes: ClienteItem[];
  onEdit: (c: ClienteItem) => void;
  onDelete: (c: ClienteItem) => void;
}

export function ClientesTable({ clientes, onEdit, onDelete }: ClientesTableProps) {
  const [page, setPage] = useState(0);
  const pageSize = 4;

  const start = page * pageSize;
  const end = start + pageSize;
  const currentItems = clientes.slice(start, end);

  const totalPages = Math.ceil(clientes.length / pageSize);

  return (
    <div className="flex flex-col gap-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nombre</TableHead>
            <TableHead>País</TableHead>
            <TableHead>Teléfono</TableHead>
            <TableHead>Correo</TableHead>
            <TableHead>Categoría</TableHead>
            <TableHead className="text-center w-[100px]">Estado</TableHead>
            <TableHead className="text-center w-[90px]">Acciones</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {currentItems.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-6">
                No se encontraron clientes registrados.
              </TableCell>
            </TableRow>
          ) : (
            currentItems.map((c) => (
              <TableRow
                key={c.id}
                className="h-14 border-b transition-colors hover:bg-muted/50"
              >
                <TableCell>{c.nombre}</TableCell>
                <TableCell>{c.pais}</TableCell>
                <TableCell>{c.telefono}</TableCell>
                <TableCell>{c.correo}</TableCell>
                <TableCell>{c.categoria}</TableCell>
                <TableCell className="text-center">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      c.estado === "Activo"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {c.estado}
                  </span>
                </TableCell>
                <TableCell className="text-center">
                  <div className="flex justify-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onEdit(c)}
                      className="text-primary hover:bg-primary/10 cursor-pointer"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onDelete(c)}
                      className="text-primary hover:bg-primary/10 cursor-pointer"
                    >
                      <Trash className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-2">
          <Button
            variant="outline"
            size="icon"
            disabled={page === 0}
            onClick={() => setPage((prev) => Math.max(prev - 1, 0))}
            className="rounded-full shadow-sm hover:bg-primary hover:text-white transition cursor-pointer"
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>

          <span className="text-sm text-muted-foreground">
            Página {page + 1} de {totalPages}
          </span>

          <Button
            variant="outline"
            size="icon"
            disabled={page >= totalPages - 1}
            onClick={() => setPage((prev) => Math.min(prev + 1, totalPages - 1))}
            className="rounded-full shadow-sm hover:bg-primary hover:text-white transition cursor-pointer"
          >
            <ChevronRight className="w-5 h-5" />
          </Button>
        </div>
      )}
    </div>
  );
}
