// src/layout/dashboard.layout.tsx
import { Outlet } from "react-router-dom";
import DashboardSidebar from "@/components/common/Dashboards/dashboard.sidebar";
import DashboardHeader from "@/components/common/Dashboards/dashboard.header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { useState } from "react";

export default function DashboardLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <SidebarProvider open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
      <div className="flex min-h-screen w-full">
        <DashboardSidebar />
          <SidebarInset className="relative">
          <DashboardHeader />
            <main className="flex-1 w-full p-6 overflow-auto bg-white">
            <Outlet />
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
