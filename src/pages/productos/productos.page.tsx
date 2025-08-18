import { ProductsForm } from "@/components/common/Forms/products-form";
import { DashboardProductsDiscount } from "@/components/common/Forms/products-Discotinued-form";
import { DashboardTabs } from "@/components/common/Dashboards/dashboard-tabs";
import { useQueryTabs } from "@/hooks/useQueryTabs";
import { TABS_CONFIG } from "@/config/tabs.config";

export default function ProductosPage() {
  const { activeTab, setActiveTab } = useQueryTabs("lista");

  return (
    <div>
      <div className="inline-flex">
        <DashboardTabs
          activeTab={activeTab}
          onChange={setActiveTab}
          tabs={TABS_CONFIG.productos}
        />
      </div>

      <div className="mt-4">
        {activeTab === "lista" && <ProductsForm />}
        {activeTab === "descuentos" && <DashboardProductsDiscount />}
      </div>
    </div>
  );
}
