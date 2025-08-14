import {
  IconPackage,IconHome, IconUsers, IconTruck,IconShoppingCart,IconSettings
} from "@tabler/icons-react"
import ProductosPage from "@/pages/productos/productos.page"

export const dashboardRoutes = [
  {
    title: "Dashboard",
    path: "/dashboard",
    icon: IconHome,
    element: <ProductosPage />,
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
    element: <ProductosPage />,
    showInSidebar: true,
  },
  {
    title: "Logística",
    path: "/logistica",
    icon: IconTruck,
    element: <ProductosPage />,
    showInSidebar: true,
  },
  {
    title: "Ventas",
    path: "/ventas",
    icon: IconShoppingCart,
    element: <ProductosPage />,
    showInSidebar: true,
  },
  {
    title: "Configuración",
    path: "/configuracion",
    icon: IconSettings,
    element: <ProductosPage />,
    showInSidebar: true,
  }
]
