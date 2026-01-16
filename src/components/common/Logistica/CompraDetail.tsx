import { X, FileText, FileSpreadsheet } from "lucide-react";
import { FaFileWord } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { ImportacionWithRelations } from "@/types/importaciones/importacion.relations";

interface CompraDetailProps {
  compra: ImportacionWithRelations | null;
  onClose: () => void;
}

export function CompraDetail({ compra, onClose }: CompraDetailProps) {
  if (!compra) return null;

  return (
    <div className="h-full bg-white flex flex-col">

      {/* HEADER */}
      <div className="flex items-start justify-between p-4 border-b">
        <div className="space-y-2 text-sm pl-3">

          <p><span className="font-semibold">Factura:</span> {compra.factura ?? "-"}</p>
          <p><span className="font-semibold">Fecha de vencimiento:</span> {compra.fecha_vencimiento ?? "-"}</p>

          <p>
            <span className="font-semibold">Cantidad:</span> 
            {compra.cantidad} {compra.unidad}
          </p>

          <p><span className="font-semibold">Valor FOB:</span> USD {compra.valor_fob_usd}</p>
          <p><span className="font-semibold">Transporte marítimo:</span> USD {compra.transporte_maritimo_usd}</p>
          <p><span className="font-semibold">Valor CFR:</span> USD {compra.valor_cfr_usd}</p>

          <p>
            <span className="font-semibold">Liquidación:</span> 
            {compra.liquidacion_moneda} {compra.liquidacion_monto}
          </p>

          <p><span className="font-semibold">País de Origen:</span> {compra.pais_origen ?? "-"}</p>
          <p><span className="font-semibold">Proveedor:</span> {compra.proveedor ?? "-"}</p>
          <p><span className="font-semibold">Agente de Aduanas:</span> {compra.agente_aduanas ?? "-"}</p>

        </div>

        <Button className="cursor-pointer" variant="ghost" size="icon" onClick={onClose}>
          <X className="w-5 h-5" />
        </Button>
      </div>

      {/* SCROLL */}
      <ScrollArea className="flex-1 p-4">

        <h4 className="font-semibold mb-2">Adjuntos:</h4>

        <div className="grid grid-cols-3 gap-4">

          {compra.adjuntos.length > 0 ? (
            compra.adjuntos.map((file, index) => {
              const fileName = file.nombre_archivo ?? `Archivo ${index + 1}`;
              const ext = fileName.split(".").pop()?.toLowerCase();

              return (
                <div
                  key={file.id}
                  className="border rounded-lg shadow hover:shadow-lg transition cursor-pointer flex flex-col items-center justify-center p-4"
                  onClick={() => window.open(file.url, "_blank")}
                >
                  {ext === "xlsx" || ext === "xls" ? (
                    <FileSpreadsheet className="w-10 h-10 text-gray-400 mb-2" />
                  ) : ext === "doc" || ext === "docx" ? (
                    <FaFileWord className="w-10 h-10 text-gray-400 mb-2" />
                  ) : (
                    <FileText className="w-10 h-10 text-gray-400 mb-2" />
                  )}

                  <p className="text-xs text-center truncate w-full">{fileName}</p>
                </div>
              );
            })
          ) : (
            <p className="text-sm text-gray-500 col-span-3">No hay adjuntos</p>
          )}

        </div>

      </ScrollArea>
    </div>
  );
}
