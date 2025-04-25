import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Clock, AlertTriangle, CheckCircle, ArrowRight, Play, Settings } from "lucide-react";

interface TestCardProps {
  title: string;
  description: string;
  status: "assigned" | "in_progress" | "completed" | "expired";
  dueDate?: string;
  completedDate?: string;
  score?: number;
  onView?: () => void;
  onStart?: () => void;
  onContinue?: () => void;
  estimatedTime?: number; // in minutes
}

export function TestCard({
  title,
  description,
  status,
  dueDate,
  completedDate,
  score,
  onView,
  onStart,
  onContinue,
  estimatedTime
}: TestCardProps) {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-6">
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <div className="space-y-2 flex-1">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
                {status === "in_progress" && (
                  <div className="mt-1 mb-2">
                    <Progress value={35} className="h-1 w-24" />
                    <p className="text-xs mt-1 text-muted-foreground">35% concluído</p>
                  </div>
                )}
              </div>
              <StatusBadge status={status} />
            </div>
            <p className="text-sm text-slate-600 line-clamp-2">{description}</p>
            
            <div className="pt-2 flex flex-wrap gap-4 text-sm">
              {estimatedTime && (
                <div className="flex items-center text-muted-foreground">
                  <Clock className="h-4 w-4 mr-1" />
                  <span>{estimatedTime} min</span>
                </div>
              )}
              
              {dueDate && status !== "completed" && status !== "expired" && (
                <div className="flex items-center text-muted-foreground">
                  <span>Prazo: {new Date(dueDate).toLocaleDateString()}</span>
                </div>
              )}
              
              {status === "completed" && score !== undefined && (
                <div className="flex items-center gap-1">
                  <span className="font-medium">Nota:</span>
                  <span className={`${score >= 70 ? "text-green-600" : score >= 50 ? "text-amber-600" : "text-red-600"}`}>
                    {score}%
                  </span>
                </div>
              )}

              {status === "completed" && completedDate && (
                <div className="flex items-center text-muted-foreground">
                  <span>Concluído em: {new Date(completedDate).toLocaleDateString()}</span>
                </div>
              )}
              
              {status === "expired" && dueDate && (
                <div className="flex items-center text-red-600">
                  <AlertTriangle className="h-4 w-4 mr-1" />
                  <span>Expirado em {new Date(dueDate).toLocaleDateString()}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-end gap-2 px-6 py-4 bg-slate-50">
        {status === "assigned" && onStart && (
          <Button onClick={onStart}>
            <Play className="h-4 w-4 mr-2" />
            Iniciar
          </Button>
        )}
        
        {status === "in_progress" && onContinue && (
          <Button onClick={onContinue}>
            <ArrowRight className="h-4 w-4 mr-2" />
            Continuar
          </Button>
        )}
        
        {status === "completed" && onView && (
          <Button variant="outline" onClick={onView}>
            Ver Resultados
          </Button>
        )}
        
        {status === "expired" && (
          <Button variant="outline" disabled>
            <Settings className="h-4 w-4 mr-2" />
            Solicitar Extensão
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}

function StatusBadge({ status }: { status: TestCardProps["status"] }) {
  switch (status) {
    case "assigned":
      return <Badge variant="outline" className="bg-blue-50 text-blue-800 hover:bg-blue-50">Atribuído</Badge>;
      
    case "in_progress":
      return <Badge variant="outline" className="bg-amber-50 text-amber-800 hover:bg-amber-50">Em Progresso</Badge>;
      
    case "completed":
      return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Concluído</Badge>;
      
    case "expired":
      return <Badge variant="outline" className="bg-red-50 text-red-800 hover:bg-red-50">Expirado</Badge>;
      
    default:
      return null;
  }
}