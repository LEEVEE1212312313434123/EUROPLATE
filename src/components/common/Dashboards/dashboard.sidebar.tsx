import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Link, useLocation } from "react-router-dom";
import { dashboardRoutes } from "@/config/dashboard.routes";

export default function Sidebar() {
  const menuItems = dashboardRoutes.filter((route) => route.showInSidebar);
  const location = useLocation();

  return (
    <aside className="w-64 border-r bg-primary text-primary-foreground flex flex-col">
      <div className="h-20 flex items-center justify-start pl-7 border-b font-bold text-2xl">
        EUROPLATE
      </div>

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
                          : ""
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
    </aside>
  );
}
