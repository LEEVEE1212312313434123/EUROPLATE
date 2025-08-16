import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { DashboardProducts } from "@/components/common/dashboard-products";
import { DashboardProductsDiscount } from "@/components/common/dashboard-products-discount";
import { DashboardTabs } from "@/components/common/dashboard-tabs";
import { List, Percent } from "lucide-react";

export default function ProductosPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const tabParam = searchParams.get("tab");

  const activeTab = tabParam === "descuentos" ? "descuentos" : "lista";

  const setActiveTab = (tab: string) => {
    setSearchParams({ tab });
  };

  useEffect(() => {
    if (!tabParam) {
      setSearchParams({ tab: "lista" });
    }
  }, [tabParam, setSearchParams]);

  const tabs = [
    { value: "lista", label: "Lista Productos", icon: <List size={16} /> },
    { value: "descuentos", label: "Descuentos", icon: <Percent size={16} /> },
  ];

  return (
  <div>
    <div className="inline-flex">
      <DashboardTabs activeTab={activeTab} onChange={setActiveTab} tabs={tabs} />
    </div>

    <div className="mt-4">
      {activeTab === "lista" && <DashboardProducts />}
      {activeTab === "descuentos" && <DashboardProductsDiscount />}
    </div>
  </div>
);
}
