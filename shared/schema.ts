import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  name: text("name").notNull(),
  role: text("role", { enum: ["mentor", "client"] }).notNull().default("client"),
  mentorId: integer("mentor_id"),
  plan: text("plan", { enum: ["free", "basic", "pro", "enterprise"] }),
  active: boolean("active").default(true),
  createdAt: text("created_at").notNull(), // ISO date string
  profile: text("profile"), // JSON string with profile data
  company: text("company"),
  position: text("position"),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  name: true,
  role: true,
  mentorId: true,
  plan: true,
  company: true,
  position: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export const tests = pgTable("tests", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  type: text("type", { enum: ["behavior", "emotional_intelligence", "enneagram"] }).notNull(),
  questions: text("questions").notNull(), // JSON string of questions
  estimatedTime: integer("estimated_time"), // in minutes
  active: boolean("active").default(true),
  createdAt: text("created_at").notNull(), // ISO date string
  createdBy: integer("created_by"), // mentor ID who created the test
});

export const insertTestSchema = createInsertSchema(tests).pick({
  title: true,
  description: true,
  type: true,
  questions: true,
  estimatedTime: true,
  createdBy: true,
});

export type InsertTest = z.infer<typeof insertTestSchema>;
export type Test = typeof tests.$inferSelect;

export const clientTests = pgTable("client_tests", {
  id: serial("id").primaryKey(),
  clientId: integer("client_id").notNull(),
  testId: integer("test_id").notNull(),
  assignedBy: integer("assigned_by").notNull(), // mentor ID
  assignedAt: text("assigned_at").notNull(), // ISO date string
  completedAt: text("completed_at"), // ISO date string, null if not completed
  dueDate: text("due_date"), // ISO date string, null if no due date
  status: text("status", { enum: ["assigned", "in_progress", "completed", "expired"] }).notNull().default("assigned"),
  results: text("results"), // JSON string of results, null if not completed
  score: integer("score"), // Numeric score if applicable, null if not completed
  feedback: text("feedback"), // Mentor feedback on results
});

export const insertClientTestSchema = createInsertSchema(clientTests).pick({
  clientId: true,
  testId: true,
  assignedBy: true,
  assignedAt: true,
  dueDate: true,
});

export type InsertClientTest = z.infer<typeof insertClientTestSchema>;
export type ClientTest = typeof clientTests.$inferSelect;

export const invitations = pgTable("invitations", {
  id: serial("id").primaryKey(),
  email: text("email").notNull(),
  name: text("name").notNull(),
  mentorId: integer("mentor_id").notNull(),
  token: text("token").notNull().unique(),
  status: text("status", { enum: ["pending", "accepted", "expired"] }).notNull().default("pending"),
  createdAt: text("created_at").notNull(), // ISO date string
  expiresAt: text("expires_at").notNull(), // ISO date string
});

export const insertInvitationSchema = createInsertSchema(invitations).pick({
  email: true,
  name: true,
  mentorId: true,
  token: true,
  expiresAt: true,
});

export type InsertInvitation = z.infer<typeof insertInvitationSchema>;
export type Invitation = typeof invitations.$inferSelect;

export const gamification = pgTable("gamification", {
  id: serial("id").primaryKey(),
  clientId: integer("client_id").notNull(),
  points: integer("points").notNull().default(0),
  badges: text("badges"), // JSON string of badge IDs
  level: integer("level").notNull().default(1),
  streak: integer("streak").notNull().default(0),
  lastActive: text("last_active"), // ISO date string
});

export const insertGamificationSchema = createInsertSchema(gamification).pick({
  clientId: true,
  points: true,
  badges: true,
  level: true,
  streak: true,
  lastActive: true,
});

export type InsertGamification = z.infer<typeof insertGamificationSchema>;
export type Gamification = typeof gamification.$inferSelect;

// Schema para conversas com assistentes de IA
export const conversations = pgTable("conversations", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  assistantType: text("assistant_type", { enum: ["mentor", "client"] }).notNull(),
  title: text("title").notNull(),
  createdAt: text("created_at").notNull(), // ISO date string
  updatedAt: text("updated_at").notNull(), // ISO date string
});

export const insertConversationSchema = createInsertSchema(conversations).pick({
  userId: true,
  assistantType: true,
  title: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertConversation = z.infer<typeof insertConversationSchema>;
export type Conversation = typeof conversations.$inferSelect;

// Schema para mensagens nas conversas
export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  conversationId: integer("conversation_id").notNull(),
  content: text("content").notNull(),
  role: text("role", { enum: ["user", "assistant"] }).notNull(),
  timestamp: text("timestamp").notNull(), // ISO date string
  contextData: text("context_data"), // Dados contextuais opcionais em JSON
  feedback: text("feedback", { enum: ["positive", "negative", "neutral"] }),
});

export const insertMessageSchema = createInsertSchema(messages).pick({
  conversationId: true,
  content: true,
  role: true,
  timestamp: true,
  contextData: true,
});

export type InsertMessage = z.infer<typeof insertMessageSchema>;
export type Message = typeof messages.$inferSelect;

// Schema para sugestões proativas
export const suggestions = pgTable("suggestions", {
  id: serial("id").primaryKey(), 
  userId: integer("user_id").notNull(),
  assistantType: text("assistant_type", { enum: ["mentor", "client"] }).notNull(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  contextType: text("context_type", { 
    enum: ["test_results", "client_progress", "profile_analysis", "test_taking", "dashboard"] 
  }).notNull(),
  isRead: boolean("is_read").default(false),
  createdAt: text("created_at").notNull(), // ISO date string
  expiresAt: text("expires_at"), // ISO date string opcional
});

export const insertSuggestionSchema = createInsertSchema(suggestions).pick({
  userId: true, 
  assistantType: true,
  title: true,
  content: true,
  contextType: true,
  createdAt: true,
  expiresAt: true,
});

export type InsertSuggestion = z.infer<typeof insertSuggestionSchema>;
export type Suggestion = typeof suggestions.$inferSelect;
