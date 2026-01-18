import { useEffect, useState } from "react";
import { ResourcePage } from "@/components/common/ResourcePage";
import { MetricCard } from "./MetricCard";
import { VisitorsBarChart } from "./VisitorsBarChart";
import { VentasService } from "@/services/ventas/venta.service";
import { processDashboardStats, prepareChartData } from "@/services/dashboard/dashboard.adapter";

export function DashboardForm() {
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState<any[]>([]);
  const [chartData, setChartData] = useState<any[]>([]);

  useEffect(() => {
    async function loadDashboardData() {
      try {
        setLoading(true);
        const rawVentas = await VentasService.getAll();

        setMetrics(processDashboardStats(rawVentas));
        setChartData(prepareChartData(rawVentas));
      } catch (error) {
        console.error("Error cargando dashboard:", error);
      } finally {
        setLoading(false);
      }
    }
    loadDashboardData();
  }, []);

  return (
    <ResourcePage
      title="Dashboard de Ventas"
      subtitle="Indicadores de rendimiento basados en ventas reales"
      isLoading={loading}
    >
      <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 px-4 lg:px-6">
        {metrics.map((metric) => (
          <MetricCard key={metric.id} metric={metric} size="sm" />
        ))}
      </section>

      <section className="mt-6 px-4 lg:px-6">
        {/* Pasamos los datos reales al gráfico */}
        <VisitorsBarChart externalData={chartData} />
      </section>
    </ResourcePage>
  );
}