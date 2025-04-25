import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, Clock, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

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
  estimatedTime,
}: TestCardProps) {
  const getStatusBadge = () => {
    switch (status) {
      case "assigned":
        return (
          <Badge variant="outline" className="bg-slate-100 text-slate-800">
            Atribuído
          </Badge>
        );
      case "in_progress":
        return (
          <Badge variant="outline" className="bg-blue-100 text-blue-800">
            Em Progresso
          </Badge>
        );
      case "completed":
        return (
          <Badge variant="outline" className="bg-green-100 text-green-800">
            Concluído
          </Badge>
        );
      case "expired":
        return (
          <Badge variant="outline" className="bg-red-100 text-red-800">
            Expirado
          </Badge>
        );
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case "assigned":
        return (
          <div className="p-2 bg-slate-100 rounded-md">
            <Clock className="h-5 w-5 text-slate-600" />
          </div>
        );
      case "in_progress":
        return (
          <div className="p-2 bg-blue-100 rounded-md">
            <Clock className="h-5 w-5 text-blue-600" />
          </div>
        );
      case "completed":
        return (
          <div className="p-2 bg-green-100 rounded-md">
            <CheckCircle2 className="h-5 w-5 text-green-600" />
          </div>
        );
      case "expired":
        return (
          <div className="p-2 bg-red-100 rounded-md">
            <AlertCircle className="h-5 w-5 text-red-600" />
          </div>
        );
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return null;
    
    const date = new Date(dateString);
    return date.toLocaleDateString("pt-BR");
  };

  const getRemainingDays = () => {
    if (!dueDate) return null;
    
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays <= 0) return null;
    
    if (diffDays === 1) return "1 dia restante";
    return `${diffDays} dias restantes`;
  };

  const getActionButton = () => {
    switch (status) {
      case "assigned":
        return (
          <Button size="sm" className="w-full mt-2" onClick={onStart}>
            Iniciar Teste
          </Button>
        );
      case "in_progress":
        return (
          <Button size="sm" className="w-full mt-2" onClick={onContinue}>
            Continuar Teste
          </Button>
        );
      case "completed":
      case "expired":
        return (
          <Button 
            size="sm" 
            variant="outline" 
            className="w-full mt-2" 
            onClick={onView}
          >
            Ver Detalhes
          </Button>
        );
    }
  };

  return (
    <div className="p-4 bg-slate-50 rounded-lg">
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h4 className="font-semibold text-slate-900">{title}</h4>
            {getStatusBadge()}
          </div>
          <p className="text-sm text-slate-600 mt-1">{description}</p>
          {estimatedTime && (
            <p className="text-xs text-slate-500 mt-1">
              Tempo estimado: {estimatedTime} minutos
            </p>
          )}
        </div>
        {getStatusIcon()}
      </div>
      <div className="mt-4">
        {status === "completed" && score !== undefined && (
          <div className="mt-2">
            <div className="flex justify-between text-sm mb-1">
              <span>Resultado</span>
              <span className="font-medium">{score}/100</span>
            </div>
            <Progress value={score} className="h-2" />
          </div>
        )}
        
        <div className="flex justify-between text-xs mb-1 mt-3">
          {status === "completed" && completedDate && (
            <span className="font-medium">
              Completado em: {formatDate(completedDate)}
            </span>
          )}
          {(status === "assigned" || status === "in_progress") && dueDate && (
            <>
              <span className="font-medium">Prazo</span>
              <span className={getRemainingDays() ? "text-amber-600" : "text-red-600"}>
                {getRemainingDays() || `Vence em: ${formatDate(dueDate)}`}
              </span>
            </>
          )}
        </div>
        
        {getActionButton()}
      </div>
    </div>
  );
}
