import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogCancel,
    AlertDialogAction,
} from "@/components/ui/alert-dialog";

import { AlertTriangle } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { CompraNacionalService } from "@/services/national/compra-nacional.service";

interface Props {
    open: boolean;
    compraId: number | null;
    onClose: () => void;
    onSuccess: () => void;
}
export function FinalizarCompraNacionalModal({
    open,
    compraId,
    onClose,
    onSuccess,
}: Props) {
    const [loading, setLoading] = useState(false);

    const handleConfirm = async () => {
        if (!compraId) return;

        try {
            setLoading(true);
            await CompraNacionalService.entregarCompra(compraId);

            toast.success("Compra entregada y stock actualizado");
            onSuccess();
            onClose();
        } catch (error: any) {
            toast.error(error.message || "Error al finalizar la compra");
        } finally {
            setLoading(false);
        }
    };

    return (
        <AlertDialog
            open={open}
            onOpenChange={(value) => {
                if (!value) onClose();
            }}
        >
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle className="flex items-center gap-2">
                        <AlertTriangle className="text-amber-500" />
                        Confirmar Entrega
                    </AlertDialogTitle>

                    <AlertDialogDescription>
                        Esta acción marcará la compra como <strong>ENTREGADA</strong> y
                        actualizará el stock. No podrá revertirse.
                    </AlertDialogDescription>
                </AlertDialogHeader>

                <AlertDialogFooter>
                    <AlertDialogCancel disabled={loading}>
                        Cancelar
                    </AlertDialogCancel>

                    <AlertDialogAction
                        onClick={handleConfirm}
                        disabled={loading}
                        className="bg-green-600 hover:bg-green-700"
                    >
                        {loading ? "Procesando..." : "Confirmar Entrega"}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
