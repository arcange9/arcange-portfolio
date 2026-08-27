import mongoose from 'mongoose';
const schema = new mongoose.Schema({title:{type:String,required:true},issuer:String,issueDate:Date,credentialId:String,credentialUrl:String,imageUrl:String,published:{type:Boolean,default:true}},{timestamps:true});
export default mongoose.model('Certificate',schema);
