import mongoose from 'mongoose';
const eventSchema=new mongoose.Schema({
 title:{type:String,required:true,trim:true},description:{type:String,default:''},category:{type:String,default:'Workshop'},club:{type:String,required:true},
 coordinator:{type:mongoose.Schema.Types.ObjectId,ref:'User',required:true},start:{type:Date,required:true},end:{type:Date,required:true},attendees:{type:Number,required:true,min:0},
 venue:{type:mongoose.Schema.Types.ObjectId,ref:'Venue',default:null},venueName:{type:String,default:''},status:{type:String,enum:['pending','approved','rejected','cancelled'],default:'pending'},
 bookingNote:{type:String,default:''},interested:[{type:mongoose.Schema.Types.ObjectId,ref:'User'}],priority:{type:Number,default:1}
},{timestamps:true});
eventSchema.index({start:1,end:1,venue:1});
export default mongoose.model('Event',eventSchema);
