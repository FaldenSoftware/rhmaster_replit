import { useState, useEffect } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Activity,
  Bell, 
  BrainCircuit, 
  Check, 
  ChevronRight,
  ClipboardList,
  HelpCircle,
  LayoutDashboard,
  Lightbulb,
  Loader2,
  User,
  X 
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AssistantType } from "@/lib/gemini-service";
import { useAuth } from "@/hooks/use-auth";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface Suggestion {
  id: number;
  title: string;
  content: string;
  contextType: "test_results" | "client_progress" | "profile_analysis" | "test_taking" | "dashboard";
  createdAt: string;
  isRead: boolean;
}

interface SuggestionsPanelProps {
  assistantType: AssistantType;
  onSelectSuggestion?: (suggestion: Suggestion) => void;
  className?: string;
}

export function SuggestionsPanel({ 
  assistantType, 
  onSelectSuggestion,
  className 
}: SuggestionsPanelProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("all");

  // Carregar sugestões
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (!user) return;
      
      setIsLoading(true);
      
      try {
        const response = await apiRequest("GET", `/api/assistant/suggestions?type=${assistantType}`);
        const data = await response.json();
        setSuggestions(data);
      } catch (error) {
        console.error("Erro ao carregar sugestões:", error);
        toast({
          variant: "destructive",
          title: "Erro ao carregar sugestões",
          description: "Não foi possível carregar as sugestões. Tente novamente mais tarde."
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchSuggestions();
    
    // Atualizar sugestões a cada 5 minutos
    const interval = setInterval(fetchSuggestions, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, [user, assistantType, toast]);

  // Marcar sugestão como lida
  const markAsRead = async (suggestionId: number) => {
    try {
      await apiRequest("PATCH", `/api/assistant/suggestions/${suggestionId}/read`);
      
      setSuggestions(prev => 
        prev.map(suggestion => 
          suggestion.id === suggestionId 
            ? { ...suggestion, isRead: true } 
            : suggestion
        )
      );
    } catch (error) {
      console.error("Erro ao marcar sugestão como lida:", error);
      toast({
        variant: "destructive",
        title: "Erro ao marcar sugestão como lida",
        description: "Não foi possível marcar a sugestão como lida. Tente novamente mais tarde."
      });
    }
  };

  // Ignorar sugestão
  const dismissSuggestion = async (suggestionId: number) => {
    try {
      await apiRequest("DELETE", `/api/assistant/suggestions/${suggestionId}`);
      
      setSuggestions(prev => 
        prev.filter(suggestion => suggestion.id !== suggestionId)
      );
      
      toast({
        title: "Sugestão removida",
        description: "A sugestão foi removida com sucesso."
      });
    } catch (error) {
      console.error("Erro ao remover sugestão:", error);
      toast({
        variant: "destructive",
        title: "Erro ao remover sugestão",
        description: "Não foi possível remover a sugestão. Tente novamente mais tarde."
      });
    }
  };

  // Filtrar sugestões com base na tab ativa
  const filteredSuggestions = suggestions.filter(suggestion => {
    if (activeTab === "all") return true;
    if (activeTab === "unread") return !suggestion.isRead;
    return suggestion.contextType === activeTab;
  });

  // Formatar data
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSec = Math.round(diffMs / 1000);
    const diffMin = Math.round(diffSec / 60);
    const diffHour = Math.round(diffMin / 60);
    const diffDay = Math.round(diffHour / 24);
    
    if (diffSec < 60) return "Agora mesmo";
    if (diffMin < 60) return `${diffMin} min atrás`;
    if (diffHour < 24) return `${diffHour} h atrás`;
    if (diffDay === 1) return "Ontem";
    if (diffDay < 7) return `${diffDay} dias atrás`;
    
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric"
    });
  };

  // Obter ícone com base no tipo de contexto
  const getContextIcon = (type: Suggestion["contextType"]) => {
    switch (type) {
      case "test_results":
        return <ClipboardList className="h-5 w-5" />;
      case "client_progress":
        return <Activity className="h-5 w-5" />;
      case "profile_analysis":
        return <User className="h-5 w-5" />;
      case "test_taking":
        return <HelpCircle className="h-5 w-5" />;
      case "dashboard":
        return <LayoutDashboard className="h-5 w-5" />;
      default:
        return <Lightbulb className="h-5 w-5" />;
    }
  };

  // Obter cor com base no tipo de contexto
  const getContextColor = (type: Suggestion["contextType"]) => {
    switch (type) {
      case "test_results":
        return "bg-blue-100 text-blue-700";
      case "client_progress":
        return "bg-green-100 text-green-700";
      case "profile_analysis":
        return "bg-purple-100 text-purple-700";
      case "test_taking":
        return "bg-amber-100 text-amber-700";
      case "dashboard":
        return "bg-slate-100 text-slate-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  // Obter rótulo com base no tipo de contexto
  const getContextLabel = (type: Suggestion["contextType"]) => {
    switch (type) {
      case "test_results":
        return "Resultados de Teste";
      case "client_progress":
        return "Progresso do Cliente";
      case "profile_analysis":
        return "Análise de Perfil";
      case "test_taking":
        return "Realização de Teste";
      case "dashboard":
        return "Dashboard";
      default:
        return "Geral";
    }
  };

  return (
    <Card className={cn("border shadow-md h-full", className)}>
      <CardHeader className="px-4 py-3 border-b flex flex-row items-center justify-between">
        <div className="flex items-center space-x-2">
          <BrainCircuit className="h-5 w-5 text-primary" />
          <CardTitle className="text-lg">Insights do Assistente</CardTitle>
        </div>
        
        <Badge variant="outline" className="bg-primary/10 text-primary">
          {suggestions.filter(s => !s.isRead).length} novos
        </Badge>
      </CardHeader>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="px-4 pt-2 border-b">
          <TabsList className="grid grid-cols-3">
            <TabsTrigger value="all">Todos</TabsTrigger>
            <TabsTrigger value="unread">Não lidos</TabsTrigger>
            <TabsTrigger value="test_results">Resultados</TabsTrigger>
          </TabsList>
        </div>
        
        <ScrollArea className="h-[400px]">
          <CardContent className="p-4">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-10">
                <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
                <p className="text-muted-foreground">Carregando sugestões...</p>
              </div>
            ) : filteredSuggestions.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <Lightbulb className="h-10 w-10 text-muted-foreground mb-4" />
                <h3 className="font-medium text-lg mb-2">Nenhuma sugestão disponível</h3>
                <p className="text-muted-foreground max-w-md">
                  À medida que você usa o sistema, o assistente gerará insights personalizados para ajudar em seu trabalho.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredSuggestions.map((suggestion) => (
                  <div 
                    key={suggestion.id}
                    className={cn(
                      "rounded-lg border p-4 transition-colors relative",
                      !suggestion.isRead && "bg-primary/5 border-primary/20"
                    )}
                  >
                    {!suggestion.isRead && (
                      <div className="absolute top-4 right-4 h-2 w-2 rounded-full bg-primary" />
                    )}
                    
                    <div className="flex items-start gap-3 mb-3">
                      <div className={cn(
                        "p-2 rounded-full",
                        getContextColor(suggestion.contextType)
                      )}>
                        {getContextIcon(suggestion.contextType)}
                      </div>
                      
                      <div className="flex-1">
                        <h4 className="font-medium text-md leading-tight mb-1">{suggestion.title}</h4>
                        <div className="flex items-center">
                          <Badge 
                            variant="outline" 
                            className={cn(
                              "h-6 text-xs font-normal",
                              getContextColor(suggestion.contextType)
                            )}
                          >
                            {getContextLabel(suggestion.contextType)}
                          </Badge>
                          <span className="text-xs text-muted-foreground ml-2">
                            {formatDate(suggestion.createdAt)}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-3">{suggestion.content}</p>
                    
                    <div className="flex justify-between items-center mt-2">
                      <div className="flex space-x-2">
                        <Button 
                          variant="ghost"
                          size="sm"
                          className="h-8 text-destructive"
                          onClick={() => dismissSuggestion(suggestion.id)}
                        >
                          <X className="h-4 w-4 mr-1" />
                          <span className="text-xs">Ignorar</span>
                        </Button>
                        
                        {!suggestion.isRead && (
                          <Button 
                            variant="ghost"
                            size="sm"
                            className="h-8"
                            onClick={() => markAsRead(suggestion.id)}
                          >
                            <Check className="h-4 w-4 mr-1" />
                            <span className="text-xs">Marcar como lido</span>
                          </Button>
                        )}
                      </div>
                      
                      {onSelectSuggestion && (
                        <Button 
                          variant="ghost"
                          size="sm"
                          className="h-8 text-primary"
                          onClick={() => {
                            if (!suggestion.isRead) markAsRead(suggestion.id);
                            onSelectSuggestion(suggestion);
                          }}
                        >
                          <span className="text-xs mr-1">Ver mais</span>
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </ScrollArea>
      </Tabs>
    </Card>
  );
}