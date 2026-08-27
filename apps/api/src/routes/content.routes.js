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
    const [profile, projects, skills, education, experience, achievements, certificates, socials, settings] = await Promise.all([
      Profile.findOne().lean(), Project.find({published:true}).sort({featured:-1,createdAt:-1}).lean(), Skill.find({published:true}).sort({sortOrder:1}).lean(), Education.find({published:true}).sort({startYear:-1}).lean(), Experience.find({published:true}).sort({startDate:-1}).lean(), Achievement.find({published:true}).sort({year:-1}).lean(), Certificate.find({published:true}).sort({issueDate:-1}).lean(), SocialLink.find({enabled:true}).sort({sortOrder:1}).lean(), SiteSettings.findOne().lean()
    ]);
    res.json({profile,projects,skills,education,experience,achievements,certificates,socials,settings});
  } catch (e) { next(e); }
});

router.use(requireAdmin);
router.get('/:type', async (req,res,next)=>{try{const Model=models[req.params.type];if(!Model)return res.status(404).json({error:'Unknown content type'});res.json(await Model.find().sort({sortOrder:1,createdAt:-1}));}catch(e){next(e);}});
router.post('/:type', async (req,res,next)=>{try{const Model=models[req.params.type];if(!Model)return res.status(404).json({error:'Unknown content type'});res.status(201).json(await Model.create(req.body));}catch(e){next(e);}});
router.patch('/:type/:id', async(req,res,next)=>{try{const Model=models[req.params.type];if(!Model)return res.status(404).json({error:'Unknown content type'});const item=await Model.findByIdAndUpdate(req.params.id,req.body,{new:true,runValidators:true});if(!item)return res.status(404).json({error:'Item not found'});res.json(item);}catch(e){next(e);}});
router.delete('/:type/:id',async(req,res,next)=>{try{const Model=models[req.params.type];if(!Model)return res.status(404).json({error:'Unknown content type'});const item=await Model.findByIdAndDelete(req.params.id);if(!item)return res.status(404).json({error:'Item not found'});res.status(204).end();}catch(e){next(e);}});

export default router;
