import mongoose from 'mongoose';
const venueSchema=new mongoose.Schema({name:{type:String,required:true,trim:true,unique:true},building:{type:String,default:''},capacity:{type:Number,required:true,min:1},type:{type:String,default:'Auditorium'},description:{type:String,default:''},amenities:[String],active:{type:Boolean,default:true}},{timestamps:true});
export default mongoose.model('Venue',venueSchema);
