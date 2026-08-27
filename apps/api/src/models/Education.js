import mongoose from 'mongoose';
const schema = new mongoose.Schema({institution:{type:String,required:true},program:{type:String,required:true},level:{type:String,default:''},startYear:Number,endYear:Number,description:String,featured:{type:Boolean,default:false},published:{type:Boolean,default:true}},{timestamps:true});
export default mongoose.model('Education',schema);
