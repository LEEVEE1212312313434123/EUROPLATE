// @/components/common/Forms/Ventas/NotaSelectorModal.tsx
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { ArrowDownCircle, ArrowUpCircle, Receipt } from "lucide-react";

interface Props {
    isOpen: boolean;
    onClose: () => void;
    selectedVenta: {
        id: number;
        cliente: string;
    } | null;
    onSelectType: (tipo: 'credito' | 'debito') => void;
}

export function NotaSelectorModal({ isOpen, onClose, selectedVenta, onSelectType }: Props) {
    if (!selectedVenta) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[440px] p-0 overflow-hidden border-none shadow-2xl">
                {/* Header con fondo sutil */}
                <div className="bg-slate-50/50 p-6 border-b">
                    <DialogHeader>
                        <div className="flex items-center gap-2 mb-2">
                            <div className="p-1.5 bg-primary/10 rounded-md">
                                <Receipt className="w-5 h-5 text-primary" />
                            </div>
                            <DialogTitle className="text-xl font-black text-slate-900 tracking-tight">
                                Documento de Ajuste
                            </DialogTitle>
                        </div>
                        <DialogDescription className="text-slate-500 text-sm leading-relaxed">
                            Seleccione el tipo de nota para la venta <strong className="text-slate-900 font-bold">#{selectedVenta.id}</strong>.
                            <br />
                            <span className="text-xs italic text-slate-400">Cliente: {selectedVenta.cliente}</span>
                        </DialogDescription>
                    </DialogHeader>
                </div>

                <div className="p-6 grid gap-4">
                    {/* OPCIÓN: NOTA DE CRÉDITO */}
                    <button
                        onClick={() => onSelectType('credito')}
                        className="flex items-center gap-4 w-full p-4 rounded-xl border-2 border-slate-100 bg-white hover:border-rose-200 hover:bg-rose-50/30 transition-all duration-200 group text-left"
                    >
                        <div className="flex-shrink-0 p-3 bg-rose-100 rounded-xl group-hover:scale-110 transition-transform duration-200">
                            <ArrowDownCircle className="w-6 h-6 text-rose-600" />
                        </div>
                        <div className="flex flex-col min-w-0">
                            <span className="font-bold text-slate-900 group-hover:text-rose-700">Nota de Crédito</span>
                            <span className="text-xs text-slate-500 leading-snug line-clamp-2">
                                Devoluciones, anulación de operaciones o bonificaciones.
                            </span>
                        </div>
                    </button>

                    {/* OPCIÓN: NOTA DE DÉBITO */}
                    <button
                        onClick={() => onSelectType('debito')}
                        className="flex items-center gap-4 w-full p-4 rounded-xl border-2 border-slate-100 bg-white hover:border-blue-200 hover:bg-blue-50/30 transition-all duration-200 group text-left"
                    >
                        <div className="flex-shrink-0 p-3 bg-blue-100 rounded-xl group-hover:scale-110 transition-transform duration-200">
                            <ArrowUpCircle className="w-6 h-6 text-blue-600" />
                        </div>
                        <div className="flex flex-col min-w-0">
                            <span className="font-bold text-slate-900 group-hover:text-blue-700">Nota de Débito</span>
                            <span className="text-xs text-slate-500 leading-snug line-clamp-2">
                                Intereses por mora, aumentos de precio o gastos bancarios.
                            </span>
                        </div>
                    </button>
                </div>

                <div className="p-4 bg-slate-50 border-t flex justify-center">
                    <button
                        onClick={onClose}
                        className="text-xs font-bold text-slate-400 hover:text-slate-600 uppercase tracking-widest transition-colors"
                    >
                        Cancelar operación
                    </button>
                </div>
            </DialogContent>
        </Dialog>
    );
}