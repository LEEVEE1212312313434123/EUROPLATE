import { ResourcePage } from "@/components/common/ResourcePage"
import { MetricCard } from "./MetricCard"
import { METRICS } from "./metrics.data"
import { VisitorsBarChart } from "./VisitorsBarChart"

export function DashboardForm() {
  return (
    <ResourcePage
      title="Dashboard"
      subtitle="Visualiza desde aquí los principales indicadores de tu negocio"
      isLoading={false}
    >
      <section className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 px-4 lg:px-6">
        {METRICS.map((metric) => (
          <MetricCard key={metric.id} metric={metric} size="sm" />
        ))}
      </section>
      <section className="mt-6 px-4 lg:px-6">
        <VisitorsBarChart />
      </section>
    </ResourcePage>
  )
}
