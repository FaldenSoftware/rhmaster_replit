import { ReactNode, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Loader2, Save, PauseCircle, PlayCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface TestLayoutProps {
  title: string;
  description: string;
  currentStep: number;
  totalSteps: number;
  children: ReactNode;
  onSave: () => Promise<void>;
  onPause?: () => void;
  onResume?: () => void;
  loading?: boolean;
  className?: string;
  isPaused?: boolean;
}

export function TestLayout({
  title,
  description,
  currentStep,
  totalSteps,
  children,
  onSave,
  onPause,
  onResume,
  loading = false,
  className,
  isPaused = false,
}: TestLayoutProps) {
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  const progress = Math.round((currentStep / totalSteps) * 100);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSave();
      toast({
        title: "Progresso salvo",
        description: "Suas respostas foram salvas com sucesso.",
      });
    } catch (error) {
      toast({
        title: "Erro ao salvar",
        description: "Não foi possível salvar suas respostas. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className={cn("container max-w-4xl mx-auto py-8", className)}>
      <Card className="shadow-lg">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl font-bold text-primary">{title}</CardTitle>
            <div className="flex gap-2">
              {onPause && onResume && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={isPaused ? onResume : onPause}
                  disabled={loading || isSaving}
                >
                  {isPaused ? (
                    <>
                      <PlayCircle className="h-4 w-4 mr-2" />
                      Continuar
                    </>
                  ) : (
                    <>
                      <PauseCircle className="h-4 w-4 mr-2" />
                      Pausar
                    </>
                  )}
                </Button>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={handleSave}
                disabled={loading || isSaving}
              >
                {isSaving ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Salvando...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Salvar
                  </>
                )}
              </Button>
            </div>
          </div>
          <CardDescription>{description}</CardDescription>
          <div className="mt-4">
            <div className="flex justify-between text-sm mb-1">
              <span>Progresso</span>
              <span>{progress}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </CardHeader>
        <CardContent className={cn("pt-4", { "opacity-50": isPaused })}>
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            children
          )}
        </CardContent>
      </Card>
    </div>
  );
}