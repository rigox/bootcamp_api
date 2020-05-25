const errorResponse =  require("../utils/errorResponse")
const crypto =  require('crypto')
const asyncHandler =  require('../middleware/async')
const sendEmail =  require('../utils/sendEmail')
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

//@Desc  Forgot Password
//@Route POST /api/v1/auth/forgotpassword
//@Access Public
exports.forgotPassword  = asyncHandler(async (req,res,next)=>{
const user =  await  User.findOne({email:req.body.email});
if(!user){
     return  next(new errorResponse('There is no user with that email',400))
}

//Get Reset Token
const resetToken  =  user.getResetToken()
console.log(resetToken);

 await user.save({validateBeforeSave:false})

 // Create reset  url

 const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/resetPassword/${resetToken}`;

 const message = `you are reciving this email because you or someone else has requested to reset a passwor please make a put request on the following url: \n\n ${resetUrl}`;

 try {
     await sendEmail({
          email:user.email,
          subject:'Password reset token dude',
          message
     });

     res.status(200).json({
        success:true,
        data:{}
   })

 } catch (err) {
    console.log(err)
    user.resetPasswordToke  = undefined
    user.resetPasswordExpire = undefined
    user.save({validateBeforeSave:false})

    return  next(new errorResponse('Email could not be sent',500))
 }



});


//@Desc  resets Password from giving email
//@Route PUT /api/v1/auth/reset/:resettoken
//@Access Public
exports.resetPassword = asyncHandler(async (req,res,next)=>{
     // get hashed token
     const resetPasswordToke = crypto.createHash('sha256').update(req.params.resettoken).digest('hex');

     const user = await User.findOne({
          resetPasswordToke,
          resetPasswordExpire:{$gt: Date.now() }
     });

     if(!user){
          return next(new errorResponse('invalid token',400))
     }

     //Set the new password
     user.password =  req.body.password;
     user.resetPasswordToke  = undefined
     user.resetPasswordExpire = undefined
     await user.save({validateBeforeSave:false})

     sendTokenResponse(user,200,res);

});

//@Desc  updates users details
//@Route PUT /api/v1/auth/updatedetails
//@Access Private
exports.updateDetails =  asyncHandler(async (req,res,next)=>{
        const fieldToUpdate = {
             name :req.body.name,
             email:req.body.email
        }

     const user =  await User.findByIdAndUpdate(req.user.id,fieldToUpdate,{
          new:true,
          runValidators:true
     });

     res.status(200).json({
          success:true,
          data:user
     });


});

//@Desc  updates users password
//@Route PUT /api/v1/auth/updatePassword
//@Access Private
exports.updatePassword =  asyncHandler(async (req,res,next)=>{
    
     const user =  await  User.findById(req.user.id).select('+password');
     
    // check if the password is correct
    if(!(await user.matchPasswords(req.body.currentPassword))){
         return  next(new errorResponse('invalid credentials',401))
    }
        
    user.password =  req.body.newPassword;

    await user.save()

    sendTokenResponse(user,200,res);

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