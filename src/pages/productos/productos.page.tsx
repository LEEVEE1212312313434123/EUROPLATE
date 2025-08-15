import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { DashboardProducts } from "@/components/common/dashboard-products";
import { DashboardProductsDiscount } from "@/components/common/dashboard-products-discount";

export default function ProductosPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const tabParam = searchParams.get("tab");

  // Validar el tab actual, default "lista"
  const activeTab = tabParam === "descuentos" ? "descuentos" : "lista";

  // Cambiar el tab actual y actualizar query param
  const setActiveTab = (tab: "lista" | "descuentos") => {
    setSearchParams({ tab });
  };

  useEffect(() => {
    // Si no hay query param, lo ponemos por defecto para que se refleje en URL
    if (!tabParam) {
      setSearchParams({ tab: "lista" });
    }
  }, [tabParam, setSearchParams]);

  return (
    <div>
      <h1 className="text-xl font-bold mb-4">Lista de Productos</h1>

      <div className="flex gap-4 border-b pb-2 mb-4">
        <button
          className={`px-3 py-1 border rounded cursor-pointer ${
            activeTab === "lista" ? "bg-primary text-white" : ""
          }`}
          onClick={() => setActiveTab("lista")}
        >
          Lista Productos
        </button>

        <button
          className={`px-3 py-1 border rounded cursor-pointer ${
            activeTab === "descuentos" ? "bg-primary text-white" : ""
          }`}
          onClick={() => setActiveTab("descuentos")}
        >
          Descuentos
        </button>
      </div>

      {activeTab === "lista" && <DashboardProducts />}

      {activeTab === "descuentos" && <DashboardProductsDiscount />}
    </div>
  );
}
