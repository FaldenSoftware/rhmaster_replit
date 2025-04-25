import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronRight, Lightbulb } from "lucide-react";
import { useState } from "react";

export function WelcomeMessage() {
  const { user } = useAuth();
  const [showTip, setShowTip] = useState(true);

  if (!user) return null;

  const getTip = () => {
    if (user.role === "mentor") {
      return (
        <>
          <Lightbulb className="h-6 w-6 text-primary mr-2 flex-shrink-0" />
          <div>
            <p className="text-sm font-medium">Dica do dia</p>
            <p className="text-sm text-muted-foreground">
              Lembre-se de revisar os resultados dos testes completados pelos seus clientes 
              para fornecer feedback personalizado.
            </p>
          </div>
        </>
      );
    } else {
      return (
        <>
          <Lightbulb className="h-6 w-6 text-primary mr-2 flex-shrink-0" />
          <div>
            <p className="text-sm font-medium">Dica do dia</p>
            <p className="text-sm text-muted-foreground">
              Complete os testes atribuídos pelo seu mentor para obter insights valiosos 
              sobre seu perfil de liderança.
            </p>
          </div>
        </>
      );
    }
  };

  return (
    <Card className="mb-6">
      <CardContent className="pt-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-2xl font-bold">
              Bem-vindo(a), {user.name}!
            </h2>
            <p className="text-muted-foreground">
              {user.role === "mentor"
                ? "Gerencie seus clientes e acompanhe seu progresso em um só lugar."
                : "Acompanhe seu progresso e complete os testes atribuídos pelo seu mentor."}
            </p>
          </div>
          <div className="mt-4 md:mt-0">
            <Button>
              {user.role === "mentor" ? "Ver Clientes" : "Ver Testes"}
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>

        {showTip && (
          <div className="mt-4 bg-primary/5 p-4 rounded-md flex items-start">
            {getTip()}
            <Button 
              variant="ghost" 
              size="sm" 
              className="ml-auto flex-shrink-0" 
              onClick={() => setShowTip(false)}
            >
              Fechar
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
