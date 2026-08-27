import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import passport from './config/passport.js';
import authRoutes from './routes/auth.routes.js';
import { env } from './config/environment.js';

export function createApp() {
  const app = express();
  app.set('trust proxy', 1);
  app.use(helmet());
  app.use(cors({ origin: [env.webUrl, env.adminUrl], credentials: true }));
  app.use(express.json({ limit: '1mb' }));
  app.use(rateLimit({ windowMs: 15 * 60 * 1000, limit: 100, standardHeaders: true, legacyHeaders: false }));
  app.use(session({
    secret: env.sessionSecret,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: env.mongoUri }),
    cookie: { httpOnly: true, secure: env.nodeEnv === 'production', sameSite: 'lax', maxAge: 1000 * 60 * 60 * 8 },
  }));
  app.use(passport.initialize());
  app.use(passport.session());
  app.get('/api/health', (_req, res) => res.json({ ok: true, service: 'arcange-portfolio-api' }));
  app.use('/api/auth', authRoutes);
  return app;
}
