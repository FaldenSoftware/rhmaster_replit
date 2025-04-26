import { useState } from "react";
import { DashboardLayout } from "@/layouts/dashboard-layout";
import { ChatWindow } from "@/components/assistant/chat-window";
import { SuggestionsPanel } from "@/components/assistant/suggestions-panel";
import { AssistantType } from "@/lib/gemini-service";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/use-auth";
import { useIsMobile } from "@/hooks/use-mobile";
import { Loader2, BrainCircuit, Sparkles, HelpCircle, Info } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export default function MentorAssistantPage() {
  const { user, isLoading } = useAuth();
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const [activeTab, setActiveTab] = useState<string>("chat");
  const [selectedSuggestion, setSelectedSuggestion] = useState<any>(null);

  // Tipo de assistente para esse contexto
  const assistantType: AssistantType = "mentor";

  // Manipula a seleção de uma sugestão
  const handleSelectSuggestion = (suggestion: any) => {
    setSelectedSuggestion(suggestion);
    setActiveTab("chat");
    
    toast({
      title: "Sugestão selecionada",
      description: "A sugestão foi carregada no chat."
    });
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[calc(100vh-150px)]">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto py-8 px-4">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 p-2 rounded-full">
                <BrainCircuit className="h-6 w-6 text-primary" />
              </div>
              <h1 className="text-2xl font-bold">Assistente do Mentor</h1>
              <Badge variant="outline" className="ml-2 bg-green-50 text-green-700 border-green-200">
                Powered by Gemini AI
              </Badge>
            </div>
            <p className="text-muted-foreground mt-2 ml-11">
              O assistente inteligente que ajuda você a potencializar sua prática de mentoria.
            </p>
          </div>
          
          {!isMobile && (
            <Card className="bg-primary/5 border-primary/10 w-auto">
              <CardContent className="p-4 flex items-center gap-3">
                <Info className="h-5 w-5 text-primary flex-shrink-0" />
                <p className="text-sm">
                  Seu assistente aprende com suas interações e oferece insights personalizados conforme você usa a plataforma.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
        
        <Separator className="mb-8" />
        
        {isMobile ? (
          // Layout para dispositivos móveis com abas
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid grid-cols-2 w-full">
              <TabsTrigger value="chat" className="flex items-center gap-2">
                <BrainCircuit className="h-4 w-4" /> 
                <span>Conversar</span>
              </TabsTrigger>
              <TabsTrigger value="insights" className="flex items-center gap-2">
                <Sparkles className="h-4 w-4" />
                <span>Insights</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="chat" className="m-0 mt-6">
              <ChatWindow 
                assistantType={assistantType} 
                contextData={{
                  mentorId: user?.id,
                  mentorName: user?.name,
                  role: user?.role
                }}
              />
            </TabsContent>
            
            <TabsContent value="insights" className="m-0 mt-6">
              <SuggestionsPanel 
                assistantType={assistantType} 
                onSelectSuggestion={handleSelectSuggestion}
              />
            </TabsContent>
          </Tabs>
        ) : (
          // Layout para desktop com painéis lado a lado
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Card className="border shadow-lg overflow-hidden h-full">
                <CardHeader className="bg-white p-4 border-b flex flex-row items-center gap-3">
                  <BrainCircuit className="h-5 w-5 text-primary" />
                  <div>
                    <CardTitle>Chat com Assistente</CardTitle>
                    <CardDescription>
                      Faça perguntas sobre mentoria, desenvolvimento de líderes e análise de comportamento
                    </CardDescription>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <ChatWindow 
                    assistantType={assistantType} 
                    isFullScreen
                    contextData={{
                      mentorId: user?.id,
                      mentorName: user?.name,
                      role: user?.role
                    }}
                  />
                </CardContent>
              </Card>
            </div>
            
            <div className="lg:col-span-1">
              <SuggestionsPanel 
                assistantType={assistantType} 
                onSelectSuggestion={handleSelectSuggestion}
                className="h-[calc(100vh-300px)]"
              />
              
              <Card className="border shadow-md mt-6">
                <CardHeader className="p-4 pb-0">
                  <div className="flex items-center gap-2">
                    <HelpCircle className="h-4 w-4 text-primary" />
                    <CardTitle className="text-base">Como usar o assistente</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="p-4 pt-2">
                  <ul className="text-sm space-y-2 text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <span className="bg-primary/10 text-primary font-medium rounded-full h-5 w-5 flex items-center justify-center text-xs flex-shrink-0 mt-0.5">1</span>
                      <span>Faça perguntas específicas sobre mentoria e desenvolvimento de líderes</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="bg-primary/10 text-primary font-medium rounded-full h-5 w-5 flex items-center justify-center text-xs flex-shrink-0 mt-0.5">2</span>
                      <span>Peça sugestões de atividades para seus clientes baseadas em seus perfis</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="bg-primary/10 text-primary font-medium rounded-full h-5 w-5 flex items-center justify-center text-xs flex-shrink-0 mt-0.5">3</span>
                      <span>Solicite interpretações de resultados de testes comportamentais</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}