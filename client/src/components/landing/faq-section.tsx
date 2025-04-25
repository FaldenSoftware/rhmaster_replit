import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export function FAQSection() {
  const faqs = [
    {
      question: "Quanto custa usar o RH Master?",
      answer: "Oferecemos diversos planos que se adaptam ao tamanho e necessidades do seu negócio de mentoria. Nosso plano básico começa em R$97/mês para até 10 clientes. O plano Mentor Pro custa R$197/mês e suporta até 30 clientes ativos. Entre em contato conosco para planos corporativos personalizados."
    },
    {
      question: "Posso testar a plataforma antes de assinar?",
      answer: "Sim! Oferecemos um período de teste gratuito de 14 dias com acesso completo a todos os recursos. Não exigimos cartão de crédito para começar o teste. É uma ótima maneira de experimentar a plataforma e ver como ela pode transformar sua mentoria."
    },
    {
      question: "Como funcionam os convites para clientes?",
      answer: "O processo é simples: você adiciona o email do seu cliente na plataforma, e nós enviamos um convite personalizado com suas informações e logotipo. Quando o cliente aceitar, ele criará uma conta e será automaticamente vinculado ao seu perfil de mentor. Você pode acompanhar quais convites foram aceitos e enviar lembretes se necessário."
    },
    {
      question: "Que tipos de testes comportamentais estão disponíveis?",
      answer: "Temos uma biblioteca abrangente de testes comportamentais validados cientificamente, incluindo análise de perfil DISC, tipos de personalidade, estilos de liderança, inteligência emocional, identificação de pontos fortes, entre outros. Todos os testes vêm com relatórios detalhados tanto para mentores quanto para clientes."
    },
    {
      question: "Como os dados dos meus clientes são protegidos?",
      answer: "A segurança é nossa prioridade. Utilizamos criptografia de ponta a ponta para todos os dados, armazenamento seguro em nuvem, e seguimos rigorosamente as diretrizes da LGPD. Todos os dados pertencem a você e seus clientes, e nunca são compartilhados com terceiros sem consentimento explícito."
    },
    {
      question: "É possível personalizar a plataforma com minha marca?",
      answer: "Sim! Nos planos Mentor Pro e Enterprise, oferecemos recursos de white-label que permitem adicionar seu logotipo, cores e domínio personalizado. Isso cria uma experiência perfeitamente integrada para seus clientes, aumentando sua credibilidade e reconhecimento de marca."
    },
    {
      question: "Que tipo de relatórios posso gerar para meus clientes?",
      answer: "Nossa plataforma oferece uma variedade de relatórios personalizáveis, incluindo análises de perfil, progresso ao longo do tempo, comparativos com benchmarks da indústria, recomendações de desenvolvimento específicas, e muito mais. Todos os relatórios podem ser exportados em PDF para compartilhamento fácil."
    },
    {
      question: "Vocês oferecem suporte técnico?",
      answer: "Absolutamente! Todos os planos incluem suporte técnico por email com tempo de resposta de 24 horas. Os planos Pro e Enterprise também incluem suporte prioritário com respostas em até 4 horas e suporte por chat ao vivo. Além disso, oferecemos sessões de onboarding personalizado para garantir que você aproveite ao máximo a plataforma."
    }
  ];

  return (
    <section id="faq" className="py-20 bg-gradient-to-b from-slate-50 to-white">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-16">
          <p className="text-sm font-medium text-primary mb-2 tracking-wider uppercase">PERGUNTAS FREQUENTES</p>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            Respostas para suas dúvidas
          </h2>
          <p className="text-lg text-slate-600 max-w-3xl mx-auto">
            Tudo o que você precisa saber sobre o RH Master e como ele pode transformar sua mentoria
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="border border-slate-200 rounded-lg">
                <AccordionTrigger className="text-left px-4 hover:no-underline hover:bg-slate-50 font-medium rounded-lg">
                  <span className="text-lg">{faq.question}</span>
                </AccordionTrigger>
                <AccordionContent className="px-4 pt-2 pb-4 text-slate-600">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        <div className="mt-12 text-center">
          <p className="text-slate-600 mb-4">
            Não encontrou o que estava procurando?
          </p>
          <a href="#contact" className="text-primary font-medium hover:underline">
            Entre em contato com nossa equipe
          </a>
        </div>
      </div>
    </section>
  );
}