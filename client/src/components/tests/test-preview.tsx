import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Clock, Info, CheckCircle2 } from "lucide-react";

interface TestPreviewProps {
  test: {
    id: string;
    title: string;
    description: string;
    estimatedTime?: number;
    questionCount: number;
    type: string;
  };
  onStart: () => void;
  onCancel: () => void;
}

export function TestPreview({ test, onStart, onCancel }: TestPreviewProps) {
  const getTestTypeInfo = (type: string) => {
    switch (type.toLowerCase()) {
      case "behavior":
        return {
          name: "Perfil Comportamental",
          description: "Este teste avalia seus comportamentos naturais e adaptados em diferentes situações.",
        };
      case "emotional_intelligence":
        return {
          name: "Inteligência Emocional",
          description: "Este teste mede sua capacidade de perceber, usar, compreender e gerenciar emoções.",
        };
      case "enneagram":
        return {
          name: "Eneagrama",
          description: "O Eneagrama é um sistema que descreve nove tipos de personalidade distintos e suas interrelações.",
        };
      default:
        return {
          name: "Teste Comportamental",
          description: "Este teste avalia diferentes aspectos do seu comportamento e personalidade.",
        };
    }
  };
  
  const typeInfo = getTestTypeInfo(test.type);

  return (
    <Card className="max-w-xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl">{test.title}</CardTitle>
        <CardDescription>{test.description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="bg-slate-50 p-4 rounded-lg space-y-4">
          <div className="flex items-start">
            <Clock className="h-5 w-5 text-slate-600 mt-0.5 mr-2" />
            <div>
              <h4 className="font-medium">Tempo Estimado</h4>
              <p className="text-sm text-slate-600">
                {test.estimatedTime 
                  ? `Aproximadamente ${test.estimatedTime} minutos para completar` 
                  : "Responda em seu próprio ritmo"}
              </p>
            </div>
          </div>
          
          <div className="flex items-start">
            <CheckCircle2 className="h-5 w-5 text-slate-600 mt-0.5 mr-2" />
            <div>
              <h4 className="font-medium">Formato</h4>
              <p className="text-sm text-slate-600">
                {test.questionCount} questões de múltipla escolha
              </p>
            </div>
          </div>
          
          <div className="flex items-start">
            <Info className="h-5 w-5 text-slate-600 mt-0.5 mr-2" />
            <div>
              <h4 className="font-medium">Sobre {typeInfo.name}</h4>
              <p className="text-sm text-slate-600">
                {typeInfo.description}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-primary/5 p-4 rounded-lg">
          <h4 className="font-medium mb-2">Instruções</h4>
          <ul className="text-sm text-slate-600 space-y-2 list-disc pl-5">
            <li>Leia cada questão com atenção antes de responder.</li>
            <li>Responda com base em como você geralmente pensa, sente e age.</li>
            <li>Não há respostas certas ou erradas, seja honesto(a) em suas escolhas.</li>
            <li>O teste pode ser pausado e retomado mais tarde se necessário.</li>
            <li>Após completar o teste, você terá acesso a um relatório detalhado.</li>
          </ul>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={onCancel}>
          Voltar
        </Button>
        <Button onClick={onStart}>
          Iniciar Teste
        </Button>
      </CardFooter>
    </Card>
  );
}
