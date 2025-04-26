import { 
  pgTable, 
  text, 
  serial, 
  integer, 
  boolean, 
  timestamp, 
  date,
  pgEnum,
  foreignKey,
  json,
  uniqueIndex,
  numeric,
  primaryKey,
  index
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// Enums para campos com valores predefinidos
export const userRoleEnum = pgEnum('user_role', ['mentor', 'client', 'admin']);
export const subscriptionPlanEnum = pgEnum('subscription_plan', ['free', 'basic', 'pro', 'enterprise']);
export const invitationStatusEnum = pgEnum('invitation_status', ['pending', 'accepted', 'expired']);
export const testTypeEnum = pgEnum('test_type', [
  'behavior', 
  'emotional_intelligence', 
  'leadership', 
  'enneagram', 
  'communication', 
  'behavioral_profile', // Águia, Gato, Lobo e Tubarão
  'emotional_intelligence_test', // Teste de Inteligência Emocional
  'enneagram_test', // Teste Eneagrama
  'custom'
]);
export const testStatusEnum = pgEnum('test_status', ['assigned', 'in_progress', 'completed', 'expired']);
export const messageRoleEnum = pgEnum('message_role', ['user', 'assistant']);
export const messageFeedbackEnum = pgEnum('message_feedback', ['positive', 'negative', 'neutral']);
export const contextTypeEnum = pgEnum('context_type', ['test_results', 'client_progress', 'profile_analysis', 'test_taking', 'dashboard']);
export const paymentStatusEnum = pgEnum('payment_status', ['pending', 'completed', 'failed', 'refunded']);
export const subscriptionStatusEnum = pgEnum('subscription_status', ['active', 'inactive', 'trial', 'canceled', 'expired']);

// 1. Users - Base para todos os usuários do sistema
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull().unique(),
  name: text("name").notNull(),
  role: userRoleEnum("role").notNull().default('client'),
  stripeCustomerId: text("stripe_customer_id").unique(),
  stripeSubscriptionId: text("stripe_subscription_id").unique(),
  stripePlanId: text("stripe_plan_id"),
  subscriptionStatus: subscriptionStatusEnum("subscription_status").default('trial'),
  subscriptionStartDate: timestamp("subscription_start_date"),
  subscriptionEndDate: timestamp("subscription_end_date"),
  active: boolean("active").default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  lastLogin: timestamp("last_login"),
  profile: json("profile").$type<Record<string, any>>(), // Dados de perfil flexíveis
  company: text("company"),
  position: text("position"),
  phone: text("phone"),
  avatar: text("avatar"), // URL da imagem de perfil
}, (table) => {
  return {
    emailIdx: uniqueIndex("email_idx").on(table.email),
    usernameIdx: uniqueIndex("username_idx").on(table.username),
    roleIdx: index("role_idx").on(table.role),
    stripeSubIdx: index("stripe_subscription_id_idx").on(table.stripeSubscriptionId),
  }
});

export const usersRelations = relations(users, ({ one, many }) => ({
  mentor: one(mentors, {
    fields: [users.id],
    references: [mentors.userId],
    relationName: "user_mentor",
  }),
  client: one(clients, {
    fields: [users.id],
    references: [clients.userId],
    relationName: "user_client",
  }),
  conversations: many(conversations),
  assistantInteractions: many(aiAssistantInteractions),
  achievements: many(clientAchievements),
  assignedTests: many(testAssignments, { relationName: "assigned_tests" }),
  testResponses: many(testResponses),
}));

export const insertUserSchema = createInsertSchema(users, {
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "A senha deve ter no mínimo 6 caracteres"),
}).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  lastLogin: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// 2. Mentors - Informações específicas para mentores
export const mentors = pgTable("mentors", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  bio: text("bio"),
  specialties: json("specialties").$type<string[]>(), // Lista de especialidades do mentor
  yearsExperience: integer("years_experience"),
  rating: numeric("rating", { precision: 3, scale: 2 }),
  availableSlots: integer("available_slots").default(10), // Slots disponíveis para clientes
  verified: boolean("verified").default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
}, (table) => {
  return {
    userIdIdx: uniqueIndex("mentor_user_id_idx").on(table.userId),
  }
});

