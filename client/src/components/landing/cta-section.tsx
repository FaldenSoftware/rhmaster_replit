import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { CalendarClock } from "lucide-react";

export function CTASection() {
  return (
    <section className="py-20 bg-primary text-white">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Pronto para transformar sua mentoria?
            </h2>
            <p className="text-xl opacity-90 mb-8 leading-relaxed">
              Junte-se a centenas de mentores que estão elevando o nível de suas sessões com dados e insights poderosos
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/auth">
                <Button 
                  size="lg" 
                  variant="secondary"
                  className="text-base w-full sm:w-auto"
                >
                  Criar Conta Agora
                </Button>
              </Link>
              <Button 
                size="lg" 
                variant="outline" 
                className="text-white border-white hover:bg-white/10 text-base w-full sm:w-auto"
              >
                <CalendarClock className="mr-2 h-5 w-5" />
                Agendar Demonstração
              </Button>
            </div>
            
            <div className="mt-8 space-y-4">
              <div className="flex items-center">
                <div className="w-6 h-6 rounded-full border-2 border-white flex items-center justify-center mr-2">
                  <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="opacity-90">Teste gratuito por 14 dias, sem necessidade de cartão de crédito</span>
              </div>
              <div className="flex items-center">
                <div className="w-6 h-6 rounded-full border-2 border-white flex items-center justify-center mr-2">
                  <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="opacity-90">Acesso completo a todos os recursos durante o período de teste</span>
              </div>
              <div className="flex items-center">
                <div className="w-6 h-6 rounded-full border-2 border-white flex items-center justify-center mr-2">
                  <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="opacity-90">Suporte personalizado para ajudar você a começar</span>
              </div>
            </div>
          </div>
          
          <div className="bg-white/10 p-8 rounded-lg backdrop-blur-sm border border-white/20 relative">
            <div className="absolute -top-6 -right-6 bg-secondary text-primary text-sm font-bold py-2 px-4 rounded-lg rotate-6 shadow-lg">
              Oferta por tempo limitado!
            </div>
            
            <h3 className="text-2xl font-bold mb-6">Plano Mentor Pro</h3>
            <div className="flex items-baseline mb-6">
              <span className="text-5xl font-bold">R$197</span>
              <span className="ml-2 text-xl opacity-80">/mês</span>
            </div>
            
            <div className="space-y-4 mb-8">
              <div className="flex items-center">
                <svg className="h-6 w-6 text-secondary mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <span>Até 30 clientes ativos</span>
              </div>
              <div className="flex items-center">
                <svg className="h-6 w-6 text-secondary mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <span>Testes comportamentais ilimitados</span>
              </div>
              <div className="flex items-center">
                <svg className="h-6 w-6 text-secondary mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <span>Relatórios personalizados</span>
              </div>
              <div className="flex items-center">
                <svg className="h-6 w-6 text-secondary mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <span>Biblioteca completa de recursos</span>
              </div>
              <div className="flex items-center">
                <svg className="h-6 w-6 text-secondary mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <span>Suporte prioritário</span>
              </div>
            </div>
            
            <Link href="/auth">
              <Button 
                size="lg" 
                variant="secondary"
                className="w-full text-base"
              >
                Começar Teste Gratuito
              </Button>
            </Link>
            
            <p className="text-sm text-center mt-4 opacity-80">
              Cancele a qualquer momento durante o período de teste
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}