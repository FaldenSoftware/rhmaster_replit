import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth } from "./auth";
import { assistantRouter } from "./routes/assistant";
import { subscriptionRouter } from "./routes/subscription";

export async function registerRoutes(app: Express): Promise<Server> {
  // Sets up authentication routes
  setupAuth(app);

  // Registrar as rotas do assistente virtual
  app.use("/api/assistant", assistantRouter);
  
  // Registrar as rotas de assinatura e pagamento
  app.use("/api/subscription", subscriptionRouter);

  // API routes
  app.get("/api/mentors", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    
    // Only admin or users themselves should be able to access mentor list
    const mentors = await storage.getAllMentors();
    res.json(mentors);
  });

  app.get("/api/clients", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    
    // Only mentors should access their clients
    if (req.user.role !== 'mentor') {
      return res.status(403).send("Acesso negado");
    }
    
    const clients = await storage.getClientsByMentorId(req.user.id);
    res.json(clients);
  });

  app.post("/api/invite", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    
    // Only mentors can invite clients
    if (req.user.role !== 'mentor') {
      return res.status(403).send("Acesso negado");
    }
    
    // In a real app, this would send an email with an invite link
    const { email, name } = req.body;
    
    // For now, just return success
    res.status(200).json({ success: true, message: "Convite enviado com sucesso" });
  });

  const httpServer = createServer(app);

  return httpServer;
}
