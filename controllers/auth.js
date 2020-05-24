const errorResponse =  require("../utils/errorResponse")
const asyncHandler =  require('../middleware/async')
const  User = require('../models/User')

//@Desc  Register  User
//@Route POST /api/v1/auth/register
//@Access Public
exports.register =  asyncHandler(async (req,res,next)=>{
    const {name,email, password , role }  = req.body;

    //Create User 

     const  user =  await User.create({
          name,
          email,
          password,
          role
     });
     
     sendTokenResponse(user,200,res);

});

//@Desc  Login  User
//@Route POST /api/v1/auth/login
//@Access Public
exports.login =  asyncHandler(async (req,res,next)=>{
    const {email,password}  = req.body

    //validate email and password
    if(!email || !password){
    return next(new errorResponse('please provide and email and a password',400))
    } 

    //check for the user

    const user =  await  User.findOne({email:email}).select('+password');

    if(!user){
       return next(new errorResponse('Invalid credentials',401))}
     
    // check if the passwords match
    const isMatch = await user.matchPasswords(password)
     
    if(!isMatch){
        return next(new errorResponse('Invalid credentials',401))

    }
    
    sendTokenResponse(user,200,res);
   
});



//@Desc  Gets Current Login  User
//@Route GET /api/v1/auth/me
//@Access Private
exports.getMe =  asyncHandler(async (req,res,next)=>{
       const user =  await  User.findById(req.user.id)
       res.status(200).json({success:true,data:user})
});




//get token from model create cookie and send respose
const sendTokenResponse = (user,statusCode,res) =>{
    //Create Token
    const token = user.getSignedJwtToken();

    const options = {
        expires: new Date(Date.now()+process.env.JWT_COOKIE_EXPIRE *24 *60 *60*1000),
        httpOnly:true,
    }

    if(process.env.NODE_ENV ==='production'){
         options.secure =  true
    }

    res
     .status(statusCode)
        .cookie('token',token,options)
        .json(
            {
                 success:true,
                 token
            })
}