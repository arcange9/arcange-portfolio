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
import auditRoutes from './routes/audit.routes.js';
import bootstrapRoutes from './routes/bootstrap.routes.js';
import { requireCsrf } from './middleware/csrf.middleware.js';
import { env } from './config/environment.js';

export function createApp(){
  const app=express();
  app.set('trust proxy',1);
  app.disable('x-powered-by');
  app.use(helmet({crossOriginResourcePolicy:{policy:'cross-origin'}}));
  app.use(cors({origin:[env.webUrl,env.adminUrl],credentials:true,methods:['GET','POST','PATCH','PUT','DELETE','OPTIONS'],allowedHeaders:['Content-Type','Accept','X-CSRF-Token']}));
  app.use(express.json({limit:'1mb'}));
  app.use(rateLimit({windowMs:15*60*1000,limit:100,standardHeaders:'draft-7',legacyHeaders:false,message:{error:'Too many requests. Please try again later.'}}));
  app.use(session({secret:env.sessionSecret,resave:false,saveUninitialized:false,store:MongoStore.create({mongoUrl:env.mongoUri,touchAfter:24*3600}),cookie:{httpOnly:true,secure:env.nodeEnv==='production',sameSite:env.nodeEnv==='production'?'none':'lax',maxAge:1000*60*60*8}}));
  app.use(passport.initialize());
  app.use(passport.session());
  app.use((req,res,next)=>{
    if(!['POST','PATCH','PUT','DELETE'].includes(req.method))return next();
    const origin=req.get('origin');
    if(!origin||origin.replace(/\/$/,'')!==env.adminUrl.replace(/\/$/,''))return res.status(403).json({error:'Invalid request origin'});
    next();
  });
  app.use(requireCsrf);
  app.get('/api/health',(_req,res)=>res.json({ok:true,service:'arcange-portfolio-api'}));
  app.use('/uploads',express.static(env.uploadDir,{index:false,dotfiles:'deny',fallthrough:false,setHeaders:res=>res.setHeader('Cache-Control','public, max-age=31536000, immutable')}));
  app.use('/api/auth',authRoutes);
  app.use('/api/uploads',uploadRoutes);
  app.use('/api/content',contentRoutes);
  app.use('/api/audit',auditRoutes);
  app.use('/api/bootstrap',bootstrapRoutes);
  app.use((err,_req,res,_next)=>{console.error(err);res.status(err.status||500).json({error:err.status?err.message:'Internal server error'});});
  return app;
}