export const mentorsRelations = relations(mentors, ({ one, many }) => ({
  user: one(users, {
    fields: [mentors.userId],
    references: [users.id],
    relationName: "user_mentor",
  }),
  clients: many(clients),
  tests: many(tests),
  subscription: one(subscriptions),
  invitations: many(invitations),
}));

export const insertMentorSchema = createInsertSchema(mentors).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertMentor = z.infer<typeof insertMentorSchema>;
export type Mentor = typeof mentors.$inferSelect;

// 3. Clients - Informações específicas para clientes
export const clients = pgTable("clients", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  mentorId: integer("mentor_id").notNull().references(() => mentors.id),
  department: text("department"),
  jobTitle: text("job_title"),
  focus: json("focus").$type<string[]>(), // Áreas de foco do desenvolvimento
  onboardingCompleted: boolean("onboarding_completed").default(false),
  startDate: timestamp("start_date").notNull().defaultNow(),
  notes: text("notes"), // Notas do mentor sobre o cliente
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
}, (table) => {
  return {
    userIdIdx: uniqueIndex("client_user_id_idx").on(table.userId),
    mentorIdIdx: index("client_mentor_id_idx").on(table.mentorId),
  }
});

export const clientsRelations = relations(clients, ({ one, many }) => ({
  user: one(users, {
    fields: [clients.userId],
    references: [users.id],
    relationName: "user_client",
  }),
  mentor: one(mentors, {
    fields: [clients.mentorId],
    references: [mentors.id],
  }),
  gamification: one(gamificationPoints),
  assignments: many(testAssignments),
  responses: many(testResponses),
  achievements: many(clientAchievements),
}));

export const insertClientSchema = createInsertSchema(clients).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertClient = z.infer<typeof insertClientSchema>;
export type Client = typeof clients.$inferSelect;

// 4. Invitations - Gerenciamento de convites para clientes
export const invitations = pgTable("invitations", {
  id: serial("id").primaryKey(),
  email: text("email").notNull(),
  name: text("name").notNull(),
  mentorId: integer("mentor_id").notNull().references(() => mentors.id),
  token: text("token").notNull().unique(),
  message: text("message"),
  status: invitationStatusEnum("status").notNull().default('pending'),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  expiresAt: timestamp("expires_at").notNull(),
  acceptedAt: timestamp("accepted_at"),
}, (table) => {
  return {
    emailIdx: index("invitation_email_idx").on(table.email),
    tokenIdx: uniqueIndex("invitation_token_idx").on(table.token),
    mentorIdIdx: index("invitation_mentor_id_idx").on(table.mentorId),
    statusIdx: index("invitation_status_idx").on(table.status),
  }
});

export const invitationsRelations = relations(invitations, ({ one }) => ({
  mentor: one(mentors, {
    fields: [invitations.mentorId],
    references: [mentors.id],
  }),
}));

export const insertInvitationSchema = createInsertSchema(invitations, {
  email: z.string().email("Email inválido"),
}).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  acceptedAt: true,
});

export type InsertInvitation = z.infer<typeof insertInvitationSchema>;
export type Invitation = typeof invitations.$inferSelect;

// 5. Tests - Testes disponíveis na plataforma
export const tests = pgTable("tests", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  type: testTypeEnum("type").notNull(),
  estimatedTimeMinutes: integer("estimated_time_minutes").default(30),
  active: boolean("active").default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  createdBy: integer("created_by").references(() => mentors.id),
  isTemplate: boolean("is_template").default(false),
  maxScore: integer("max_score"),
  tags: json("tags").$type<string[]>(), // Tags para categorização
  instructions: text("instructions"),
}, (table) => {
  return {
    typeIdx: index("test_type_idx").on(table.type),
    createdByIdx: index("test_created_by_idx").on(table.createdBy),
  }
});

