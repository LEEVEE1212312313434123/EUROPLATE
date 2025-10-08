import {
  IconPackage,
  IconHome,
  IconUsers,
  IconTruck,
  IconShoppingCart,
  IconSettings,
} from "@tabler/icons-react";
import ProductosPage from "@/pages/productos/productos.page";
import EjemploPage from "@/pages/ejemplo.page";
import AgregarProductosStep1 from "@/pages/productos/productos.add.page";
import LogisticaPage from "@/pages/logistica/logistica.page"
import AgregarLogistica from "@/pages/logistica/logistica.addpage";
import ClientesPage from "@/pages/clientes/clientes.page"


export const dashboardRoutes = [
  {
    key: "dashboard",   
    title: "Dashboard",
    path: "/dashboard",
    icon: IconHome,
    element: <EjemploPage />,
    showInSidebar: true,
  },
  {
    key: "productos",   
    title: "Productos",
    path: "/products",
    icon: IconPackage,
    element: <ProductosPage />,
    showInSidebar: true,
  },
  {
    title: "Agregar Producto",
    path: "/products/addProducts",
    icon: IconPackage,
    element: <AgregarProductosStep1 />,
    showInSidebar: false,
    parent: "/products",
  },
  {
    title: "Clientes",
    path: "/clientes",
    icon: IconUsers,
    element: <ClientesPage />,
    showInSidebar: true,
  },
  {
    key: "logistica",   
    title: "Logística",
    path: "/logistica",
    icon: IconTruck,
    element: <LogisticaPage />,
    showInSidebar: true,
  },
  {
    title: "Agregar Importacion",
    path: "/logistica/addimport",
    icon: IconPackage,
    element: <AgregarLogistica />,
    showInSidebar: false,
    parent: "/logistica",
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
