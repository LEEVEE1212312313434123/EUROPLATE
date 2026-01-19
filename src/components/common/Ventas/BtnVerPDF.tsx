// @/components/common/Ventas/BtnVerPDF.tsx
import { pdf } from "@react-pdf/renderer";
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";
import { VentaPDFDocument } from "./VentaPDFDocument";

export function BtnVerPDF({ venta }: { venta: any }) {
    const handleViewPDF = async () => {
        if (!venta) return;

        // 1. Generar el documento PDF
        const doc = <VentaPDFDocument venta={venta} />;

        // 2. Convertirlo a un Blob
        const blob = await pdf(doc).toBlob();

        // 3. Crear una URL para ese Blob
        const url = URL.createObjectURL(blob);

        // 4. Abrir en pestaña nueva
        window.open(url, "_blank");
    };

    return (
        <Button
            variant="outline"
            size="sm"
            onClick={handleViewPDF}
            className="flex gap-2 items-center"
        >
            <FileText className="h-4 w-4" />
            Ver Comprobante (PDF)
        </Button>
    );
}