import { useState, useEffect  } from "react";
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
import { EstadoImportacionDialog } from "@/components/common/Dialog/EstadoImportacionDialog";
import type { Importacion } from "@/types/importacion.types";
import { supabase } from "@/lib/supabaseClient";


interface ComprasTableProps {
  compras: Importacion[];
  onEdit: (compra: Importacion) => void;
  onDelete: (compra: Importacion) => void;
  onView?: (compra: Importacion) => void;
}

export function ComprasTable({
  compras,
  onEdit,
  onDelete,
  onView,
}: ComprasTableProps) {
  
  const [modalData, setModalData] = useState<any>(null);
  const [almacenes, setAlmacenes] = useState<any[]>([]);

  const [page, setPage] = useState(0);
  const pageSize = 10;

  const start = page * pageSize;
  const end = start + pageSize;
  const currentCompras = compras.slice(start, end);

  const totalPages = Math.ceil(compras.length / pageSize);
  useEffect(() => {
    const fetchAlmacenes = async () => {
      const { data } = await supabase.from("almacenes").select("id, ubicacion");
      setAlmacenes(data || []);
    };
    fetchAlmacenes();
  }, []);
  return (
    <div className="flex flex-col gap-4">
      <Table>
        <TableHeader>
          <TableRow>
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
                <TableCell>{c.num_dua}</TableCell>
                <TableCell>{c.detalle ?? "Sin descripción"}</TableCell>
                <TableCell>{c.proveedor ?? "N/A"}</TableCell>
                <TableCell>{c.pais_origen ?? "N/A"}</TableCell>
                <TableCell>
          <button
            className="flex items-center gap-2 text-primary hover:underline cursor-pointer"
            onClick={() =>
              setModalData({
                estado: c.estado === "Entregado" ? "Entregado" : "Cancelado",
                importacionId: c.id,
              })
            }
          >
            {c.estado === "Entregado" ? (
              <>
                <PackageCheck className="w-4 h-4 text-green-500" />
                Entregado
              </>
            ) : c.estado === "Cancelado" ? (
              <>
                <XCircle className="w-4 h-4 text-red-500" />
                Cancelado
              </>
            ) : (
              "En tránsito"
            )}
          </button>
              </TableCell>
                <TableCell className="text-center">
                  {c.fecha_entrega ?? "No definida"}
                </TableCell>
                <TableCell className="text-center">
                  <div className="flex justify-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onView && onView(c)}
                      className="text-primary hover:bg-primary/10 cursor-pointer"
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
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
        {modalData && (
          <EstadoImportacionDialog
            open={!!modalData}
            onClose={() => setModalData(null)}
            estado={modalData.estado}
            importacionId={modalData.importacionId}
            almacenes={almacenes}
            onSuccess={() => window.location.reload()}
          />
        )}
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
