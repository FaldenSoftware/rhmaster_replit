import { Star } from "lucide-react";

const testimonials = [
  {
    content: "O RH Master transformou completamente minha prática de mentoria. Consigo acompanhar o progresso de todos meus clientes em um só lugar e os testes comportamentais trazem insights valiosos.",
    author: "Ana Silva",
    role: "Coach Executiva",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80"
  },
  {
    content: "A interface Kanban para atribuição de testes é genial! Meus clientes se engajam mais com o processo de desenvolvimento e os assistentes de IA são incrivelmente úteis.",
    author: "Roberto Mendes",
    role: "Consultor de Liderança",
    avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80"
  },
  {
    content: "Como consultora de RH, o RH Master se tornou uma ferramenta essencial no meu trabalho. A gamificação invisível para os clientes é um diferencial incrível que mantém todos motivados.",
    author: "Carla Oliveira",
    role: "Consultora de RH",
    avatar: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80"
  }
];

export function TestimonialsSection() {
  return (
    <section className="py-20 bg-slate-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">O Que Nossos Mentores Dizem</h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">Descubra como o RH Master está transformando a prática de mentoria profissional.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-white p-6 rounded-xl shadow-md">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-secondary fill-current" />
                ))}
              </div>
              <p className="text-slate-600 mb-4">{testimonial.content}</p>
              <div className="flex items-center">
                <img 
                  src={testimonial.avatar} 
                  alt={`Foto de ${testimonial.author}`} 
                  className="w-10 h-10 rounded-full object-cover mr-3"
                />
                <div>
                  <h4 className="font-semibold text-slate-900">{testimonial.author}</h4>
                  <p className="text-sm text-slate-500">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
