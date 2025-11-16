import { X, FileText, FileSpreadsheet } from "lucide-react";
import { FaFileWord } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { Compra } from "@/types/logistica.types";
import type { DatosEconomicos, DatosImportacion } from "@/types/ImportacionLogistica.types";

export interface CompraFull extends Compra {
  datosEconomicos?: DatosEconomicos;
  datosImportacion?: DatosImportacion;
  adjuntos?: string[];
}

interface CompraDetailProps {
  compra: CompraFull | null;
  onClose: () => void;
}

export function CompraDetail({ compra, onClose }: CompraDetailProps) {
  if (!compra) return null;

  const datosEconomicos = compra.datosEconomicos;
  const datosImportacion = compra.datosImportacion;
  const logistica = compra.logistica;
  const proveedor = compra.proveedor;

  return (
    <div className="h-full bg-white flex flex-col">
      <div className="flex items-start justify-between p-4 border-b">
        <div className="space-y-2 text-sm pl-3">
          <p><span className="font-semibold">Factura:</span> {datosEconomicos?.factura || "-"}</p>
          <p><span className="font-semibold">Fecha de vencimiento:</span> {datosEconomicos?.fechaVencimiento || "-"}</p>
          <p><span className="font-semibold">Cantidad:</span> {datosEconomicos?.cantidad} {datosEconomicos?.unidad}</p>
          <p><span className="font-semibold">Valor FOB:</span> USD {datosEconomicos?.valorFOB}</p>
          <p><span className="font-semibold">Transporte marítimo:</span> USD {datosEconomicos?.transporteMaritimo}</p>
          <p><span className="font-semibold">Valor CFR:</span> USD {datosEconomicos?.valorCFR}</p>
          <p><span className="font-semibold">Liquidación:</span> {datosEconomicos?.liquidacion?.moneda} {datosEconomicos?.liquidacion?.monto}</p>
          <p><span className="font-semibold">País de Origen:</span> {logistica?.origen || "-"}</p>
          <p><span className="font-semibold">Proveedor:</span> {proveedor?.nombre} ({proveedor?.pais || "N/A"})</p>
          <p><span className="font-semibold">Agente de aduanas:</span> {datosImportacion?.agente || "-"}</p>
        </div>
        <Button className="cursor-pointer" variant="ghost" size="icon" onClick={onClose}>
          <X className="w-5 h-5" />
        </Button>
      </div>

      <ScrollArea className="flex-1 p-4">
        <h4 className="font-semibold mb-2">Adjuntos:</h4>
        <div className="grid grid-cols-3 gap-4">
          {compra.adjuntos && compra.adjuntos.length > 0 ? (
            compra.adjuntos.map((file: any, index: number) => {
              const fileUrl = typeof file === "string" ? file : file.url || "";
              const fileName = typeof file === "string"
                ? file.split("/").pop() || `Archivo ${index + 1}`
                : file.nombre || `Archivo ${index + 1}`;
              const ext = fileName.split(".").pop()?.toLowerCase();

              return (
                <div
                  key={index}
                  className="border rounded-lg shadow hover:shadow-lg transition cursor-pointer flex flex-col items-center justify-center p-4"
                  onClick={() => fileUrl && window.open(fileUrl, "_blank")}
                >
                  {ext === "xlsx" || ext === "xls" ? (
                    <FileSpreadsheet className="w-10 h-10 text-gray-400 mb-2" />
                  ) : ext === "doc" || ext === "docx" ? (
                    <FaFileWord className="w-10 h-10 text-gray-400 mb-2" />
                  ) : (
                    <FileText className="w-10 h-10 text-gray-400 mb-2" />
                  )}
                  <p className="text-xs text-center truncate overflow-hidden whitespace-nowrap w-full">
                    {fileName}
                  </p>
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
