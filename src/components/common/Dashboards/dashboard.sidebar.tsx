import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { Link, useLocation } from "react-router-dom";
import { dashboardRoutes } from "@/config/dashboard.routes";

export default function DashboardSidebar() {
  const menuItems = dashboardRoutes.filter((route) => route.showInSidebar);
  const location = useLocation();

  return (
    <Sidebar className="bg-primary text-primary-foreground z-40 shadow-md">
      <SidebarHeader className="h-20 flex items-start pl-5 pt-6 border-b font-bold text-2xl bg-primary text-white">
        EUROPLATE
      </SidebarHeader>


      <SidebarContent className="bg-primary">
        <SidebarGroup>
          <SidebarGroupContent className="mt-25">
            <SidebarMenu>
              {menuItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <SidebarMenuItem key={item.path}>
                    <Link to={item.path}>
                      <SidebarMenuButton
                        tooltip={item.title}
                        className={`pl-5 cursor-pointer ${
                          isActive
                            ? "bg-secondary text-secondary-foreground font-semibold"
                            : "text-primary-foreground"
                        }`}
                      >
                        {item.icon && <item.icon className="mr-1" />}
                        <span>{item.title}</span>
                      </SidebarMenuButton>
                    </Link>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarRail className="bg-primary" />
    </Sidebar>
  );
}
