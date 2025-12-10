import ComprasLogistica from "@/components/common/Forms/Logistica/logisticaCompras-form"
import InventarioLogistica from "@/components/common/Forms/Logistica/logisticaInventario-form"
import Provedor from "@/components/common/Forms/Logistica/logisticaProvedores-form";
import { DashboardTabs } from "@/components/common/Dashboards/dashboard-tabs";
import { useQueryTabs } from "@/hooks/useQueryTabs";
import { TABS_CONFIG } from "@/config/tabs.config";

export default function LogisticaPage() {
  const { activeTab, setActiveTab } = useQueryTabs("compras");

  return (
    <div>
      <div className="inline-flex">
        <DashboardTabs
          activeTab={activeTab}
          onChange={setActiveTab}
          tabs={TABS_CONFIG.logistica}
        />
      </div>

      <div className="mt-4">
        {activeTab === "compras" && <ComprasLogistica />}
        {activeTab === "inventario" && <InventarioLogistica />}
        {activeTab === "proveedores" && <Provedor />}
      </div>
    </div>
  );
}
