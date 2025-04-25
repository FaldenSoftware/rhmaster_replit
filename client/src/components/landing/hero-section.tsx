import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export function HeroSection() {
  return (
    <section className="relative bg-gradient-to-br from-primary to-primary-light py-20 overflow-hidden">
      <div className="absolute inset-0 opacity-10 bg-cover bg-center"></div>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between">
          <div className="lg:w-1/2 text-center lg:text-left mb-12 lg:mb-0">
            <h1 className="text-4xl sm:text-5xl font-bold text-white leading-tight mb-6">
              Transforme mentoria em resultados mensuráveis
            </h1>
            <p className="text-lg sm:text-xl text-white/80 mb-8 max-w-2xl mx-auto lg:mx-0">
              Plataforma SaaS que ajuda mentores a treinar, acompanhar e avaliar o progresso de seus líderes com testes comportamentais e gamificação.
            </p>
            <div className="flex flex-col sm:flex-row justify-center lg:justify-start space-y-4 sm:space-y-0 sm:space-x-4">
              <Link href="/auth">
                <Button className="px-6 py-3 bg-secondary text-dark font-medium hover:bg-secondary-light">
                  Comece Gratuitamente
                </Button>
              </Link>
              <Link href="/#contato">
                <Button variant="outline" className="px-6 py-3 bg-white/20 text-white backdrop-blur-sm font-medium hover:bg-white/30 border-white/30">
                  Agende uma Demo
                </Button>
              </Link>
            </div>
          </div>
          <div className="lg:w-1/2">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 shadow-2xl border border-white/20">
              <img 
                src="https://images.unsplash.com/photo-1552581234-26160f608093?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
                alt="Dashboard do RH Master" 
                className="rounded-lg shadow-lg w-full"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
