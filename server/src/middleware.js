export function requireAuth(req,res,next){if(req.isAuthenticated?.()&&req.user)return next();return res.status(401).json({message:'Please sign in to continue.'});}
export function requireAdmin(req,res,next){if(req.isAuthenticated?.()&&req.user?.role==='admin')return next();return res.status(403).json({message:'Administrator access required.'});}
export function asyncRoute(fn){return (req,res,next)=>Promise.resolve(fn(req,res,next)).catch(next);}
