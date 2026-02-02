// @/pages/ventas/VentasPage.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ResourcePage } from "@/components/common/ResourcePage";
import { VentasTable } from "@/components/common/Ventas/VentaTable";
import { VentaDetalleModal } from "@/components/common/Ventas/VentaDetalleModal";
import { NotaSelectorModal } from "@/components/common/Forms/Ventas/NotaSelectorModal";
import { toast } from "sonner";

export function VentasSelectorNota() {
    const navigate = useNavigate();
    const [selectedVenta, setSelectedVenta] = useState<any>(null);
    const [detailOpen, setDetailOpen] = useState(false);
    const [noteSelectorOpen, setNoteSelectorOpen] = useState(false);

    // --- HANDLERS ---

    // 2. Abrir el selector de tipo de nota
    const handleEmitirNota = (venta: any) => {
        setSelectedVenta(venta);
        setNoteSelectorOpen(true);
    };

    // 3. Función Principal de Navegación a Formularios de Notas
    const irANota = (tipo: 'credito' | 'debito') => {
        if (!selectedVenta) {
            toast.error("No se ha seleccionado ninguna venta");
            return;
        }
        setNoteSelectorOpen(false);
        // Redirecciona a /ventas/nota-credito/123 o /ventas/nota-debito/123
        navigate(`/ventas/nota-${tipo}/${selectedVenta.id}`);
    };



    return (
        <ResourcePage
            title="Gestión de Ventas"
            subtitle="Visualiza tus ventas y emite documentos de ajuste"
            isLoading={false} // <--- AGREGAR ESTO PARA QUITAR EL ERROR
            error={null}      // <--- AGREGAR ESTO PARA QUITAR EL ERROR
        >
            <VentasTable
                showEmitirNota={true}
                onEmitirNota={handleEmitirNota}
            />

            <VentaDetalleModal
                ventaId={selectedVenta?.id}
                open={detailOpen}
                onOpenChange={setDetailOpen}
            />

            <NotaSelectorModal
                isOpen={noteSelectorOpen}
                onClose={() => setNoteSelectorOpen(false)}
                selectedVenta={selectedVenta}
                onSelectType={irANota}
            />
        </ResourcePage>
    );
}