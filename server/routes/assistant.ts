import { Router, Request, Response } from "express";
import { storage } from "../storage";
import { geminiService } from "../../client/src/lib/gemini-service";

export const assistantRouter = Router();

// Middleware para verificar autenticação
function isAuthenticated(req: Request, res: Response, next: Function) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ message: "Não autenticado" });
}

// Verificar status da API
assistantRouter.get("/status", isAuthenticated, async (req, res) => {
  try {
    const available = await geminiService.checkAvailability();
    res.json({ available });
  } catch (error) {
    console.error("Erro ao verificar disponibilidade da API Gemini:", error);
    res.status(500).json({ message: "Erro ao verificar disponibilidade da API", available: false });
  }
});

// CONVERSAS

// Obter todas as conversas do usuário
assistantRouter.get("/conversations", isAuthenticated, async (req, res) => {
  try {
    const userId = req.user!.id;
    const assistantType = req.query.type as string || "client";
    
    // Validar tipo de assistente
    if (assistantType !== "mentor" && assistantType !== "client") {
      return res.status(400).json({ message: "Tipo de assistente inválido" });
    }
    
    const conversations = await storage.getUserConversations(userId, assistantType);
    res.json(conversations);
  } catch (error) {
    console.error("Erro ao buscar conversas:", error);
    res.status(500).json({ message: "Erro ao buscar conversas" });
  }
});

