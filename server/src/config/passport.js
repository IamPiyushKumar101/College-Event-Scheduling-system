import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
passport.use(new LocalStrategy({usernameField:'email',passwordField:'password'},async(email,password,done)=>{try{const user=await User.findOne({email:email.toLowerCase().trim()});if(!user||!(await bcrypt.compare(password,user.passwordHash)))return done(null,false,{message:'Invalid email or password.'});return done(null,user);}catch(err){return done(err);}}));
passport.serializeUser((user,done)=>done(null,user.id));
passport.deserializeUser(async(id,done)=>{try{done(null,await User.findById(id));}catch(e){done(e);}});
export default passport;
