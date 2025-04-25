import { 
  users, type User, type InsertUser, 
  conversations, type Conversation, type InsertConversation,
  messages, type Message, type InsertMessage,
  suggestions, type Suggestion, type InsertSuggestion 
} from "@shared/schema";
import { db } from "./db";
import { eq, and, desc, isNull, lte, gte } from "drizzle-orm";
import session from "express-session";
import createMemoryStore from "memorystore";
import connectPg from "connect-pg-simple";
import { pool } from "./db";

const MemoryStore = createMemoryStore(session);
const PostgresSessionStore = connectPg(session);

export interface IStorage {
  // Usuários
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getUserByStripeSubscriptionId(subscriptionId: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserStripeCustomerId(userId: number, stripeCustomerId: string): Promise<User | undefined>;
  updateUserStripeInfo(userId: number, stripeInfo: { 
    stripeCustomerId?: string, 
    stripeSubscriptionId?: string | null 
  }): Promise<User | undefined>;
  getAllMentors(): Promise<User[]>;
  getClientsByMentorId(mentorId: number): Promise<User[]>;
  
  // Conversas com assistentes
  createConversation(conversation: InsertConversation): Promise<Conversation>;
  getUserConversations(userId: number, assistantType: string): Promise<Conversation[]>;
  getConversation(id: number): Promise<Conversation | undefined>;
  updateConversationTitle(id: number, title: string): Promise<Conversation | undefined>;
  deleteConversation(id: number): Promise<boolean>;
  
  // Mensagens
  addMessage(message: InsertMessage): Promise<Message>;
  getConversationMessages(conversationId: number): Promise<Message[]>;
  updateMessageFeedback(id: number, feedback: "positive" | "negative" | "neutral" | null): Promise<Message | undefined>;
  
  // Sugestões
  createSuggestion(suggestion: InsertSuggestion): Promise<Suggestion>;
  getUserSuggestions(userId: number, assistantType: string): Promise<Suggestion[]>;
  markSuggestionAsRead(id: number): Promise<Suggestion | undefined>;
  deleteSuggestion(id: number): Promise<boolean>;
  
  sessionStore: session.Store;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private usersByEmail: Map<string, number>; // Mapa de emails para IDs de usuários
  private mentorClients: Map<number, Set<number>>;
  private conversations: Map<number, Conversation>;
  private messages: Map<number, Message>;
  private suggestions: Map<number, Suggestion>;
  private userConversations: Map<number, Set<number>>;
  currentId: number;
  currentConversationId: number;
  currentMessageId: number;
  currentSuggestionId: number;
  sessionStore: session.Store;

  constructor() {
    this.users = new Map();
    this.usersByEmail = new Map();
    this.mentorClients = new Map();
    this.conversations = new Map();
    this.messages = new Map();
    this.suggestions = new Map();
    this.userConversations = new Map();
    
    this.currentId = 1;
    this.currentConversationId = 1;
    this.currentMessageId = 1;
    this.currentSuggestionId = 1;
    
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000, // prune expired entries every 24h
    });
    
    // Add some sample data
    this.addSampleData();
    
