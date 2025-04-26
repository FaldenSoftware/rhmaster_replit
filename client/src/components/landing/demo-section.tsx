import { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Play, ArrowRight, Maximize2, ChevronRight, ChevronLeft } from "lucide-react";

export function DemoSection() {
  const [activeSlide, setActiveSlide] = useState(0);
  
  // Dados das demonstrações
  const demoSlides = [
    {
      id: "dashboard",
      title: "Dashboard Interativo",
      description: "Visualize o progresso de todos os seus liderados em um só lugar, com métricas claras e insights acionáveis.",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=1740&q=80",
      benefits: [
        "Visão consolidada de todos os seus liderados",
        "Métricas de progresso e engajamento em tempo real",
        "Alertas sobre pontos de atenção"
      ]
    },
    {
      id: "kanban",
      title: "Sistema Kanban para Testes",
      description: "Distribua e acompanhe facilmente os testes comportamentais para seus liderados com nosso sistema de Kanban intuitivo.",
      image: "https://images.unsplash.com/photo-1611224885990-ab7363d7f2fc?ixlib=rb-4.0.3&auto=format&fit=crop&w=1739&q=80",
      benefits: [
        "Atribuição simplificada de testes",
        "Acompanhamento visual do status",
        "Priorização de atividades pendentes"
      ]
    },
    {
      id: "ai",
      title: "Assistente de IA",
      description: "Receba insights e sugestões personalizados do nosso assistente alimentado por IA, com base nos dados dos seus liderados.",
      image: "https://images.unsplash.com/photo-1677442135132-81e902ade49d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1932&q=80",
      benefits: [
        "Análises comportamentais profundas",
        "Recomendações personalizadas para cada liderado",
        "Sugestões de desenvolvimento baseadas em evidências"
      ]
    },
    {
      id: "reports",
      title: "Relatórios Personalizados",
      description: "Gere relatórios detalhados sobre o progresso dos seus liderados, com visualizações claras e insights acionáveis.",
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1115&q=80",
      benefits: [
        "Relatórios detalhados por liderado ou grupo",
        "Exportação em múltiplos formatos",
        "Compartilhamento seguro com stakeholders"
      ]
    }
  ];
  
  const nextSlide = () => {
    setActiveSlide((prev) => (prev + 1) % demoSlides.length);
  };
  
  const prevSlide = () => {
    setActiveSlide((prev) => (prev - 1 + demoSlides.length) % demoSlides.length);
  };

  return (
    <section id="demo" className="py-24 bg-slate-50">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-12">
          <div className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            Veja em ação
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 tracking-tight">
            Conheça a plataforma que está transformando a mentoria
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Explore as principais funcionalidades do RH Master e descubra como ele pode 
            potencializar o desenvolvimento das suas lideranças.
          </p>
        </div>

        {/* Versão Desktop - Tabs */}
        <div className="hidden md:block mb-12">
          <Tabs defaultValue={demoSlides[0].id} className="max-w-6xl mx-auto">
            <TabsList className="w-full grid grid-cols-4 mb-10">
              {demoSlides.map((slide) => (
                <TabsTrigger 
                  key={slide.id} 
                  value={slide.id}
                  className="data-[state=active]:bg-primary data-[state=active]:text-white text-sm py-3"
                >
                  {slide.title}
                </TabsTrigger>
              ))}
            </TabsList>
            
            {demoSlides.map((slide) => (
              <TabsContent key={slide.id} value={slide.id}>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                  <div className="bg-white rounded-xl overflow-hidden shadow-lg border border-slate-200">
                    <div className="w-full aspect-video bg-slate-200 relative">
                      <img 
                        src={slide.image} 
                        alt={slide.title} 
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 hover:opacity-100 transition-opacity">
                        <Button variant="outline" size="icon" className="rounded-full bg-white/20 backdrop-blur-sm">
                          <Play className="h-6 w-6 text-white" fill="white" />
                        </Button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="order-first lg:order-last">
                    <h3 className="text-2xl font-bold text-slate-900 mb-4">{slide.title}</h3>
                    <p className="text-slate-600 mb-6">
                      {slide.description}
                    </p>
                    <ul className="space-y-3 mb-8">
                      {slide.benefits.map((benefit, i) => (
                        <li key={i} className="flex items-start">
                          <div className="bg-primary/10 rounded-full p-1 mr-3 mt-0.5">
                            <div className="w-4 h-4 bg-primary rounded-full"></div>
                          </div>
                          <span className="text-slate-700">{benefit}</span>
                        </li>
                      ))}
                    </ul>
                    
                    <Link href="/auth?tab=register">
                      <Button className="group">
                        Experimente gratuitamente
                        <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>
        
        {/* Versão Mobile - Carrossel */}
        <div className="md:hidden">
          <div className="bg-white rounded-xl overflow-hidden shadow-lg border border-slate-200 mb-8">
            <div className="w-full aspect-video bg-slate-200 relative">
              <img 
                src={demoSlides[activeSlide].image} 
                alt={demoSlides[activeSlide].title} 
                className="w-full h-full object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                <Button variant="outline" size="icon" className="rounded-full bg-white/20 backdrop-blur-sm">
                  <Play className="h-5 w-5 text-white" fill="white" />
                </Button>
              </div>
              
              <div className="absolute top-0 bottom-0 left-0 flex items-center">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8 rounded-full bg-white/30 backdrop-blur-sm text-white hover:bg-white/50 ml-2"
                  onClick={prevSlide}
                >
                  <ChevronLeft className="h-5 w-5" />
                </Button>
              </div>
              
              <div className="absolute top-0 bottom-0 right-0 flex items-center">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8 rounded-full bg-white/30 backdrop-blur-sm text-white hover:bg-white/50 mr-2"
                  onClick={nextSlide}
                >
                  <ChevronRight className="h-5 w-5" />
                </Button>
              </div>
              
              <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
                {demoSlides.map((_, i) => (
                  <button 
                    key={i} 
                    className={`w-2 h-2 rounded-full transition-all ${i === activeSlide ? 'bg-white scale-125' : 'bg-white/50'}`}
                    onClick={() => setActiveSlide(i)}
                  />
                ))}
              </div>
            </div>
          </div>
          
          <div className="px-2">
            <h3 className="text-xl font-bold text-slate-900 mb-3">{demoSlides[activeSlide].title}</h3>
            <p className="text-slate-600 mb-5 text-sm">
              {demoSlides[activeSlide].description}
            </p>
            <Link href="/auth?tab=register">
              <Button className="w-full group">
                Experimente gratuitamente
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>
        </div>
        
        {/* Barra de urgência */}
        <div className="max-w-4xl mx-auto mt-16 bg-secondary/10 border border-secondary/20 rounded-lg p-4 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center">
            <div className="bg-secondary h-10 w-10 rounded-full flex items-center justify-center text-white font-bold mr-4">
              14
            </div>
            <div>
              <h4 className="font-medium text-slate-900">Comece hoje seu período de testes</h4>
              <p className="text-sm text-slate-600">14 dias de acesso total a todas as funcionalidades</p>
            </div>
          </div>
          <Link href="/auth?tab=register">
            <Button variant="secondary" className="whitespace-nowrap">
              Ativar período gratuito
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}