  import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
  } from "@/components/ui/breadcrumb";
  import { Bell, Home } from "lucide-react";
  import { useLocation } from "react-router-dom";
  import { dashboardRoutes } from "@/config/dashboard.routes";
  import { getTabLabel } from "@/utils/getTabLabel";
  import { useAuth } from "@/hooks/useAuth";

  export default function DashboardHeader() {
    const location = useLocation();
    const { user } = useAuth();

    const currentRoute = dashboardRoutes.find(
      (route) => route.path === location.pathname
    );

    const parentRoute = currentRoute?.parent
      ? dashboardRoutes.find((route) => route.path === currentRoute.parent)
      : null;

    const searchParams = new URLSearchParams(location.search);
    const tab = searchParams.get("tab");
    const tabLabel = currentRoute?.key ? getTabLabel(currentRoute.key, tab) : null;

    return (
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

            {parentRoute && (
              <>
                <BreadcrumbSeparator />
                <BreadcrumbLink
                  href={parentRoute.path}
                  className="text-primary font-semibold"
                >
                  {parentRoute.title}
                </BreadcrumbLink>
              </>
            )}

            {currentRoute && (
              <>
                <BreadcrumbSeparator />
                <BreadcrumbPage className="text-primary font-semibold">
                  {currentRoute.title}
                </BreadcrumbPage>
              </>
            )}

            {tabLabel && (
              <>
                <BreadcrumbSeparator />
                <BreadcrumbPage className="text-primary font-semibold">
                  {tabLabel}
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

          {user ? (
            <div className="flex items-center gap-2 cursor-pointer hover:opacity-80">
              <img
                src={user.profileIcon}
                alt={user.firstName}
                className="w-8 h-8 rounded-full object-cover"
              />
              <span className="font-medium">
                {user.firstName} {user.lastName}
              </span>
            </div>
          ) : (
            <span className="text-sm text-gray-500">No autenticado</span>
          )}
        </div>
      </header>
    );
  }
