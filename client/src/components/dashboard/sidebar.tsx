import { useAuth } from "@/hooks/use-auth";
import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import {
  Users,
  ClipboardList,
  BarChart2,
  Settings,
  LogOut,
  Home,
  Award,
  Mail,
  HelpCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export function Sidebar() {
  const { user, logoutMutation, isMentor } = useAuth();
  const [location] = useLocation();
  const { toast } = useToast();

  if (!user) return null;

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  const mentorNavItems = [
    {
      label: "Dashboard",
      icon: Home,
      href: "/mentor-dashboard",
    },
    {
      label: "Clientes",
      icon: Users,
      href: "/mentor-dashboard/clients",
    },
    {
      label: "Testes",
      icon: ClipboardList,
      href: "/mentor-dashboard/tests",
    },
    {
      label: "Análises",
      icon: BarChart2,
      href: "/mentor-dashboard/analytics",
    },
    {
      label: "Convites",
      icon: Mail,
      href: "/mentor-dashboard/invites",
    },
    {
      label: "Gamificação",
      icon: Award,
      href: "/mentor-dashboard/gamification",
    }
  ];

  const clientNavItems = [
    {
      label: "Dashboard",
      icon: Home,
      href: "/client-dashboard",
    },
    {
      label: "Meus Testes",
      icon: ClipboardList,
      href: "/client-dashboard/tests",
    },
    {
      label: "Resultados",
      icon: BarChart2,
      href: "/client-dashboard/results",
    }
  ];

  const navItems = isMentor ? mentorNavItems : clientNavItems;

  return (
    <div className="w-64 bg-sidebar h-full flex flex-col border-r border-slate-200 hidden md:flex">
      <div className="p-4 flex items-center border-b border-sidebar-border">
        <svg className="h-8 w-8 text-sidebar-foreground" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="currentColor"/>
          <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        <span className="ml-2 text-xl font-semibold text-white">RH Master</span>
      </div>

      <div className="flex-grow py-6 px-3 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
              location === item.href
                ? "bg-sidebar-accent text-sidebar-accent-foreground"
                : "text-sidebar-foreground hover:bg-sidebar-accent/20"
            )}
          >
            <item.icon className="h-5 w-5" />
            <span>{item.label}</span>
          </Link>
        ))}
      </div>

      <div className="p-4 border-t border-sidebar-border space-y-2">
        <Link
          href="/settings"
          className="flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium transition-colors text-sidebar-foreground hover:bg-sidebar-accent/20"
        >
          <Settings className="h-5 w-5" />
          <span>Configurações</span>
        </Link>
        <Link
          href="/help"
          className="flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium transition-colors text-sidebar-foreground hover:bg-sidebar-accent/20"
        >
          <HelpCircle className="h-5 w-5" />
          <span>Ajuda</span>
        </Link>
        <Button
          variant="outline"
          className="w-full justify-start text-sidebar-foreground border-sidebar-border hover:bg-sidebar-accent/20 hover:text-sidebar-foreground"
          onClick={handleLogout}
        >
          <LogOut className="h-5 w-5 mr-2" />
          Sair
        </Button>
      </div>
    </div>
  );
}
