import { useEffect, useState } from "react";
import { ResourcePage } from "@/components/common/ResourcePage";
import { MetricCard } from "./MetricCard";
import { VisitorsBarChart } from "./VisitorsBarChart";
import { ComprasService } from "@/services/compras/compras.service";

export function DashboardComprasForm() {
    const [loading, setLoading] = useState(true);
    const [metrics, setMetrics] = useState<any[]>([]);
    const [chartData, setChartData] = useState<any[]>([]);

    useEffect(() => {
        async function loadDashboardData() {
            try {
                setLoading(true);

                // 1. Obtenemos las métricas de inversión (Kpis)
                const stats = await ComprasService.getStatsParaDashboard();

                // 2. Obtenemos los datos para el gráfico (Costos por fecha de llegada)
                const chart = await ComprasService.getChartData();

                setMetrics(stats);
                setChartData(chart);
            } catch (error) {
                console.error("Error cargando dashboard de compras:", error);
            } finally {
                setLoading(false);
            }
        }
        loadDashboardData();
    }, []);

    return (
        <ResourcePage
            title="Dashboard de Compras e Importaciones"
            subtitle="Seguimiento de inversión y reabastecimiento de inventario"
            isLoading={loading}
        >
            {/* Sección de Métricas de Compra */}
            <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 px-4 lg:px-6">
                {metrics.map((metric) => (
                    <MetricCard key={metric.id} metric={metric} size="sm" />
                ))}
            </section>

            {/* Gráfico de Flujo de Gastos (Basado en importaciones) */}
            <section className="mt-6 px-4 lg:px-6">
                <VisitorsBarChart
                    externalData={chartData}
                />
            </section>
        </ResourcePage>
    );
}