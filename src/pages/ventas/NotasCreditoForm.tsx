// @/components/common/Forms/Ventas/notascredito-form.tsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { VentasService } from "@/services/ventas/venta.service";
import { AjustesService } from "@/services/ventas/ajustes.service";
import { SeriesRepository } from "@/repository/ventas/series.repository";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    ArrowLeft, Save, Loader2, Hash, AlertCircle,
    User, FileText, Calendar, Wallet, ShoppingBag, ArrowDownCircle
} from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

export function NotasCreditoForm() {
    const { ventaId } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [venta, setVenta] = useState<any>(null);
    const [proximaSerie, setProximaSerie] = useState<string>("");

    const [motivo, setMotivo] = useState("");
    const [productosADevolver, setProductosADevolver] = useState<any[]>([]);

    useEffect(() => {
        const cargarDatosIniciales = async () => {
            if (!ventaId) return;
            try {
                setLoading(true);
                const [ventaData, infoSerie] = await Promise.all([
                    VentasService.getVentaById(Number(ventaId)),
                    SeriesRepository.obtenerInfoSerie('Nota de Crédito')
                ]);

                setVenta(ventaData);
                const siguiente = (infoSerie.data.ultimo_numero + 1).toString().padStart(8, '0');
                setProximaSerie(`${infoSerie.data.serie}-${siguiente}`);

                // Mapeamos productos con su estado de devolución
                const items = ventaData.venta_productos.map((p: any) => ({
                    ...p,
                    cantidadDevolucion: 0
                }));
                setProductosADevolver(items);
            } catch (error) {
                console.error(error);
                toast.error("Error al cargar los datos de la venta");
            } finally {
                setLoading(false);
            }
        };
        cargarDatosIniciales();
    }, [ventaId]);

    const handleCantidadChange = (id: number, cant: number, maxDisponible: number) => {
        const valor = Math.max(0, Math.min(cant, maxDisponible));
        setProductosADevolver(prev => prev.map(p =>
            p.id === id ? { ...p, cantidadDevolucion: valor } : p
        ));
    };

    const montoTotalAjuste = productosADevolver.reduce(
        (acc, p) => acc + (p.cantidadDevolucion * p.precio_unitario), 0
    );

    const handleSubmit = async () => {
        if (!motivo) return toast.warning("Ingrese el motivo de la devolución");
        if (montoTotalAjuste <= 0) return toast.warning("Seleccione al menos un producto");

        try {
            setSaving(true);
            const resultado = await AjustesService.emitirNotaCredito({
                venta_id: Number(ventaId),
                motivo,
                monto_ajuste: montoTotalAjuste,
                productos: productosADevolver
                    .filter(p => p.cantidadDevolucion > 0)
                    .map(p => ({
                        producto_id: p.producto_id,
                        cantidad: p.cantidadDevolucion,
                        precio_unitario: p.precio_unitario
                    }))
            });
            toast.success(`Nota de Crédito ${resultado.numero} generada`);
            navigate("/ventas");
        } catch (error) {
            toast.error("Error al procesar el documento");
        } finally {
            setSaving(false);
        }
    };

    if (loading) return (
        <div className="h-screen flex flex-col justify-center items-center gap-2">
            <Loader2 className="animate-spin text-rose-600 w-10 h-10" />
            <p className="text-sm font-medium text-slate-500">Sincronizando datos de venta...</p>
        </div>
    );

    return (
        <div className="p-6 max-w-6xl mx-auto space-y-6">
            {/* Header Principal */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <Button variant="outline" size="icon" onClick={() => navigate(-1)} className="rounded-full shadow-sm hover:bg-slate-50">
                        <ArrowLeft className="w-4 h-4" />
                    </Button>
                    <div>
                        <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none mb-1">Nueva Nota de Crédito</h1>
                        <p className="text-slate-500 text-sm font-medium">Devolución o Descuento para Venta #{ventaId}</p>
                    </div>
                </div>
                <div className="flex items-center gap-3 bg-white p-2 px-4 rounded-xl border border-rose-100 shadow-sm">
                    <div className="text-right">
                        <p className="text-[10px] uppercase font-bold text-slate-400 leading-none">Correlativo NC</p>
                        <p className="text-lg font-black text-rose-600 leading-none mt-1">{proximaSerie}</p>
                    </div>
                    <Hash className="text-rose-200 w-8 h-8" />
                </div>
            </div>

            {/* Fila de Tarjetas de Info */}
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
                            <p className="text-[10px] font-black text-slate-400 uppercase">Comprobante Origen</p>
                            <p className="font-bold text-slate-700 text-sm">{venta?.tipo_comprobante} #{venta?.id}</p>
                        </div>
                    </CardContent>
                </Card>
                <Card className="bg-slate-50/50 border-dashed border-slate-200 shadow-none">
                    <CardContent className="p-4 flex items-center gap-3">
                        <div className="p-2 bg-white rounded-lg border border-slate-100"><Calendar className="w-4 h-4 text-slate-400" /></div>
                        <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase">Fecha Emisión</p>
                            <p className="font-bold text-slate-700 text-sm">{new Date(venta?.fecha_venta).toLocaleDateString()}</p>
                        </div>
                    </CardContent>
                </Card>
                <Card className="bg-rose-600 text-white shadow-md shadow-rose-100 border-none">
                    <CardContent className="p-4 flex items-center gap-3">
                        <div className="p-2 bg-rose-500 rounded-lg"><Wallet className="w-4 h-4 text-white" /></div>
                        <div>
                            <p className="text-[10px] font-black text-rose-200 uppercase">Total Venta</p>
                            <p className="text-xl font-black">{venta?.moneda} {venta?.totalOriginal?.toFixed(2)}</p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                {/* Panel Izquierdo: Selección de Productos */}
                <div className="lg:col-span-2 space-y-6">
                    <Card className="shadow-sm border-slate-200 overflow-hidden">
                        <CardHeader className="bg-slate-50/50 border-b py-3 px-6">
                            <CardTitle className="text-sm font-bold flex items-center gap-2 text-slate-700 uppercase tracking-wider">
                                <ShoppingBag className="w-4 h-4 text-rose-600" />
                                Selección de Items a Devolver
                            </CardTitle>
                        </CardHeader>
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-slate-50/20">
                                    <TableHead className="pl-6 h-10 text-[11px] uppercase font-bold">Descripción</TableHead>
                                    <TableHead className="text-center h-10 text-[11px] uppercase font-bold">Vendido</TableHead>
                                    <TableHead className="text-center h-10 text-[11px] uppercase font-bold text-blue-600">Disp.</TableHead>
                                    <TableHead className="pr-6 h-10 text-[11px] uppercase font-bold w-32 text-right">Cant. Devolver</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {productosADevolver.map((p) => (
                                    <TableRow key={p.id} className="hover:bg-slate-50/50 border-slate-100">
                                        <TableCell className="pl-6 py-4">
                                            <p className="font-bold text-slate-700 text-sm">{p.producto?.nombre_producto}</p>
                                            <p className="text-[10px] text-slate-400 uppercase tracking-tighter">{p.producto?.categoria}</p>
                                        </TableCell>
                                        <TableCell className="text-center text-sm font-medium text-slate-500">{p.cantidadOriginal}</TableCell>
                                        <TableCell className="text-center">
                                            <Badge variant="secondary" className="bg-blue-50 text-blue-700 hover:bg-blue-50 border-none font-bold">
                                                {p.cantidadDisponible}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="pr-6">
                                            <Input
                                                type="number"
                                                disabled={p.cantidadDisponible === 0}
                                                className={`h-9 text-center font-bold transition-all ${p.cantidadDevolucion > 0 ? 'border-rose-400 ring-2 ring-rose-50' : 'border-slate-200'}`}
                                                value={p.cantidadDevolucion || ""}
                                                onChange={(e) => handleCantidadChange(p.id, Number(e.target.value), p.cantidadDisponible)}
                                            />
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </Card>

                    <Card className="shadow-sm border-slate-200">
                        <CardHeader className="bg-slate-50/50 border-b py-3 px-6">
                            <CardTitle className="text-sm font-bold flex items-center gap-2 text-slate-700 uppercase tracking-wider">
                                <ArrowDownCircle className="w-4 h-4 text-slate-500" />
                                Justificación Técnica
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6">
                            <textarea
                                className="w-full min-h-[100px] p-4 rounded-xl border-2 border-slate-100 bg-slate-50/30 focus:bg-white focus:border-rose-400 focus:ring-4 focus:ring-rose-50 outline-none transition-all resize-none text-slate-700 text-sm"
                                placeholder="Indique el motivo de la devolución (ej: Producto defectuoso, error de despacho...)"
                                value={motivo}
                                onChange={(e) => setMotivo(e.target.value)}
                            />
                        </CardContent>
                    </Card>
                </div>

                {/* Panel Derecho: Resumen Sticky */}
                <div className="lg:sticky lg:top-6">
                    <Card className="shadow-xl border-rose-100 border-2 overflow-hidden bg-white">
                        <CardHeader className="bg-white text-slate-700 py-4 px-6 border-none">
                            <CardTitle className="text-lg flex items-center justify-between font-black tracking-tight text-slate-800">
                                RESUMEN AJUSTE
                                <Badge className="bg-rose-100 border-none text-rose-700 text-[10px] font-black">
                                    CRÉDITO
                                </Badge>
                            </CardTitle>
                        </CardHeader>

                        <CardContent className="p-6 space-y-6">
                            <div className="bg-amber-50 border border-amber-100 p-4 rounded-xl flex gap-3">
                                <AlertCircle className="w-5 h-5 text-amber-500 shrink-0" />
                                <p className="text-[11px] text-amber-800 leading-tight font-medium">
                                    Esta operación reducirá el saldo de la venta y **reintegrará el stock** seleccionado al inventario automáticamente.
                                </p>
                            </div>

                            <div className="space-y-3 pt-2">
                                <div className="flex justify-between text-slate-400 text-[11px] font-black uppercase">
                                    <span>Monto a descontar</span>
                                    <span>Base Imponible</span>
                                </div>
                                <div className="flex justify-between items-end">
                                    <p className="text-3xl font-black text-rose-600 tracking-tighter">
                                        -{venta?.moneda} {montoTotalAjuste.toFixed(2)}
                                    </p>
                                    <p className="text-sm font-bold text-slate-400">
                                        {venta?.moneda} {(montoTotalAjuste / 1.18).toFixed(2)}
                                    </p>
                                </div>
                            </div>

                            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-2">
                                <div className="flex justify-between text-slate-500 text-[11px] font-bold">
                                    <span>TOTAL ORIGINAL:</span>
                                    <span>{venta?.moneda} {venta?.totalOriginal?.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-rose-600 text-[11px] font-bold italic">
                                    <span>- AJUSTE ACTUAL:</span>
                                    <span>{venta?.moneda} {montoTotalAjuste.toFixed(2)}</span>
                                </div>
                                <div className="pt-3 border-t-2 border-dashed border-slate-200 flex justify-between items-center">
                                    <span className="text-xs font-black text-slate-900 uppercase">Nuevo Total:</span>
                                    <p className="text-xl font-black text-slate-900 tracking-tighter">
                                        {venta?.moneda} {(venta?.totalOriginal - montoTotalAjuste).toFixed(2)}
                                    </p>
                                </div>
                            </div>

                            <Button
                                className="w-full h-14 text-lg font-bold bg-rose-600 hover:bg-rose-700 shadow-lg shadow-rose-100 transition-all active:scale-[0.98] rounded-xl"
                                onClick={handleSubmit}
                                disabled={saving || montoTotalAjuste <= 0}
                            >
                                {saving ? (
                                    <><Loader2 className="animate-spin mr-2" /> Procesando...</>
                                ) : (
                                    <><Save className="mr-2" /> Confirmar Emisión</>
                                )}
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}