import mongoose from 'mongoose';
const schema = new mongoose.Schema({title:{type:String,default:'Curriculum Vitae'},url:{type:String,required:true},version:{type:String,default:'1.0'},uploadedAt:{type:Date,default:Date.now},active:{type:Boolean,default:true}},{timestamps:true});
export default mongoose.model('CV',schema);
