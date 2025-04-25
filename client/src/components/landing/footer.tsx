import { Link } from "wouter";
import { Separator } from "@/components/ui/separator";
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 py-12">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="h-8 w-8 bg-primary rounded-full flex items-center justify-center">
                <svg className="h-5 w-5 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="currentColor"/>
                  <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <span className="font-bold text-xl text-white">RH Master</span>
            </div>
            <p className="text-slate-400 mb-4">
              Transforme sua mentoria em resultados mensuráveis com testes comportamentais e análises poderosas.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-slate-400 hover:text-white transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-slate-400 hover:text-white transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-slate-400 hover:text-white transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-slate-400 hover:text-white transition-colors">
                <Linkedin size={20} />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="font-bold text-white mb-4">Plataforma</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/auth">
                  <a className="hover:text-white transition-colors">Entrar</a>
                </Link>
              </li>
              <li>
                <Link href="/auth?tab=register">
                  <a className="hover:text-white transition-colors">Cadastre-se</a>
                </Link>
              </li>
              <li>
                <Link href="#pricing">
                  <a className="hover:text-white transition-colors">Planos</a>
                </Link>
              </li>
              <li>
                <Link href="#features">
                  <a className="hover:text-white transition-colors">Recursos</a>
                </Link>
              </li>
              <li>
                <Link href="#testimonials">
                  <a className="hover:text-white transition-colors">Depoimentos</a>
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-bold text-white mb-4">Recursos</h3>
            <ul className="space-y-3">
              <li>
                <a href="#" className="hover:text-white transition-colors">Blog</a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">Documentação</a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">Webinars</a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">Tutoriais</a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">API</a>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-bold text-white mb-4">Contato</h3>
            <ul className="space-y-3">
              <li className="flex items-center">
                <Mail size={18} className="mr-2 text-primary" />
                <a href="mailto:contato@rhmaster.com.br" className="hover:text-white transition-colors">
                  contato@rhmaster.com.br
                </a>
              </li>
              <li className="flex items-center">
                <Phone size={18} className="mr-2 text-primary" />
                <a href="tel:+551199999999" className="hover:text-white transition-colors">
                  +55 11 9999-9999
                </a>
              </li>
              <li className="mt-4">
                <a href="#" className="inline-block px-4 py-2 rounded-md bg-primary text-white hover:bg-primary-dark transition-colors">
                  Fale Conosco
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <Separator className="bg-slate-800" />
        
        <div className="mt-8 flex flex-col md:flex-row justify-between">
          <div className="mb-4 md:mb-0">
            <p>&copy; {new Date().getFullYear()} RH Master. Todos os direitos reservados.</p>
          </div>
          <div className="flex flex-wrap gap-4">
            <a href="#" className="hover:text-white transition-colors">Termos de Uso</a>
            <a href="#" className="hover:text-white transition-colors">Política de Privacidade</a>
            <a href="#" className="hover:text-white transition-colors">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
}