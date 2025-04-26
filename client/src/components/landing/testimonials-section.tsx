import { BadgeCheck, Quote, StarIcon, ChevronRight, ChevronLeft, TrendingUp, Users, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { useState, useEffect } from "react";

export function TestimonialsSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    // Configurar rotação automática a cada 6 segundos
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % testimonials.length);
    }, 6000);
    
    return () => {
      window.removeEventListener('resize', checkMobile);
      clearInterval(interval);
    };
  }, []);
  
  const testimonials = [
    {
      name: "Carlos Almeida",
      role: "Mentor de Liderança Executiva",
      company: "Tesla Brasil",
      photo: "https://randomuser.me/api/portraits/men/32.jpg",
      quote: "O RH Master transformou completamente minha prática de mentoria. Os testes comportamentais fornecem insights profundos que me permitem personalizar cada sessão de forma precisa.",
      rating: 5,
      result: "+45% em retenção de talentos",
      color: "bg-blue-500/10 text-blue-700",
      icon: <TrendingUp className="h-5 w-5" />
    },
    {
      name: "Márcia Ribeiro",
      role: "Diretora de Desenvolvimento",
      company: "Banco Santander",
      photo: "https://randomuser.me/api/portraits/women/68.jpg",
      quote: "Aumentei minha retenção de clientes em 40% em apenas três meses. A plataforma me permite demonstrar valor de forma tangível, facilitando a renovação de contratos.",
      rating: 5,
      result: "ROI de 280% em 6 meses",
      color: "bg-emerald-500/10 text-emerald-700",
      icon: <Award className="h-5 w-5" />
    },
    {
      name: "Roberto Lima",
      role: "Head de Recursos Humanos",
      company: "Magazine Luiza",
      photo: "https://randomuser.me/api/portraits/men/42.jpg",
      quote: "Como líder de RH, precisava de uma ferramenta que realmente entregasse resultados mensuráveis. O RH Master não só atendeu essa necessidade como superou todas as minhas expectativas.",
      rating: 5,
      result: "87 líderes desenvolvidos",
      color: "bg-purple-500/10 text-purple-700",
      icon: <Users className="h-5 w-5" />
    }
  ];

  const featuredTestimonial = {
    name: "Luiz Santos",
    role: "CEO",
    company: "LS Consultoria de Liderança",
    photo: "https://randomuser.me/api/portraits/men/86.jpg",
    quote: "O RH Master tem sido uma ferramenta transformadora para nossa empresa. A capacidade de acompanhar métricas claras de desenvolvimento nos diferencia no mercado. Nossos clientes ficam impressionados com a profundidade das análises e nossos mentores conseguem resultados 3x melhores que antes.",
    logos: [
      "Amazon",
      "Microsoft",
      "Unilever",
      "Natura"
    ]
  };

  const clientLogos = [
    { name: "Itaú", color: "text-blue-600" },
    { name: "Magazine Luiza", color: "text-pink-600" },
    { name: "Nubank", color: "text-purple-600" },
    { name: "XP Inc", color: "text-yellow-600" },
    { name: "iFood", color: "text-red-600" },
    { name: "Banco do Brasil", color: "text-yellow-600" }
  ];

  const nextTestimonial = () => {
    setActiveIndex((prev) => (prev + 1) % testimonials.length);
  };
  
  const prevTestimonial = () => {
    setActiveIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <section id="testimonials" className="py-24 bg-white overflow-hidden">
      <div className="container mx-auto px-4 md:px-6">
        {/* Cabeçalho */}
        <div className="text-center mb-16">
          <div className="inline-block rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary mb-4">
            DEPOIMENTOS REAIS
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 tracking-tight max-w-3xl mx-auto">
            Mentores estão transformando lideranças com o RH Master
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Veja como profissionais e empresas estão alcançando resultados excepcionais
            e se diferenciando no mercado.
          </p>
        </div>

        {/* Depoimento destacado */}
        <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl p-8 md:p-12 mb-20 border border-slate-200 relative overflow-hidden">
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-primary/5 blur-3xl"></div>
          <div className="absolute -left-20 -bottom-20 h-64 w-64 rounded-full bg-secondary/5 blur-3xl"></div>
          
          <div className="relative max-w-4xl mx-auto">
            <Quote className="absolute -top-2 -left-2 h-12 w-12 text-primary/10" />
            
            <div className="md:text-center mb-8">
              <p className="text-xl md:text-2xl font-medium text-slate-800 leading-relaxed">
                {featuredTestimonial.quote}
              </p>
            </div>
            
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex items-center">
                <div className="w-16 h-16 rounded-full border-2 border-primary/20 p-0.5 mr-4 overflow-hidden">
                  <img 
                    src={featuredTestimonial.photo}
                    alt={featuredTestimonial.name}
                    className="w-full h-full object-cover rounded-full"
                    loading="lazy"
                  />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-lg">{featuredTestimonial.name}</h4>
                  <p className="text-slate-600">
                    {featuredTestimonial.role}, {featuredTestimonial.company}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                {featuredTestimonial.logos.map((logo, index) => (
                  <div key={index} className="text-xs md:text-sm font-semibold px-3 py-1 bg-white rounded-md shadow-sm border border-slate-200">
                    {logo}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        {/* Depoimentos em carousel */}
        <div className="mb-20">
          <div className="max-w-6xl mx-auto relative">
            {/* Controles do carousel - Desktop */}
            <div className="hidden md:flex absolute -right-4 top-1/2 transform -translate-y-1/2 space-x-2 z-10">
              <Button 
                variant="outline" 
                size="icon" 
                className="rounded-full border-slate-200 hover:bg-primary hover:text-white"
                onClick={prevTestimonial}
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <Button 
                variant="outline" 
                size="icon" 
                className="rounded-full border-slate-200 hover:bg-primary hover:text-white"
                onClick={nextTestimonial}
              >
                <ChevronRight className="h-5 w-5" />
              </Button>
            </div>
            
            <div className="flex transition-all duration-500" style={{ transform: `translateX(-${activeIndex * (isMobile ? 100 : 33.33)}%)` }}>
              {testimonials.map((testimonial, index) => (
                <div 
                  key={index} 
                  className={`${isMobile ? 'w-full' : 'w-1/3'} flex-shrink-0 px-4`}
                >
                  <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm h-full flex flex-col">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center">
                        <div className="w-12 h-12 rounded-full overflow-hidden mr-3">
                          <img 
                            src={testimonial.photo} 
                            alt={testimonial.name}
                            className="w-full h-full object-cover"
                            loading="lazy"
                          />
                        </div>
                        <div>
                          <h4 className="font-semibold text-slate-900">{testimonial.name}</h4>
                          <p className="text-xs text-slate-500">{testimonial.role} • {testimonial.company}</p>
                        </div>
                      </div>
                      <div className="flex">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <StarIcon key={i} className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                        ))}
                      </div>
                    </div>
                    <p className="text-slate-700 mb-4 flex-grow">
                      "{testimonial.quote}"
                    </p>
                    <div className={`${testimonial.color} text-sm font-medium rounded-full px-3 py-1 inline-flex items-center self-start`}>
                      {testimonial.icon}
                      <span className="ml-1.5">{testimonial.result}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Indicadores para mobile */}
            <div className="flex justify-center mt-6 space-x-2 md:hidden">
              {testimonials.map((_, i) => (
                <button 
                  key={i} 
                  onClick={() => setActiveIndex(i)} 
                  className={`w-2 h-2 rounded-full transition-all ${i === activeIndex ? 'bg-primary scale-125' : 'bg-slate-300'}`} 
                />
              ))}
            </div>
          </div>
        </div>
        
        {/* Logos de clientes */}
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-6">
            <p className="text-sm text-slate-500 font-medium">
              + DE 300 EMPRESAS LÍDERES UTILIZAM O RH MASTER
            </p>
          </div>
          
          <div className="flex flex-wrap justify-center gap-x-12 gap-y-6">
            {clientLogos.map((logo, index) => (
              <div key={index} className={`text-lg md:text-xl font-bold ${logo.color}`}>
                {logo.name}
              </div>
            ))}
          </div>
        </div>
        
        {/* CTA */}
        <div className="mt-20 text-center">
          <Link href="/auth?tab=register">
            <Button size="lg" className="px-8 group">
              Junte-se a esses mentores de sucesso
              <ChevronRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
          <p className="text-sm text-slate-500 mt-4">
            14 dias grátis. Sem necessidade de cartão de crédito.
          </p>
        </div>
      </div>
    </section>
  );
}