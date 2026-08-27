import { Router } from 'express';
import Profile from '../models/Profile.js';
import Project from '../models/Project.js';
import Skill from '../models/Skill.js';
import Education from '../models/Education.js';
import Experience from '../models/Experience.js';
import Achievement from '../models/Achievement.js';
import Certificate from '../models/Certificate.js';
import SocialLink from '../models/SocialLink.js';
import Media from '../models/Media.js';
import CV from '../models/CV.js';
import SiteSettings from '../models/SiteSettings.js';
import { requireAdmin } from '../middleware/admin.middleware.js';

const models = { profiles: Profile, projects: Project, skills: Skill, education: Education, experience: Experience, achievements: Achievement, certificates: Certificate, socials: SocialLink, media: Media, cvs: CV, settings: SiteSettings };
const router = Router();

router.get('/public', async (_req, res, next) => {
  try {
    const result = {};
    for (const [key, Model] of Object.entries(models)) result[key] = await Model.find({ published: { $ne: false } }).sort({ sortOrder: 1, createdAt: -1 }).lean();
    res.json(result);
  } catch (e) { next(e); }
});

router.use(requireAdmin);
router.get('/:type', async (req, res, next) => {
  try { const Model = models[req.params.type]; if (!Model) return res.status(404).json({error:'Unknown content type'}); res.json(await Model.find().sort({sortOrder:1,createdAt:-1})); } catch(e){next(e);}
});
router.post('/:type', async (req,res,next)=>{
  try { const Model=models[req.params.type]; if(!Model)return res.status(404).json({error:'Unknown content type'}); res.status(201).json(await Model.create(req.body)); }catch(e){next(e);}
});
router.patch('/:type/:id', async(req,res,next)=>{
  try {const Model=models[req.params.type];if(!Model)return res.status(404).json({error:'Unknown content type'});const item=await Model.findByIdAndUpdate(req.params.id,req.body,{new:true,runValidators:true});if(!item)return res.status(404).json({error:'Item not found'});res.json(item);}catch(e){next(e);}
});
router.delete('/:type/:id',async(req,res,next)=>{
  try{const Model=models[req.params.type];if(!Model)return res.status(404).json({error:'Unknown content type'});const item=await Model.findByIdAndDelete(req.params.id);if(!item)return res.status(404).json({error:'Item not found'});res.status(204).end();}catch(e){next(e);}
});
export default router;
