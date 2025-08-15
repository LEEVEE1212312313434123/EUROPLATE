import {
  IconPackage,
  IconHome,
  IconUsers,
  IconTruck,
  IconShoppingCart,
  IconSettings,
} from "@tabler/icons-react";
import ProductosPage from "@/pages/productos/productos.page";
import EjemploPage from "@/pages/productos/ejemplo.page";
import SoldProductsPage from "@/pages/productos/soldProducts.page";

export const dashboardRoutes = [
  {
    title: "Dashboard",
    path: "/dashboard",
    icon: IconHome,
    element: <SoldProductsPage />,
    showInSidebar: true,
  },
  {
    title: "Productos",
    path: "/productos",
    icon: IconPackage,
    element: <ProductosPage />,
    showInSidebar: true,
  },
  {
    title: "Clientes",
    path: "/clientes",
    icon: IconUsers,
    element: <EjemploPage />,
    showInSidebar: true,
  },
  {
    title: "Logística",
    path: "/logistica",
    icon: IconTruck,
    element: <EjemploPage />,
    showInSidebar: true,
  },
  {
    title: "Ventas",
    path: "/ventas",
    icon: IconShoppingCart,
    element: <EjemploPage />,
    showInSidebar: true,
  },
  {
    title: "Configuración",
    path: "/configuracion",
    icon: IconSettings,
    element: <EjemploPage />,
    showInSidebar: true,
  },
];
