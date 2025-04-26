import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'wouter';
import { apiRequest } from '@/lib/queryClient';
import { useAuth } from '@/hooks/use-auth';
import { 
  AlertCircle, 
  Calendar, 
  ExternalLink,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { useLocalStorage } from '@/hooks/use-local-storage';

// Tipo de dados para as informações de trial
type TrialInfo = {
  isTrialActive: boolean;
  daysRemaining: number;
  trialEndDate: string;
  hasActiveSubscription: boolean;
  plan?: string;
};

export function TrialNotification() {
  const { user } = useAuth();
  const [dismissed, setDismissed] = useLocalStorage<boolean>('trial-notification-dismissed', false);
  
  // Reset quando muda de usuário
  const userId = user?.id || 0;
  const storageKey = `trial-notification-dismissed-${userId}`;
  const [isDismissed, setIsDismissed] = useLocalStorage<boolean>(storageKey, false);
  
  // Busca informações do período trial
  const { data: trialInfo, isLoading } = useQuery<TrialInfo>({
    queryKey: ['/api/subscription/trial-info'],
    enabled: !!user && user.role === 'mentor',
  });
  
  // Se não for mentor, dados não estiverem carregados, ou notificação já estiver dispensada, não mostra nada
  if (!user || user.role !== 'mentor' || isLoading || isDismissed) {
    return null;
  }
  
  // Se não tiver dados do trial ou não estiver em período trial, não mostra nada
  if (!trialInfo || !trialInfo.isTrialActive || trialInfo.hasActiveSubscription) {
    return null;
  }
  
  // Determina a cor com base nos dias restantes
  const getBadgeVariant = (): "default" | "destructive" | "outline" => {
    if (trialInfo.daysRemaining <= 3) return "destructive";
    if (trialInfo.daysRemaining <= 7) return "default";
    return "outline";
  };
  
  return (
    <div className="bg-muted/50 border rounded-md px-4 py-3 mb-4 relative">
      <Button
        variant="ghost"
        size="icon"
        className="absolute right-2 top-2 h-6 w-6"
        onClick={() => setIsDismissed(true)}
        aria-label="Dispensar notificação"
      >
        <X className="h-4 w-4" />
      </Button>
      
      <div className="flex flex-col md:flex-row md:items-center gap-3">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-primary" />
            <h3 className="font-semibold">Período de Avaliação</h3>
            <Badge variant={getBadgeVariant()}>
              {trialInfo.daysRemaining} dias restantes
            </Badge>
          </div>
          
          <p className="text-sm text-muted-foreground mt-1">
            Seu período de avaliação gratuito termina em{' '}
            <span className="font-medium text-foreground">
              {new Date(trialInfo.trialEndDate).toLocaleDateString('pt-BR')}
            </span>. 
            Assine agora para continuar acessando todos os recursos.
          </p>
        </div>
        
        <div className="shrink-0">
          <Button asChild className="w-full md:w-auto">
            <Link href="/subscription">
              Assinar Agora <ExternalLink className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}