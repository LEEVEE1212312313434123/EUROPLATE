import { DashboardTabs } from "@/components/common/Dashboards/dashboard-tabs";
import { useQueryTabs } from "@/hooks/useQueryTabs";
import { TABS_CONFIG } from "@/config/tabs.config";
import { NotasDebitoForm } from "@/components/common/Forms/Ventas/notasdebito-form";
import { VentasForm } from "@/components/common/Forms/Ventas/ventas-form";
import { NotasCreditoForm } from "@/components/common/Forms/Ventas/notascredito-form";

export function VentasPage() {
  const { activeTab, setActiveTab } = useQueryTabs("venta");
  return (
    <div>
      <div className="inline-flex">
        <DashboardTabs
          activeTab={activeTab}
          onChange={setActiveTab}
          tabs={TABS_CONFIG.ventas}
        />
      </div>

      <div className="mt-4">
        {activeTab === "venta" && <VentasForm />}
        {activeTab === "notacredito" && <NotasCreditoForm />}
        {activeTab === "notadebito" && <NotasDebitoForm />}
      </div>
    </div>
  );
}