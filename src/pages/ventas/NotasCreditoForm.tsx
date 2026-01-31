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
import { ArrowLeft, Save, Loader2, Hash, AlertCircle } from "lucide-react";
import { toast } from "sonner";

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
                    obtenerPrevisualizacionSerie('Nota de Crédito')
                ]);

                setVenta(ventaData);
                setProximaSerie(infoSerie);

                // Inicializamos solo con lo que realmente se puede devolver
                const items = ventaData.venta_productos.map((p: any) => ({
                    ...p,
                    cantidadDevolucion: 0
                }));
                setProductosADevolver(items);
            } catch (error) {
                toast.error("Error al cargar datos");
            } finally {
                setLoading(false);
            }
        };
        cargarDatosIniciales();
    }, [ventaId]);

    const obtenerPrevisualizacionSerie = async (tipo: string) => {
        const { data } = await SeriesRepository.obtenerInfoSerie(tipo);
        if (!data) return "---";
        return `${data.serie}-${(data.ultimo_numero + 1).toString().padStart(8, '0')}`;
    };

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
        if (montoTotalAjuste <= 0) return toast.warning("Seleccione al menos un producto para devolver");

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
            toast.error("Error al procesar");
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="p-10 flex justify-center"><Loader2 className="animate-spin" /></div>;

    return (
        <div className="p-6 max-w-5xl mx-auto space-y-6">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={() => navigate(-1)}><ArrowLeft /></Button>
                <h1 className="text-2xl font-bold">Nota de Crédito (Venta #{ventaId})</h1>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="md:col-span-2">
                    <CardHeader><CardTitle>Selección de Productos</CardTitle></CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Producto</TableHead>
                                    <TableHead className="text-center">Vendido</TableHead>
                                    <TableHead className="text-center">Ya Devuelto</TableHead>
                                    <TableHead className="text-center text-blue-600">Disponible</TableHead>
                                    <TableHead className="w-32">A Devolver</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {productosADevolver.map((p) => (
                                    <TableRow key={p.id}>
                                        <TableCell className="font-medium">{p.producto.nombre_producto}</TableCell>
                                        <TableCell className="text-center">{p.cantidadOriginal}</TableCell>
                                        <TableCell className="text-center text-red-500">{p.cantidadYaDevuelta}</TableCell>
                                        <TableCell className="text-center font-bold bg-blue-50">{p.cantidadDisponible}</TableCell>
                                        <TableCell>
                                            <Input
                                                type="number"
                                                disabled={p.cantidadDisponible === 0}
                                                value={p.cantidadDevolucion}
                                                onChange={(e) => handleCantidadChange(p.id, Number(e.target.value), p.cantidadDisponible)}
                                                className={p.cantidadDisponible === 0 ? "bg-slate-100" : "border-blue-300"}
                                            />
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                <Card className="h-fit">
                    <CardHeader className="space-y-3">
                        <CardTitle>Resumen</CardTitle>
                        <div className="flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-2 rounded-md border border-blue-200">
                            <Hash className="w-4 h-4" />
                            <span className="font-bold">{proximaSerie}</span>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <label className="text-sm font-medium">Motivo</label>
                            <Input placeholder="Ej: Error en facturación" value={motivo} onChange={(e) => setMotivo(e.target.value)} />
                        </div>
                        <div className="p-3 bg-amber-50 rounded-lg border border-amber-200 flex gap-2 text-amber-800 text-xs">
                            <AlertCircle className="w-4 h-4 shrink-0" />
                            Al confirmar, el stock seleccionado reingresará al inventario automáticamente.
                        </div>
                        <div className="pt-4 border-t flex justify-between text-xl font-black">
                            <span>TOTAL:</span>
                            <span>{venta?.moneda} {montoTotalAjuste.toFixed(2)}</span>
                        </div>
                        <Button className="w-full h-12 text-lg" onClick={handleSubmit} disabled={saving || montoTotalAjuste === 0}>
                            {saving ? <Loader2 className="animate-spin" /> : <><Save className="mr-2" /> Emitir Nota</>}
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}