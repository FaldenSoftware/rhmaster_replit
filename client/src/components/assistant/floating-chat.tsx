import { useState, useRef, useEffect } from "react";
import { 
  Card, 
  CardContent, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Send, 
  X,
  ThumbsUp, 
  ThumbsDown, 
  MoreHorizontal, 
  Copy, 
  Loader2, 
  BrainCircuit 
} from "lucide-react";
import { 
  DropdownMenu, 
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { AssistantType } from "@/lib/gemini-service";
import { useAuth } from "@/hooks/use-auth";
import { apiRequest } from "@/lib/queryClient";
import { cn } from "@/lib/utils";

// Interfaces
interface Message {
  id: number;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
  feedback?: "positive" | "negative" | "neutral" | null;
}

interface Conversation {
  id: number;
  title: string;
  updatedAt: string;
}

interface FloatingChatProps {
  assistantType: AssistantType;
  isOpen: boolean;
  onClose: () => void;
  contextData?: Record<string, any>;
}

export function FloatingChat({ 
  assistantType, 
  isOpen,
  onClose,
  contextData 
}: FloatingChatProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isApiAvailable, setIsApiAvailable] = useState<boolean>(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Verificar se a API está disponível
  useEffect(() => {
    const checkApiAvailability = async () => {
      try {
        const response = await apiRequest("GET", "/api/assistant/status");
        const data = await response.json();
        setIsApiAvailable(data.available);
      } catch (error) {
        console.error("Erro ao verificar status da API:", error);
        setIsApiAvailable(false);
      }
    };

    if (isOpen) {
      checkApiAvailability();
    }
  }, [isOpen]);

  // Carregar conversas
  useEffect(() => {
    const fetchConversations = async () => {
      if (!user || !isOpen) return;
      
      try {
        const response = await apiRequest("GET", `/api/assistant/conversations?type=${assistantType}`);
        const data = await response.json();
        
        // Se tiver conversas, seleciona a mais recente
        if (data.length > 0) {
          // Ordena as conversas pela data de atualização (mais recente primeiro)
          const sortedConversations = [...data].sort(
            (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
          );
          
          setConversation(sortedConversations[0]);
          await loadMessages(sortedConversations[0].id);
        }
      } catch (error) {
        console.error("Erro ao carregar conversas:", error);
        toast({
          variant: "destructive",
          title: "Erro ao carregar conversas",
          description: "Não foi possível carregar suas conversas. Tente novamente mais tarde."
        });
      }
    };
    
    fetchConversations();
  }, [user, assistantType, isOpen, toast]);

  // Rola para a última mensagem quando as mensagens mudam
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Carrega mensagens de uma conversa
  const loadMessages = async (conversationId: number) => {
    try {
      const response = await apiRequest("GET", `/api/assistant/conversations/${conversationId}`);
      if (!response.ok) throw new Error("Erro ao carregar conversa");
      
      const conversation = await response.json();
      setConversation(conversation);
      
      const messagesResponse = await apiRequest("GET", `/api/assistant/conversations/${conversationId}/messages`);
      if (!messagesResponse.ok) throw new Error("Erro ao carregar mensagens");
      
      const messagesData = await messagesResponse.json();
      setMessages(messagesData);
    } catch (error) {
      console.error("Erro ao carregar mensagens:", error);
      toast({
        variant: "destructive",
        title: "Erro ao carregar mensagens",
        description: "Não foi possível carregar as mensagens. Tente novamente mais tarde."
      });
    }
  };

  // Cria uma nova conversa
  const createNewConversation = async (): Promise<number | undefined> => {
    try {
      const now = new Date();
      const title = `Conversa ${now.toLocaleDateString()}, ${now.toLocaleTimeString()}`;
      
      const response = await apiRequest("POST", "/api/assistant/conversations", {
        title,
        assistantType,
        createdAt: now.toISOString(),
        updatedAt: now.toISOString()
      });
      
      const newConversation = await response.json();
      setConversation(newConversation);
      return newConversation.id;
    } catch (error) {
      console.error("Erro ao criar conversa:", error);
      toast({
        variant: "destructive",
        title: "Erro ao criar conversa",
        description: "Não foi possível criar uma nova conversa. Tente novamente mais tarde."
      });
      return undefined;
    }
  };

  // Enviar feedback sobre uma mensagem
  const sendFeedback = async (messageId: number, feedback: "positive" | "negative" | "neutral") => {
    try {
      const response = await apiRequest("PATCH", `/api/assistant/messages/${messageId}/feedback`, {
        feedback
      });
      
      const updatedMessage = await response.json();
      
      setMessages(prev => 
        prev.map(msg => msg.id === messageId ? { ...msg, feedback } : msg)
      );
      
      toast({
        title: "Feedback enviado",
        description: "Obrigado pelo seu feedback!"
      });
    } catch (error) {
      console.error("Erro ao enviar feedback:", error);
      toast({
        variant: "destructive",
        title: "Erro ao enviar feedback",
        description: "Não foi possível enviar seu feedback. Tente novamente mais tarde."
      });
    }
  };

  // Enviar mensagem
  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;
    
    setIsLoading(true);
    
    try {
      // Se não há conversa selecionada, cria uma nova
      let conversationId = conversation?.id;
      
      if (!conversationId) {
        const newId = await createNewConversation();
        if (newId === undefined) {
          setIsLoading(false);
          return;
        }
        conversationId = newId;
      }
      
      const response = await apiRequest("POST", `/api/assistant/conversations/${conversationId}/messages`, {
        content: input,
        contextData
      });
      
      const data = await response.json();
      
      // Atualiza as mensagens com a mensagem do usuário e a resposta do assistente
      setMessages(prev => [...prev, data.userMessage, data.assistantMessage]);
      
      // Limpa o input
      setInput("");
    } catch (error) {
      console.error("Erro ao enviar mensagem:", error);
      toast({
        variant: "destructive",
        title: "Erro ao enviar mensagem",
        description: "Não foi possível enviar sua mensagem. Tente novamente mais tarde."
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Copiar texto para a área de transferência
  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Texto copiado",
        description: "O texto foi copiado para a área de transferência."
      });
    } catch (error) {
      console.error("Erro ao copiar texto:", error);
      toast({
        variant: "destructive",
        title: "Erro ao copiar texto",
        description: "Não foi possível copiar o texto."
      });
    }
  };

  // Renderizar uma mensagem
  const renderMessage = (message: Message) => {
    const isUser = message.role === "user";
    
    return (
      <div 
        key={message.id} 
        className={cn(
          "flex w-full mb-4",
          isUser ? "justify-end" : "justify-start"
        )}
      >
        <div 
          className={cn(
            "rounded-lg px-4 py-2 max-w-[80%]",
            isUser 
              ? "bg-primary text-primary-foreground" 
              : "bg-muted"
          )}
        >
          <div className="whitespace-pre-wrap break-words">{message.content}</div>
          
          {!isUser && (
            <div className="flex items-center justify-end mt-2 space-x-2 text-xs text-muted-foreground">
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-6 w-6" 
                onClick={() => sendFeedback(message.id, "positive")}
              >
                <ThumbsUp className={cn(
                  "h-4 w-4",
                  message.feedback === "positive" && "text-green-500 fill-green-500"
                )} />
              </Button>
              
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-6 w-6" 
                onClick={() => sendFeedback(message.id, "negative")}
              >
                <ThumbsDown className={cn(
                  "h-4 w-4",
                  message.feedback === "negative" && "text-red-500 fill-red-500"
                )} />
              </Button>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-6 w-6">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => copyToClipboard(message.content)}>
                    <Copy className="mr-2 h-4 w-4" />
                    <span>Copiar</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
        </div>
      </div>
    );
  };

  if (!isOpen) return null;

  return (
    <Card className="fixed right-4 bottom-4 w-96 h-[500px] z-50 shadow-lg flex flex-col">
      <CardHeader className="pb-2 px-4 py-3 border-b flex-shrink-0 flex flex-row justify-between items-center">
        <div className="flex items-center space-x-2">
          <BrainCircuit className="h-5 w-5 text-primary" />
          <CardTitle className="text-base">
            {assistantType === "mentor" ? "Assistente do Mentor" : "Assistente Pessoal"}
          </CardTitle>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      
      <CardContent className="p-4 flex-grow overflow-hidden">
        <ScrollArea className="h-full pr-4">
          {!isApiAvailable ? (
            <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
              <div className="mb-4">
                <BrainCircuit className="h-12 w-12 mx-auto mb-2 text-muted" />
                <p>A API do assistente não está disponível no momento.</p>
                <p className="text-sm mt-2">Tente novamente mais tarde.</p>
              </div>
            </div>
          ) : messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
              <div className="mb-4">
                <BrainCircuit className="h-12 w-12 mx-auto mb-2 text-primary" />
                <p>Olá, como posso ajudar você hoje?</p>
                <p className="text-sm mt-2">Digite sua mensagem abaixo para começar.</p>
              </div>
            </div>
          ) : (
            messages.map(renderMessage)
          )}
          <div ref={messagesEndRef} />
        </ScrollArea>
      </CardContent>
      
      <CardFooter className="p-4 pt-2 border-t">
        <div className="flex w-full items-center space-x-2">
          <Input
            className="flex-grow"
            placeholder="Digite sua mensagem..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            disabled={isLoading || !isApiAvailable}
          />
          <Button 
            variant="default" 
            size="icon" 
            disabled={isLoading || !input.trim() || !isApiAvailable}
            onClick={sendMessage}
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}