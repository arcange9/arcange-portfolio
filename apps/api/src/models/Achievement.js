import mongoose from 'mongoose';
const schema = new mongoose.Schema({title:{type:String,required:true},organization:String,year:Number,description:String,link:String,imageUrl:String,published:{type:Boolean,default:true}},{timestamps:true});
export default mongoose.model('Achievement',schema);
