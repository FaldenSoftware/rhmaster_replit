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
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    
    // If this is a client and has a mentorId, add to the mentor's clients
    if (user.role === 'client' && user.mentorId) {
      if (!this.mentorClients.has(user.mentorId)) {
        this.mentorClients.set(user.mentorId, new Set());
      }
      this.mentorClients.get(user.mentorId)?.add(id);
    }
    
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
    // This is just for testing and would be removed in production
    const sampleMentor = {
      id: this.currentId++,
      username: "mentor@example.com",
      password: "password-hash", // In reality this would be hashed
      name: "Carlos Mendes",
      role: "mentor"
    };
    this.users.set(sampleMentor.id, sampleMentor as User);

    const sampleClient = {
      id: this.currentId++,
      username: "client@example.com",
      password: "password-hash", // In reality this would be hashed
      name: "Ana Beatriz",
      role: "client",
      mentorId: sampleMentor.id
    };
    this.users.set(sampleClient.id, sampleClient as User);

    // Set up the mentor-client relationship
    this.mentorClients.set(sampleMentor.id, new Set([sampleClient.id]));
  }
}

export const storage = new MemStorage();
