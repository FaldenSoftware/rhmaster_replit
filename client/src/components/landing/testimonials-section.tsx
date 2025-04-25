import { BadgeCheck, Quote } from "lucide-react";

export function TestimonialsSection() {
  const testimonials = [
    {
      name: "Carlos Almeida",
      role: "Mentor de Liderança Executiva",
      quote: "O RH Master revolucionou minha forma de trabalhar com executivos. Os insights dos testes me permitem personalizar cada sessão de mentoria e focar exatamente nos pontos que fazem a diferença para meus clientes. A comunicação integrada também tornou todo o processo muito mais fluido.",
      rating: 5,
      initials: "CA",
      bgColor: "bg-primary/20"
    },
    {
      name: "Márcia Ribeiro",
      role: "Coach de Desenvolvimento",
      quote: "Meus clientes adoram a gamificação e os relatórios detalhados. A plataforma me ajuda a demonstrar valor de forma tangível, o que tem sido crucial para a renovação de contratos. Em apenas três meses, aumentei minha retenção de clientes em 40%.",
      rating: 5,
      initials: "MR",
      bgColor: "bg-secondary/20"
    },
    {
      name: "Roberto Lima",
      role: "Consultor de RH",
      quote: "Como consultor, preciso de ferramentas que me diferenciem. O RH Master me dá credibilidade e resultados que impressionam meus clientes. O sistema de convites para clientes é extremamente profissional e os testes comportamentais são realmente de alto nível.",
      rating: 5,
      initials: "RL",
      bgColor: "bg-pink-500/20"
    },
    {
      name: "Ana Paula Ferreira",
      role: "Mentora de Carreiras",
      quote: "Nunca vi uma ferramenta tão completa e ao mesmo tempo tão fácil de usar. Meus clientes conseguem ver claramente seu progresso, o que aumenta tremendamente o engajamento deles no processo de desenvolvimento. Os relatórios personalizados são simplesmente impressionantes.",
      rating: 5, 
      initials: "AF",
      bgColor: "bg-emerald-500/20"
    }
  ];

  return (
    <section id="testimonials" className="py-20 bg-white">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-16">
          <p className="text-sm font-medium text-primary mb-2 tracking-wider uppercase">DEPOIMENTOS</p>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            O que nossos mentores dizem
          </h2>
          <p className="text-lg text-slate-600 max-w-3xl mx-auto">
            Descubra como o RH Master está transformando a forma como os mentores trabalham
            e entregam valor para seus clientes
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-slate-50 p-6 rounded-lg border border-slate-100 relative">
              <Quote className="absolute top-6 right-6 h-12 w-12 text-slate-100" />
              <div className="flex items-center mb-4">
                <div className={`w-12 h-12 ${testimonial.bgColor} rounded-full flex items-center justify-center text-primary font-bold`}>
                  {testimonial.initials}
                </div>
                <div className="ml-4">
                  <h4 className="font-semibold text-slate-900">{testimonial.name}</h4>
                  <p className="text-sm text-slate-500">{testimonial.role}</p>
                </div>
              </div>
              <p className="text-slate-600 mb-4 relative z-10">
                "{testimonial.quote}"
              </p>
              <div className="flex text-yellow-500">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <BadgeCheck key={i} className="h-5 w-5" />
                ))}
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-20 text-center">
          <div className="bg-primary/5 p-8 rounded-lg border border-primary/10 inline-block mx-auto">
            <p className="text-xl md:text-2xl font-medium text-slate-700 mb-6">
              <span className="text-primary font-bold text-3xl">"</span>
              O RH Master tem sido uma ferramenta transformadora para nossa empresa de consultoria.
              A capacidade de acompanhar métricas claras de desenvolvimento de líderes nos diferencia no mercado.
              <span className="text-primary font-bold text-3xl">"</span>
            </p>
            <div className="flex items-center justify-center">
              <div className="w-16 h-16 bg-white rounded-full border-2 border-primary p-1">
                <img 
                  src="https://images.unsplash.com/photo-1568602471122-7832951cc4c5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80" 
                  alt="Luiz Santos"
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
              <div className="ml-4 text-left">
                <h4 className="font-bold text-slate-900">Luiz Santos</h4>
                <p className="text-slate-600">CEO, LS Consultoria de Liderança</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}