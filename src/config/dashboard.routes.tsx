import {
  IconPackage,
  IconHome,
  IconUsers,
  IconTruck,
  IconShoppingCart,
  IconSettings,
} from "@tabler/icons-react";
import ProductosPage from "@/pages/productos/productos.page";
// import AgregarProductosStep1 from "@/pages/productos/productos.add.page";
import EditarProductosStep1 from "@/pages/productos/productos.edit.page";
import LogisticaPage from "@/pages/logistica/logistica.page";
import AgregarLogistica from "@/pages/logistica/logistica.addpage";
import LogisticaAddNacional from "@/pages/logistica/LogisticaAddNational";

import CrearCompra from "@/pages/general/CrearCompra"
import VentaPOS from "@/pages/general/VentaPOS"
import CrearNotaVenta from "@/pages/general/crearNotaVenta"
import EnglobarCreacionProducto from "@/pages/general/englobarCreacionProducto"


import ClientesPage from "@/pages/clientes/clientes.page";
import EditarLogistica from "@/pages/logistica/logistica.edit";
import BuildForm from "@/components/common/Forms/Build-form";
import { VentasPage } from "@/pages/ventas/ventas.page";
import { NotasCreditoForm } from "@/pages/ventas/NotasCreditoForm";
import { NotasDebitoForm } from "@/pages/ventas/NotasDebitoForm";
import { VentasSelectorNota } from "@/components/common/Forms/Ventas/VentasSelectorNota";
import VentasView from "@/components/common/Ventas/VentasView";
import { DashboardPage } from "@/pages/dashboard/dashboard.page";
import SettingsPage from "@/pages/settings/settings.page";
import MonedasPage from "@/pages/settings/monedas.page";
import ConfiguracionAvanzada from "@/pages/settings/configuracionAvanzada";

import TipoCambioPage from "@/pages/settings/tipo-cambio.page";

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
    element: <EnglobarCreacionProducto />,
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
    title: "Compra Nacional/Importacion",
    path: "/logistica/addbuy",
    icon: IconPackage,
    element: <CrearCompra />,
    showInSidebar: false,
    parent: "/logistica",
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
    title: "Crear Venta",
    path: "/ventas/crear-venta",
    icon: IconShoppingCart,
    element: <VentaPOS />,
    showInSidebar: false,
    parent: "/ventas",
  },
  {
    title: "Crear Nota de Venta",
    path: "/ventas/crear-notaventa",
    icon: IconShoppingCart,
    element: <CrearNotaVenta />,
    showInSidebar: false,
    parent: "/ventas",
  },
  {
    title: "Seleccionar tipo de nota",
    path: "/ventas/Seleccionar-tipo-de-nota",
    icon: IconShoppingCart,
    element: <VentasSelectorNota />,
    showInSidebar: false,
    parent: "/ventas",
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
    title: "no_Configuración",
    path: "/no_configuracion",
    icon: IconSettings,
    element: <BuildForm />,
    showInSidebar: false,
  },
  {
    title: "Configuración",
    path: "/configuracion",
    icon: IconSettings,
    element: <SettingsPage />,
    showInSidebar: true,
  },
  {
    title: "configuracion-avanzada",
    path: "/configuracion/configuracion-avanzada",
    icon: IconSettings,
    element: <ConfiguracionAvanzada />,
    showInSidebar: false,
    parent: "/configuracion",
  },
  {
    title: "monedas",
    path: "/configuracion/monedas",
    icon: IconSettings,
    element: <MonedasPage />,
    showInSidebar: false,
    parent: "/configuracion",
  },
  {
    title: "tipo cambio",
    path: "/configuracion/tipo-cambio",
    icon: IconSettings,
    element: <TipoCambioPage />,
    showInSidebar: false,
    parent: "/configuracion",
  },
];
