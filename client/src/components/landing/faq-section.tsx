import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "O que é o RH Master?",
    answer: "O RH Master é uma plataforma SaaS (Software as a Service) projetada para mentores de liderança e desenvolvimento profissional que desejam treinar, acompanhar e avaliar o progresso de seus clientes de forma estruturada e eficiente."
  },
  {
    question: "Quais testes comportamentais estão disponíveis?",
    answer: "Inicialmente, o RH Master oferece três testes comportamentais: Perfil Comportamental, Inteligência Emocional e Eneagrama. Novos testes serão adicionados regularmente à plataforma."
  },
  {
    question: "Como funciona o sistema de convites para clientes?",
    answer: "O sistema de convites permite que apenas mentores cadastrados possam convidar clientes para a plataforma. O mentor envia um convite por e-mail, e o cliente cria sua conta através de um link exclusivo, garantindo segurança e exclusividade."
  },
  {
    question: "O que é a gamificação invisível?",
    answer: "A gamificação invisível é um sistema de pontuação e ranking que apenas os mentores podem visualizar. Isso permite que mentores acompanhem o engajamento de seus clientes sem criar um ambiente competitivo entre eles."
  },
  {
    question: "Como funcionam os assistentes virtuais de IA?",
    answer: "Os assistentes virtuais de IA são baseados no modelo Gemini 2.0 Flash e estão disponíveis tanto para mentores quanto para clientes. Eles auxiliam na interpretação de resultados, fornecem insights adicionais e respondem a dúvidas sobre a plataforma."
  }
];

export function FAQSection() {
  return (
    <section id="faq" className="py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">Perguntas Frequentes</h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">Respostas para as dúvidas mais comuns sobre o RH Master.</p>
        </div>

        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="w-full space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="bg-slate-50 rounded-lg shadow-sm border-none">
                <AccordionTrigger className="px-6 py-4 text-lg font-semibold text-slate-900">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-4 text-slate-600">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
