import { Link } from "wouter";
import { Facebook, Instagram, Twitter, Github } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-slate-900 text-white py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center mb-4">
              <svg className="h-8 w-8 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="currentColor"/>
                <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span className="ml-2 text-xl font-semibold">RH Master</span>
            </div>
            <p className="text-slate-300 mb-4">Transformando mentoria em resultados mensuráveis.</p>
            <div className="flex space-x-4">
              <a href="#" className="text-slate-300 hover:text-white">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-slate-300 hover:text-white">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-slate-300 hover:text-white">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-slate-300 hover:text-white">
                <Github className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Plataforma</h3>
            <ul className="space-y-2">
              <li><Link href="/#recursos" className="text-slate-300 hover:text-white">Recursos</Link></li>
              <li><Link href="/#como-funciona" className="text-slate-300 hover:text-white">Como Funciona</Link></li>
              <li><Link href="/#planos" className="text-slate-300 hover:text-white">Planos e Preços</Link></li>
              <li><Link href="/#faq" className="text-slate-300 hover:text-white">Perguntas Frequentes</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Suporte</h3>
            <ul className="space-y-2">
              <li><Link href="/help" className="text-slate-300 hover:text-white">Centro de Ajuda</Link></li>
              <li><Link href="/#contato" className="text-slate-300 hover:text-white">Contato</Link></li>
              <li><Link href="/docs" className="text-slate-300 hover:text-white">Documentação</Link></li>
              <li><Link href="/status" className="text-slate-300 hover:text-white">Status do Sistema</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Legal</h3>
            <ul className="space-y-2">
              <li><Link href="/terms" className="text-slate-300 hover:text-white">Termos de Serviço</Link></li>
              <li><Link href="/privacy" className="text-slate-300 hover:text-white">Política de Privacidade</Link></li>
              <li><Link href="/cookies" className="text-slate-300 hover:text-white">Política de Cookies</Link></li>
              <li><Link href="/security" className="text-slate-300 hover:text-white">Segurança</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-slate-700 text-center text-slate-400">
          <p>&copy; {new Date().getFullYear()} RH Master. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
