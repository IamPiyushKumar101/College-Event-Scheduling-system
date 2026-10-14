import mongoose from 'mongoose';
const userSchema = new mongoose.Schema({
  name:{type:String,required:true,trim:true}, email:{type:String,required:true,unique:true,lowercase:true,trim:true},
  passwordHash:{type:String,required:true}, role:{type:String,enum:['coordinator','admin'],default:'coordinator'},
  club:{type:String,required:true,trim:true}, facultyName:{type:String,trim:true,default:''}, phone:{type:String,trim:true,default:''}
},{timestamps:true});
userSchema.set('toJSON',{transform:(_doc,ret)=>{delete ret.passwordHash;delete ret.__v;return ret;}});
export default mongoose.model('User',userSchema);
