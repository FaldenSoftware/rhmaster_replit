import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowRight, Play } from "lucide-react";

export function HeroSection() {
  return (
    <section 
      id="hero" 
      className="py-20 md:py-28 bg-gradient-to-b from-slate-50 to-white overflow-hidden"
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 md:pr-12 mb-10 md:mb-0">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 tracking-tight mb-6">
              Transforme líderes em{" "}
              <span className="relative">
                <span className="bg-gradient-to-r from-primary to-amber-500 bg-clip-text text-transparent">alta performance</span>
                <span className="absolute bottom-1 left-0 w-full h-2 bg-gradient-to-r from-primary/20 to-amber-500/20 rounded-full"></span>
              </span>
            </h1>
            <p className="text-lg md:text-xl text-slate-600 mb-8 leading-relaxed">
              RH Master é a plataforma inovadora que ajuda mentores a 
              transformar seus líderes através de testes comportamentais, 
              monitoramento de progresso e insights valiosos.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/auth">
                <Button 
                  size="lg" 
                  className="text-base"
                >
                  Começar Agora
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Button 
                size="lg" 
                variant="outline"
                className="text-base"
              >
                <Play className="mr-2 h-4 w-4" />
                Ver Demonstração
              </Button>
            </div>
            
            <div className="mt-8 flex flex-col sm:flex-row items-center text-slate-500 text-sm">
              <div className="flex -space-x-1 mb-3 sm:mb-0 sm:mr-4">
                <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center shadow-sm">JD</div>
                <div className="w-8 h-8 rounded-full bg-secondary text-white flex items-center justify-center shadow-sm">MR</div>
                <div className="w-8 h-8 rounded-full bg-pink-500 text-white flex items-center justify-center shadow-sm">CA</div>
                <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-sm">LF</div>
                <div className="w-8 h-8 rounded-full bg-amber-500 text-white flex items-center justify-center shadow-sm">SP</div>
              </div>
              <span>+ de 300 mentores usam a plataforma</span>
            </div>
          </div>
          
          <div className="md:w-1/2 relative">
            <div className="absolute -top-12 -left-12 w-32 h-32 bg-primary/10 rounded-full blur-2xl"></div>
            <div className="absolute -bottom-12 -right-12 w-32 h-32 bg-secondary/10 rounded-full blur-2xl"></div>
            
            <div className="rounded-xl bg-white shadow-xl p-2 border border-slate-100 relative z-10">
              <img 
                src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2184&q=80" 
                alt="Mentoria em ação" 
                className="rounded-lg h-full w-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}