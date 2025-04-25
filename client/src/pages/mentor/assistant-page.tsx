import { useState } from "react";
import { DashboardLayout } from "@/layouts/dashboard-layout";
import { ChatWindow } from "@/components/assistant/chat-window";
import { SuggestionsPanel } from "@/components/assistant/suggestions-panel";
import { AssistantType } from "@/lib/gemini-service";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/use-auth";
import { useIsMobile } from "@/hooks/use-mobile";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

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
      <div className="container py-6">
        <h1 className="text-3xl font-bold mb-6">Assistente do Mentor</h1>
        
        {isMobile ? (
          // Layout para dispositivos móveis com abas
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-2 mb-4">
              <TabsTrigger value="chat">Chat</TabsTrigger>
              <TabsTrigger value="insights">Insights</TabsTrigger>
            </TabsList>
            
            <TabsContent value="chat" className="m-0">
              <ChatWindow 
                assistantType={assistantType} 
                contextData={{
                  mentorId: user?.id,
                  mentorName: user?.name,
                  role: user?.role
                }}
              />
            </TabsContent>
            
            <TabsContent value="insights" className="m-0">
              <SuggestionsPanel 
                assistantType={assistantType} 
                onSelectSuggestion={handleSelectSuggestion}
              />
            </TabsContent>
          </Tabs>
        ) : (
          // Layout para desktop com painéis lado a lado
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <ChatWindow 
                assistantType={assistantType} 
                isFullScreen
                contextData={{
                  mentorId: user?.id,
                  mentorName: user?.name,
                  role: user?.role
                }}
              />
            </div>
            
            <div className="lg:col-span-1">
              <SuggestionsPanel 
                assistantType={assistantType} 
                onSelectSuggestion={handleSelectSuggestion}
                className="h-[calc(100vh-200px)]"
              />
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}