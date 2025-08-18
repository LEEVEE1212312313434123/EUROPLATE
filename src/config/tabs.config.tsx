import { List, Percent, BarChart } from "lucide-react";

export const TABS_CONFIG = {
  productos: [
    { value: "lista", label: "Lista Productos", icon: <List size={16} /> },
    { value: "descuentos", label: "Descontinuados", icon: <Percent size={16} /> },
  ],
  dashboard: [
    { value: "lista", label: "Lista", icon: <List size={16} /> },
    { value: "analisis", label: "Análisis", icon: <BarChart size={16} /> },
  ],
};