    // Debug: Print all users
    console.log('Usuários disponíveis:', Array.from(this.users.entries()));
  }
  
  // Métodos para gerenciar conversas
  async createConversation(insertConversation: InsertConversation): Promise<Conversation> {
    const id = this.currentConversationId++;
    const now = new Date().toISOString();
    
    const conversation: Conversation = {
      ...insertConversation,
      id,
      createdAt: insertConversation.createdAt || now,
      updatedAt: insertConversation.updatedAt || now
    };
    
    this.conversations.set(id, conversation);
    
    // Adicionar à lista de conversas do usuário
    if (!this.userConversations.has(conversation.userId)) {
      this.userConversations.set(conversation.userId, new Set());
    }
    this.userConversations.get(conversation.userId)?.add(id);
    
    return conversation;
  }
  
  async getUserConversations(userId: number, assistantType: string): Promise<Conversation[]> {
    const conversationIds = this.userConversations.get(userId) || new Set();
    return Array.from(conversationIds)
      .map(id => this.conversations.get(id))
      .filter(c => c && c.assistantType === assistantType) as Conversation[];
  }
  
  async getConversation(id: number): Promise<Conversation | undefined> {
    return this.conversations.get(id);
  }
  
  async updateConversationTitle(id: number, title: string): Promise<Conversation | undefined> {
    const conversation = this.conversations.get(id);
    if (!conversation) return undefined;
    
    const updatedConversation = {
      ...conversation,
      title,
      updatedAt: new Date().toISOString()
    };
    
    this.conversations.set(id, updatedConversation);
    return updatedConversation;
  }
  
  async deleteConversation(id: number): Promise<boolean> {
    const conversation = this.conversations.get(id);
    if (!conversation) return false;
    
    // Remover das conversas do usuário
    const userConversations = this.userConversations.get(conversation.userId);
    if (userConversations) {
      userConversations.delete(id);
    }
    
    // Remover mensagens da conversa
    const messagesToDelete = Array.from(this.messages.values())
      .filter(m => m.conversationId === id)
      .map(m => m.id);
    
    for (const msgId of messagesToDelete) {
      this.messages.delete(msgId);
    }
    
    // Remover a conversa
    return this.conversations.delete(id);
  }
  
  // Métodos para gerenciar mensagens
  async addMessage(insertMessage: InsertMessage): Promise<Message> {
    const id = this.currentMessageId++;
    const now = new Date().toISOString();
    
    const message: Message = {
      ...insertMessage,
      id,
      timestamp: insertMessage.timestamp || now,
      contextData: insertMessage.contextData || null,
      feedback: null
    };
    
    this.messages.set(id, message);
    
    // Atualizar o timestamp da conversa
    const conversation = this.conversations.get(message.conversationId);
    if (conversation) {
      const updatedConversation = {
        ...conversation,
        updatedAt: now
      };
      this.conversations.set(message.conversationId, updatedConversation);
    }
    
    return message;
  }
  
  async getConversationMessages(conversationId: number): Promise<Message[]> {
    return Array.from(this.messages.values())
      .filter(m => m.conversationId === conversationId)
      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  }
  
  async updateMessageFeedback(id: number, feedback: "positive" | "negative" | "neutral" | null): Promise<Message | undefined> {
    const message = this.messages.get(id);
    if (!message) return undefined;
    
    const updatedMessage = {
      ...message,
      feedback
    };
    
    this.messages.set(id, updatedMessage);
    return updatedMessage;
  }
  
  // Métodos para gerenciar sugestões
  async createSuggestion(insertSuggestion: InsertSuggestion): Promise<Suggestion> {
    const id = this.currentSuggestionId++;
    const now = new Date().toISOString();
    
    const suggestion: Suggestion = {
      ...insertSuggestion,
      id,
      createdAt: insertSuggestion.createdAt || now,
      isRead: false,
      expiresAt: insertSuggestion.expiresAt || null
    };
    
    this.suggestions.set(id, suggestion);
    return suggestion;
  }
  
  async getUserSuggestions(userId: number, assistantType: string): Promise<Suggestion[]> {
    return Array.from(this.suggestions.values())
      .filter(s => s.userId === userId && s.assistantType === assistantType)
      .filter(s => !s.expiresAt || new Date(s.expiresAt).getTime() > Date.now())
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }
  
  async markSuggestionAsRead(id: number): Promise<Suggestion | undefined> {
    const suggestion = this.suggestions.get(id);
    if (!suggestion) return undefined;
    
    const updatedSuggestion = {
      ...suggestion,
      isRead: true
    };
    
    this.suggestions.set(id, updatedSuggestion);
    return updatedSuggestion;
  }
  
  async deleteSuggestion(id: number): Promise<boolean> {
    return this.suggestions.delete(id);
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    console.log(`Procurando usuário com username: "${username}"`);
    console.log('Usuários disponíveis:', Array.from(this.users.values()).map(u => u.username));
    
    const user = Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
    
    console.log('Usuário encontrado:', user || 'Nenhum usuário encontrado');
    return user;
  }
  
  async getUserByEmail(email: string): Promise<User | undefined> {
    console.log(`Procurando usuário com email: "${email}"`);
    
    // Se temos mapeamento de email para ID
    if (this.usersByEmail.has(email)) {
      const userId = this.usersByEmail.get(email);
      return this.users.get(userId!);
    }
    
    // Caso contrário, busque por todos os usuários
    const user = Array.from(this.users.values()).find(
      (user) => user.email === email,
    );
    
    console.log('Usuário encontrado por email:', user || 'Nenhum usuário encontrado');
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentId++;
    
    // Adicionar campos obrigatórios que podem estar faltando
    const user: User = { 
      ...insertUser, 
      id,
      role: insertUser.role || "client", // Garantir que role sempre tenha um valor
      mentorId: insertUser.mentorId ?? null,
      plan: insertUser.plan ?? null,
      active: true,
      createdAt: new Date().toISOString(),
      profile: null,
      company: insertUser.company ?? null,
      position: insertUser.position ?? null
    };
    
    this.users.set(id, user);
    
    // Armazenar email para acesso rápido
    if (user.email) {
      this.usersByEmail.set(user.email, id);
    }
    
    // If this is a client and has a mentorId, add to the mentor's clients
    if (user.role === 'client' && user.mentorId) {
      if (!this.mentorClients.has(user.mentorId)) {
        this.mentorClients.set(user.mentorId, new Set());
      }
      this.mentorClients.get(user.mentorId)?.add(id);
    }
    
    console.log('Novo usuário criado:', user);
    return user;
  }

  async getAllMentors(): Promise<User[]> {
    return Array.from(this.users.values()).filter(
      (user) => user.role === 'mentor',
    );
  }

  async getClientsByMentorId(mentorId: number): Promise<User[]> {
    const clientIds = this.mentorClients.get(mentorId) || new Set();
    return Array.from(clientIds).map(id => this.users.get(id)).filter(Boolean) as User[];
  }
  
  async getUserByStripeSubscriptionId(subscriptionId: string): Promise<User | undefined> {
    console.log(`Procurando usuário com subscriptionId: "${subscriptionId}"`);
    
    // Buscar usuário pelo ID da assinatura Stripe
    const user = Array.from(this.users.values()).find(
      (user) => user.stripeSubscriptionId === subscriptionId
    );
    
    console.log('Usuário encontrado por subscriptionId:', user || 'Nenhum usuário encontrado');
    return user;
  }
  
  async updateUserStripeCustomerId(userId: number, stripeCustomerId: string): Promise<User | undefined> {
    console.log(`Atualizando ID de cliente Stripe para usuário ${userId}: ${stripeCustomerId}`);
    
    const user = this.users.get(userId);
    if (!user) return undefined;
    
    const updatedUser = {
      ...user,
      stripeCustomerId,
      updatedAt: new Date().toISOString()
    };
    
    this.users.set(userId, updatedUser);
    return updatedUser;
  }
  
  async updateUserStripeInfo(userId: number, stripeInfo: { 
    stripeCustomerId?: string, 
    stripeSubscriptionId?: string | null
  }): Promise<User | undefined> {
    console.log(`Atualizando informações do Stripe para usuário ${userId}:`, stripeInfo);
    
    const user = this.users.get(userId);
    if (!user) return undefined;
    
    const updatedUser = {
      ...user,
      ...stripeInfo,
      updatedAt: new Date().toISOString()
    };
    
    this.users.set(userId, updatedUser);
    return updatedUser;
  }

  private addSampleData() {
    // Usuário mentor com login 'admin'
    const adminMentor = {
      id: this.currentId++,
      username: "admin",
      email: "admin@rhmaster.com.br", // Adicionar email para mentor
      password: "21232f297a57a5a743894a0e4a801fc3", // 'admin' com hash md5 correto
      name: "Marcos Silva",
      role: "mentor" as const,
      plan: "enterprise" as const,
      active: true,
      createdAt: new Date().toISOString(),
      profile: null,
      company: "RH Master Consultoria",
      position: "Diretor de Desenvolvimento",
      mentorId: null
    };
    this.users.set(adminMentor.id, adminMentor as User);
    this.usersByEmail.set(adminMentor.email, adminMentor.id);

    // Usuário cliente com login 'cliente'
    const adminClient = {
      id: this.currentId++,
      username: "cliente",
      email: "cliente@empresa.com.br", // Adicionar email para cliente
      password: "21232f297a57a5a743894a0e4a801fc3", // 'admin' com hash md5 correto
      name: "Ana Oliveira",
      role: "client" as const,
      mentorId: adminMentor.id,
      plan: "pro" as const,
      active: true, 
      createdAt: new Date().toISOString(),
      profile: null,
      company: "Tech Solutions Inc.",
      position: "Gerente de Produto",
    };
    this.users.set(adminClient.id, adminClient as User);
    this.usersByEmail.set(adminClient.email, adminClient.id);

    // Set up the mentor-client relationship
    this.mentorClients.set(adminMentor.id, new Set([adminClient.id]));
  }
}

