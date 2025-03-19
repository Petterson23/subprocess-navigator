
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { 
  LayoutGrid, 
  Users, 
  Briefcase, 
  Layers, 
  Settings, 
  Menu, 
  X, 
  ChevronRight,
  Home
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

const menuItems = [
  {
    title: "Dashboard",
    icon: Home,
    path: "/"
  },
  {
    title: "Departamentos",
    icon: Briefcase,
    path: "/departments"
  },
  {
    title: "Processos",
    icon: Layers,
    path: "/processes"
  },
  {
    title: "Subprocessos",
    icon: LayoutGrid,
    path: "/subprocesses"
  },
  {
    title: "Pessoas",
    icon: Users,
    path: "/people"
  },
  {
    title: "Configurações",
    icon: Settings,
    path: "/settings"
  }
];

interface MainLayoutProps {
  children: React.ReactNode;
}

export const AppSidebar = () => {
  const location = useLocation();
  
  return (
    <Sidebar>
      <SidebarHeader className="px-4 py-6">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
            <Layers className="h-4 w-4 text-white" />
          </div>
          <span className="text-lg font-semibold">ProcessManager</span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu Principal</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.path}>
                  <SidebarMenuButton asChild className={cn(
                    "w-full justify-start",
                    location.pathname === item.path && "bg-accent"
                  )}>
                    <Link to={item.path} className="flex items-center">
                      <item.icon className="mr-2 h-4 w-4" />
                      <span>{item.title}</span>
                      {location.pathname === item.path && (
                        <ChevronRight className="ml-auto h-4 w-4" />
                      )}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <SidebarProvider>
      <div className="min-h-screen w-full flex">
        <AppSidebar />
        <div className="flex-1 overflow-auto">
          <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b">
            <div className="flex h-16 items-center px-6">
              <SidebarTrigger>
                <Button variant="ghost" size="icon" className="mr-4">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SidebarTrigger>
              <div className="ml-auto flex items-center space-x-2">
                <Button variant="ghost" size="icon">
                  <Users className="h-5 w-5" />
                  <span className="sr-only">User menu</span>
                </Button>
              </div>
            </div>
          </div>
          <main className="flex-1 p-6">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default MainLayout;
