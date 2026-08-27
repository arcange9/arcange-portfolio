import mongoose from 'mongoose';
const schema = new mongoose.Schema({name:{type:String,required:true},url:{type:String,required:true},type:{type:String,default:'image'},alt:String,folder:String,size:Number,mimeType:String,published:{type:Boolean,default:true}},{timestamps:true});
export default mongoose.model('Media',schema);