// Implementação de armazenamento com PostgreSQL
export class DatabaseStorage implements IStorage {
  sessionStore: session.Store;

  constructor() {
    this.sessionStore = new PostgresSessionStore({ 
      pool,
      createTableIfMissing: true
    });
  }

  // Implementação de usuários
  async getUser(id: number): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id));
    return result[0];
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    console.log(`Procurando usuário com username: "${username}"`);
    
    const result = await db.select().from(users).where(eq(users.username, username));
    const user = result[0];
    
    console.log('Usuário encontrado:', user || 'Nenhum usuário encontrado');
    return user;
  }
  
  async getUserByEmail(email: string): Promise<User | undefined> {
    console.log(`Procurando usuário com email: "${email}"`);
    
    const result = await db.select().from(users).where(eq(users.email, email));
    const user = result[0];
    
    console.log('Usuário encontrado:', user || 'Nenhum usuário encontrado');
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    // Adicionar campos obrigatórios que podem estar faltando
    const userToInsert = {
      ...insertUser,
      role: insertUser.role || "client", // Garantir que role sempre tenha um valor
      active: true,
      createdAt: new Date(),
    };
    
    const result = await db.insert(users).values(userToInsert).returning();
    const user = result[0];
    
    console.log('Novo usuário criado:', user);
    return user;
  }
  
  async updateUserStripeCustomerId(userId: number, stripeCustomerId: string): Promise<User | undefined> {
    console.log(`Atualizando ID de cliente Stripe para usuário ${userId}: ${stripeCustomerId}`);
    
    const result = await db
      .update(users)
      .set({ 
        stripeCustomerId,
        updatedAt: new Date()
      })
      .where(eq(users.id, userId))
      .returning();
    
    const user = result[0];
    return user;
  }
  
  async updateUserStripeInfo(userId: number, stripeInfo: { 
    stripeCustomerId?: string, 
    stripeSubscriptionId?: string | null
  }): Promise<User | undefined> {
    console.log(`Atualizando informações do Stripe para usuário ${userId}:`, stripeInfo);
    
    const result = await db
      .update(users)
      .set({ 
        ...stripeInfo,
        updatedAt: new Date()
      })
      .where(eq(users.id, userId))
      .returning();
    
    const user = result[0];
    return user;
  }
  
  async getUserByStripeSubscriptionId(subscriptionId: string): Promise<User | undefined> {
    console.log(`Procurando usuário com subscriptionId: "${subscriptionId}"`);
    
    const result = await db.select().from(users).where(eq(users.stripeSubscriptionId, subscriptionId));
    const user = result[0];
    
    console.log('Usuário encontrado:', user || 'Nenhum usuário encontrado');
    return user;
  }

  async getAllMentors(): Promise<User[]> {
    return await db.select().from(users).where(eq(users.role, "mentor"));
  }

  async getClientsByMentorId(mentorId: number): Promise<User[]> {
    return await db.select().from(users).where(and(
      eq(users.role, "client"),
      eq(users.mentorId, mentorId)
    ));
  }

  // Implementação de conversas
  async createConversation(insertConversation: InsertConversation): Promise<Conversation> {
    const result = await db.insert(conversations).values({
      ...insertConversation,
      createdAt: new Date(),
      updatedAt: new Date()
    }).returning();
    
    return result[0];
  }

  async getUserConversations(userId: number, assistantType: string): Promise<Conversation[]> {
    return await db.select().from(conversations).where(and(
      eq(conversations.userId, userId),
      eq(conversations.assistantType, assistantType)
    )).orderBy(desc(conversations.updatedAt));
  }

  async getConversation(id: number): Promise<Conversation | undefined> {
    const result = await db.select().from(conversations).where(eq(conversations.id, id));
    return result[0];
  }

  async updateConversationTitle(id: number, title: string): Promise<Conversation | undefined> {
    const result = await db.update(conversations)
      .set({ title, updatedAt: new Date() })
      .where(eq(conversations.id, id))
      .returning();
    
    return result[0];
  }

  async deleteConversation(id: number): Promise<boolean> {
    // Primeiro, remover todas as mensagens relacionadas
    await db.delete(messages).where(eq(messages.conversationId, id));
    
    // Depois, remover a conversa
    const result = await db.delete(conversations).where(eq(conversations.id, id)).returning();
    
    return result.length > 0;
  }

  // Implementação de mensagens
  async addMessage(insertMessage: InsertMessage): Promise<Message> {
    // Criar a mensagem
    const result = await db.insert(messages).values({
      ...insertMessage,
      timestamp: insertMessage.timestamp || new Date(),
      feedback: null
    }).returning();
    
    // Atualizar o timestamp da conversa
    await db.update(conversations)
      .set({ updatedAt: new Date() })
      .where(eq(conversations.id, insertMessage.conversationId));
    
    return result[0];
  }

  async getConversationMessages(conversationId: number): Promise<Message[]> {
    // Se passado um ID negativo (caso especial), retornar todas as mensagens
    if (conversationId < 0) {
      return await db.select().from(messages);
    }
    
    return await db.select().from(messages)
      .where(eq(messages.conversationId, conversationId))
      .orderBy(messages.timestamp);
  }

  async updateMessageFeedback(id: number, feedback: "positive" | "negative" | "neutral" | null): Promise<Message | undefined> {
    const result = await db.update(messages)
      .set({ feedback })
      .where(eq(messages.id, id))
      .returning();
    
    return result[0];
  }

  // Implementação de sugestões
  async createSuggestion(insertSuggestion: InsertSuggestion): Promise<Suggestion> {
    const result = await db.insert(suggestions).values({
      ...insertSuggestion,
      isRead: false,
      createdAt: new Date()
    }).returning();
    
    return result[0];
  }

  async getUserSuggestions(userId: number, assistantType: string): Promise<Suggestion[]> {
    const now = new Date();
    
    return await db.select().from(suggestions).where(and(
      eq(suggestions.userId, userId),
      eq(suggestions.assistantType, assistantType),
      // Verificar se a sugestão não está expirada 
      // (ou não tem data de expiração)
      or(
        isNull(suggestions.expiresAt),
        gte(suggestions.expiresAt, now)
      )
    )).orderBy(desc(suggestions.createdAt));
  }

  async markSuggestionAsRead(id: number): Promise<Suggestion | undefined> {
    const result = await db.update(suggestions)
      .set({ isRead: true })
      .where(eq(suggestions.id, id))
      .returning();
    
    return result[0];
  }

  async deleteSuggestion(id: number): Promise<boolean> {
    const result = await db.delete(suggestions)
      .where(eq(suggestions.id, id))
      .returning();
    
    return result.length > 0;
  }
}

// Verificamos se existe a variável de ambiente DATABASE_URL
// Se existir, usamos o DatabaseStorage, caso contrário, usamos o MemStorage
// Isso permite que a aplicação funcione mesmo sem banco de dados configurado
let selectedStorage: IStorage;

if (process.env.DATABASE_URL) {
  console.log("Usando armazenamento com banco de dados PostgreSQL");
  selectedStorage = new DatabaseStorage();
} else {
  console.log("Usando armazenamento em memória");
  selectedStorage = new MemStorage();
}

export const storage = selectedStorage;