// Criar nova conversa
assistantRouter.post("/conversations", isAuthenticated, async (req, res) => {
  try {
    const userId = req.user!.id;
    const { title, assistantType } = req.body;
    
    // Validar tipo de assistente
    if (assistantType !== "mentor" && assistantType !== "client") {
      return res.status(400).json({ message: "Tipo de assistente inválido" });
    }
    
    const conversation = await storage.createConversation({
      title,
      userId,
      assistantType,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
    
    res.status(201).json(conversation);
  } catch (error) {
    console.error("Erro ao criar conversa:", error);
    res.status(500).json({ message: "Erro ao criar conversa" });
  }
});

// Obter conversa específica com mensagens
assistantRouter.get("/conversations/:id", isAuthenticated, async (req, res) => {
  try {
    const conversationId = parseInt(req.params.id);
    const userId = req.user!.id;
    
    // Buscar conversa
    const conversation = await storage.getConversation(conversationId);
    
    if (!conversation) {
      return res.status(404).json({ message: "Conversa não encontrada" });
    }
    
    // Verificar permissão (apenas proprietário pode ver)
    if (conversation.userId !== userId) {
      return res.status(403).json({ message: "Sem permissão para acessar esta conversa" });
    }
    
    // Buscar mensagens
    const messages = await storage.getConversationMessages(conversationId);
    
    res.json({
      ...conversation,
      messages
    });
  } catch (error) {
    console.error("Erro ao buscar conversa:", error);
    res.status(500).json({ message: "Erro ao buscar conversa" });
  }
});

// Atualizar título da conversa
assistantRouter.patch("/conversations/:id", isAuthenticated, async (req, res) => {
  try {
    const conversationId = parseInt(req.params.id);
    const userId = req.user!.id;
    const { title } = req.body;
    
    // Buscar conversa para verificar permissão
    const conversation = await storage.getConversation(conversationId);
    
    if (!conversation) {
      return res.status(404).json({ message: "Conversa não encontrada" });
    }
    
    // Verificar permissão (apenas proprietário pode atualizar)
    if (conversation.userId !== userId) {
      return res.status(403).json({ message: "Sem permissão para atualizar esta conversa" });
    }
    
    // Atualizar título
    const updatedConversation = await storage.updateConversationTitle(conversationId, title);
    
    if (!updatedConversation) {
      return res.status(404).json({ message: "Conversa não encontrada" });
    }
    
    res.json(updatedConversation);
  } catch (error) {
    console.error("Erro ao atualizar conversa:", error);
    res.status(500).json({ message: "Erro ao atualizar conversa" });
  }
});

// Excluir conversa
assistantRouter.delete("/conversations/:id", isAuthenticated, async (req, res) => {
  try {
    const conversationId = parseInt(req.params.id);
    const userId = req.user!.id;
    
    // Buscar conversa para verificar permissão
    const conversation = await storage.getConversation(conversationId);
    
    if (!conversation) {
      return res.status(404).json({ message: "Conversa não encontrada" });
    }
    
    // Verificar permissão (apenas proprietário pode excluir)
    if (conversation.userId !== userId) {
      return res.status(403).json({ message: "Sem permissão para excluir esta conversa" });
    }
    
    // Excluir conversa
    const success = await storage.deleteConversation(conversationId);
    
    if (!success) {
      return res.status(500).json({ message: "Erro ao excluir conversa" });
    }
    
    // Limpar histórico no serviço do Gemini
    geminiService.clearHistory(userId, conversation.assistantType as "mentor" | "client");
    
    res.status(204).send();
  } catch (error) {
    console.error("Erro ao excluir conversa:", error);
    res.status(500).json({ message: "Erro ao excluir conversa" });
  }
});

// MENSAGENS

// Enviar mensagem e obter resposta do assistente
assistantRouter.post("/conversations/:id/messages", isAuthenticated, async (req, res) => {
  try {
    const conversationId = parseInt(req.params.id);
    const userId = req.user!.id;
    const { content, contextData } = req.body;
    
    // Buscar conversa para verificar permissão e tipo de assistente
    const conversation = await storage.getConversation(conversationId);
    
    if (!conversation) {
      return res.status(404).json({ message: "Conversa não encontrada" });
    }
    
    // Verificar permissão (apenas proprietário pode enviar mensagens)
    if (conversation.userId !== userId) {
      return res.status(403).json({ message: "Sem permissão para enviar mensagens nesta conversa" });
    }
    
    const assistantType = conversation.assistantType as "mentor" | "client";
    
    // Adicionar mensagem do usuário ao banco de dados
    const timestamp = new Date().toISOString();
    
    const userMessage = await storage.addMessage({
      conversationId,
      content,
      role: "user",
      timestamp,
      contextData: contextData ? JSON.stringify(contextData) : null
    });
    
    // Atualizar timestamp da conversa
    await storage.updateConversationTitle(conversationId, conversation.title); // Isso atualiza o updatedAt
    
    // Enviar mensagem para o serviço do Gemini
    const assistantResponse = await geminiService.sendMessage(
      userId,
      content,
      assistantType,
      contextData
    );
    
    // Adicionar resposta do assistente ao banco de dados
    const assistantMessage = await storage.addMessage({
      conversationId,
      content: assistantResponse,
      role: "assistant",
      timestamp: new Date().toISOString(),
      contextData: contextData ? JSON.stringify(contextData) : null
    });
    
    res.json({
      userMessage,
      assistantMessage
    });
  } catch (error) {
    console.error("Erro ao processar mensagem:", error);
    res.status(500).json({ message: "Erro ao processar mensagem" });
  }
});

// Atualizar feedback de uma mensagem
assistantRouter.patch("/messages/:id/feedback", isAuthenticated, async (req, res) => {
  try {
    const messageId = parseInt(req.params.id);
    const userId = req.user!.id;
    const { feedback } = req.body;
    
    // Validar feedback
    if (!["positive", "negative", "neutral"].includes(feedback)) {
      return res.status(400).json({ message: "Feedback inválido" });
    }
    
    // Buscar mensagem
    const messages = await storage.getConversationMessages(-1); // Passa um ID inválido para buscar todas as mensagens
    const message = messages.find(m => m.id === messageId);
    
    if (!message) {
      return res.status(404).json({ message: "Mensagem não encontrada" });
    }
    
    // Buscar conversa para verificar permissão
    const conversation = await storage.getConversation(message.conversationId);
    
    if (!conversation) {
      return res.status(404).json({ message: "Conversa não encontrada" });
    }
    
    // Verificar permissão (apenas proprietário pode atualizar feedback)
    if (conversation.userId !== userId) {
      return res.status(403).json({ message: "Sem permissão para atualizar feedback" });
    }
    
    // Atualizar feedback
    const updatedMessage = await storage.updateMessageFeedback(messageId, feedback);
    
    if (!updatedMessage) {
      return res.status(404).json({ message: "Mensagem não encontrada" });
    }
    
    res.json(updatedMessage);
  } catch (error) {
    console.error("Erro ao atualizar feedback:", error);
    res.status(500).json({ message: "Erro ao atualizar feedback" });
  }
});

// SUGESTÕES

// Obter todas as sugestões do usuário
assistantRouter.get("/suggestions", isAuthenticated, async (req, res) => {
  try {
    const userId = req.user!.id;
    const assistantType = req.query.type as string || "client";
    
    // Validar tipo de assistente
    if (assistantType !== "mentor" && assistantType !== "client") {
      return res.status(400).json({ message: "Tipo de assistente inválido" });
    }
    
    const suggestions = await storage.getUserSuggestions(userId, assistantType);
    res.json(suggestions);
  } catch (error) {
    console.error("Erro ao buscar sugestões:", error);
    res.status(500).json({ message: "Erro ao buscar sugestões" });
  }
});

// Marcar sugestão como lida
assistantRouter.patch("/suggestions/:id/read", isAuthenticated, async (req, res) => {
  try {
    const suggestionId = parseInt(req.params.id);
    const userId = req.user!.id;
    
    // Buscar sugestões para verificar permissão
    const userSuggestions = await storage.getUserSuggestions(userId, "client"); // tipo não importa aqui
    const suggestion = userSuggestions.find(s => s.id === suggestionId);
    
    if (!suggestion) {
      return res.status(404).json({ message: "Sugestão não encontrada" });
    }
    
    // Verificar permissão (apenas proprietário pode marcar como lida)
    if (suggestion.userId !== userId) {
      return res.status(403).json({ message: "Sem permissão para atualizar esta sugestão" });
    }
    
    // Marcar como lida
    const updatedSuggestion = await storage.markSuggestionAsRead(suggestionId);
    
    if (!updatedSuggestion) {
      return res.status(404).json({ message: "Sugestão não encontrada" });
    }
    
    res.json(updatedSuggestion);
  } catch (error) {
    console.error("Erro ao marcar sugestão como lida:", error);
    res.status(500).json({ message: "Erro ao marcar sugestão como lida" });
  }
});

// Excluir sugestão
assistantRouter.delete("/suggestions/:id", isAuthenticated, async (req, res) => {
  try {
    const suggestionId = parseInt(req.params.id);
    const userId = req.user!.id;
    
    // Buscar sugestões para verificar permissão
    const userSuggestions = await storage.getUserSuggestions(userId, "client"); // tipo não importa aqui
    const suggestion = userSuggestions.find(s => s.id === suggestionId);
    
    if (!suggestion) {
      return res.status(404).json({ message: "Sugestão não encontrada" });
    }
    
    // Verificar permissão (apenas proprietário pode excluir)
    if (suggestion.userId !== userId) {
      return res.status(403).json({ message: "Sem permissão para excluir esta sugestão" });
    }
    
    // Excluir sugestão
    const success = await storage.deleteSuggestion(suggestionId);
    
    if (!success) {
      return res.status(500).json({ message: "Erro ao excluir sugestão" });
    }
    
    res.status(204).send();
  } catch (error) {
    console.error("Erro ao excluir sugestão:", error);
    res.status(500).json({ message: "Erro ao excluir sugestão" });
  }
});

// Criar sugestão (apenas para fins de teste)
// Normalmente, as sugestões seriam geradas automaticamente pelo sistema
assistantRouter.post("/suggestions", isAuthenticated, async (req, res) => {
  try {
    const userId = req.user!.id;
    const { title, content, contextType, assistantType } = req.body;
    
    // Validar tipo de assistente
    if (assistantType !== "mentor" && assistantType !== "client") {
      return res.status(400).json({ message: "Tipo de assistente inválido" });
    }
    
    // Validar tipo de contexto
    const validContextTypes = [
      "test_results", 
      "client_progress", 
      "profile_analysis", 
      "test_taking", 
      "dashboard"
    ];
    
    if (!validContextTypes.includes(contextType)) {
      return res.status(400).json({ message: "Tipo de contexto inválido" });
    }
    
    const suggestion = await storage.createSuggestion({
      title,
      content,
      contextType,
      assistantType,
      userId,
      createdAt: new Date().toISOString(),
      expiresAt: null
    });
    
    res.status(201).json(suggestion);
  } catch (error) {
    console.error("Erro ao criar sugestão:", error);
    res.status(500).json({ message: "Erro ao criar sugestão" });
  }
});