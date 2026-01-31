// @/components/common/Forms/Ventas/notasdebito-form.tsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { VentasService } from "@/services/ventas/venta.service";
import { AjustesService } from "@/services/ventas/ajustes.service";
import { SeriesRepository } from "@/repository/ventas/series.repository";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Save, Loader2, Hash, AlertTriangle, TrendingUp } from "lucide-react";
import { toast } from "sonner";

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
                const [ventaData, infoSerie] = await Promise.all([
                    VentasService.getVentaById(Number(ventaId)),
                    SeriesRepository.obtenerInfoSerie('Nota de Débito')
                ]);
                setVenta(ventaData);
                const siguiente = (infoSerie.data.ultimo_numero + 1).toString().padStart(8, '0');
                setProximaSerie(`${infoSerie.data.serie}-${siguiente}`);
            } catch (error) {
                toast.error("Error al cargar datos");
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
            toast.error("Error al procesar la nota");
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="p-10 flex justify-center"><Loader2 className="animate-spin" /></div>;

    return (
        <div className="p-6 max-w-3xl mx-auto space-y-6">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={() => navigate(-1)}><ArrowLeft /></Button>
                <div>
                    <h1 className="text-2xl font-bold">Nota de Débito</h1>
                    <p className="text-muted-foreground text-sm">Incremento de valor para Venta #{ventaId}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6">
                <Card>
                    <CardHeader className="border-b bg-slate-50/50">
                        <div className="flex justify-between items-center">
                            <CardTitle className="text-base font-semibold">Detalles del Incremento</CardTitle>
                            <div className="flex items-center gap-2 bg-blue-100 text-blue-700 px-3 py-1 rounded-full border border-blue-200">
                                <Hash className="w-3.5 h-3.5" />
                                <span className="text-xs font-bold">{proximaSerie}</span>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="pt-6 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Monto a Incrementar ({venta?.moneda})</label>
                                <div className="relative">
                                    <TrendingUp className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                                    <Input
                                        type="number"
                                        className="pl-10 text-lg font-bold border-blue-200 focus:ring-blue-500"
                                        placeholder="0.00"
                                        value={montoAjuste}
                                        onChange={(e) => setMontoAjuste(Number(e.target.value))}
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Motivo</label>
                                <Input
                                    placeholder="Ej: Intereses por mora / Flete adicional"
                                    value={motivo}
                                    onChange={(e) => setMotivo(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg flex gap-3">
                            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
                            <p className="text-sm text-amber-800">
                                Esta acción **incrementará** la cuenta por cobrar del cliente vinculada a esta venta.
                                Asegúrese de que el monto sea correcto.
                            </p>
                        </div>

                        <div className="pt-4 border-t">
                            <div className="flex justify-between items-end">
                                <div className="text-sm text-muted-foreground">
                                    Total original: {venta?.moneda} {Number(venta?.total_monto).toFixed(2)}
                                </div>
                                <div className="text-right">
                                    <span className="text-sm text-muted-foreground block">Nuevo total estimado:</span>
                                    <span className="text-2xl font-black text-blue-700">
                                        {venta?.moneda} {(Number(venta?.total_monto) + montoAjuste).toFixed(2)}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <Button className="w-full h-12 bg-blue-600 hover:bg-blue-700" onClick={handleSubmit} disabled={saving}>
                            {saving ? <Loader2 className="animate-spin" /> : <Save className="mr-2" />}
                            Emitir Nota de Débito
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}