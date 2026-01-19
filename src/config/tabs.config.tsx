import { List, PackageX, BarChart3, ShoppingCart, Package, Users, TrendingUp } from "lucide-react";

export const TABS_CONFIG = {
  productos: [
    { value: "lista", label: "Lista Productos", icon: <List size={16} /> },
    { value: "descuentos", label: "Descontinuados", icon: <PackageX size={16} /> },
  ],
  dashboard: [
    { value: "Ventas", label: "Venta", icon: <TrendingUp size={16} /> },
    { value: "Compras", label: "Compras", icon: <BarChart3 size={16} /> }, ,
  ],
  logistica: [
    { value: "compras", label: "Compras", icon: <ShoppingCart size={16} /> },
    { value: "inventario", label: "Inventario", icon: <Package size={16} /> },
    { value: "proveedores", label: "Proveedores", icon: <Users size={16} /> },
  ],
  ventas: [
    { value: "venta", label: "Ventas", icon: <List size={16} /> },
    { value: "notacredito", label: "Nota Crédito", icon: <PackageX size={16} /> },
    { value: "notadebito", label: "Nota Débito", icon: <PackageX size={16} /> },
  ],
};
