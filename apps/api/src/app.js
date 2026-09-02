import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import passport from './config/passport.js';
import authRoutes from './routes/auth.routes.js';
import contentRoutes from './routes/content.routes.js';
import uploadRoutes from './routes/upload.routes.js';
import { env } from './config/environment.js';

export function createApp() {
  const app = express();
  app.set('trust proxy', 1);
  app.disable('x-powered-by');
  app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
  app.use(cors({ origin: [env.webUrl, env.adminUrl], credentials: true, methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'], allowedHeaders: ['Content-Type', 'Accept'] }));
  app.use(express.json({ limit: '1mb' }));

  app.use(rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 100,
    standardHeaders: 'draft-7',
    legacyHeaders: false,
    message: { error: 'Too many requests. Please try again later.' }
  }));

  app.use(session({
    secret: env.sessionSecret,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: env.mongoUri, touchAfter: 24 * 3600 }),
    cookie: {
      httpOnly: true,
      secure: env.nodeEnv === 'production',
      sameSite: env.nodeEnv === 'production' ? 'none' : 'lax',
      maxAge: 1000 * 60 * 60 * 8
    }
  }));
  app.use(passport.initialize());
  app.use(passport.session());

  // Browser CSRF/origin protection for all state-changing API requests.
  // The public API remains readable, while writes must originate from the admin app.
  app.use((req, res, next) => {
    if (!['POST', 'PATCH', 'PUT', 'DELETE'].includes(req.method)) return next();
    const origin = req.get('origin');
    if (!origin || origin.replace(/\/$/, '') !== env.adminUrl.replace(/\/$/, '')) {
      return res.status(403).json({ error: 'Invalid request origin' });
    }
    next();
  });

  app.get('/api/health', (_req,res)=>res.json({ok:true,service:'arcange-portfolio-api'}));
  app.use('/uploads', express.static(env.uploadDir, {
    index: false,
    dotfiles: 'deny',
    fallthrough: false,
    setHeaders: (res) => {
      res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    }
  }));
  app.use('/api/auth', authRoutes);
  app.use('/api/uploads', uploadRoutes);
  app.use('/api/content', contentRoutes);
  app.use((err,_req,res,_next)=>{
    console.error(err);
    res.status(err.status || 500).json({error: err.status ? err.message : 'Internal server error'});
  });
  return app;
}
