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
import AgregarProductosPage from "@/pages/productos/Agregar.Productos";
import AgregarProductosStep1 from "@/pages/productos/Agregar-productos-stp1.page";

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
    title: "Agregar Producto stp 1",
    path: "/productos/agregar1",
    icon: IconPackage,
    element: <AgregarProductosStep1 />,
    showInSidebar: false, // 👈 ocultamos del sidebar
  },
  {
    title: "Agregar Producto",
    path: "/productos/agregar2",
    icon: IconPackage,
    element: <AgregarProductosPage />,
    showInSidebar: false, // 👈 ocultamos del sidebar
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
