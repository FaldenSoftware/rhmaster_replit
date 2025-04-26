import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Express } from "express";
import session from "express-session";
import { scrypt, randomBytes, timingSafeEqual, createHash } from "crypto";
import { promisify } from "util";
import { storage } from "./storage";
import { User as SelectUser } from "@shared/schema";
import { pool } from "./db";

declare global {
  namespace Express {
    interface User extends SelectUser {}
  }
}

const scryptAsync = promisify(scrypt);

async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString("hex")}.${salt}`;
}

async function comparePasswords(supplied: string, stored: string) {
  console.log(`Comparando senha: "${supplied}" com hash armazenado`);
  
  // Para usuários admin temporários, vamos comparar diretamente com valores conhecidos
  if (supplied === 'admin' && stored === '21232f297a57a5a743894a0e4a801fc3') {
    console.log('Match direto encontrado para "admin"');
    return true;
  }
  
  // Para senhas normais com salt
  if (stored.includes('.')) {
    const [hashed, salt] = stored.split(".");
    const hashedBuf = Buffer.from(hashed, "hex");
    const suppliedBuf = (await scryptAsync(supplied, salt, 64)) as Buffer;
    return timingSafeEqual(hashedBuf, suppliedBuf);
  }
  
  // Caso de fallback, falha na autenticação
  return false;
}

export function setupAuth(app: Express) {
  const sessionSettings: session.SessionOptions = {
    secret: process.env.SESSION_SECRET || "rh-master-secret-key",
    resave: false,
    saveUninitialized: false,
    store: storage.sessionStore,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
    }
  };

  app.set("trust proxy", 1);
  app.use(session(sessionSettings));
  app.use(passport.initialize());
  app.use(passport.session());

  passport.use(
    new LocalStrategy(async (username, password, done) => {
      try {
        // Verificamos se o login é por username ou email
        const query = `
          SELECT * FROM users 
          WHERE username = $1 OR email = $1
        `;
        
        // Pool já está importado acima
        const result = await pool.query(query, [username]);
        
        // Se não encontrou usuário
        if (result.rows.length === 0) {
          console.log('Usuário não encontrado:', username);
          return done(null, false, { message: "Usuário não encontrado" });
        }
        
        const user = result.rows[0];
        console.log('Usuário encontrado:', user.username);
        
        // Verifica a senha
        if (!(await comparePasswords(password, user.password))) {
          console.log('Senha incorreta para usuário:', user.username);
          return done(null, false, { message: "Senha incorreta" });
        }
        
        // Mapeando para o formato User do sistema
        const userData = {
          id: user.id,
          username: user.username,
          email: user.email,
          password: user.password,
          role: user.role,
          name: user.name || user.username,
          avatar: user.avatar,
          stripeCustomerId: user.stripe_customer_id,
          stripeSubscriptionId: user.stripe_subscription_id,
          stripePlanId: user.stripe_plan_id,
          subscriptionStatus: user.subscription_status,
          active: user.active || true,
          createdAt: user.created_at instanceof Date ? user.created_at : new Date(user.created_at || Date.now())
        };
        
        console.log('Login bem-sucedido para:', user.username);
        return done(null, userData);
      } catch (error) {
        console.error('Erro durante autenticação:', error);
        return done(error);
      }
    }),
  );

  passport.serializeUser((user, done) => done(null, user.id));
  passport.deserializeUser(async (id: number, done) => {
    try {
      // Acessar diretamente a tabela de usuários para obter dados atualizados
      const query = `
        SELECT * FROM users 
        WHERE id = $1
      `;
      
      const result = await pool.query(query, [id]);
      
      if (result.rows.length === 0) {
        console.error('Usuário não encontrado na deserialização:', id);
        return done(null, false);
      }
      
      const user = result.rows[0];
      
      // Mapeando para o formato User esperado pelo sistema
      const userData = {
        id: user.id,
        username: user.username,
        email: user.email,
        password: user.password,
        role: user.role,
        name: user.name || user.username,
        avatar: user.avatar,
        stripeCustomerId: user.stripe_customer_id,
        stripeSubscriptionId: user.stripe_subscription_id,
        stripePlanId: user.stripe_plan_id,
        subscriptionStatus: user.subscription_status,
        active: user.active || true,
        createdAt: user.created_at instanceof Date ? user.created_at : new Date(user.created_at || Date.now())
      };
      
      // Carregar informações adicionais se for mentor
      if (userData.role === 'mentor') {
        const mentorQuery = `
          SELECT * FROM mentors
          WHERE user_id = $1
        `;
        
        const mentorResult = await pool.query(mentorQuery, [id]);
        
        if (mentorResult.rows.length > 0) {
          const mentorData = mentorResult.rows[0];
          Object.assign(userData, {
            bio: mentorData.bio,
            specialties: mentorData.specialties || [],
            yearsExperience: mentorData.years_experience || 0,
            rating: mentorData.rating || 0,
            availableSlots: mentorData.available_slots || 0,
            verified: mentorData.verified || false
          });
        }
      }
      
      // Carregar informações adicionais se for cliente
      if (userData.role === 'client') {
        const clientQuery = `
          SELECT * FROM clients
          WHERE user_id = $1
        `;
        
        const clientResult = await pool.query(clientQuery, [id]);
        
        if (clientResult.rows.length > 0) {
          const clientData = clientResult.rows[0];
          Object.assign(userData, {
            department: clientData.department,
            jobTitle: clientData.job_title,
            focus: clientData.focus || [],
            onboardingCompleted: clientData.onboarding_completed || false,
            startDate: clientData.start_date,
            notes: clientData.notes
          });
        }
      }
      
      done(null, userData);
    } catch (error) {
      console.error('Erro na deserialização do usuário:', error);
      done(error);
    }
  });

  app.post("/api/register", async (req, res, next) => {
    try {
      // Verificar se campos obrigatórios estão presentes
      if (!req.body.username) {
        return res.status(400).json({ message: "O nome de usuário é obrigatório" });
      }
      
      if (!req.body.password) {
        return res.status(400).json({ message: "A senha é obrigatória" });
      }
      
      if (!req.body.email) {
        return res.status(400).json({ message: "O e-mail é obrigatório" });
      }
      
      if (!req.body.role || !['mentor', 'client'].includes(req.body.role)) {
        return res.status(400).json({ message: "Tipo de usuário inválido" });
      }
      
      // Verificar formato básico de email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(req.body.email)) {
        return res.status(400).json({ message: "Formato de e-mail inválido" });
      }

      // Pool já está importado acima
      
      // Verificar se o nome de usuário já existe
      const usernameQuery = `SELECT id FROM users WHERE username = $1`;
      const usernameResult = await pool.query(usernameQuery, [req.body.username]);
      
      if (usernameResult.rows.length > 0) {
        return res.status(400).json({ message: "Este nome de usuário já está em uso" });
      }
      
      // Verificar se o email já existe
      const emailQuery = `SELECT id FROM users WHERE email = $1`;
      const emailResult = await pool.query(emailQuery, [req.body.email]);
      
      if (emailResult.rows.length > 0) {
        return res.status(400).json({ message: "Este e-mail já está em uso" });
      }

      // Hash da senha
      const hashedPassword = await hashPassword(req.body.password);
      
      // Inserir usuário
      const insertQuery = `
        INSERT INTO users 
          (username, password, email, name, role, created_at, active)
        VALUES 
          ($1, $2, $3, $4, $5, $6, $7)
        RETURNING *
      `;
      
      const now = new Date();
      const insertValues = [
        req.body.username,
        hashedPassword,
        req.body.email,
        req.body.name || req.body.username,
        req.body.role,
        now,
        true
      ];
      
      const userResult = await pool.query(insertQuery, insertValues);
      
      if (userResult.rows.length === 0) {
        return res.status(500).json({ message: "Falha ao criar o usuário" });
      }
      
      const newUser = userResult.rows[0];
      
      // Se for mentor, criar entrada na tabela de mentores
      if (req.body.role === 'mentor') {
        const mentorQuery = `
          INSERT INTO mentors 
            (user_id, bio, specialties, years_experience, rating, available_slots, verified, created_at, updated_at)
          VALUES 
            ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        `;
        
        const mentorValues = [
          newUser.id,
          req.body.bio || `Mentor ${newUser.name || newUser.username}`,
          req.body.specialties || [],
          req.body.years_experience || 0,
          0,  // Rating inicial
          10, // Slots disponíveis iniciais
          false, // Verificado
          now,
          now
        ];
        
        await pool.query(mentorQuery, mentorValues);
      }
      
      // Se for cliente, criar entrada na tabela de clientes
      if (req.body.role === 'client' && req.body.mentor_id) {
        const clientQuery = `
          INSERT INTO clients 
            (user_id, mentor_id, department, job_title, focus, onboarding_completed, start_date, notes, created_at, updated_at)
          VALUES 
            ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        `;
        
        const clientValues = [
          newUser.id,
          req.body.mentor_id,
          req.body.department || '',
          req.body.job_title || '',
          req.body.focus || [],
          false, // Onboarding completado
          now,
          req.body.notes || '',
          now,
          now
        ];
        
        await pool.query(clientQuery, clientValues);
      }
      
      // Criando objeto de usuário no formato esperado pelo sistema
      const userData = {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        password: newUser.password,
        role: newUser.role,
        name: newUser.name || newUser.username,
        avatar: null,
        active: true,
        createdAt: now
      };

      req.login(userData, (err) => {
        if (err) return next(err);
        // Remove password from response
        const { password, ...userWithoutPassword } = userData;
        res.status(201).json(userWithoutPassword);
      });
    } catch (error) {
      console.error('Erro no registro de usuário:', error);
      next(error);
    }
  });

  app.post("/api/login", (req, res, next) => {
    passport.authenticate("local", (err, user, info) => {
      if (err) return next(err);
      if (!user) {
        return res.status(401).json({ message: info?.message || "Credenciais inválidas" });
      }
      
      req.login(user, (err) => {
        if (err) return next(err);
        // Remove password from response
        const { password, ...userWithoutPassword } = user;
        res.status(200).json(userWithoutPassword);
      });
    })(req, res, next);
  });

  app.post("/api/logout", (req, res, next) => {
    req.logout((err) => {
      if (err) return next(err);
      res.status(200).json({ message: "Logout realizado com sucesso" });
    });
  });

  app.get("/api/user", (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Não autenticado" });
    
    // Remove password from response
    const { password, ...userWithoutPassword } = req.user;
    res.json(userWithoutPassword);
  });
}
