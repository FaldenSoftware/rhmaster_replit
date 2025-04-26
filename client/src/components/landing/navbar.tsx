import { useState, useEffect } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/hooks/use-theme";
import { useIsMobile } from "@/hooks/use-mobile";
import { Badge } from "@/components/ui/badge";
import { Menu, X, Sun, Moon, ArrowRight, CheckCircle2 } from "lucide-react";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const isMobile = useIsMobile();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Disable body scroll when menu is open on mobile
  useEffect(() => {
    if (menuOpen && isMobile) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [menuOpen, isMobile]);

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-200 ${
        scrolled
          ? "bg-white/95 backdrop-blur-sm shadow-md py-3"
          : "bg-transparent py-4"
      }`}
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/">
            <div className="flex items-center space-x-2">
              <div className="h-9 w-9 bg-primary rounded-full flex items-center justify-center">
                <svg className="h-5 w-5 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="currentColor"/>
                  <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <span className="font-bold text-xl text-slate-900">RH Master</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="#features">
              <span className="font-medium text-slate-700 hover:text-primary transition-colors cursor-pointer">
                Recursos
              </span>
            </Link>
            <Link href="#demo">
              <span className="font-medium text-slate-700 hover:text-primary transition-colors cursor-pointer">
                Demonstração
              </span>
            </Link>
            <Link href="#pricing">
              <span className="font-medium text-slate-700 hover:text-primary transition-colors cursor-pointer">
                Planos
              </span>
            </Link>
            <Link href="#testimonials">
              <span className="font-medium text-slate-700 hover:text-primary transition-colors cursor-pointer">
                Depoimentos
              </span>
            </Link>
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-3 md:space-x-4">
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="p-1.5 rounded-full hover:bg-slate-100 transition-colors"
              aria-label={theme === "dark" ? "Mudar para tema claro" : "Mudar para tema escuro"}
            >
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
            
            <div className="hidden md:flex items-center space-x-3">
              <Badge variant="outline" className="hidden lg:flex gap-1 items-center px-3 py-1.5 text-xs font-medium text-primary border-primary/20">
                <CheckCircle2 className="h-3.5 w-3.5" />
                14 dias grátis
              </Badge>
              
              <Link href="/auth">
                <Button variant="outline" size="sm" className="h-9">Entrar</Button>
              </Link>
              
              <Link href="/auth?tab=register">
                <Button size="sm" className="h-9 whitespace-nowrap">
                  Teste Grátis
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>

            {/* Mobile Menu Toggle */}
            <button
              className="p-2 md:hidden rounded-md hover:bg-slate-100 transition-colors"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}
            >
              {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="fixed inset-0 top-[60px] z-50 bg-white/98 backdrop-blur-sm md:hidden overflow-auto">
          <nav className="container mx-auto px-4 py-6 space-y-6 divide-y divide-slate-100">
            <div className="space-y-4 py-4">
              <Link href="#features">
                <span className="block font-medium text-lg text-slate-900 hover:text-primary transition-colors py-2" onClick={() => setMenuOpen(false)}>
                  Recursos
                </span>
              </Link>
              <Link href="#demo">
                <span className="block font-medium text-lg text-slate-900 hover:text-primary transition-colors py-2" onClick={() => setMenuOpen(false)}>
                  Demonstração
                </span>
              </Link>
              <Link href="#pricing">
                <span className="block font-medium text-lg text-slate-900 hover:text-primary transition-colors py-2" onClick={() => setMenuOpen(false)}>
                  Planos
                </span>
              </Link>
              <Link href="#testimonials">
                <span className="block font-medium text-lg text-slate-900 hover:text-primary transition-colors py-2" onClick={() => setMenuOpen(false)}>
                  Depoimentos
                </span>
              </Link>
              <Link href="#faq">
                <span className="block font-medium text-lg text-slate-900 hover:text-primary transition-colors py-2" onClick={() => setMenuOpen(false)}>
                  FAQ
                </span>
              </Link>
            </div>
            
            <div className="space-y-4 py-4">
              <div className="flex items-center justify-center py-2">
                <Badge variant="outline" className="flex gap-1 items-center px-3 py-1.5 text-xs font-medium text-primary border-primary/20">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  14 dias grátis
                </Badge>
              </div>
              
              <Link href="/auth">
                <Button variant="outline" className="w-full" onClick={() => setMenuOpen(false)}>
                  Entrar
                </Button>
              </Link>
              
              <Link href="/auth?tab=register">
                <Button className="w-full" onClick={() => setMenuOpen(false)}>
                  Começar Teste Grátis
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}