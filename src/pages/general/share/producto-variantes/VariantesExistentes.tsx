"use client"

import { Tag, Package } from "lucide-react"

import { useMoneda } from "@/pages/general/share/hooks/moneda.hook"

type Variante = {
    id: number
    sku: string | null
    precio_venta: number | null
    atributos: {
        nombre: string
        valor: string
    }[]
}

type Props = {
    variantes: Variante[]
}


export function VariantesExistentes({ variantes }: Props) {
    const { monedas } = useMoneda();

    const simbolo = monedas.find(m => m.codigo === 'PEN')?.simbolo || "$";
    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between border-b pb-2">
                <h2 className="font-bold text-xl flex items-center gap-2 text-slate-800">
                    <Package className="h-5 w-5 text-indigo-600" />
                    Variantes registradas
                </h2>
                <span className="text-xs font-medium bg-slate-100 text-slate-600 px-2.5 py-0.5 rounded-full border">
                    {variantes.length} {variantes.length === 1 ? 'variante' : 'variantes'}
                </span>
            </div>

            {variantes.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 border-2 border-dashed rounded-xl bg-slate-50/50">
                    <Package className="h-10 w-10 text-slate-300 mb-2" />
                    <p className="text-slate-500 font-medium">No hay variantes configuradas aún</p>
                    <p className="text-slate-400 text-sm">Las nuevas variantes aparecerán aquí.</p>
                </div>
            ) : (
                <div className="grid gap-3">
                    {variantes.map((v) => (
                        <div
                            key={v.id}
                            className="group bg-white border border-slate-200 p-4 rounded-xl shadow-sm hover:shadow-md hover:border-indigo-200 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
                        >
                            <div className="space-y-2">
                                <div className="flex items-center gap-3">
                                    <span className="text-xs font-mono font-bold bg-slate-800 text-white px-2 py-0.5 rounded shadow-sm">
                                        {v.sku ?? "SIN SKU"}
                                    </span>
                                </div>

                                <div className="flex flex-wrap gap-2">
                                    {v.atributos.map((a) => (
                                        <div
                                            key={a.nombre}
                                            className="inline-flex items-center gap-1.5 bg-indigo-50 border border-indigo-100 text-indigo-700 px-2 py-1 rounded-md text-xs font-medium"
                                        >
                                            <Tag className="h-3 w-3 opacity-60" />
                                            <span className="opacity-70">{a.nombre}:</span>
                                            <span className="font-semibold">{a.valor}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="flex items-center justify-between md:justify-end md:gap-8 border-t md:border-t-0 pt-3 md:pt-0">
                                <div className="flex flex-col items-end">
                                    <span className="text-xs text-slate-400 uppercase font-bold tracking-tighter">Precio de venta</span>
                                    <div className="flex items-center gap-1 text-lg font-bold text-emerald-600">
                                        <span className="text-md">{simbolo}</span>
                                        {v.precio_venta?.toLocaleString('en-US', { minimumFractionDigits: 2 }) ?? "0.00"}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}