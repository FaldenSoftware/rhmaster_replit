import { BehavioralProfileTest } from "@/components/tests/BehavioralProfileTest";
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";

export default function BehavioralProfilePage() {
  const { user } = useAuth();

  // Redirecionar para login se não autenticado
  const [, setLocation] = useLocation();
  if (!user) {
    setLocation("/auth");
    return null;
  }

  // Apenas clientes podem realizar os testes
  if (user.role !== "client") {
    return (
      <div className="container mx-auto p-8 text-center">
        <h1 className="text-2xl font-bold text-primary mb-4">Acesso Restrito</h1>
        <p className="mb-4">
          Este teste é destinado apenas aos clientes do RH Master.
        </p>
        <p>
          Os mentores podem visualizar os resultados dos testes através do dashboard.
        </p>
      </div>
    );
  }

  return <BehavioralProfileTest />;
}