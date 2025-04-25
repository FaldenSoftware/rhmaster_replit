import { users, type User, type InsertUser } from "@shared/schema";
import session from "express-session";
import createMemoryStore from "memorystore";

const MemoryStore = createMemoryStore(session);

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getAllMentors(): Promise<User[]>;
  getClientsByMentorId(mentorId: number): Promise<User[]>;
  sessionStore: session.SessionStore;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private mentorClients: Map<number, Set<number>>;
  currentId: number;
  sessionStore: session.SessionStore;

  constructor() {
    this.users = new Map();
    this.mentorClients = new Map();
    this.currentId = 1;
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000, // prune expired entries every 24h
    });
    
    // Add some sample data
    this.addSampleData();
    
    // Debug: Print all users
    console.log('Usuários disponíveis:', Array.from(this.users.entries()));
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

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentId++;
    
    // Adicionar campos obrigatórios que podem estar faltando
    const user: User = { 
      ...insertUser, 
      id,
      mentorId: insertUser.mentorId ?? null,
      plan: insertUser.plan ?? null,
      active: true,
      createdAt: new Date().toISOString(),
      profile: null,
      company: insertUser.company ?? null,
      position: insertUser.position ?? null
    };
    
    this.users.set(id, user);
    
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

  private addSampleData() {
    // Usuário mentor com login 'admin'
    const adminMentor = {
      id: this.currentId++,
      username: "admin",
      password: "827ccb0eea8a706c4c34a16891f84e7b", // 'admin' com hash md5 (temporário)
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

    // Usuário cliente com login 'cliente'
    const adminClient = {
      id: this.currentId++,
      username: "cliente",
      password: "827ccb0eea8a706c4c34a16891f84e7b", // 'admin' com hash md5 (temporário)
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

    // Set up the mentor-client relationship
    this.mentorClients.set(adminMentor.id, new Set([adminClient.id]));
  }
}

export const storage = new MemStorage();
