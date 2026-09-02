import { Router } from 'express';
import mongoose from 'mongoose';
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
import ContentRevision from '../models/ContentRevision.js';
import { requireAdmin } from '../middleware/admin.middleware.js';
import { validateContentPayload } from '../utils/validation.js';
import { audit } from '../utils/audit.js';
import { deleteStorageObject } from '../utils/storage.js';

const models={profiles:Profile,projects:Project,skills:Skill,education:Education,experience:Experience,achievements:Achievement,certificates:Certificate,socials:SocialLink,media:Media,cvs:CV,settings:SiteSettings};
const labels={profiles:'Profile',projects:'Project',skills:'Skill',education:'Education',experience:'Experience',achievements:'Achievement',certificates:'Certificate',socials:'Social link',media:'Media',cvs:'CV',settings:'Settings'};
const imageFields={profiles:['photoUrl'],projects:['imageUrl'],achievements:['imageUrl'],certificates:['imageUrl'],media:['url']};
const router=Router();
function idOr400(id){if(!mongoose.isValidObjectId(id))throw Object.assign(new Error('Invalid item id'),{status:400});return id;}
function safeSnapshot(item){const value=item.toObject?item.toObject():{...item};delete value._id;delete value.__v;return value;}
async function cleanupReplacedImages(type,before,afterBody){for(const field of imageFields[type]||[]){if(!Object.prototype.hasOwnProperty.call(afterBody,field))continue;const oldUrl=before?.[field];const newUrl=afterBody[field];if(oldUrl&&oldUrl!==newUrl){try{await deleteStorageObject(oldUrl);}catch(error){console.error(`Storage cleanup failed for ${type}.${field}:`,error.message);}}}}

router.get('/public',async(_req,res,next)=>{try{const [profile,projects,skills,education,experience,achievements,certificates,socials,settings]=await Promise.all([Profile.findOne().lean(),Project.find({published:true}).sort({featured:-1,createdAt:-1}).lean(),Skill.find({published:true}).sort({sortOrder:1}).lean(),Education.find({published:true}).sort({startYear:-1}).lean(),Experience.find({published:true}).sort({startDate:-1}).lean(),Achievement.find({published:true}).sort({year:-1}).lean(),Certificate.find({published:true}).sort({issueDate:-1}).lean(),SocialLink.find({enabled:true}).sort({sortOrder:1}).lean(),SiteSettings.findOne().lean()]);res.json({profile,projects,skills,education,experience,achievements,certificates,socials,settings});}catch(e){next(e);}});
router.use(requireAdmin);

router.get('/trash',async(req,res,next)=>{try{const rows=await ContentRevision.find({operation:'DELETE'}).sort({createdAt:-1}).limit(Math.min(Number(req.query.limit)||100,200)).lean();res.json(rows);}catch(e){next(e);}});
router.get('/:type/:id/revisions',async(req,res,next)=>{try{if(!models[req.params.type])return res.status(404).json({error:'Unknown content type'});idOr400(req.params.id);res.json(await ContentRevision.find({type:req.params.type,resourceId:req.params.id}).sort({createdAt:-1}).limit(50).lean());}catch(e){next(e);}});
router.post('/trash/:revisionId/restore',async(req,res,next)=>{try{idOr400(req.params.revisionId);const revision=await ContentRevision.findOne({_id:req.params.revisionId,operation:'DELETE'});if(!revision)return res.status(404).json({error:'Trash item not found'});const Model=models[revision.type];if(!Model)return res.status(400).json({error:'Unknown content type'});const restored=await Model.create(revision.snapshot);await audit(req,'CREATE',revision.type,`${labels[revision.type]} restored`,restored._id,{restoredFrom:String(revision._id)});res.status(201).json(restored);}catch(e){next(e);}});

router.get('/:type',async(req,res,next)=>{try{const Model=models[req.params.type];if(!Model)return res.status(404).json({error:'Unknown content type'});const limit=Math.min(Math.max(Number(req.query.limit)||100,1),200);res.json(await Model.find().sort({sortOrder:1,createdAt:-1}).limit(limit).lean());}catch(e){next(e);}});
router.post('/:type',async(req,res,next)=>{try{const Model=models[req.params.type];if(!Model)return res.status(404).json({error:'Unknown content type'});validateContentPayload(req.params.type,req.body);const item=await Model.create(req.body);const action=req.params.type==='settings'?'SETTINGS_CHANGE':'CREATE';await audit(req,action,req.params.type,req.params.type==='settings'?'Settings changed':`${labels[req.params.type]} created`,item._id,{fields:Object.keys(req.body)});res.status(201).json(item);}catch(e){next(e);}});
router.patch('/:type/:id',async(req,res,next)=>{try{const Model=models[req.params.type];if(!Model)return res.status(404).json({error:'Unknown content type'});idOr400(req.params.id);validateContentPayload(req.params.type,req.body);const before=await Model.findById(req.params.id);if(!before)return res.status(404).json({error:'Item not found'});await ContentRevision.create({type:req.params.type,resourceId:req.params.id,operation:'UPDATE',snapshot:safeSnapshot(before),actorId:req.user._id,actorEmail:req.user.email});const item=await Model.findByIdAndUpdate(req.params.id,req.body,{new:true,runValidators:true});await cleanupReplacedImages(req.params.type,before,req.body);const action=req.params.type==='settings'?'SETTINGS_CHANGE':'UPDATE';await audit(req,action,req.params.type,req.params.type==='settings'?'Settings changed':`${labels[req.params.type]} edited`,item._id,{fields:Object.keys(req.body)});res.json(item);}catch(e){next(e);}});
router.delete('/:type/:id',async(req,res,next)=>{try{const Model=models[req.params.type];if(!Model)return res.status(404).json({error:'Unknown content type'});idOr400(req.params.id);const item=await Model.findById(req.params.id);if(!item)return res.status(404).json({error:'Item not found'});const revision=await ContentRevision.create({type:req.params.type,resourceId:req.params.id,operation:'DELETE',snapshot:safeSnapshot(item),actorId:req.user._id,actorEmail:req.user.email});await Model.findByIdAndDelete(req.params.id);await audit(req,'DELETE',req.params.type,`${labels[req.params.type]} deleted`,req.params.id,{trashId:String(revision._id),storageRetained:true});res.status(204).end();}catch(e){next(e);}});
export default router;
