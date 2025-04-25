import React from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckIcon, XIcon } from 'lucide-react';
import { motion } from 'framer-motion';

// Tipo para as características do plano
export type PlanFeature = {
  name: string;
  included: boolean;
};

// Propriedades do componente de cartão de plano
export type PlanProps = {
  id: string;
  name: string;
  description: string;
  price: number;
  features: PlanFeature[];
  popular?: boolean;
  current?: boolean;
  onSelect: (id: string) => void;
  disabled?: boolean;
};

export function PlanCard({ 
  id, 
  name, 
  description, 
  price, 
  features, 
  popular = false, 
  current = false,
  onSelect,
  disabled = false
}: PlanProps) {
  
  // Handler para seleção do plano
  const handleSelect = () => {
    if (!disabled) {
      onSelect(id);
    }
  };
  
  return (
    <Card 
      className={`h-full relative ${
        popular 
          ? 'border-primary shadow-md' 
          : current 
            ? 'border-secondary shadow-sm' 
            : ''
      }`}
    >
      {popular && (
        <div className="absolute -top-3 left-0 right-0 flex justify-center">
          <Badge 
            variant="default" 
            className="rounded-full px-4 py-1 bg-primary text-primary-foreground"
          >
            Mais Popular
          </Badge>
        </div>
      )}
      
      {current && (
        <div className="absolute -top-3 left-0 right-0 flex justify-center">
          <Badge 
            variant="secondary" 
            className="rounded-full px-4 py-1"
          >
            Plano Atual
          </Badge>
        </div>
      )}
      
      <CardHeader>
        <CardTitle>{name}</CardTitle>
        <CardDescription>{description}</CardDescription>
        <div className="mt-4">
          <span className="text-3xl font-bold">
            R${price.toFixed(2)}
          </span>
          <span className="text-muted-foreground">/mês</span>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="space-y-2">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="flex items-center gap-2"
            >
              {feature.included ? (
                <CheckIcon className="h-5 w-5 text-primary flex-shrink-0" />
              ) : (
                <XIcon className="h-5 w-5 text-muted-foreground flex-shrink-0" />
              )}
              
              <span className={`text-sm ${!feature.included ? 'text-muted-foreground' : ''}`}>
                {feature.name}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
      
      <CardFooter>
        <Button
          onClick={handleSelect}
          className="w-full"
          variant={popular ? "default" : "outline"}
          disabled={disabled}
        >
          {current ? 'Plano Atual' : 'Selecionar Plano'}
        </Button>
      </CardFooter>
    </Card>
  );
}