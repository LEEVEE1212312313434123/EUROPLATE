import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit, Trash, Eye, ChevronLeft, ChevronRight, PackageCheck, XCircle } from "lucide-react";
import EstadoImportacionDialog from "@/components/common/Dialog/EstadoImportacionDialog";
import type { Importacion } from "@/types/editimportacion.type";
import { supabase } from "@/lib/supabaseClient";
import { ImportacionService } from "@/services/editimportacion.service";
import { useNavigate } from "react-router-dom";

interface ComprasTableProps {
  compras: Importacion[];
  onDelete: (compra: Importacion) => void;
  onView?: (compra: Importacion) => void;
}

export function ComprasTable({ compras, onDelete, onView }: ComprasTableProps) {
  const navigate = useNavigate();
  const [modalData, setModalData] = useState<any>(null);
  const [almacenes, setAlmacenes] = useState<any[]>([]);
  const [page, setPage] = useState(0);

  const pageSize = 10;
  const start = page * pageSize;
  const end = start + pageSize;
  const currentCompras = compras.slice(start, end);
  const totalPages = Math.ceil(compras.length / pageSize);

  useEffect(() => {
    console.log("Compras recibidas en ComprasTable:", compras);
  }, [compras]);

  useEffect(() => {
    const fetchAlmacenes = async () => {
      const { data } = await supabase.from("almacenes").select("id, ubicacion");
      setAlmacenes(data || []);
    };
    fetchAlmacenes();
  }, []);

  const handleEdit = async (compraId: number) => {
    const detalle = await ImportacionService.getById(compraId);
    console.log("Detalle cargado para editar:", detalle);
    if (!detalle) return;
    navigate("/logistica/editimport", { state: { compra: detalle } });
  };

  const renderEstado = (estado: string) => {
    switch (estado) {
      case "Registrado":
        return <span className="flex items-center gap-2 text-blue-500"><Eye className="w-4 h-4" />Registrado</span>;
      case "En Transito":
        return <span className="flex items-center gap-2 text-yellow-500"><Eye className="w-4 h-4" />En Transito</span>;
      case "Entregado":
        return <span className="flex items-center gap-2 text-green-500"><PackageCheck className="w-4 h-4" />Entregado</span>;
      case "Cancelado":
        return <span className="flex items-center gap-2 text-red-500"><XCircle className="w-4 h-4" />Cancelado</span>;
      default:
        return <span className="flex items-center gap-2 text-gray-500"><Eye className="w-4 h-4" />Desconocido</span>;
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID Interno</TableHead>
            <TableHead>N° DUA</TableHead>
            <TableHead>Descripción</TableHead>
            <TableHead>Proveedor</TableHead>
            <TableHead>Origen</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead className="text-center w-[140px]">Fecha Entrega</TableHead>
            <TableHead className="text-center w-[140px]">Acción</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {currentCompras.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="text-center py-6">
                No se encontraron compras registradas.
              </TableCell>
            </TableRow>
          ) : (
            currentCompras.map((c) => (
              <TableRow key={c.id} className="h-14 border-b hover:bg-muted/50 transition-colors">
                <TableCell>{c.id_importacion ?? "-"}</TableCell>
                <TableCell>{c.num_dua}</TableCell>
                <TableCell>{c.detalle ?? "Sin descripción"}</TableCell>
                <TableCell>{c.proveedor ?? "N/A"}</TableCell>
                <TableCell>{c.pais_origen ?? "N/A"}</TableCell>
                <TableCell>
                  <button
                    className="flex items-center gap-2 hover:underline cursor-pointer"
                    onClick={() =>
                      setModalData({
                        estadoActual: c.estado,
                        importacionId: c.id,
                        estadosPosibles: ["Registrado", "En Transito", "Entregado", "Cancelado"]
                      })
                    }

                  >
                    {renderEstado(c.estado)}
                  </button>
                </TableCell>
                <TableCell className="text-center">{c.fecha_entrega ?? "No definida"}</TableCell>
                <TableCell className="text-center">
                  <div className="flex justify-center gap-1">
                    <Button variant="ghost" size="icon" onClick={() => onView && onView(c)}>
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleEdit(c.id)}>
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => onDelete(c)}>
                      <Trash className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>

        {modalData && (
          <EstadoImportacionDialog
            open={!!modalData}
            onClose={() => setModalData(null)}
            estadoActual={modalData.estadoActual}
            estadosPosibles={modalData.estadosPosibles}
            importacionId={modalData.importacionId}
            almacenes={almacenes}
            onSuccess={() => window.location.reload()}
          />
        )}
      </Table>

      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-2">
          <Button variant="outline" size="icon" disabled={page === 0} onClick={() => setPage((prev) => Math.max(prev - 1, 0))}>
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <span className="text-sm text-muted-foreground">
            Página {page + 1} de {totalPages}
          </span>
          <Button variant="outline" size="icon" disabled={page >= totalPages - 1} onClick={() => setPage((prev) => Math.min(prev + 1, totalPages - 1))}>
            <ChevronRight className="w-5 h-5" />
          </Button>
        </div>
      )}
    </div>
  );
}