export const testsRelations = relations(tests, ({ one, many }) => ({
  creator: one(mentors, {
    fields: [tests.createdBy],
    references: [mentors.id],
  }),
  questions: many(questions),
  assignments: many(testAssignments),
}));

export const insertTestSchema = createInsertSchema(tests).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertTest = z.infer<typeof insertTestSchema>;
export type Test = typeof tests.$inferSelect;

// 6. Questions - Perguntas dos testes
export const questions = pgTable("questions", {
  id: serial("id").primaryKey(),
  testId: integer("test_id").notNull().references(() => tests.id, { onDelete: "cascade" }),
  text: text("text").notNull(),
  type: text("type", { enum: ["multiple_choice", "true_false", "scale", "open_ended"] }).notNull(),
  required: boolean("required").default(true),
  order: integer("order").notNull(),
  points: integer("points").default(1),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  metadata: json("metadata").$type<Record<string, any>>(), // Metadados adicionais
}, (table) => {
  return {
    testIdIdx: index("question_test_id_idx").on(table.testId),
    testIdOrderIdx: uniqueIndex("question_test_id_order_idx").on(table.testId, table.order),
  }
});

export const questionsRelations = relations(questions, ({ one, many }) => ({
  test: one(tests, {
    fields: [questions.testId],
    references: [tests.id],
  }),
  options: many(options),
  responses: many(testResponseAnswers),
}));

export const insertQuestionSchema = createInsertSchema(questions).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertQuestion = z.infer<typeof insertQuestionSchema>;
export type Question = typeof questions.$inferSelect;

// 7. Options - Opções de resposta para perguntas de múltipla escolha
export const options = pgTable("options", {
  id: serial("id").primaryKey(),
  questionId: integer("question_id").notNull().references(() => questions.id, { onDelete: "cascade" }),
  text: text("text").notNull(),
  value: text("value").notNull(),
  order: integer("order").notNull(),
  isCorrect: boolean("is_correct").default(false), // Para questões com respostas corretas
  points: integer("points").default(0), // Pontos atribuídos a esta opção
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
}, (table) => {
  return {
    questionIdIdx: index("option_question_id_idx").on(table.questionId),
    questionIdOrderIdx: uniqueIndex("option_question_id_order_idx").on(table.questionId, table.order),
  }
});

export const optionsRelations = relations(options, ({ one, many }) => ({
  question: one(questions, {
    fields: [options.questionId],
    references: [questions.id],
  }),
}));

export const insertOptionSchema = createInsertSchema(options).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertOption = z.infer<typeof insertOptionSchema>;
export type Option = typeof options.$inferSelect;

// 8. TestAssignments - Atribuição de testes aos clientes
export const testAssignments = pgTable("test_assignments", {
  id: serial("id").primaryKey(),
  testId: integer("test_id").notNull().references(() => tests.id),
  clientId: integer("client_id").notNull().references(() => clients.id),
  assignedBy: integer("assigned_by").notNull().references(() => users.id),
  status: testStatusEnum("status").notNull().default('assigned'),
  assignedAt: timestamp("assigned_at").notNull().defaultNow(),
  dueDate: timestamp("due_date"),
  completedAt: timestamp("completed_at"),
  kanbanColumn: text("kanban_column").default("to_do"), // Para visualização Kanban
  priority: text("priority", { enum: ["low", "medium", "high"] }).default("medium"),
  notes: text("notes"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
}, (table) => {
  return {
    testIdClientIdIdx: uniqueIndex("assignment_test_client_idx").on(table.testId, table.clientId),
    clientIdIdx: index("assignment_client_id_idx").on(table.clientId),
    assignedByIdx: index("assignment_assigned_by_idx").on(table.assignedBy),
    statusIdx: index("assignment_status_idx").on(table.status),
  }
});

export const testAssignmentsRelations = relations(testAssignments, ({ one, many }) => ({
  test: one(tests, {
    fields: [testAssignments.testId],
    references: [tests.id],
  }),
  client: one(clients, {
    fields: [testAssignments.clientId],
    references: [clients.id],
  }),
  assignedBy: one(users, {
    fields: [testAssignments.assignedBy],
    references: [users.id],
    relationName: "assigned_tests",
  }),
  responses: many(testResponses),
  results: one(testResults),
}));

export const insertTestAssignmentSchema = createInsertSchema(testAssignments).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  completedAt: true,
});

