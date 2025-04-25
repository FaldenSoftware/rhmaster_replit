import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { AuthForm } from "@/components/auth/auth-form";

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [location] = useLocation();
  const { user, isMentor } = useAuth();
  const [isLoginDialogOpen, setIsLoginDialogOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const getDashboardPath = () => {
    if (!user) return "/auth";
    return isMentor ? "/mentor-dashboard" : "/client-dashboard";
  };

  return (
    <header className="bg-white shadow sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <svg className="h-10 w-10 text-primary" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="currentColor"/>
              <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span className="ml-2 text-xl font-semibold text-primary">RH Master</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/#recursos" className="text-slate-600 hover:text-primary text-sm font-medium">Recursos</Link>
            <Link href="/#como-funciona" className="text-slate-600 hover:text-primary text-sm font-medium">Como Funciona</Link>
            <Link href="/#planos" className="text-slate-600 hover:text-primary text-sm font-medium">Planos</Link>
            <Link href="/#contato" className="text-slate-600 hover:text-primary text-sm font-medium">Contato</Link>
          </nav>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <Link href={getDashboardPath()}>
                <Button variant="default">
                  Acessar Dashboard
                </Button>
              </Link>
            ) : (
              <>
                <Dialog open={isLoginDialogOpen} onOpenChange={setIsLoginDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="link" className="text-primary">Entrar</Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>Entrar ou Criar Conta</DialogTitle>
                      <DialogDescription>
                        Acesse sua conta para continuar ou crie uma nova conta.
                      </DialogDescription>
                    </DialogHeader>
                    <AuthForm onSuccess={() => setIsLoginDialogOpen(false)} />
                  </DialogContent>
                </Dialog>
                
                <Link href="/auth">
                  <Button variant="default">
                    Começar Agora
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden rounded-md p-2 text-slate-600 hover:bg-slate-100 focus:outline-none"
            onClick={toggleMobileMenu}
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden pb-4">
            <div className="flex flex-col space-y-3">
              <Link href="/#recursos" className="text-slate-600 hover:text-primary px-3 py-2 rounded-md text-base font-medium">Recursos</Link>
              <Link href="/#como-funciona" className="text-slate-600 hover:text-primary px-3 py-2 rounded-md text-base font-medium">Como Funciona</Link>
              <Link href="/#planos" className="text-slate-600 hover:text-primary px-3 py-2 rounded-md text-base font-medium">Planos</Link>
              <Link href="/#contato" className="text-slate-600 hover:text-primary px-3 py-2 rounded-md text-base font-medium">Contato</Link>
              
              <div className="pt-2 space-y-2">
                {user ? (
                  <Link href={getDashboardPath()}>
                    <Button variant="default" className="w-full">
                      Acessar Dashboard
                    </Button>
                  </Link>
                ) : (
                  <>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" className="w-full">Entrar</Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                          <DialogTitle>Entrar ou Criar Conta</DialogTitle>
                          <DialogDescription>
                            Acesse sua conta para continuar ou crie uma nova conta.
                          </DialogDescription>
                        </DialogHeader>
                        <AuthForm />
                      </DialogContent>
                    </Dialog>
                    
                    <Link href="/auth">
                      <Button variant="default" className="w-full">
                        Começar Agora
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
