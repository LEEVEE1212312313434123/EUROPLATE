"use client"

import { useEffect, useState } from "react";
import { Loader2, TrendingUp } from "lucide-react";
import { StatCard } from "./StatCard";
import { VisitorsBarChart } from "@/components/common/Forms/Dashboard/VisitorsBarChart";
import { comprasService } from "@/services/general/compras.service";

export default function DashboardComprasForm() {
    const [data, setData] = useState<{ metrics: any[], chart: any[] }>({ metrics: [], chart: [] });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadData() {
            try {
                setLoading(true);
                const result = await comprasService.getDashboardData();
                setData(result);
            } catch (e) {
                console.error("Error cargando dashboard:", e);
            } finally {
                setLoading(false);
            }
        }
        loadData();
    }, []);

    if (loading) return (
        <div className="flex h-[80vh] w-full items-center justify-center">
            <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
        </div>
    );

    return (
        <div className="min-h-screen bg-slate-50/30 p-4 md:p-8 space-y-8">
            {/* Header con Filtros de tiempo */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Gestión de Compras</h1>
                    <p className="text-slate-500 text-sm">Análisis de inversión con conversión a soles.</p>
                </div>

                <div className="flex items-center gap-2 bg-white p-1 rounded-lg border shadow-sm text-xs font-semibold">
                    {["7 días", "30 días", "3 meses", "12 meses"].map((range) => (
                        <button
                            key={range}
                            className="px-3 py-1.5 hover:bg-slate-100 rounded-md transition-colors text-slate-600"
                        >
                            {range}
                        </button>
                    ))}
                </div>
            </div>

            {/* Grid de Metricas */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {data.metrics.map((m) => (
                    <StatCard key={m.id} item={m} />
                ))}
            </div>

            {/* Gráfico Principal */}
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-emerald-50 rounded-lg">
                            <TrendingUp className="w-5 h-5 text-emerald-600" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-slate-800">Flujo de Salida de Capital</h2>
                            <p className="text-sm text-slate-500">Inversión acumulada por fecha (Soles S/)</p>
                        </div>
                    </div>
                </div>

                <div className="h-[400px]">
                    <VisitorsBarChart
                        externalData={data.chart}
                        title="Compras Registradas"
                        description="Total invertido por día"
                        tooltipLabel="Inversión del día"
                        barLabel="Compras (S/)"
                    />
                </div>
            </div>
        </div>
    );
}