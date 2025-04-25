import { GoogleGenerativeAI, GenerativeModel, ChatSession, GenerationConfig } from "@google/generative-ai";

// Inicializando a API com a chave fornecida pelo usuário
const API_KEY = import.meta.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(API_KEY);

// Define a configuração do modelo para respostas rápidas
const defaultGenerationConfig: GenerationConfig = {
  temperature: 0.7,
  topK: 16,
  topP: 0.95,
  maxOutputTokens: 800,
};

// Configuração específica para o assistente do Mentor
const mentorConfig: GenerationConfig = {
  ...defaultGenerationConfig,
  temperature: 0.6, // Ligeiramente mais conservador para análises profissionais
};

// Configuração específica para o assistente do Cliente
const clientConfig: GenerationConfig = {
  ...defaultGenerationConfig,
  temperature: 0.75, // Ligeiramente mais criativo para sugestões de desenvolvimento
};

// Tipo de assistente
export type AssistantType = "mentor" | "client";

// Interface para histórico de mensagens
export interface ChatMessage {
  role: "user" | "model";
  parts: string;
  timestamp: Date;
}

// Interface para gerenciar o histórico
export interface ChatHistory {
  messages: ChatMessage[];
  userId: number;
  assistantType: AssistantType;
}

// Classe que gerencia sessões de chat com o Gemini
class GeminiService {
  private mentorModel: GenerativeModel;
  private clientModel: GenerativeModel;
  private mentorSessions: Map<number, ChatSession> = new Map();
  private clientSessions: Map<number, ChatSession> = new Map();
  
  constructor() {
    // Inicializa os modelos com as configurações apropriadas
    this.mentorModel = genAI.getGenerativeModel({
      model: "gemini-1.5-flash", 
      generationConfig: mentorConfig,
      systemInstruction: this.getMentorSystemPrompt(),
    });
    
    this.clientModel = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      generationConfig: clientConfig, 
      systemInstruction: this.getClientSystemPrompt(),
    });
  }

  // Sistema de prompts contextuais para o assistente do mentor
  private getMentorSystemPrompt(): string {
    return `Você é um assistente virtual especializado em auxiliar mentores de liderança no RH Master.
    Sua função é analisar perfis comportamentais, fornecer recomendações para mentorias,
    interpretar resultados de testes e ajudar na tomada de decisões.
    
    Diretrizes:
    - Responda sempre em português de forma profissional e concisa
    - Foque em análises baseadas em evidências dos testes comportamentais
    - Ofereça insights práticos que um mentor pode aplicar imediatamente
    - Recomende abordagens personalizadas com base no perfil dos clientes
    - Explique conceitos de liderança e desenvolvimento de forma clara
    - Ajude a interpretar padrões e tendências nos resultados
    - Mantenha um tom consultivo e estratégico
    
    Você não deve:
    - Fazer diagnósticos psicológicos ou médicos
    - Compartilhar informações confidenciais entre clientes
    - Dar conselhos fora do escopo de liderança e desenvolvimento profissional
    - Utilizar jargões excessivamente técnicos sem explicação`;
  }

  // Sistema de prompts contextuais para o assistente do cliente
  private getClientSystemPrompt(): string {
    return `Você é um assistente virtual dedicado a apoiar clientes na plataforma RH Master.
    Sua função é orientar durante testes comportamentais, explicar resultados,
    oferecer sugestões de desenvolvimento pessoal e esclarecer dúvidas.
    
    Diretrizes:
    - Responda sempre em português de forma amigável e encorajadora
    - Forneça explicações claras sobre os testes e seus objetivos
    - Ofereça orientação sem influenciar as respostas nos testes
    - Sugira caminhos de desenvolvimento com base nos resultados
    - Use linguagem acessível e evite jargões técnicos
    - Mantenha um tom motivacional e de apoio
    - Esclareça dúvidas sobre a plataforma de forma simples
    
    Você não deve:
    - Interpretar resultados de forma definitiva ou determinista
    - Fazer comparações com outros usuários
    - Dar conselhos fora do escopo de desenvolvimento pessoal e profissional
    - Substituir o papel do mentor humano`;
  }

  // Obtém ou cria uma sessão de chat para um usuário
  private getOrCreateSession(userId: number, type: AssistantType): ChatSession {
    const sessionsMap = type === "mentor" ? this.mentorSessions : this.clientSessions;
    const model = type === "mentor" ? this.mentorModel : this.clientModel;
    
    if (!sessionsMap.has(userId)) {
      const chat = model.startChat({
        history: [],
      });
      sessionsMap.set(userId, chat);
    }
    
    return sessionsMap.get(userId)!;
  }

  // Envia uma mensagem para o assistente e obtém a resposta
  public async sendMessage(
    userId: number, 
    message: string, 
    type: AssistantType,
    contextData?: Record<string, any>
  ): Promise<string> {
    try {
      // Adiciona contexto à mensagem, se fornecido
      let enhancedMessage = message;
      if (contextData) {
        enhancedMessage = `${message}\n\nContexto: ${JSON.stringify(contextData)}`;
      }
      
      const session = this.getOrCreateSession(userId, type);
      const result = await session.sendMessage(enhancedMessage);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error("Erro ao comunicar com a API Gemini:", error);
      return "Desculpe, estou enfrentando dificuldades para processar sua solicitação. Por favor, tente novamente em alguns instantes.";
    }
  }

  // Limpa o histórico de chat para um usuário
  public clearHistory(userId: number, type: AssistantType): void {
    const sessionsMap = type === "mentor" ? this.mentorSessions : this.clientSessions;
    sessionsMap.delete(userId);
  }

  // Verifica se a API está disponível
  public async checkAvailability(): Promise<boolean> {
    try {
      const result = await this.mentorModel.generateContent("Teste de disponibilidade");
      return result.response !== undefined;
    } catch (error) {
      console.error("API Gemini não disponível:", error);
      return false;
    }
  }
}

// Instância do serviço para uso em toda a aplicação
export const geminiService = new GeminiService();