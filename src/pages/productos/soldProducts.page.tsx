import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { DashboardMenu } from "@/components/common/dashbord-menu";

export default function SoldProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const tabParam = searchParams.get("tab");

  // Validar el tab actual, default "lista"
  const activeTab = tabParam === "analisis" ? "analisis" : "lista";

  // Cambiar el tab actual y actualizar query param
  const setActiveTab = (tab: "lista" | "analisis") => {
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
      <h1 className="text-xl font-bold mb-4">Productos Vendidos</h1>

      <div className="flex gap-4 border-b pb-2 mb-4">
        <button
          className={`px-3 py-1 border rounded cursor-pointer ${
            activeTab === "lista" ? "bg-primary text-white" : ""
          }`}
          onClick={() => setActiveTab("lista")}
        >
          Lista
        </button>

        <button
          className={`px-3 py-1 border rounded cursor-pointer ${
            activeTab === "analisis" ? "bg-primary text-white" : ""
          }`}
          onClick={() => setActiveTab("analisis")}
        >
          Análisis
        </button>
      </div>

      {activeTab === "lista" && <DashboardMenu />}

      {activeTab === "analisis" && (
        <div className="max-w-4xl mx-auto p-8 bg-background rounded-xl shadow-xl border border-border">
          <h2 className="text-4xl font-extrabold text-foreground mb-6 border-b-4 border-primary pb-2">
            VISTA DE ANALITICAS
          </h2>
          <p className="text-muted-foreground text-lg mb-8">
            Aqui puedes ver los analiticas y rendimiento y otras mediciones
            importantes con total claridad.
          </p>

          <ul className="grid grid-cols-1 md:grid-cols-2 gap-8 text-gray-800">
            <li className="bg-indigo-50 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
              <h3 className="text-xl font-semibold mb-2">VENTAS TOTALES</h3>
              <p className="text-indigo-700 text-3xl font-bold">$500</p>
            </li>
            <li className="bg-yellow-50 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
              <h3 className="text-xl font-semibold mb-2">
                PRODUCTOS MEJOR VENDIDOS
              </h3>
              <p className="text-yellow-700 text-3xl font-bold">Producto A</p>
            </li>
            <li className="bg-green-50 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
              <h3 className="text-xl font-semibold mb-2">
                DESCUENTOS APLICADOS
              </h3>
              <p className="text-green-700 text-3xl font-bold">20%</p>
            </li>
            <li className="bg-red-50 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
              <h3 className="text-xl font-semibold mb-2">
                VALOR PROMEDIO DE VENTA
              </h3>
              <p className="text-red-700 text-3xl font-bold">$120</p>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}
