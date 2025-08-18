import { Outlet } from "react-router-dom";
import Sidebar from "@/components/common/Dashboards/dashboard.sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import DashboardHeader from "@/components/common/Dashboards/dashboard.header";

export default function DashboardLayout() {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <Sidebar />
        <div className="flex flex-col flex-1 w-full min-h-screen">
          <DashboardHeader />

          <main className="flex-1 w-full p-6 overflow-auto">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
