import { Router } from 'express';
import { requireAdmin } from '../middleware/admin.middleware.js';
import { audit } from '../utils/audit.js';
import Profile from '../models/Profile.js';
import Project from '../models/Project.js';
import Skill from '../models/Skill.js';
import Experience from '../models/Experience.js';
import SocialLink from '../models/SocialLink.js';
import SiteSettings from '../models/SiteSettings.js';

const router = Router();
router.use(requireAdmin);

const fallbackSkills = ['Python','C','C++','Java','JavaScript','HTML5','CSS3','React.js','Node.js','Express.js','Electron.js','MongoDB','MySQL','SQL','NoSQL'];
const fallbackProjects = [
  { title:'Munyarwanda AI', slug:'munyarwanda-ai', category:'AI / RAG', description:'A Kinyarwanda-focused AI project exploring retrieval-augmented generation and AI integration.', published:true, featured:true, status:'completed', technologies:['AI','RAG'] },
  { title:'Arcange AI Assistant', slug:'arcange-ai-assistant', category:'AI / Desktop', description:'A personal AI assistant concept combining desktop software with AI APIs.', published:true, status:'completed', technologies:['AI','Electron.js'] },
  { title:'NextBit Updates', slug:'nextbit-updates', category:'Technology Media', description:'A technology and ICT news brand focused on digital developments.', published:true, status:'completed', technologies:['Technology','Media'] },
  { title:'NextByte Academy', slug:'nextbyte-academy', category:'Education', description:'A technology learning platform concept for practical programming education.', published:true, status:'completed', technologies:['Education','Web'] }
];
const fallbackSocials = [
  { platform:'GitHub', label:'GitHub', url:'https://github.com/arcange9', icon:'github', enabled:true, sortOrder:1 },
  { platform:'Instagram', label:'Instagram', url:'https://instagram.com/arcangegram', icon:'instagram', enabled:true, sortOrder:2 },
  { platform:'Telegram', label:'Telegram', url:'https://t.me/izerearcange', icon:'send', enabled:true, sortOrder:3 },
  { platform:'Facebook', label:'Facebook', url:'https://facebook.com/arcange.froky', icon:'facebook', enabled:true, sortOrder:4 }
];

router.post('/current-site', async (req, res, next) => {
  try {
    const created = { profiles:0, projects:0, skills:0, experience:0, socials:0, settings:0 };

    if (!(await Profile.exists({}))) {
      await Profile.create({
        name:'Mukamyi Izere Arcange',
        title:'Software Developer • AI Builder • Computer Systems & Architecture',
        shortBio:'Building practical digital experiences with software, AI, web technologies and computer systems.',
        longBio:'I am focused on programming, web development, AI, databases and computer systems. This portfolio brings together the projects, technical interests, learning journey and experiments I build as I grow as a developer.'
      });
      created.profiles = 1;
    }

    for (const [index, name] of fallbackSkills.entries()) {
      const result = await Skill.findOneAndUpdate(
        { name },
        { $setOnInsert: { name, category:'Technology', level:0, published:true, sortOrder:index + 1 } },
        { upsert:true, new:true, rawResult:true }
      );
      if (result?.lastErrorObject?.updatedExisting === false) created.skills += 1;
    }

    for (const project of fallbackProjects) {
      const result = await Project.findOneAndUpdate(
        { slug:project.slug },
        { $setOnInsert: project },
        { upsert:true, new:true, rawResult:true }
      );
      if (result?.lastErrorObject?.updatedExisting === false) created.projects += 1;
    }

    if (!(await Experience.exists({ organization:'Ejo Labs — Technology Training Program' }))) {
      await Experience.create({
        organization:'Ejo Labs — Technology Training Program',
        role:'Technology Training',
        type:'Training',
        description:'Participated in a one-month technology training program, developing practical knowledge around AI integration, Retrieval-Augmented Generation (RAG), software development and collaborative project work.',
        published:true
      });
      created.experience = 1;
    }

    for (const social of fallbackSocials) {
      const result = await SocialLink.findOneAndUpdate(
        { platform:social.platform },
        { $setOnInsert:social },
        { upsert:true, new:true, rawResult:true }
      );
      if (result?.lastErrorObject?.updatedExisting === false) created.socials += 1;
    }

    if (!(await SiteSettings.exists({}))) {
      await SiteSettings.create({
        siteName:'Mukamyi Izere Arcange',
        copyrightText:'All rights reserved.',
        copyrightStartYear:new Date().getFullYear(),
        autoUpdateCopyrightYear:true,
        colors:{
          primary:'#8b5cf6', secondary:'#ff4ecd', accent:'#42e8ff',
          background:'#070711', surface:'#111120', text:'#f7f7fb', muted:'#aaaabd'
        }
      });
      created.settings = 1;
    }

    await audit(req,'CREATE','bootstrap','Current website defaults synced into CMS',undefined,{created});
    res.json({ ok:true, message:'Current website defaults are now available in the CMS.', created });
  } catch (error) { next(error); }
});

export default router;
