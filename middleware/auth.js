const jwt =  require("jsonwebtoken")
const asynHandler =  require("./async")
const errorResponse =  require("../utils/errorResponse")
const User =   require("../models/User")



//Protect routes
exports.protect =  asynHandler(async (req,res,next)=>{
    let token; 
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
       token =  req.headers.authorization.split(' ')[1];

    }
    
 //   else if(req.cookies.token){
   //          token = req.cookies.token
  //  }

  // make sure token  exists

  if(!token){
       return  next(new errorResponse('not authorized to access this route',401))
  }

  try {
      // verify token
      const decoded  =  jwt.verify(token,process.env.JWT_SECRET)

      console.log(decoded)
      
      req.user  = await User.findById(decoded.id)
      
    next()
  } catch (err) {
    console.log(err)  
  }

});

// Grant Access to specific roles
exports.authorize = (...roles) => {
      return (req,res,next)=>{
          if(!roles.includes(req.user.role)){
    return  next(new errorResponse(`User Role ${req.user.role} is not authorized`,403))
          }
          next();
      }
}