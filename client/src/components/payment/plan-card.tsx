import React from 'react';
import { Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

export type PlanFeature = {
  name: string;
  included: boolean;
};

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
  return (
    <Card 
      className={cn(
        "relative flex flex-col justify-between overflow-hidden transition-all border-2",
        popular ? "border-primary shadow-lg scale-[1.02]" : "border-muted",
        current ? "bg-primary/5" : ""
      )}
    >
      {popular && (
        <div className="absolute top-0 right-0">
          <div className="text-xs font-bold uppercase text-white bg-primary py-1 px-3 rounded-bl-md">
            Popular
          </div>
        </div>
      )}
      
      <div>
        <CardHeader>
          <CardTitle className="text-xl">{name}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        
        <CardContent>
          <div className="mb-4">
            <span className="text-3xl font-bold">R${price.toFixed(2)}</span>
            <span className="text-muted-foreground">/mês</span>
          </div>
          
          <ul className="space-y-2">
            {features.map((feature, index) => (
              <li key={index} className="flex items-center gap-2">
                {feature.included ? (
                  <Check className="h-4 w-4 text-primary" />
                ) : (
                  <X className="h-4 w-4 text-muted-foreground" />
                )}
                <span className={cn(
                  "text-sm",
                  !feature.included && "text-muted-foreground line-through"
                )}>
                  {feature.name}
                </span>
              </li>
            ))}
          </ul>
        </CardContent>
      </div>
      
      <CardFooter className="pt-4">
        <Button 
          className="w-full" 
          variant={current ? "secondary" : popular ? "default" : "outline"}
          onClick={() => onSelect(id)}
          disabled={disabled || current}
        >
          {current ? "Plano Atual" : "Selecionar Plano"}
        </Button>
      </CardFooter>
    </Card>
  );
}