export type InsertTestAssignment = z.infer<typeof insertTestAssignmentSchema>;
export type TestAssignment = typeof testAssignments.$inferSelect;

// 9. TestResponses - Respostas dos clientes aos testes
export const testResponses = pgTable("test_responses", {
  id: serial("id").primaryKey(),
  assignmentId: integer("assignment_id").notNull().references(() => testAssignments.id, { onDelete: "cascade" }),
  clientId: integer("client_id").notNull().references(() => clients.id),
  startedAt: timestamp("started_at").notNull().defaultNow(),
  submittedAt: timestamp("submitted_at"),
  timeSpentSeconds: integer("time_spent_seconds"),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
}, (table) => {
  return {
    assignmentIdIdx: uniqueIndex("response_assignment_id_idx").on(table.assignmentId),
    clientIdIdx: index("response_client_id_idx").on(table.clientId),
  }
});

export const testResponsesRelations = relations(testResponses, ({ one, many }) => ({
  assignment: one(testAssignments, {
    fields: [testResponses.assignmentId],
    references: [testAssignments.id],
  }),
  client: one(clients, {
    fields: [testResponses.clientId],
    references: [clients.id],
  }),
  user: one(users, {
    fields: [testResponses.clientId],
    references: [users.id],
  }),
  answers: many(testResponseAnswers),
  result: one(testResults),
}));

export const insertTestResponseSchema = createInsertSchema(testResponses).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  submittedAt: true,
  timeSpentSeconds: true,
});

export type InsertTestResponse = z.infer<typeof insertTestResponseSchema>;
export type TestResponse = typeof testResponses.$inferSelect;

