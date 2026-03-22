"use client"

import { useEffect, useState } from "react";
import { ventaService } from "@/services/general/venta.service";
import { processDashboardMetrics, prepareChartData } from "@/services/dashboard/dashboard.adapter";
import { StatCard } from "@/components/common/Forms/Dashboard/StatCard";
import { VisitorsBarChart } from "@/components/common/Forms/Dashboard/VisitorsBarChart";
import { Loader2 } from "lucide-react";

export default function DashboardForm() {
  const [data, setData] = useState<{ metrics: any[], chart: any[] }>({ metrics: [], chart: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const rawVentas = await ventaService.obtenerVentas();
        setData({
          metrics: processDashboardMetrics(rawVentas),
          chart: prepareChartData(rawVentas)
        });
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading) return (
    <div className="flex h-96 items-center justify-center">
      <Loader2 className="w-8 h-8 animate-spin text-primary" />
    </div>
  );

  return (
    <div className="p-6 space-y-8 bg-slate-50/50 min-h-screen">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Resumen Ejecutivo</h1>
        <p className="text-slate-500">Monitoreo de ingresos y transacciones en tiempo real</p>
      </div>

      {/* Grid de Métricas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {data.metrics.map((m, idx) => (
          <StatCard key={idx} item={m} />
        ))}
      </div>

      {/* Gráfico */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <div className="mb-6">
          <h2 className="text-lg font-bold text-slate-800">Flujo de Ingresos</h2>
          <p className="text-sm text-slate-500">Monto total vendido por día</p>
        </div>
        <VisitorsBarChart externalData={data.chart} />
      </div>
    </div>
  );
}