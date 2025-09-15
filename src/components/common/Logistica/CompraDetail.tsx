import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { Compra } from "@/types/logistica.types";

interface CompraDetailProps {
  compra: Compra | null;
  onClose: () => void;
}

export function CompraDetail({ compra, onClose }: CompraDetailProps) {
  if (!compra) return null;

  const pdfs = [
    { file: "/pdfs/pdf1.pdf", preview: "/previews/preview1.jpg" },
    { file: "/pdfs/pdf1.pdf", preview: "/previews/preview2.jpg" },
    { file: "/pdfs/pdf1.pdf", preview: "/previews/preview2.jpg" },
  ];

  return (
    <div className="h-full bg-white flex flex-col">
      <div className="flex items-start justify-between p-4 border-b">
        <div className="space-y-2 text-sm pl-3">
          <p><span className="font-semibold">Factura:</span> S106180</p>
          <p><span className="font-semibold">Fecha de vencimiento:</span> 31/12/2025</p>
          <p><span className="font-semibold">Cantidad:</span> 48,868 MT</p>
          <p><span className="font-semibold">Valor FOB:</span> USD 22,484.68</p>
          <p><span className="font-semibold">Transporte marítimo:</span> USD 2,438.00</p>
          <p><span className="font-semibold">Valor CFR:</span> USD 24,922.68</p>
          <p><span className="font-semibold">Liquidación:</span> USD 2,810.16 (S/ 2,183)</p>
          <p><span className="font-semibold">País de Origen:</span> Suecia</p>
          <p><span className="font-semibold">País de Destino:</span> Perú</p>
          <p><span className="font-semibold">Transportista:</span> Beate 4455 Gothenburg</p>
          <p><span className="font-semibold">Aseguradora:</span> Anova Marine Insurance</p>
          <p><span className="font-semibold">Agente de aduanas:</span> EBL Grupo Logístico</p>
        </div>
        <Button className="cursor-pointer" variant="ghost" size="icon" onClick={onClose}>
          <X className="w-5 h-5" />
        </Button>
      </div>
      <ScrollArea className="flex-1 p-4">
        <h4 className="font-semibold mb-2">Adjuntos:</h4>
        <div className="grid grid-cols-3 gap-4">
          {pdfs.map((pdf, index) => (
            <div
              key={index}
              className="border rounded-lg shadow hover:shadow-lg transition cursor-pointer overflow-hidden"
              onClick={() => window.open(pdf.file, "_blank")}
            >
              <img
                src={pdf.preview}
                alt={`Vista previa PDF ${index + 1}`}
                className="w-full h-20 object-cover bg-gray-100"
              />
              <p className="text-xs text-center py-2 bg-gray-50">
                PDF {index + 1}
              </p>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
