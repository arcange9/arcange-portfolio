import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

const app = express();
app.use(helmet());
app.use(cors({origin: process.env.WEB_ORIGIN || 'http://localhost:5173', credentials:true}));
app.use(express.json({limit:'1mb'}));
app.use(rateLimit({windowMs:15*60*1000,max:100}));

app.get('/api/health', (_req,res)=>res.json({ok:true,service:'arcange-portfolio-api'}));
app.get('/api/profile', (_req,res)=>res.json({name:'Mukamyi Izere Arcange',title:'Software Developer • AI Builder • Computer Systems & Architecture Student'}));

const port=process.env.PORT || 5000;
app.listen(port,()=>console.log(`API running on port ${port}`));
