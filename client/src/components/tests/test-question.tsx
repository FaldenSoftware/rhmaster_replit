import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { ArrowLeft, ArrowRight, Save } from "lucide-react";

export interface TestQuestion {
  id: string;
  text: string;
  options: {
    id: string;
    text: string;
  }[];
}

interface TestQuestionProps {
  question: TestQuestion;
  questionNumber: number;
  totalQuestions: number;
  selectedOption: string | null;
  onAnswer: (questionId: string, optionId: string) => void;
  onPrevious: () => void;
  onNext: () => void;
  onSave: () => void;
  isFirst: boolean;
  isLast: boolean;
}

export function TestQuestion({
  question,
  questionNumber,
  totalQuestions,
  selectedOption,
  onAnswer,
  onPrevious,
  onNext,
  onSave,
  isFirst,
  isLast,
}: TestQuestionProps) {
  const [localSelectedOption, setLocalSelectedOption] = useState<string | null>(selectedOption);
  
  const handleSelect = (optionId: string) => {
    setLocalSelectedOption(optionId);
    onAnswer(question.id, optionId);
  };
  
  const progressPercentage = (questionNumber / totalQuestions) * 100;

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2 text-sm text-muted-foreground">
          <span>Questão {questionNumber} de {totalQuestions}</span>
          <span>{Math.round(progressPercentage)}% completo</span>
        </div>
        <Progress value={progressPercentage} className="h-2" />
      </div>
      
      <div className="mb-6">
        <h2 className="text-xl font-medium mb-6">{question.text}</h2>
        
        <RadioGroup 
          value={localSelectedOption || ""} 
          className="space-y-4"
        >
          {question.options.map((option) => (
            <div key={option.id} className="flex items-start space-x-2">
              <RadioGroupItem 
                value={option.id} 
                id={option.id}
                onClick={() => handleSelect(option.id)}
              />
              <Label 
                htmlFor={option.id} 
                className="text-base font-normal cursor-pointer"
              >
                {option.text}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>
      
      <div className="flex justify-between mt-8">
        <div>
          {!isFirst && (
            <Button variant="outline" onClick={onPrevious}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Anterior
            </Button>
          )}
        </div>
        
        <div className="flex space-x-2">
          <Button variant="outline" onClick={onSave}>
            <Save className="mr-2 h-4 w-4" />
            Salvar e Sair
          </Button>
          
          <Button 
            onClick={onNext} 
            disabled={!localSelectedOption}
          >
            {isLast ? "Finalizar" : "Próxima"}
            {!isLast && <ArrowRight className="ml-2 h-4 w-4" />}
          </Button>
        </div>
      </div>
    </div>
  );
}
