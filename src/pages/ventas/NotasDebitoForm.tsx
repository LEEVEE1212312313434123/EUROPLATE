// @/components/common/Forms/Ventas/notasdebito-form.tsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { VentasService } from "@/services/ventas/venta.service";
import { AjustesService } from "@/services/ventas/ajustes.service";
import { SeriesRepository } from "@/repository/ventas/series.repository";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
    ArrowLeft, Save, Loader2, Hash, AlertTriangle,
    TrendingUp, User, FileText, Calendar, Wallet, ShoppingBag
} from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

export function NotasDebitoForm() {
    const { ventaId } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [venta, setVenta] = useState<any>(null);
    const [proximaSerie, setProximaSerie] = useState<string>("");

    const [motivo, setMotivo] = useState("");
    const [montoAjuste, setMontoAjuste] = useState<number>(0);

    useEffect(() => {
        const cargarDatos = async () => {
            if (!ventaId) return;
            try {
                setLoading(true);
                const [ventaData, infoSerie] = await Promise.all([
                    VentasService.getVentaById(Number(ventaId)),
                    SeriesRepository.obtenerInfoSerie('Nota de Débito')
                ]);

                setVenta(ventaData);
                const siguiente = (infoSerie.data.ultimo_numero + 1).toString().padStart(8, '0');
                setProximaSerie(`${infoSerie.data.serie}-${siguiente}`);
            } catch (error) {
                console.error(error);
                toast.error("Error al cargar datos de la venta");
            } finally {
                setLoading(false);
            }
        };
        cargarDatos();
    }, [ventaId]);

    const handleSubmit = async () => {
        if (!motivo) return toast.warning("Indique el motivo del incremento");
        if (montoAjuste <= 0) return toast.warning("El monto debe ser mayor a 0");

        try {
            setSaving(true);
            const res = await AjustesService.emitirNotaDebito({
                venta_id: Number(ventaId),
                motivo,
                monto_ajuste: montoAjuste
            });
            toast.success(`Nota de Débito ${res.numero} emitida correctamente`);
            navigate("/ventas");
        } catch (error) {
            toast.error("Error al procesar la nota de débito");
        } finally {
            setSaving(false);
        }
    };

    if (loading) return (
        <div className="h-screen flex flex-col justify-center items-center gap-2">
            <Loader2 className="animate-spin text-blue-600 w-10 h-10" />
            <p className="text-sm font-medium text-slate-500">Cargando información de venta...</p>
        </div>
    );

    const totalActualVenta = venta?.totalAjustado || venta?.total_monto || 0;

    return (
        <div className="p-6 max-w-6xl mx-auto space-y-6">
            {/* Header Principal */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <Button variant="outline" size="icon" onClick={() => navigate(-1)} className="rounded-full shadow-sm hover:bg-slate-50">
                        <ArrowLeft className="w-4 h-4" />
                    </Button>
                    <div>
                        <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none mb-1">Nueva Nota de Débito</h1>
                        <p className="text-slate-500 text-sm font-medium">Incremento de saldo para Venta #{ventaId}</p>
                    </div>
                </div>
                <div className="flex items-center gap-3 bg-white p-2 px-4 rounded-xl border border-blue-100 shadow-sm">
                    <div className="text-right">
                        <p className="text-[10px] uppercase font-bold text-slate-400 leading-none">Correlativo</p>
                        <p className="text-lg font-black text-blue-600 leading-none mt-1">{proximaSerie}</p>
                    </div>
                    <Hash className="text-blue-200 w-8 h-8" />
                </div>
            </div>

            {/* Fila de Tarjetas de Info (Info de la Venta Original) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                <Card className="bg-slate-50/50 border-dashed border-slate-200 shadow-none">
                    <CardContent className="p-4 flex items-center gap-3">
                        <div className="p-2 bg-white rounded-lg border border-slate-100"><User className="w-4 h-4 text-slate-400" /></div>
                        <div className="min-w-0">
                            <p className="text-[10px] font-black text-slate-400 uppercase">Cliente</p>
                            <p className="font-bold text-slate-700 truncate text-sm">{venta?.cliente?.nombre}</p>
                        </div>
                    </CardContent>
                </Card>
                <Card className="bg-slate-50/50 border-dashed border-slate-200 shadow-none">
                    <CardContent className="p-4 flex items-center gap-3">
                        <div className="p-2 bg-white rounded-lg border border-slate-100"><FileText className="w-4 h-4 text-slate-400" /></div>
                        <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase">Origen</p>
                            <p className="font-bold text-slate-700 text-sm">{venta?.tipo_comprobante} #{venta?.id}</p>
                        </div>
                    </CardContent>
                </Card>
                <Card className="bg-slate-50/50 border-dashed border-slate-200 shadow-none">
                    <CardContent className="p-4 flex items-center gap-3">
                        <div className="p-2 bg-white rounded-lg border border-slate-100"><Calendar className="w-4 h-4 text-slate-400" /></div>
                        <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase">Fecha Original</p>
                            <p className="font-bold text-slate-700 text-sm">{new Date(venta?.fecha_venta).toLocaleDateString()}</p>
                        </div>
                    </CardContent>
                </Card>
                <Card className="bg-blue-600 text-white shadow-md shadow-blue-100 border-none">
                    <CardContent className="p-4 flex items-center gap-3">
                        <div className="p-2 bg-blue-500 rounded-lg"><Wallet className="w-4 h-4 text-white" /></div>
                        <div>
                            <p className="text-[10px] font-black text-blue-200 uppercase">Saldo Actual</p>
                            <p className="text-xl font-black">{venta?.moneda} {totalActualVenta.toFixed(2)}</p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Contenido Formulario */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">

                {/* Panel Izquierdo */}
                <div className="lg:col-span-2 space-y-6">
                    <Card className="shadow-sm border-slate-200">
                        <CardHeader className="bg-slate-50/50 border-b py-3 px-6">
                            <CardTitle className="text-sm font-bold flex items-center gap-2 text-slate-700 uppercase tracking-wider">
                                <TrendingUp className="w-4 h-4 text-blue-600" />
                                Detalle del Cargo
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6 space-y-4">
                            <div className="space-y-2">
                                <label className="text-xs font-black text-slate-500 uppercase tracking-tight">Motivo del Ajuste</label>
                                <textarea
                                    className="w-full min-h-[100px] p-4 rounded-xl border-2 border-slate-100 bg-slate-50/30 focus:bg-white focus:border-blue-400 focus:ring-4 focus:ring-blue-50 outline-none transition-all resize-none text-slate-700 text-sm"
                                    placeholder="Escriba aquí la razón del cobro extra (ej: Intereses, error de digitación, etc.)"
                                    value={motivo}
                                    onChange={(e) => setMotivo(e.target.value)}
                                />
                            </div>

                            <div className="bg-blue-50/50 border border-blue-100 p-4 rounded-xl flex gap-3">
                                <AlertTriangle className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                                <div className="space-y-1">
                                    <p className="text-xs text-blue-900 font-bold leading-none">Nota Importante</p>
                                    <p className="text-[11px] text-blue-700 leading-relaxed font-medium">
                                        Las Notas de Débito son documentos tributarios que incrementan el valor de la venta original.
                                        Este movimiento **no afecta el inventario** físico.
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Tabla Informativa */}
                    <Card className="shadow-sm border-slate-200 overflow-hidden">
                        <CardHeader className="bg-slate-50/50 border-b py-3 px-6">
                            <CardTitle className="text-sm font-bold flex items-center gap-2 text-slate-700 uppercase tracking-wider">
                                <ShoppingBag className="w-4 h-4 text-slate-500" />
                                Productos Originales
                            </CardTitle>
                        </CardHeader>
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-slate-50/20">
                                    <TableHead className="pl-6 h-10 text-[11px] uppercase font-bold">Descripción</TableHead>
                                    <TableHead className="text-center h-10 text-[11px] uppercase font-bold">Cantidad</TableHead>
                                    <TableHead className="text-right pr-6 h-10 text-[11px] uppercase font-bold">P. Unitario</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {venta?.venta_productos?.map((p: any) => (
                                    <TableRow key={p.id} className="hover:bg-slate-50/50 border-slate-100">
                                        <TableCell className="pl-6 py-3 font-medium text-slate-700 text-sm">
                                            {p.producto?.nombre_producto}
                                        </TableCell>
                                        <TableCell className="text-center text-sm">{p.cantidad}</TableCell>
                                        <TableCell className="text-right pr-6 font-bold text-sm text-slate-900">
                                            {venta?.moneda} {p.precio_unitario?.toFixed(2)}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </Card>
                </div>

                {/* Resumen de Ajuste (Sticky) */}
                <div className="lg:sticky lg:top-6">
                    <Card className="shadow-xl border-blue-100 border-2 overflow-hidden bg-white">
                        <CardHeader className="bg-white text-slate-700 py-4 px-6 border-none">
                            <CardTitle className="text-lg flex items-center justify-between font-black tracking-tight text-slate-800">
                                RESUMEN
                                <Badge className="bg-slate-200 border-none text-slate-700 text-[10px] font-black">
                                    DÉBITO
                                </Badge>
                            </CardTitle>
                        </CardHeader>

                        <CardContent className="p-6 space-y-6">
                            <div className="space-y-3">
                                <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Monto a Incrementar</label>
                                <div className="relative group">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-xl font-bold text-slate-300 group-focus-within:text-blue-500 transition-colors">
                                        {venta?.moneda}
                                    </div>
                                    <Input
                                        type="number"
                                        className="h-14 pl-16 text-2xl font-black text-blue-700 border-2 border-slate-100 focus:border-blue-500 focus:ring-0 transition-all rounded-xl bg-slate-50/30"
                                        placeholder="0.00"
                                        value={montoAjuste || ""}
                                        onChange={(e) => setMontoAjuste(Number(e.target.value))}
                                    />
                                </div>
                            </div>

                            {/* Detalle Cálculos */}
                            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-3">
                                <div className="flex justify-between text-slate-500 text-[11px] font-bold">
                                    <span>SALDO ACTUAL:</span>
                                    <span>{venta?.moneda} {totalActualVenta.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-blue-600 text-[11px] font-bold italic">
                                    <span>+ CARGO ADICIONAL:</span>
                                    <span>{venta?.moneda} {montoAjuste.toFixed(2)}</span>
                                </div>
                                <div className="pt-3 border-t-2 border-dashed border-slate-200 flex justify-between items-center">
                                    <span className="text-xs font-black text-slate-900">NUEVO SALDO:</span>
                                    <p className="text-2xl font-black text-slate-900 tracking-tighter">
                                        {venta?.moneda} {(totalActualVenta + montoAjuste).toFixed(2)}
                                    </p>
                                </div>
                            </div>

                            <Button
                                className="w-full h-14 text-lg font-bold bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-100 transition-all active:scale-[0.98] rounded-xl"
                                onClick={handleSubmit}
                                disabled={saving || montoAjuste <= 0}
                            >
                                {saving ? (
                                    <><Loader2 className="animate-spin mr-2" /> Emitiendo...</>
                                ) : (
                                    <><Save className="mr-2" /> Emitir Documento</>
                                )}
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}