import { useState } from "react";
import { Save, XCircle, Wallet, UserCircle, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ClienteSelector } from "@/components/common/Ventas/ClienteSelector";
import { SeleccionProductos } from "@/components/common/Ventas/SeleccionProductos";
import { InformacionPago } from "@/components/common/Ventas/InformacionPago";
import { VentasService } from "@/services/ventas/venta.service";
import type { CreateVentaDTO, MetodoPagoDTO } from "@/types/ventas/venta.dto";
import type { ClienteEntity } from "@/types/clientes/entity/cliente.entity";
import { toast } from "sonner";

export default function VentasView() {
    const [cliente, setCliente] = useState<ClienteEntity | null>(null);
    const [carrito, setCarrito] = useState<any[]>([]);
    const [tipoComprobante, setTipoComprobante] = useState("Boleta");
    const [pagos, setPagos] = useState<MetodoPagoDTO[]>([
        { metodo: "Efectivo", nro_operacion: "", monto: 0 },
    ]);
    const [loading, setLoading] = useState(false);
    const subtotal = carrito.reduce(
        (acc, item) => acc + item.cantidad * item.precio,
        0
    );
    const igv = subtotal * 0.18;
    const total = subtotal + igv;

    const montoPagado = pagos.reduce(
        (acc, p) => acc + (Number(p.monto) || 0),
        0
    );
    const pagoCompleto = Math.abs(total - montoPagado) < 0.1;
    const handleConfirmarVenta = async () => {
        if (!cliente) {
            toast.error("Seleccione un cliente");
            return;
        }
        if (carrito.length === 0) {
            toast.error("El carrito está vacío");
            return;
        }
        if (!pagoCompleto) {
            toast.error("El monto pagado no coincide con el total");
            return;
        }
        setLoading(true);
        try {
            const ventaDTO: CreateVentaDTO = {
                cliente_id: cliente.id,
                tipo_comprobante: tipoComprobante as any,
                moneda: carrito[0]?.moneda || "USD",
                subtotal,
                igv,
                total_monto: total,
                observaciones: "",
                productos: carrito.map((p) => ({
                    producto_id: p.id,
                    cantidad: p.cantidad,
                    precio_unitario: p.precio,
                    subtotal: p.cantidad * p.precio,
                })),
                pagos,
            };
            await VentasService.registrarVenta(ventaDTO, ventaDTO.productos);
            toast.success("Venta registrada con éxito");
            setCliente(null);
            setCarrito([]);
            setPagos([{ metodo: "Efectivo", nro_operacion: "", monto: 0 }]);
        } catch (error: any) {
            toast.error("Error al registrar: " + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col gap-6 p-6 bg-white min-h-screen max-w-[1400px] mx-auto">
            <header className="flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="flex items-center gap-3">
                    <div className="bg-primary p-2 rounded-lg">
                        <Wallet className="text-primary-foreground w-5 h-5" />
                    </div>
                    <div className="flex flex-col">
                        <h1 className="text-xl font-bold">AGREGAR VENTAS</h1>
                        <p className="text-sm text-muted-foreground">
                            Gestiona una venta
                        </p>
                </div>
                </div>
                <div className="flex gap-3">
                    <Button
                        variant="outline"
                        className="
                            text-foreground
                            border-border
                            hover:bg-accent
                            hover:text-accent-foreground
                            transition-colors
                            cursor-pointer
                        "
                        onClick={() => window.location.reload()}
                    >
                        <XCircle className="w-4 h-4 mr-2" />
                        Cancelar
                    </Button>
                    <Button
                        onClick={handleConfirmarVenta}
                        disabled={loading || carrito.length === 0 || !pagoCompleto}
                        className="bg-primary text-primary-foreground hover:bg-primary/90 px-6 shadow-sm"
                    >
                        <Save className="w-4 h-4 mr-2" />
                        {loading ? "Procesando..." : "Confirmar"}
                    </Button>
                </div>
            </header>
            <Card className="border-none shadow-none">
                <CardHeader>
                    <CardTitle className="text-sm flex items-center gap-2 uppercase text-primary font-bold">
                        <UserCircle className="w-4 h-4" /> Datos del Cliente
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <ClienteSelector onClienteSeleccionado={setCliente} />
                </CardContent>
            </Card>
            <Separator className="my-3" />
            <Card className="border-none shadow-none">
                <CardContent>
                    <SeleccionProductos
                        productosSeleccionados={carrito}
                        setProductosSeleccionados={setCarrito}
                    />
                </CardContent>
            </Card>
            <Separator className="my-3" />
            <div className="grid grid-cols-1 lg:grid-cols-13 gap-6">
                <div className="lg:col-span-6">
                    <Card className="border-none shadow-none">
                        <CardHeader>
                            <CardTitle className="text-sm flex items-center gap-2 uppercase text-primary font-bold">
                                <CreditCard className="w-4 h-4" />
                                Información de Pago
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <InformacionPago
                                subtotal={subtotal}
                                igv={igv}
                                total={total}
                                tipoComprobante={tipoComprobante}
                                setTipoComprobante={setTipoComprobante}
                                pagos={pagos}
                                setPagos={setPagos}
                                montoPagado={montoPagado}
                                pagoCompleto={pagoCompleto}
                            />
                        </CardContent>
                    </Card>
                </div>
                <div className="hidden lg:flex justify-center">
                    <Separator
                        orientation="vertical"
                        className="h-full bg-border"
                    />
                </div>
                <div className="lg:col-span-6">
                    <Card className="border-none shadow-none">
                        <CardHeader className="pb-3 flex flex-row items-center justify-between">
                            <CardTitle className="text-sm flex items-center gap-2 uppercase text-primary font-bold">
                                <Wallet className="w-4 h-4" />
                                Total de Venta
                            </CardTitle>

                            <Badge
                                className={
                                    pagoCompleto
                                        ? "bg-emerald-600"
                                        : "bg-orange-500"
                                }
                            >
                                {pagoCompleto ? "Pago Completo" : "Pendiente"}
                            </Badge>
                        </CardHeader>
                        <CardContent className="pt-0 space-y-4">
                            <div className="flex justify-between text-primary text-sm">
                                <span>Subtotal</span>
                                <span>{subtotal.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-primary text-sm">
                                <span>IGV</span>
                                <span>{igv.toFixed(2)}</span>
                            </div>
                            <Separator />
                            <div className="flex justify-between items-end">
                                <span className="text-lg font-bold text-primary">
                                    TOTAL:
                                </span>
                                <span className="text-2xl font-black text-primary">
                                    {total.toFixed(2)}
                                </span>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
