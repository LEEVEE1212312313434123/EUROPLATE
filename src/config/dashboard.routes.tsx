import {
  IconPackage,
  IconHome,
  IconUsers,
  IconTruck,
  IconShoppingCart,
  IconSettings,
} from "@tabler/icons-react";
import ProductosPage from "@/pages/productos/productos.page";
import AgregarProductosStep1 from "@/pages/productos/productos.add.page";
import EditarProductosStep1 from "@/pages/productos/productos.edit.page";
import LogisticaPage from "@/pages/logistica/logistica.page";
import AgregarLogistica from "@/pages/logistica/logistica.addpage";
import ClientesPage from "@/pages/clientes/clientes.page";
import Dashboardform from "@/components/common/Forms/Dashboard/dashboard-form";

export const dashboardRoutes = [
  {
    key: "dashboard",
    title: "Dashboard",
    path: "/dashboard",
    icon: IconHome,
    element: <Dashboardform />,
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
    title: "Editar Producto",
    path: "/products/editProducts",
    icon: IconPackage,
    element: <EditarProductosStep1 />,
    showInSidebar: false,
    parent: "/products",
  },
  {
    title: "Clientes",
    path: "/clientes",
    icon: IconUsers,
    element: <ClientesPage />,
    showInSidebar: false,
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
    element: <Dashboardform />,
    showInSidebar: false,
  },
  {
    title: "Configuración",
    path: "/configuracion",
    icon: IconSettings,
    element: <Dashboardform />,
    showInSidebar: false,
  },
];
