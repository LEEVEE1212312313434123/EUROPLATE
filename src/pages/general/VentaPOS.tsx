"use client"

import { useEffect, useState } from "react"

import { productoVariantesService } from "@/services/general/productoVariantes.service"
import { ventaService } from "@/services/general/venta.service"

import ClienteFormSelector from "@/pages/general/share/ClienteFormSelector"

import POSProductos from "@/pages/general/share/ventas/POSProductos"
import POSCarrito from "@/pages/general/share/ventas/POSCarrito"
import POSComprobante from "@/pages/general/share/ventas/POSComprobante"
import POSFinalizar from "@/pages/general/share/ventas/POSFinalizar"

export default function VentaPOS() {
    const [productos, setProductos] = useState<any[]>([])
    const [carrito, setCarrito] = useState<any[]>([])
    const [clienteId, setClienteId] = useState<number | null>(null)

    const [tipoComprobante, setTipoComprobante] = useState("BOLETA")
    const [pagos, setPagos] = useState([
        {
            metodo_pago: "EFECTIVO",
            monto: 0
        }
    ])

    const [loading, setLoading] = useState(false)

    useEffect(() => {
        loadProductos()
    }, [])

    async function loadProductos() {

        const data =
            await productoVariantesService.obtenerVariantesPorTipo()

        setProductos(data)
    }

    function agregarProducto(variante: any) {
        const existe = carrito.find(p => p.variante_id === variante.id)

        if (existe) {
            setCarrito(
                carrito.map(p =>
                    p.variante_id === variante.id
                        ? { ...p, cantidad: p.cantidad + 1 }
                        : p
                )
            )
        } else {
            setCarrito([
                ...carrito,
                {
                    variante_id: variante.id,
                    // CAMBIO: Deja solo el nombre aquí
                    nombre: variante.producto_nombre ?? "Producto sin nombre",
                    // CAMBIO: Agrega la propiedad sku explícitamente
                    sku: variante.sku,
                    precio: variante.precio_venta,
                    cantidad: 1,
                    almacen_id: 1
                }
            ])
        }
    }

    const total =
        carrito.reduce(
            (acc, item) =>
                acc + item.precio * item.cantidad,
            0
        )

    async function crearVenta() {

        if (carrito.length === 0) {
            alert("El carrito está vacío")
            return
        }

        if (!clienteId) {
            alert("Debe seleccionar un cliente")
            return
        }

        const totalPagado =
            pagos.reduce((acc, p) => acc + Number(p.monto || 0), 0)

        if (totalPagado < total) {
            alert("El pago es menor al total")
            return
        }

        if (totalPagado > total) {
            alert("El pago supera el total")
            return
        }

        for (const pago of pagos) {

            if (!pago.metodo_pago) {
                alert("Debe seleccionar método de pago")
                return
            }

            if (!pago.monto || pago.monto <= 0) {
                alert("Monto de pago inválido")
                return
            }

        }

        try {

            setLoading(true)

            const payload = {

                venta: {
                    cliente_id: clienteId,
                    tipo_comprobante: tipoComprobante,
                    moneda_id: 1,
                    tipo_cambio: 1
                },

                detalles: carrito,

                pagos: pagos.map(p => ({
                    metodo_pago: p.metodo_pago,
                    monto: p.monto,
                    moneda_id: 1
                }))

            }

            const venta =
                await ventaService.crearVenta(payload)

            alert("Venta creada #" + venta.id)

            setCarrito([])
            setClienteId(null)

        } catch (error: any) {

            alert(error.message)

        } finally {

            setLoading(false)

        }

    }

    return (

        <div className="grid grid-cols-3 gap-6 p-6">

            <POSProductos
                productos={productos}
                onAgregar={agregarProducto}
            />

            <div className="space-y-4">

                <ClienteFormSelector
                    clienteId={clienteId}
                    onChange={setClienteId}
                />

                <POSCarrito
                    carrito={carrito}
                    setCarrito={setCarrito}
                />

                <POSComprobante
                    tipoComprobante={tipoComprobante}
                    setTipoComprobante={setTipoComprobante}
                    pagos={pagos}
                    setPagos={setPagos}
                />

                <POSFinalizar
                    loading={loading}
                    onFinalizar={crearVenta}
                />

            </div>

        </div>

    )
}