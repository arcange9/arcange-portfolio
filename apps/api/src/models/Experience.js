import mongoose from 'mongoose';
const schema = new mongoose.Schema({organization:{type:String,required:true},role:{type:String,required:true},type:{type:String,default:'Training'},startDate:Date,endDate:Date,description:String,technologies:[String],url:String,published:{type:Boolean,default:true}},{timestamps:true});
export default mongoose.model('Experience',schema);
