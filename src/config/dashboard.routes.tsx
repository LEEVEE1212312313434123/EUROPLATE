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
import LogisticaAddNacional from "@/pages/logistica/LogisticaAddNational";

import ClientesPage from "@/pages/clientes/clientes.page";
import EditarLogistica from "@/pages/logistica/logistica.edit";
import BuildForm from "@/components/common/Forms/Build-form";
import { VentasPage } from "@/pages/ventas/ventas.page";
import { NotasCreditoForm } from "@/pages/ventas/NotasCreditoForm";
import { NotasDebitoForm } from "@/pages/ventas/NotasDebitoForm";

import VentasView from "@/components/common/Ventas/VentasView";
import { DashboardPage } from "@/pages/dashboard/dashboard.page";

export const dashboardRoutes = [
  {
    key: "dashboard",
    title: "Dashboard",
    path: "/dashboard",
    icon: IconHome,
    element: <DashboardPage />,
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
    title: "Compra Nacional",
    path: "/logistica/addnational",
    icon: IconPackage,
    element: <LogisticaAddNacional />,
    showInSidebar: false,
    parent: "/logistica",
  },
  {
    title: "Editar Importación",
    path: "/logistica/editimport",
    icon: IconPackage,
    element: <EditarLogistica />,
    showInSidebar: false,
    parent: "/logistica",
  },
  {
    title: "Ventas",
    path: "/ventas",
    icon: IconShoppingCart,
    element: <VentasPage />,
    showInSidebar: true,
  },
  {
    title: "Registrar Venta",
    path: "/ventas/add",
    icon: IconShoppingCart,
    element: <VentasView />,
    showInSidebar: false,
    parent: "/ventas",
  },
  {
    title: "Emitir Nota de Crédito",
    path: "/ventas/nota-credito/:ventaId", // :ventaId es el parámetro dinámico
    icon: IconShoppingCart,
    element: <NotasCreditoForm />,
    showInSidebar: false,
    parent: "/ventas",
  },
  {
    title: "Emitir Nota de Débito",
    path: "/ventas/nota-debito/:ventaId",
    icon: IconShoppingCart,
    element: <NotasDebitoForm />,
    showInSidebar: false,
    parent: "/ventas",
  },
  {
    title: "Configuración",
    path: "/configuracion",
    icon: IconSettings,
    element: <BuildForm />,
    showInSidebar: false,
  },
];