// 10. TestResponseAnswers - Respostas individuais para cada pergunta
export const testResponseAnswers = pgTable("test_response_answers", {
  id: serial("id").primaryKey(),
  responseId: integer("response_id").notNull().references(() => testResponses.id, { onDelete: "cascade" }),
  questionId: integer("question_id").notNull().references(() => questions.id),
  answer: text("answer"), // Texto da resposta para questões abertas
  selectedOptions: json("selected_options").$type<number[]>(), // IDs das opções selecionadas
  scaleValue: integer("scale_value"), // Valor para questões de escala
  answeredAt: timestamp("answered_at").notNull().defaultNow(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
}, (table) => {
  return {
    responseIdQuestionIdIdx: uniqueIndex("answer_response_question_idx").on(table.responseId, table.questionId),
    questionIdIdx: index("answer_question_id_idx").on(table.questionId),
  }
});

export const testResponseAnswersRelations = relations(testResponseAnswers, ({ one }) => ({
  response: one(testResponses, {
    fields: [testResponseAnswers.responseId],
    references: [testResponses.id],
  }),
  question: one(questions, {
    fields: [testResponseAnswers.questionId],
    references: [questions.id],
  }),
}));

export const insertTestResponseAnswerSchema = createInsertSchema(testResponseAnswers).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertTestResponseAnswer = z.infer<typeof insertTestResponseAnswerSchema>;
export type TestResponseAnswer = typeof testResponseAnswers.$inferSelect;

// 11. TestResults - Resultados processados dos testes
export const testResults = pgTable("test_results", {
  id: serial("id").primaryKey(),
  assignmentId: integer("assignment_id").notNull().references(() => testAssignments.id, { onDelete: "cascade" }),
  responseId: integer("response_id").notNull().references(() => testResponses.id, { onDelete: "cascade" }),
  clientId: integer("client_id").notNull().references(() => clients.id),
  score: integer("score"),
  percentage: numeric("percentage", { precision: 5, scale: 2 }),
  assessment: text("assessment"), // Avaliação geral do teste
  strengths: json("strengths").$type<string[]>(), // Pontos fortes identificados
  areasForImprovement: json("areas_for_improvement").$type<string[]>(), // Áreas para melhoria
  recommendations: text("recommendations"),
  mentorFeedback: text("mentor_feedback"),
  // Para Teste de Perfil Comportamental (Águia, Gato, Lobo, Tubarão)
  behavioralProfile: json("behavioral_profile").$type<{
    aguia: number;  // Percentual de Águia (0-100)
    gato: number;   // Percentual de Gato (0-100)
    lobo: number;   // Percentual de Lobo (0-100)
    tubarao: number; // Percentual de Tubarão (0-100)
    predominant: "aguia" | "gato" | "lobo" | "tubarao"; // Perfil predominante
    secondary: "aguia" | "gato" | "lobo" | "tubarao"; // Perfil secundário
  }>(),
  // Para Teste de Inteligência Emocional
  emotionalIntelligence: json("emotional_intelligence").$type<{
    autoconsciencia: number;  // Pontuação 0-100
    autocontrole: number;     // Pontuação 0-100
    automotivacao: number;    // Pontuação 0-100
    empatia: number;          // Pontuação 0-100
    habilidadesSociais: number; // Pontuação 0-100
    total: number;            // Pontuação total 0-100
  }>(),
  // Para Teste de Eneagrama
  enneagram: json("enneagram").$type<{
    primaryType: number;      // Tipo principal (1-9)
    wing: number;             // Asa (tipos adjacentes)
    scores: number[];         // Pontuações para cada tipo (array de 9 números)
    integrationDirection: number; // Direção de integração
    disintegrationDirection: number; // Direção de desintegração
  }>(),
  analyzed: boolean("analyzed").default(false), // Se um mentor já analisou
  analyzedBy: integer("analyzed_by").references(() => users.id),
  analyzedAt: timestamp("analyzed_at"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
}, (table) => {
  return {
    assignmentIdIdx: uniqueIndex("result_assignment_id_idx").on(table.assignmentId),
    responseIdIdx: uniqueIndex("result_response_id_idx").on(table.responseId),
    clientIdIdx: index("result_client_id_idx").on(table.clientId),
  }
});

export const testResultsRelations = relations(testResults, ({ one }) => ({
  assignment: one(testAssignments, {
    fields: [testResults.assignmentId],
    references: [testAssignments.id],
  }),
  response: one(testResponses, {
    fields: [testResults.responseId],
    references: [testResponses.id],
  }),
  client: one(clients, {
    fields: [testResults.clientId],
    references: [clients.id],
  }),
  analyzer: one(users, {
    fields: [testResults.analyzedBy],
    references: [users.id],
  }),
}));

export const insertTestResultSchema = createInsertSchema(testResults).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertTestResult = z.infer<typeof insertTestResultSchema>;
export type TestResult = typeof testResults.$inferSelect;

// 12. GamificationPoints - Pontos de gamificação dos clientes
export const gamificationPoints = pgTable("gamification_points", {
  id: serial("id").primaryKey(),
  clientId: integer("client_id").notNull().references(() => clients.id, { onDelete: "cascade" }),
  totalPoints: integer("total_points").notNull().default(0),
  level: integer("level").notNull().default(1),
  streak: integer("streak").notNull().default(0),
  lastActivity: timestamp("last_activity"),
  weeklyPoints: integer("weekly_points").default(0),
  monthlyPoints: integer("monthly_points").default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
}, (table) => {
  return {
    clientIdIdx: uniqueIndex("gamification_client_id_idx").on(table.clientId),
  }
});

export const gamificationPointsRelations = relations(gamificationPoints, ({ one }) => ({
  client: one(clients, {
    fields: [gamificationPoints.clientId],
    references: [clients.id],
  }),
}));

export const insertGamificationPointsSchema = createInsertSchema(gamificationPoints).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertGamificationPoints = z.infer<typeof insertGamificationPointsSchema>;
export type GamificationPoints = typeof gamificationPoints.$inferSelect;

// 13. Achievements - Conquistas desbloqueáveis
export const achievements = pgTable("achievements", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  icon: text("icon").notNull(),
  points: integer("points").notNull().default(10),
  category: text("category", { enum: ["test_completion", "streak", "personal_development", "engagement"] }).notNull(),
  requirement: text("requirement").notNull(), // Descrição do requisito
  requirementValue: integer("requirement_value").notNull(), // Valor numérico do requisito
  active: boolean("active").default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
}, (table) => {
  return {
    nameIdx: uniqueIndex("achievement_name_idx").on(table.name),
    categoryIdx: index("achievement_category_idx").on(table.category),
  }
});

export const achievementsRelations = relations(achievements, ({ many }) => ({
  clientAchievements: many(clientAchievements),
}));

export const insertAchievementSchema = createInsertSchema(achievements).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertAchievement = z.infer<typeof insertAchievementSchema>;
export type Achievement = typeof achievements.$inferSelect;

// 14. ClientAchievements - Relação entre clientes e conquistas
export const clientAchievements = pgTable("client_achievements", {
  id: serial("id").primaryKey(),
  clientId: integer("client_id").notNull().references(() => clients.id, { onDelete: "cascade" }),
  achievementId: integer("achievement_id").notNull().references(() => achievements.id),
  unlockedAt: timestamp("unlocked_at").notNull().defaultNow(),
  userId: integer("user_id").notNull().references(() => users.id), // Relacionamento direto com usuário
  createdAt: timestamp("created_at").notNull().defaultNow(),
}, (table) => {
  return {
    clientIdAchievementIdIdx: uniqueIndex("client_achievement_idx").on(table.clientId, table.achievementId),
    userIdAchievementIdIdx: uniqueIndex("user_achievement_idx").on(table.userId, table.achievementId),
  }
});

export const clientAchievementsRelations = relations(clientAchievements, ({ one }) => ({
  client: one(clients, {
    fields: [clientAchievements.clientId],
    references: [clients.id],
  }),
  achievement: one(achievements, {
    fields: [clientAchievements.achievementId],
    references: [achievements.id],
  }),
  user: one(users, {
    fields: [clientAchievements.userId],
    references: [users.id],
  }),
}));

export const insertClientAchievementSchema = createInsertSchema(clientAchievements).omit({
  id: true,
  createdAt: true,
});

export type InsertClientAchievement = z.infer<typeof insertClientAchievementSchema>;
export type ClientAchievement = typeof clientAchievements.$inferSelect;

// 15. AIAssistantInteractions - Interações com assistentes de IA
export const aiAssistantInteractions = pgTable("ai_assistant_interactions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  assistantType: text("assistant_type", { enum: ["mentor", "client"] }).notNull(),
  query: text("query").notNull(),
  response: text("response").notNull(),
  context: json("context").$type<Record<string, any>>(),
  feedbackRating: integer("feedback_rating"), // 1-5 rating
  feedbackComment: text("feedback_comment"),
  timestamp: timestamp("timestamp").notNull().defaultNow(),
  metadata: json("metadata").$type<Record<string, any>>(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
}, (table) => {
  return {
    userIdIdx: index("ai_interaction_user_id_idx").on(table.userId),
    assistantTypeIdx: index("ai_interaction_type_idx").on(table.assistantType),
    timestampIdx: index("ai_interaction_timestamp_idx").on(table.timestamp),
  }
});

export const aiAssistantInteractionsRelations = relations(aiAssistantInteractions, ({ one }) => ({
  user: one(users, {
    fields: [aiAssistantInteractions.userId],
    references: [users.id],
  }),
}));

export const insertAIAssistantInteractionSchema = createInsertSchema(aiAssistantInteractions).omit({
  id: true,
  createdAt: true,
});

export type InsertAIAssistantInteraction = z.infer<typeof insertAIAssistantInteractionSchema>;
export type AIAssistantInteraction = typeof aiAssistantInteractions.$inferSelect;

// 16. Subscriptions - Assinaturas dos mentores
export const subscriptions = pgTable("subscriptions", {
  id: serial("id").primaryKey(),
  mentorId: integer("mentor_id").notNull().references(() => mentors.id, { onDelete: "cascade" }),
  plan: subscriptionPlanEnum("plan").notNull(),
  status: subscriptionStatusEnum("status").notNull().default('active'),
  startDate: timestamp("start_date").notNull().defaultNow(),
  endDate: timestamp("end_date"),
  autoRenew: boolean("auto_renew").default(true),
  maxClients: integer("max_clients").notNull(),
  clientCount: integer("client_count").default(0),
  paymentMethod: text("payment_method"),
  lastBillingDate: timestamp("last_billing_date"),
  nextBillingDate: timestamp("next_billing_date"),
  cancellationReason: text("cancellation_reason"),
  stripeSubscriptionId: text("stripe_subscription_id").unique(),
  stripePriceId: text("stripe_price_id"),
  stripeCurrentPeriodEnd: timestamp("stripe_current_period_end"),
  stripeCancelAtPeriodEnd: boolean("stripe_cancel_at_period_end").default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
}, (table) => {
  return {
    mentorIdIdx: uniqueIndex("subscription_mentor_id_idx").on(table.mentorId),
    statusIdx: index("subscription_status_idx").on(table.status),
    planIdx: index("subscription_plan_idx").on(table.plan),
  }
});

export const subscriptionsRelations = relations(subscriptions, ({ one, many }) => ({
  mentor: one(mentors, {
    fields: [subscriptions.mentorId],
    references: [mentors.id],
  }),
  payments: many(payments),
}));

export const insertSubscriptionSchema = createInsertSchema(subscriptions).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertSubscription = z.infer<typeof insertSubscriptionSchema>;
export type Subscription = typeof subscriptions.$inferSelect;

// 17. Payments - Registros de pagamentos
export const payments = pgTable("payments", {
  id: serial("id").primaryKey(),
  subscriptionId: integer("subscription_id").notNull().references(() => subscriptions.id),
  amount: numeric("amount", { precision: 10, scale: 2 }).notNull(),
  currency: text("currency").notNull().default("USD"),
  status: paymentStatusEnum("status").notNull().default('pending'),
  transactionId: text("transaction_id"),
  paymentMethod: text("payment_method").notNull(),
  paymentDate: timestamp("payment_date").notNull().defaultNow(),
  dueDate: timestamp("due_date"),
  invoiceNumber: text("invoice_number"),
  receiptUrl: text("receipt_url"),
  notes: text("notes"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
}, (table) => {
  return {
    subscriptionIdIdx: index("payment_subscription_id_idx").on(table.subscriptionId),
    statusIdx: index("payment_status_idx").on(table.status),
    paymentDateIdx: index("payment_date_idx").on(table.paymentDate),
  }
});

export const paymentsRelations = relations(payments, ({ one }) => ({
  subscription: one(subscriptions, {
    fields: [payments.subscriptionId],
    references: [subscriptions.id],
  }),
}));

export const insertPaymentSchema = createInsertSchema(payments).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertPayment = z.infer<typeof insertPaymentSchema>;
export type Payment = typeof payments.$inferSelect;

// 18. PointsHistory - Histórico de pontos de gamificação
export const pointsHistory = pgTable("points_history", {
  id: serial("id").primaryKey(),
  clientId: integer("client_id").notNull().references(() => clients.id, { onDelete: "cascade" }),
  points: integer("points").notNull(),
  source: text("source", { enum: ["test_completion", "streak", "achievement", "bonus", "other"] }).notNull(),
  sourceId: integer("source_id"), // ID do teste, conquista, etc.
  description: text("description").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
}, (table) => {
  return {
    clientIdIdx: index("points_history_client_id_idx").on(table.clientId),
    sourceIdx: index("points_history_source_idx").on(table.source),
  }
});

export const pointsHistoryRelations = relations(pointsHistory, ({ one }) => ({
  client: one(clients, {
    fields: [pointsHistory.clientId],
    references: [clients.id],
  }),
}));

export const insertPointsHistorySchema = createInsertSchema(pointsHistory).omit({
  id: true,
  createdAt: true,
});

export type InsertPointsHistory = z.infer<typeof insertPointsHistorySchema>;
export type PointsHistory = typeof pointsHistory.$inferSelect;

// Mantendo as estruturas para manter compatibilidade com o sistema atual
// Schema para conversas com assistentes de IA
export const conversations = pgTable("conversations", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  assistantType: text("assistant_type", { enum: ["mentor", "client"] }).notNull(),
  title: text("title").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
}, (table) => {
  return {
    userIdIdx: index("conversation_user_id_idx").on(table.userId),
    assistantTypeIdx: index("conversation_type_idx").on(table.assistantType),
  }
});

export const conversationsRelations = relations(conversations, ({ one, many }) => ({
  user: one(users, {
    fields: [conversations.userId],
    references: [users.id],
  }),
  messages: many(messages),
}));

export const insertConversationSchema = createInsertSchema(conversations).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertConversation = z.infer<typeof insertConversationSchema>;
export type Conversation = typeof conversations.$inferSelect;

// Schema para mensagens nas conversas
export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  conversationId: integer("conversation_id").notNull().references(() => conversations.id, { onDelete: "cascade" }),
  content: text("content").notNull(),
  role: messageRoleEnum("role").notNull(),
  timestamp: timestamp("timestamp").notNull().defaultNow(),
  contextData: json("context_data").$type<Record<string, any>>(), // Dados contextuais opcionais
  feedback: messageFeedbackEnum("feedback"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
}, (table) => {
  return {
    conversationIdIdx: index("message_conversation_id_idx").on(table.conversationId),
    timestampIdx: index("message_timestamp_idx").on(table.timestamp),
  }
});

