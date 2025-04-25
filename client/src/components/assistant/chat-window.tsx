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
import { Textarea } from "@/components/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Send, 
  Trash2, 
  Edit, 
  MessageSquare, 
  ThumbsUp, 
  ThumbsDown, 
  MoreHorizontal, 
  Copy, 
  Download, 
  ChevronLeft, 
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

interface ChatWindowProps {
  assistantType: AssistantType;
  onBack?: () => void;
  isFullScreen?: boolean;
  contextData?: Record<string, any>;
}

export function ChatWindow({ 
  assistantType, 
  onBack, 
  isFullScreen = false,
  contextData 
}: ChatWindowProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isApiAvailable, setIsApiAvailable] = useState<boolean>(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [newTitle, setNewTitle] = useState("");

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

    checkApiAvailability();
  }, []);

  // Carregar conversas
  useEffect(() => {
    const fetchConversations = async () => {
      if (!user) return;
      
      try {
        const response = await apiRequest("GET", `/api/assistant/conversations?type=${assistantType}`);
        const data = await response.json();
        setConversations(data);
        
        // Se tiver conversas, seleciona a mais recente
        if (data.length > 0) {
          // Ordena as conversas pela data de atualização (mais recente primeiro)
          const sortedConversations = [...data].sort(
            (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
          );
          
          setSelectedConversation(sortedConversations[0]);
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
  }, [user, assistantType, toast]);

  // Carregar mensagens da conversa selecionada
  const loadMessages = async (conversationId: number) => {
    try {
      const response = await apiRequest("GET", `/api/assistant/conversations/${conversationId}`);
      const data = await response.json();
      setMessages(data.messages);
    } catch (error) {
      console.error("Erro ao carregar mensagens:", error);
      toast({
        variant: "destructive",
        title: "Erro ao carregar mensagens",
        description: "Não foi possível carregar as mensagens. Tente novamente mais tarde."
      });
    }
  };

  // Criar nova conversa
  const createNewConversation = async () => {
    if (!user) return;
    
    try {
      const defaultTitle = `Conversa ${new Date().toLocaleString("pt-BR", { 
        day: "2-digit", 
        month: "2-digit",
        year: "numeric", 
        hour: "2-digit", 
        minute: "2-digit" 
      })}`;
      
      const response = await apiRequest("POST", "/api/assistant/conversations", {
        title: defaultTitle,
        assistantType
      });
      
      const newConversation = await response.json();
      
      setConversations(prev => [newConversation, ...prev]);
      setSelectedConversation(newConversation);
      setMessages([]);
      
      return newConversation.id;
    } catch (error) {
      console.error("Erro ao criar conversa:", error);
      toast({
        variant: "destructive",
        title: "Erro ao criar conversa",
        description: "Não foi possível criar uma nova conversa. Tente novamente mais tarde."
      });
      return null;
    }
  };

  // Atualizar título da conversa
  const updateConversationTitle = async (conversationId: number, title: string) => {
    try {
      const response = await apiRequest("PATCH", `/api/assistant/conversations/${conversationId}`, {
        title
      });
      
      const updatedConversation = await response.json();
      
      setConversations(prev => 
        prev.map(conv => conv.id === conversationId ? updatedConversation : conv)
      );
      
      if (selectedConversation?.id === conversationId) {
        setSelectedConversation(updatedConversation);
      }
      
      setIsEditingTitle(false);
      
      toast({
        title: "Título atualizado",
        description: "O título da conversa foi atualizado com sucesso."
      });
    } catch (error) {
      console.error("Erro ao atualizar título:", error);
      toast({
        variant: "destructive",
        title: "Erro ao atualizar título",
        description: "Não foi possível atualizar o título da conversa. Tente novamente mais tarde."
      });
    }
  };

  // Excluir conversa
  const deleteConversation = async (conversationId: number) => {
    try {
      await apiRequest("DELETE", `/api/assistant/conversations/${conversationId}`);
      
      setConversations(prev => prev.filter(conv => conv.id !== conversationId));
      
      if (selectedConversation?.id === conversationId) {
        const remainingConversations = conversations.filter(conv => conv.id !== conversationId);
        
        if (remainingConversations.length > 0) {
          setSelectedConversation(remainingConversations[0]);
          await loadMessages(remainingConversations[0].id);
        } else {
          setSelectedConversation(null);
          setMessages([]);
        }
      }
      
      toast({
        title: "Conversa excluída",
        description: "A conversa foi excluída com sucesso."
      });
    } catch (error) {
      console.error("Erro ao excluir conversa:", error);
      toast({
        variant: "destructive",
        title: "Erro ao excluir conversa",
        description: "Não foi possível excluir a conversa. Tente novamente mais tarde."
      });
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
      let conversationId = selectedConversation?.id;
      
      if (!conversationId) {
        conversationId = await createNewConversation();
        if (!conversationId) {
          setIsLoading(false);
          return;
        }
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

  // Rolar para o final da conversa quando novas mensagens são adicionadas
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Função para copiar mensagem para a área de transferência
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Texto copiado",
      description: "O texto foi copiado para a área de transferência."
    });
  };

  // Formatar a data
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
      day: "2-digit",
      month: "2-digit",
      year: "numeric"
    });
  };

  // Renderizar mensagem
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
            "max-w-[80%] rounded-lg p-3",
            isUser ? "bg-primary text-primary-foreground" : "bg-muted"
          )}
        >
          <div className="flex items-start justify-between mb-1">
            <span className="font-medium">
              {isUser ? "Você" : assistantType === "mentor" ? "Assistente do Mentor" : "Assistente"}
            </span>
            <span className="text-xs ml-2 opacity-70">
              {formatDate(message.timestamp)}
            </span>
          </div>
          
          <div className="whitespace-pre-wrap">{message.content}</div>
          
          {!isUser && (
            <div className="flex items-center justify-between mt-2">
              <div className="flex items-center space-x-1">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className={cn(
                        "h-6 w-6 p-0 rounded-full",
                        message.feedback === "positive" && "bg-green-100 text-green-600"
                      )}
                      onClick={() => sendFeedback(message.id, "positive")}
                    >
                      <ThumbsUp className="h-3 w-3" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Útil</p>
                  </TooltipContent>
                </Tooltip>
                
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className={cn(
                        "h-6 w-6 p-0 rounded-full",
                        message.feedback === "negative" && "bg-red-100 text-red-600"
                      )}
                      onClick={() => sendFeedback(message.id, "negative")}
                    >
                      <ThumbsDown className="h-3 w-3" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Não útil</p>
                  </TooltipContent>
                </Tooltip>
              </div>
              
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-6 w-6 p-0 rounded-full"
                    onClick={() => copyToClipboard(message.content)}
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Copiar</p>
                </TooltipContent>
              </Tooltip>
            </div>
          )}
        </div>
      </div>
    );
  };

  // Selecionar conversa
  const selectConversation = async (conversation: Conversation) => {
    setSelectedConversation(conversation);
    await loadMessages(conversation.id);
  };

  // Componente de lista de conversas
  const ConversationsList = () => (
    <div className="w-full md:w-64 md:min-h-[500px] border-r">
      <div className="p-4 border-b">
        <Button
          className="w-full"
          onClick={createNewConversation}
        >
          <MessageSquare className="mr-2 h-4 w-4" />
          Nova Conversa
        </Button>
      </div>
      
      <ScrollArea className="h-[calc(100vh-200px)] md:h-[450px]">
        <div className="p-2">
          {conversations.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <MessageSquare className="mx-auto h-8 w-8 mb-2 opacity-50" />
              <p>Nenhuma conversa encontrada</p>
              <p className="text-sm">Comece uma nova conversa</p>
            </div>
          ) : (
            conversations.map((conv) => (
              <div
                key={conv.id}
                className={cn(
                  "flex items-center justify-between p-2 rounded-md cursor-pointer hover:bg-muted mb-1",
                  selectedConversation?.id === conv.id && "bg-muted"
                )}
                onClick={() => selectConversation(conv)}
              >
                <div className="overflow-hidden">
                  <div className="font-medium truncate">{conv.title}</div>
                  <div className="text-xs text-muted-foreground">
                    {new Date(conv.updatedAt).toLocaleDateString()}
                  </div>
                </div>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={(e) => {
                        e.stopPropagation();
                        setNewTitle(conv.title);
                        setIsEditingTitle(true);
                        setSelectedConversation(conv);
                      }}
                    >
                      <Edit className="mr-2 h-4 w-4" />
                      Renomear
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="text-red-600"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteConversation(conv.id);
                      }}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Excluir
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );

  // Mensagem de boas-vindas
  const WelcomeMessage = () => {
    const title = assistantType === "mentor"
      ? "Bem-vindo ao Assistente do Mentor"
      : "Bem-vindo ao seu Assistente Pessoal";
    
    const description = assistantType === "mentor"
      ? "Esse assistente está aqui para ajudar você a analisar perfis comportamentais, fornecer recomendações para mentorias e interpretar resultados de testes."
      : "Esse assistente está aqui para ajudar você a entender seus testes comportamentais, explicar resultados e oferecer sugestões de desenvolvimento pessoal.";
    
    const suggestions = assistantType === "mentor"
      ? [
          "Como interpretar o resultado do teste DISC de um cliente?",
          "Quais abordagens de mentoria são recomendadas para perfis analíticos?",
          "Como identificar padrões de comportamento nos resultados dos testes?",
          "Que tipo de feedback devo dar para um cliente com perfil dominante?"
        ]
      : [
          "Pode me explicar como interpretar meus resultados do teste?",
          "Quais são minhas principais forças com base no perfil?",
          "Como posso melhorar minhas habilidades de comunicação?",
          "Que tipo de desenvolvimento profissional você recomenda para mim?"
        ];
    
    return (
      <div className="flex flex-col items-center justify-center h-full px-4 py-8 text-center">
        <BrainCircuit className="w-16 h-16 mb-4 text-primary" />
        <h2 className="text-2xl font-bold mb-4">{title}</h2>
        <p className="text-muted-foreground mb-8 max-w-md">{description}</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-2xl">
          {suggestions.map((suggestion, index) => (
            <Button
              key={index}
              variant="outline"
              className="justify-start text-left h-auto py-3 px-4"
              onClick={() => {
                setInput(suggestion);
              }}
            >
              {suggestion}
            </Button>
          ))}
        </div>
      </div>
    );
  };

  // Mensagem de API indisponível
  const ApiUnavailableMessage = () => (
    <div className="flex flex-col items-center justify-center h-full px-4 py-8 text-center">
      <div className="w-16 h-16 mb-4 text-yellow-500 rounded-full flex items-center justify-center bg-yellow-100">
        <Loader2 className="w-10 h-10" />
      </div>
      <h2 className="text-2xl font-bold mb-4">Serviço temporariamente indisponível</h2>
      <p className="text-muted-foreground mb-4 max-w-md">
        Não foi possível conectar ao serviço de IA do Gemini. Isso pode acontecer devido à alta demanda ou manutenção.
      </p>
      <p className="text-muted-foreground mb-8 max-w-md">
        Por favor, tente novamente mais tarde ou entre em contato com o suporte.
      </p>
      <Button
        variant="outline"
        onClick={() => {
          window.location.reload();
        }}
      >
        Tentar novamente
      </Button>
    </div>
  );

  return (
    <Card className={cn("border shadow-md", isFullScreen && "h-[calc(100vh-100px)]")}>
      {/* Cabeçalho */}
      <CardHeader className="px-4 py-3 border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {onBack && (
              <Button variant="ghost" size="icon" onClick={onBack}>
                <ChevronLeft className="h-5 w-5" />
              </Button>
            )}
            
            <CardTitle className="text-lg">
              {assistantType === "mentor" ? "Assistente do Mentor" : "Assistente Pessoal"}
            </CardTitle>
          </div>
          
          {selectedConversation && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="text-red-600"
                >
                  <Trash2 className="h-5 w-5" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Excluir conversa</AlertDialogTitle>
                  <AlertDialogDescription>
                    Tem certeza que deseja excluir esta conversa? Esta ação não pode ser desfeita.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction 
                    className="bg-red-600 hover:bg-red-700"
                    onClick={() => deleteConversation(selectedConversation.id)}
                  >
                    Excluir
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>
      </CardHeader>
      
      <div className="flex flex-col md:flex-row flex-1 h-full">
        {/* Lista de Conversas (apenas visível em telas maiores ou quando não tem conversa selecionada) */}
        {(!selectedConversation || !isFullScreen) && <ConversationsList />}
        
        {/* Área de Chat */}
        <div className="flex-1 flex flex-col">
          {/* Título da conversa (apenas quando uma conversa estiver selecionada) */}
          {selectedConversation && (
            <div className="p-3 border-b flex items-center justify-between">
              {isEditingTitle ? (
                <div className="flex-1 flex items-center space-x-2">
                  <Input
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="flex-1"
                    placeholder="Título da conversa"
                  />
                  <Button size="sm" onClick={() => updateConversationTitle(selectedConversation.id, newTitle)}>
                    Salvar
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => setIsEditingTitle(false)}>
                    Cancelar
                  </Button>
                </div>
              ) : (
                <>
                  <div className="flex items-center space-x-2">
                    <MessageSquare className="h-5 w-5 text-muted-foreground" />
                    <span className="font-medium">{selectedConversation.title}</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      setNewTitle(selectedConversation.title);
                      setIsEditingTitle(true);
                    }}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                </>
              )}
            </div>
          )}
          
          {/* Área de Mensagens */}
          <CardContent 
            className={cn(
              "flex-1 overflow-y-auto p-4", 
              isFullScreen ? "h-[calc(100vh-250px)]" : "h-[400px]"
            )}
          >
            {!isApiAvailable ? (
              <ApiUnavailableMessage />
            ) : messages.length === 0 ? (
              <WelcomeMessage />
            ) : (
              <>
                {messages.map(renderMessage)}
                <div ref={messagesEndRef} />
              </>
            )}
          </CardContent>
          
          {/* Área de Input */}
          <CardFooter className="p-3 border-t">
            <div className="flex w-full items-end space-x-2">
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Digite sua mensagem..."
                className="flex-1 min-h-[60px] max-h-32"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    sendMessage();
                  }
                }}
                disabled={isLoading || !isApiAvailable}
              />
              <Button
                disabled={isLoading || !input.trim() || !isApiAvailable}
                onClick={sendMessage}
                className="h-10"
              >
                {isLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <Send className="h-5 w-5" />
                )}
              </Button>
            </div>
          </CardFooter>
        </div>
      </div>
    </Card>
  );
}