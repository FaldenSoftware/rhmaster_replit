import { CheckCircle2 } from "lucide-react";

export function HowItWorksSection() {
  return (
    <section id="como-funciona" className="py-20 bg-slate-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">Como o RH Master Funciona</h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">Um processo simples para transformar seu trabalho de mentoria em uma experiência digital poderosa.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="text-center p-6">
            <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-white text-xl font-bold mx-auto mb-4">1</div>
            <h3 className="text-xl font-semibold text-slate-900 mb-3">Cadastre-se e Convide Clientes</h3>
            <p className="text-slate-600">Crie sua conta, escolha um plano e convide seus clientes para a plataforma com apenas alguns cliques.</p>
          </div>

          <div className="text-center p-6">
            <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-white text-xl font-bold mx-auto mb-4">2</div>
            <h3 className="text-xl font-semibold text-slate-900 mb-3">Atribua Testes Comportamentais</h3>
            <p className="text-slate-600">Utilize a interface Kanban para atribuir testes específicos para cada cliente de acordo com suas necessidades.</p>
          </div>

          <div className="text-center p-6">
            <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-white text-xl font-bold mx-auto mb-4">3</div>
            <h3 className="text-xl font-semibold text-slate-900 mb-3">Analise Resultados e Planeje</h3>
            <p className="text-slate-600">Acesse insights detalhados sobre os perfis dos seus clientes e planeje suas próximas sessões de mentoria.</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="flex flex-col md:flex-row">
            <div className="md:w-1/2 p-8 md:p-12 flex items-center">
              <div>
                <h3 className="text-2xl font-bold text-slate-900 mb-4">Dashboard Intuitivo</h3>
                <p className="text-slate-600 mb-6">Um dashboard completo onde você pode monitorar o progresso de todos seus clientes, atribuir novos testes e visualizar estatísticas importantes.</p>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mt-1 mr-2" />
                    <span>Visão geral de todos seus clientes</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mt-1 mr-2" />
                    <span>Acompanhamento de progresso em tempo real</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mt-1 mr-2" />
                    <span>Sistema de ranking e gamificação exclusivo</span>
                  </li>
                </ul>
              </div>
            </div>
            <div className="md:w-1/2">
              <img 
                src="https://images.unsplash.com/photo-1531538606174-0f90ff5dce83?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
                alt="Dashboard do RH Master" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