export const messagesRelations = relations(messages, ({ one }) => ({
  conversation: one(conversations, {
    fields: [messages.conversationId],
    references: [conversations.id],
  }),
}));

export const insertMessageSchema = createInsertSchema(messages).omit({
  id: true,
  createdAt: true,
});

export type InsertMessage = z.infer<typeof insertMessageSchema>;
export type Message = typeof messages.$inferSelect;

// Schema para sugestões proativas
export const suggestions = pgTable("suggestions", {
  id: serial("id").primaryKey(), 
  userId: integer("user_id").notNull().references(() => users.id),
  assistantType: text("assistant_type", { enum: ["mentor", "client"] }).notNull(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  contextType: contextTypeEnum("context_type").notNull(),
  isRead: boolean("is_read").default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  expiresAt: timestamp("expires_at"), // Data opcional de expiração
}, (table) => {
  return {
    userIdIdx: index("suggestion_user_id_idx").on(table.userId),
    contextTypeIdx: index("suggestion_context_type_idx").on(table.contextType),
    assistantTypeIdx: index("suggestion_assistant_type_idx").on(table.assistantType),
  }
});

export const suggestionsRelations = relations(suggestions, ({ one }) => ({
  user: one(users, {
    fields: [suggestions.userId],
    references: [users.id],
  }),
}));

export const insertSuggestionSchema = createInsertSchema(suggestions).omit({
  id: true,
  createdAt: true,
});

export type InsertSuggestion = z.infer<typeof insertSuggestionSchema>;
export type Suggestion = typeof suggestions.$inferSelect;
