import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export function CTASection() {
  return (
    <section className="py-20 bg-primary">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">Pronto para Transformar sua Mentoria?</h2>
          <p className="text-lg text-white/80 mb-8">Junte-se a centenas de mentores que estão elevando sua prática profissional com o RH Master.</p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Link href="/auth">
              <Button className="px-6 py-3 bg-secondary text-slate-900 font-medium hover:bg-secondary-light">
                Comece Gratuitamente
              </Button>
            </Link>
            <Link href="/#contato">
              <Button variant="outline" className="px-6 py-3 bg-white/10 text-white backdrop-blur-sm font-medium hover:bg-white/20 border-white/30">
                Agende uma Demo
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
