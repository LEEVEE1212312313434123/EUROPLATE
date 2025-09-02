import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { Compra } from "@/components/common/Logistica/ComprasTable";

interface CompraDetailProps {
  compra: Compra | null;
  onClose: () => void;
}

export function CompraDetail({ compra, onClose }: CompraDetailProps) {
  if (!compra) return null;

  return (
    <div className="h-full bg-white flex flex-col">
      {/* Header con botón de cerrar */}
      <div className="flex items-center justify-between p-4 border-b">
        <h3 className="text-lg font-bold">Detalle de Importación</h3>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="w-5 h-5" />
        </Button>
      </div>

      {/* Contenido scrollable */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-3 text-sm">
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

        <div className="mt-4">
          <h4 className="font-semibold mb-2">Adjuntos:</h4>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">PDF 1</Button>
            <Button variant="outline" size="sm">PDF 2</Button>
            <Button variant="outline" size="sm">PDF 3</Button>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
