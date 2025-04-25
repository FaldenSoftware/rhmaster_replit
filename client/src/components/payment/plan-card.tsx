import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PlanFeature {
  text: string;
  included: boolean;
}

export interface PlanCardProps {
  id: 'basic' | 'pro' | 'enterprise';
  title: string;
  price: number;
  description: string;
  features: PlanFeature[];
  isRecommended?: boolean;
  isLoading?: boolean;
  isUserCurrentPlan?: boolean;
  onSubscribe: (planId: string) => void;
}

export function PlanCard({
  id,
  title,
  price,
  description,
  features,
  isRecommended = false,
  isLoading = false,
  isUserCurrentPlan = false,
  onSubscribe
}: PlanCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  // Mapeia os IDs de plano para cores específicas
  const planColors = {
    basic: 'border-slate-200 bg-slate-50 hover:border-slate-300',
    pro: 'border-emerald-200 bg-emerald-50 hover:border-emerald-300',
    enterprise: 'border-violet-200 bg-violet-50 hover:border-violet-300'
  };

  // Mapeia os IDs de plano para cores de botões
  const buttonColors = {
    basic: 'bg-slate-700 hover:bg-slate-800',
    pro: 'bg-emerald-700 hover:bg-emerald-800',
    enterprise: 'bg-violet-700 hover:bg-violet-800'
  };

  return (
    <Card 
      className={cn(
        "w-full transition-all duration-300",
        planColors[id],
        isRecommended && "border-2 border-primary shadow-lg scale-105",
        isHovered && "shadow-md transform -translate-y-1"
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {isRecommended && (
        <div className="absolute -top-4 left-0 right-0 flex justify-center">
          <span className="bg-primary text-primary-foreground text-xs font-semibold rounded-full px-3 py-1">
            Recomendado
          </span>
        </div>
      )}
      
      <CardHeader>
        <CardTitle className="text-xl font-bold">{title}</CardTitle>
        <CardDescription className="text-sm">{description}</CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="flex items-baseline">
          <span className="text-3xl font-bold">R${price}</span>
          <span className="text-sm text-muted-foreground ml-1">/mês</span>
        </div>
        
        <ul className="space-y-2">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start">
              <CheckCircle 
                className={cn(
                  "h-5 w-5 mr-2 flex-shrink-0",
                  feature.included ? "text-green-500" : "text-gray-300"
                )} 
              />
              <span className={cn(
                "text-sm",
                !feature.included && "text-muted-foreground line-through"
              )}>
                {feature.text}
              </span>
            </li>
          ))}
        </ul>
      </CardContent>
      
      <CardFooter>
        <Button 
          className={cn(
            "w-full", 
            buttonColors[id],
            isUserCurrentPlan && "bg-green-600 hover:bg-green-700"
          )}
          disabled={isLoading || isUserCurrentPlan}
          onClick={() => onSubscribe(id)}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processando...
            </>
          ) : isUserCurrentPlan ? (
            "Plano Atual"
          ) : (
            "Assinar Agora"
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}