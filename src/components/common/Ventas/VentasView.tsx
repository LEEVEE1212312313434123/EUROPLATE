import { useState } from "react";
import { Save, XCircle, Wallet, UserCircle } from "lucide-react";

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

    /* ===== CÁLCULOS ===== */
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

    /* ===== REGISTRAR VENTA ===== */
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
            {/* CABECERA */}
            <header className="flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="flex items-center gap-3">
                    <div className="bg-blue-600 p-2 rounded-lg">
                        <Wallet className="text-white w-5 h-5" />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold">Punto de Venta</h1>
                        <Badge className="bg-emerald-50 text-emerald-700 text-[10px]">
                            Sistema Activo
                        </Badge>
                    </div>
                </div>

                <div className="flex gap-3">
                    <Button
                        variant="ghost"
                        onClick={() => window.location.reload()}
                    >
                        <XCircle className="w-4 h-4 mr-2" />
                        Cancelar
                    </Button>
                    <Button
                        onClick={handleConfirmarVenta}
                        disabled={loading || carrito.length === 0 || !pagoCompleto}
                        className="bg-blue-600 hover:bg-blue-700 px-6"
                    >
                        <Save className="w-4 h-4 mr-2" />
                        {loading ? "Procesando..." : "Finalizar Venta"}
                    </Button>
                </div>
            </header>

            {/* CLIENTE */}
            <Card className="border-none shadow-none">
                <CardHeader>
                    <CardTitle className="text-xs flex items-center gap-2">
                        <UserCircle className="w-4 h-4" /> Datos del Cliente
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <ClienteSelector onClienteSeleccionado={setCliente} />
                </CardContent>
            </Card>

            {/* PRODUCTOS */}
            <Card className="border-none shadow-none">
                <CardContent>
                    <SeleccionProductos
                        productosSeleccionados={carrito}
                        setProductosSeleccionados={setCarrito}
                    />
                </CardContent>
            </Card>

            {/* PAGOS + RESUMEN */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-7">
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
                </div>

                <div className="lg:col-span-5">
                    <Card className="border-none shadow-none">
                        <CardContent className="p-6 space-y-4">
                            <div className="flex justify-between text-slate-500">
                                <span>Subtotal</span>
                                <span>{subtotal.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-slate-500">
                                <span>IGV</span>
                                <span>{igv.toFixed(2)}</span>
                            </div>
                            <Separator />
                            <div className="text-4xl font-black">
                                Total: {total.toFixed(2)}
                            </div>

                            <Badge
                                className={
                                    pagoCompleto
                                        ? "bg-emerald-600"
                                        : "bg-orange-500"
                                }
                            >
                                {pagoCompleto ? "Pago Completo" : "Pendiente"}
                            </Badge>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
