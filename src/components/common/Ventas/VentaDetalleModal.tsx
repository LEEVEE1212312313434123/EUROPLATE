// @/components/common/Ventas/VentaDetalleModal.tsx
import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { VentasService } from "@/services/ventas/venta.service";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Loader2 } from "lucide-react";
import { BtnVerPDF } from "@/components/common/Ventas/BtnVerPDF";

interface Props {
    ventaId: number | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function VentaDetalleModal({ ventaId, open, onOpenChange }: Props) {
    const [loading, setLoading] = useState(false);
    const [venta, setVenta] = useState<any>(null);

    useEffect(() => {
        if (open && ventaId) {
            const cargarDetalle = async () => {
                setLoading(true);
                try {
                    const data = await VentasService.getVentaById(ventaId);
                    setVenta(data);
                } catch (error) {
                    console.error("Error al cargar detalle:", error);
                } finally {
                    setLoading(false);
                }
            };
            cargarDetalle();
        }
    }, [open, ventaId]);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-3xl">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold">
                        Detalle de Venta #{ventaId}
                    </DialogTitle>
                    <DialogDescription>Resumen completo de la transacción.</DialogDescription>
                    {venta && <BtnVerPDF venta={venta} />}
                </DialogHeader>

                <DialogDescription>
                    Información detallada de la transacción y productos asociados.
                </DialogDescription>

                {loading ? (
                    <div className="flex justify-center py-10"><Loader2 className="animate-spin" /></div>
                ) : venta ? (
                    <div className="space-y-6">
                        {/* Cabecera del Detalle */}
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <p className="text-muted-foreground">Cliente</p>
                                <p className="font-semibold text-lg">{venta.cliente?.nombre || "Consumidor Final"}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-muted-foreground">Fecha</p>
                                <p className="font-semibold">{new Date(venta.fecha_venta).toLocaleString()}</p>
                            </div>
                            <div>
                                <p className="text-muted-foreground">Comprobante</p>
                                <Badge variant="outline">{venta.tipo_comprobante}</Badge>
                            </div>
                            <div className="text-right">
                                <p className="text-muted-foreground">Estado</p>
                                <Badge>{venta.estado}</Badge>
                            </div>
                        </div>

                        <Separator />

                        {/* Tabla de Productos */}
                        <div>
                            <h3 className="font-bold mb-3">Productos</h3>
                            <div className="border rounded-md">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Producto</TableHead>
                                            <TableHead className="text-center">Cant.</TableHead>
                                            <TableHead className="text-right">Precio</TableHead>
                                            <TableHead className="text-right">Subtotal</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {venta.venta_productos?.map((item: any) => (
                                            <TableRow key={item.id}>
                                                <TableCell>{item.producto?.nombre_producto}</TableCell>
                                                <TableCell className="text-center">{item.cantidad}</TableCell>
                                                <TableCell className="text-right">{venta.moneda} {item.precio_unitario.toFixed(2)}</TableCell>
                                                <TableCell className="text-right font-medium">{venta.moneda} {item.subtotal.toFixed(2)}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        </div>

                        {/* Resumen de Totales */}
                        <div className="flex justify-end">
                            <div className="w-48 space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span>Subtotal:</span>
                                    <span>{venta.moneda} {venta.subtotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>IGV:</span>
                                    <span>{venta.moneda} {venta.igv.toFixed(2)}</span>
                                </div>
                                <Separator />
                                <div className="flex justify-between font-bold text-lg">
                                    <span>Total:</span>
                                    <span>{venta.moneda} {venta.total_monto.toFixed(2)}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <p>No se pudo cargar la información.</p>
                )}
            </DialogContent>
        </Dialog>
    );
}