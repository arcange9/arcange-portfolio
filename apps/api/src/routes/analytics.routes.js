import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import AnalyticsEvent from '../models/AnalyticsEvent.js';
import { requireAdmin } from '../middleware/admin.middleware.js';
import { audit } from '../utils/audit.js';

const router=Router();
const trackLimiter=rateLimit({windowMs:60*1000,limit:30,standardHeaders:'draft-7',legacyHeaders:false});
const allowed=new Set(['page_view','project_view','project_click','contact_click','cv_download']);

router.post('/track',trackLimiter,async(req,res)=>{
  try{
    const {type,path='',target='',referrer=''}=req.body||{};
    if(!allowed.has(type))return res.status(400).json({error:'Invalid analytics event'});
    await AnalyticsEvent.create({type,path:String(path).slice(0,300),target:String(target).slice(0,200),referrer:String(referrer).slice(0,500),userAgent:String(req.get('user-agent')||'').slice(0,500)});
    res.status(204).end();
  }catch{res.status(204).end();}
});

router.get('/summary',requireAdmin,async(req,res,next)=>{
  try{
    const days=Math.min(Math.max(Number(req.query.days)||30,1),365);
    const since=new Date(Date.now()-days*86400000);
    const [totals,projects,contacts,cv]=await Promise.all([
      AnalyticsEvent.aggregate([{$match:{createdAt:{$gte:since}}},{$group:{_id:'$type',count:{$sum:1}}}]),
      AnalyticsEvent.aggregate([{$match:{createdAt:{$gte:since},type:'project_view'}},{$group:{_id:'$target',count:{$sum:1}}},{$sort:{count:-1}},{$limit:10}]),
      AnalyticsEvent.countDocuments({createdAt:{$gte:since},type:'contact_click'}),
      AnalyticsEvent.countDocuments({createdAt:{$gte:since},type:'cv_download'})
    ]);
    const result={days,pageViews:0,projectViews:0,projectClicks:0,contactClicks:contacts,cvDownloads:cv,topProjects:projects.map(x=>({target:x._id,count:x.count}))};
    for(const row of totals){if(row._id==='page_view')result.pageViews=row.count;if(row._id==='project_view')result.projectViews=row.count;if(row._id==='project_click')result.projectClicks=row.count;}
    res.json(result);
  }catch(e){next(e);}
});

router.delete('/clear',requireAdmin,async(req,res,next)=>{try{const days=Math.min(Math.max(Number(req.query.days)||30,1),3650);const since=new Date(Date.now()-days*86400000);const result=await AnalyticsEvent.deleteMany({createdAt:{$gte:since}});await audit(req,'DELETE','analytics','Analytics events cleared',{},{days,deleted:result.deletedCount});res.json({deleted:result.deletedCount});}catch(e){next(e);}});

export default router;
