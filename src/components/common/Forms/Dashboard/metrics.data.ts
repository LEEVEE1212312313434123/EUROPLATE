export type TrendType = "up" | "down";

export interface DashboardMetric {
  id: string;
  title: string;
  value: string;
  trendValue: string;
  trendType: TrendType;
  highlight: string;
  description: string;
}

export const METRICS: DashboardMetric[] = [
  {
    id: "revenue",
    title: "Total Ventas",
    value: "S/ 25,000",
    trendValue: "+12.5%",
    trendType: "up",
    highlight: "Total de ventas de Enero",
    description: "Crecimiento del 12.5% con respecto al mes pasado",
  },
  {
    id: "customers",
    title: "Total Compras",
    value: "S/ 10,000",
    trendValue: "-20%",
    trendType: "down",
    highlight: "Total de Compras de Enero",
    description: "Reduccion del 20.5% con respecto al mes pasado",
  },
  {
    id: "accounts",
    title: "Stock Crítico",
    value: "5",
    trendValue: "+12.5%",
    trendType: "up",
    highlight: "Strong user retention",
    description: "Engagement exceed targets",
  },
  {
    id: "growth",
    title: "Growth Rate",
    value: "4.5%",
    trendValue: "+4.5%",
    trendType: "up",
    highlight: "Steady performance increase",
    description: "Meets growth projections",
  },
];
