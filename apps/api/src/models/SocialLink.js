import mongoose from 'mongoose';
const schema = new mongoose.Schema({platform:{type:String,required:true},label:String,url:{type:String,required:true},icon:String,enabled:{type:Boolean,default:true},sortOrder:{type:Number,default:0}},{timestamps:true});
export default mongoose.model('SocialLink',schema);
