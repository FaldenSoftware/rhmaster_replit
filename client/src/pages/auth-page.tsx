import { AuthForm } from "@/components/auth/auth-form";
import { useAuth } from "@/hooks/use-auth";
import { Redirect } from "wouter";

export default function AuthPage() {
  const { user } = useAuth();

  // Redirect if user is already logged in
  if (user) {
    return <Redirect to={user.role === 'mentor' ? "/mentor-dashboard" : "/client-dashboard"} />;
  }

  return (
    <div className="min-h-screen flex">
      {/* Left column - Auth Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md">
          <div className="flex justify-center mb-8">
            <svg className="h-12 w-12 text-primary" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="currentColor"/>
              <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          
          <h1 className="text-3xl font-bold text-center text-slate-900 mb-2">RH Master</h1>
          <p className="text-center text-slate-600 mb-8">Transforme sua mentoria em resultados mensuráveis</p>
          
          <AuthForm />
        </div>
      </div>

      {/* Right column - Hero */}
      <div className="hidden lg:block lg:w-1/2 bg-gradient-to-br from-primary to-primary-light relative">
        <div className="absolute inset-0 bg-opacity-20 bg-black"></div>
        <div className="absolute inset-0 flex items-center justify-center px-12">
          <div className="max-w-lg">
            <h2 className="text-4xl font-bold text-white mb-6">Plataforma para mentores treinarem seus líderes</h2>
            <p className="text-xl text-white/80 mb-8">
              Gerencie seus clientes, atribua testes comportamentais e acompanhe resultados em um único lugar.
            </p>
            <ul className="space-y-4">
              <li className="flex items-start">
                <svg className="h-6 w-6 text-secondary flex-shrink-0 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-white">Testes comportamentais validados</span>
              </li>
              <li className="flex items-start">
                <svg className="h-6 w-6 text-secondary flex-shrink-0 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-white">Sistema de gamificação exclusivo</span>
              </li>
              <li className="flex items-start">
                <svg className="h-6 w-6 text-secondary flex-shrink-0 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-white">Dashboards personalizados para mentores e clientes</span>
              </li>
              <li className="flex items-start">
                <svg className="h-6 w-6 text-secondary flex-shrink-0 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-white">Assistentes virtuais de IA para insights valiosos</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
