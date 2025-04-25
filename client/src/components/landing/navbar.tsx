import { useState, useEffect } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/hooks/use-theme";
import { useIsMobile } from "@/hooks/use-mobile";
import { Menu, X, Sun, Moon } from "lucide-react";

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
          ? "bg-white shadow-md py-3"
          : "bg-transparent py-4"
      }`}
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/">
            <a className="flex items-center space-x-2">
              <div className="h-8 w-8 bg-primary rounded-full flex items-center justify-center">
                <svg className="h-5 w-5 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="currentColor"/>
                  <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <span className="font-bold text-xl text-slate-900">RH Master</span>
            </a>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="#features">
              <a className="font-medium text-slate-700 hover:text-primary transition-colors">
                Recursos
              </a>
            </Link>
            <Link href="#how-it-works">
              <a className="font-medium text-slate-700 hover:text-primary transition-colors">
                Como Funciona
              </a>
            </Link>
            <Link href="#pricing">
              <a className="font-medium text-slate-700 hover:text-primary transition-colors">
                Planos
              </a>
            </Link>
            <Link href="#testimonials">
              <a className="font-medium text-slate-700 hover:text-primary transition-colors">
                Depoimentos
              </a>
            </Link>
            <Link href="#faq">
              <a className="font-medium text-slate-700 hover:text-primary transition-colors">
                FAQ
              </a>
            </Link>
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="p-2 rounded-full hover:bg-slate-100 transition-colors"
              aria-label={theme === "dark" ? "Mudar para tema claro" : "Mudar para tema escuro"}
            >
              {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
            
            <div className="hidden md:flex items-center space-x-2">
              <Link href="/auth">
                <a>
                  <Button variant="outline">Entrar</Button>
                </a>
              </Link>
              <Link href="/auth?tab=register">
                <a>
                  <Button>Cadastre-se</Button>
                </a>
              </Link>
            </div>

            {/* Mobile Menu Toggle */}
            <button
              className="p-2 md:hidden rounded-md hover:bg-slate-100 transition-colors"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}
            >
              {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="fixed inset-0 top-[65px] z-50 bg-white md:hidden">
          <nav className="container mx-auto px-4 py-6 space-y-6 divide-y divide-slate-100">
            <div className="space-y-4 py-4">
              <Link href="#features">
                <a className="block font-medium text-lg text-slate-900 hover:text-primary transition-colors py-2" onClick={() => setMenuOpen(false)}>
                  Recursos
                </a>
              </Link>
              <Link href="#how-it-works">
                <a className="block font-medium text-lg text-slate-900 hover:text-primary transition-colors py-2" onClick={() => setMenuOpen(false)}>
                  Como Funciona
                </a>
              </Link>
              <Link href="#pricing">
                <a className="block font-medium text-lg text-slate-900 hover:text-primary transition-colors py-2" onClick={() => setMenuOpen(false)}>
                  Planos
                </a>
              </Link>
              <Link href="#testimonials">
                <a className="block font-medium text-lg text-slate-900 hover:text-primary transition-colors py-2" onClick={() => setMenuOpen(false)}>
                  Depoimentos
                </a>
              </Link>
              <Link href="#faq">
                <a className="block font-medium text-lg text-slate-900 hover:text-primary transition-colors py-2" onClick={() => setMenuOpen(false)}>
                  FAQ
                </a>
              </Link>
            </div>
            
            <div className="space-y-4 py-4">
              <Link href="/auth">
                <a className="block w-full" onClick={() => setMenuOpen(false)}>
                  <Button variant="outline" className="w-full">Entrar</Button>
                </a>
              </Link>
              <Link href="/auth?tab=register">
                <a className="block w-full" onClick={() => setMenuOpen(false)}>
                  <Button className="w-full">Cadastre-se</Button>
                </a>
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}