import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Play, CheckCircle, Star, ShieldCheck, Clock, TrendingUp } from "lucide-react";
import { useState, useEffect } from "react";

export function HeroSection() {
  const [counter, setCounter] = useState(0);
  const benefits = ["Maior engajamento", "Redução de turnover", "Decisões data-driven", "Desenvolvimento acelerado"];

  // Animação para trocar os benefícios a cada 3 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      setCounter((prev) => (prev + 1) % benefits.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [benefits.length]);

  return (
    <section 
      id="hero" 
      className="pt-24 pb-16 md:pt-28 md:pb-24 bg-gradient-to-b from-slate-50/80 to-white overflow-hidden"
    >
      <div className="container mx-auto px-4 md:px-6">
        {/* Anúncio promocional */}
        <div className="max-w-4xl mx-auto mb-12 text-center">
          <Badge variant="outline" className="px-3 py-1 text-xs font-medium bg-background/95 backdrop-blur-sm border-primary/20 text-primary mb-4 inline-flex items-center gap-1.5">
            <Star className="h-3.5 w-3.5 fill-primary" />
            <span>NOVO</span>
          </Badge>
          <div className="text-sm md:text-base font-medium text-muted-foreground bg-gradient-to-r from-primary/90 to-secondary/90 bg-clip-text text-transparent">
            Aumente a eficácia dos seus programas de liderança em até 73%
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 md:pr-12 mb-10 md:mb-0">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-slate-900 mb-6 leading-[1.1]">
              <span className="relative inline-block">
                Potencialize
                <div className="absolute -z-10 bottom-2 sm:bottom-1 left-0 w-full h-3 sm:h-4 bg-primary/15 rounded-full transform rotate-[-1deg]"></div>
              </span>{" "}
              o desenvolvimento das suas lideranças
            </h1>
            
            <div className="relative h-8 mb-8 mt-4 overflow-hidden">
              <div className="flex flex-col transition-transform duration-500" style={{ transform: `translateY(-${counter * 32}px)` }}>
                {benefits.map((benefit, i) => (
                  <p key={i} className="h-8 flex items-center text-lg md:text-xl text-muted-foreground font-medium">
                    <CheckCircle className="h-5 w-5 mr-2 text-primary flex-shrink-0" />
                    {benefit}
                  </p>
                ))}
              </div>
            </div>

            <p className="text-lg text-slate-600 mb-8 leading-relaxed">
              Uma plataforma completa que une testes comportamentais, monitoramento 
              inteligente e insights acionáveis para transformar mentores em catalisadores 
              do sucesso organizacional.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <Link href="/auth?tab=register">
                <Button 
                  size="lg" 
                  className="text-base relative overflow-hidden group shadow-lg"
                >
                  <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-primary/80 to-primary transition-all duration-300 transform group-hover:scale-105 -z-10"></span>
                  Começar 14 dias grátis
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              
              <Link href="#demo">
                <Button 
                  size="lg" 
                  variant="outline"
                  className="text-base border-slate-300"
                >
                  <Play className="mr-2 h-4 w-4" />
                  Ver Demonstração
                </Button>
              </Link>
            </div>
            
            <div className="flex flex-wrap gap-4 text-sm text-slate-500">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-primary" />
                <span>Sem necessidade de cartão</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="h-4 w-4 text-primary" />
                <span>Configuração em minutos</span>
              </div>
              <div className="flex items-center gap-1.5">
                <TrendingUp className="h-4 w-4 text-primary" />
                <span>ROI comprovado</span>
              </div>
            </div>
            
            <div className="mt-8 flex items-center">
              <div className="flex -space-x-2 mr-4">
                <img src="https://randomuser.me/api/portraits/women/79.jpg" alt="Usuário" className="w-8 h-8 rounded-full border-2 border-white object-cover" />
                <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="Usuário" className="w-8 h-8 rounded-full border-2 border-white object-cover" />
                <img src="https://randomuser.me/api/portraits/women/44.jpg" alt="Usuário" className="w-8 h-8 rounded-full border-2 border-white object-cover" />
                <img src="https://randomuser.me/api/portraits/men/86.jpg" alt="Usuário" className="w-8 h-8 rounded-full border-2 border-white object-cover" />
                <div className="w-8 h-8 rounded-full bg-primary/90 text-white flex items-center justify-center text-xs border-2 border-white">
                  300+
                </div>
              </div>
              <div className="flex items-center gap-1">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-secondary text-secondary" />
                  ))}
                </div>
                <span className="text-sm font-medium">4.9/5 de satisfação</span>
              </div>
            </div>
          </div>
          
          <div className="md:w-1/2 relative">
            <div className="absolute -top-12 -left-12 w-40 h-40 bg-primary/10 rounded-full blur-3xl opacity-80"></div>
            <div className="absolute -bottom-12 -right-12 w-40 h-40 bg-secondary/10 rounded-full blur-3xl opacity-80"></div>
            
            {/* Dashboard mock */}
            <div className="relative z-10">
              <div className="absolute -top-10 -left-10 md:-left-6 md:-top-6 bg-white rounded-lg shadow-xl p-4 border border-slate-200 w-32 md:w-44 animate-float">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  <p className="text-xs font-medium">Taxa de conclusão</p>
                </div>
                <p className="text-xl md:text-2xl font-bold mt-1">94%</p>
                <div className="w-full h-1.5 bg-slate-100 rounded-full mt-2">
                  <div className="h-full w-[94%] bg-green-500 rounded-full"></div>
                </div>
              </div>
              
              <div className="absolute -bottom-10 -right-6 md:-right-8 md:-bottom-6 bg-white rounded-lg shadow-xl p-4 border border-slate-200 w-40 md:w-52 animate-float-slow">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 rounded-full bg-primary"></div>
                  <p className="text-xs font-medium">Engajamento semanal</p>
                </div>
                <div className="flex gap-1 justify-between items-end h-16">
                  {[40, 65, 55, 80, 70, 85, 90].map((h, i) => (
                    <div key={i} className="w-full bg-primary/20 rounded-sm" style={{ height: `${h}%` }}></div>
                  ))}
                </div>
              </div>
              
              <div className="rounded-xl bg-white shadow-xl p-2 border border-slate-200 relative">
                <img 
                  src="https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1674&q=80" 
                  alt="Dashboard RH Master" 
                  className="rounded-lg h-full w-full object-cover"
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}