import { useState } from "react";
import { Link } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { 
  Menu, 
  Bell, 
  ChevronDown, 
  User,
  BrainCircuit
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { FloatingChat } from "@/components/assistant/floating-chat";
import { AssistantType } from "@/lib/gemini-service";

export function Header() {
  const { user, logoutMutation, isMentor } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);

  if (!user) return null;

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleAssistant = () => {
    setIsAssistantOpen(!isAssistantOpen);
  };

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  // Get initials for avatar
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };

  // Determinar o tipo de assistente baseado no papel do usuário
  const assistantType: AssistantType = isMentor ? "mentor" : "client";

  const initials = user.name ? getInitials(user.name) : user.username.substring(0, 2).toUpperCase();

  return (
    <header className="bg-white shadow-sm border-b border-slate-200 z-10">
      <div className="px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <button
          className="block md:hidden text-slate-500 hover:text-slate-700"
          onClick={toggleMobileMenu}
        >
          <Menu className="h-6 w-6" />
        </button>

        <div className="flex-1 ml-4 md:ml-0">
          <h1 className="text-lg font-semibold text-primary">
            {user.role === 'mentor' ? 'RH Master • Painel do Mentor' : 'RH Master • Painel do Cliente'}
          </h1>
        </div>

        <div className="flex items-center space-x-3">
          <Button variant="ghost" size="icon" className="text-slate-500 hover:text-slate-700">
            <Bell className="h-5 w-5" />
          </Button>
          
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-slate-500 hover:text-slate-700 relative"
            onClick={toggleAssistant}
          >
            <BrainCircuit className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 bg-amber-500 w-2 h-2 rounded-full"></span>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center space-x-2">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <span className="hidden sm:inline-block text-sm font-medium text-slate-700">
                  {user.name || user.username}
                </span>
                <ChevronDown className="h-4 w-4 text-slate-500" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem asChild>
                <Link href="/profile" className="cursor-pointer flex items-center">
                  <User className="mr-2 h-4 w-4" />
                  <span>Perfil</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/settings" className="cursor-pointer">
                  Configurações
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleLogout} className="text-red-600 cursor-pointer">
                Sair
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          {/* Componente de chat flutuante */}
          <FloatingChat 
            assistantType={assistantType}
            isOpen={isAssistantOpen}
            onClose={toggleAssistant}
            contextData={{
              userId: user.id,
              userName: user.name || user.username,
              role: user.role
            }}
          />
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-slate-200 py-2">
          <nav className="px-4 space-y-1">
            <Link href="/dashboard" className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:bg-slate-100">
              Dashboard
            </Link>
            {user.role === 'mentor' && (
              <>
                <Link href="/clients" className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:bg-slate-100">
                  Clientes
                </Link>
                <Link href="/tests" className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:bg-slate-100">
                  Testes
                </Link>
                <Link href="/analytics" className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:bg-slate-100">
                  Análises
                </Link>
              </>
            )}
            {user.role === 'client' && (
              <>
                <Link href="/my-tests" className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:bg-slate-100">
                  Meus Testes
                </Link>
                <Link href="/results" className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:bg-slate-100">
                  Resultados
                </Link>
              </>
            )}
            <Link href="/settings" className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:bg-slate-100">
              Configurações
            </Link>
            <button
              onClick={handleLogout}
              className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-600 hover:bg-slate-100"
            >
              Sair
            </button>
          </nav>
        </div>
      )}
    </header>
  );
}
