import { Outlet, useLocation } from "react-router-dom"
import Sidebar from "@/components/common/sidebar"
import { SidebarProvider } from "@/components/ui/sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Bell, Home } from "lucide-react"
import { dashboardRoutes } from "@/config/dashboard-routes"

export default function DashboardLayout() {
  const location = useLocation()

  // Buscar la ruta actual en dashboardRoutes
  const currentRoute = dashboardRoutes.find(
    (route) => route.path === location.pathname
  )

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <Sidebar />
        <div className="flex flex-col flex-1 w-full min-h-screen">
          {/* Barra superior */}
          <header className="h-20 border-b flex items-center justify-between px-6 bg-white w-full">
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink
                    href="/dashboard"
                    className="text-primary font-semibold"
                  >
                    <Home size={16} strokeWidth={2} aria-hidden="true" />
                  </BreadcrumbLink>
                </BreadcrumbItem>

                {currentRoute && (
                  <>
                    <BreadcrumbSeparator />
                    <BreadcrumbPage className="text-primary font-semibold">
                      {currentRoute.title}
                    </BreadcrumbPage>
                  </>
                )}
              </BreadcrumbList>
            </Breadcrumb>

            <div className="flex items-center gap-4">
              <button className="relative p-2 rounded-full hover:bg-gray-100 cursor-pointer">
                <Bell size={20} />
                <span className="sr-only">Notificaciones</span>
              </button>
              <div className="flex items-center gap-2 cursor-pointer hover:opacity-80">
                <div className="w-8 h-8 rounded-full bg-gray-300"></div>
                <span className="font-medium">Miguel</span>
              </div>
            </div>
          </header>

          <main className="flex-1 w-full p-6 overflow-auto">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}
