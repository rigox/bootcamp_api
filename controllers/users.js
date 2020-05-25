const  User = require("../models/User");
const errorResponse =  require('../utils/errorResponse')
const asyncHandler =  require("../middleware/async")

//@Desc gets all users
//@Router  GET /api/v1/users
//@Access  Private/Admin
exports.getUsers = asyncHandler(async (req,res,next)=>{
     res.status(200).json(res.advancedResults)
});


//@Desc gets a single users
//@Router  GET /api/v1/user/:id
//@Access  Private/Admin
exports.getUser =  asyncHandler(async (req,res,next)=>{
    const user =  await User.findById(req.params.id)
    res.status(200).json({
         success:true,
         data:user
    })

});


//@Desc creates a user
//@Router  POST /api/v1/users/
//@Access  Private/Admin
exports.createUser =  asyncHandler(async (req,res,next)=>{
    const user =  await User.create(req.body)
    res.status(201).json({
         success:true,
         data:user
    })

});

//@Desc updates one users
//@Router  PUT /api/v1/users/:id
//@Access  Private/Admin
exports.updateUser =  asyncHandler(async (req,res,next)=>{
  
    const user =  await User.findByIdAndUpdate(req.params.id,req.body,{
        new:true,
        runValidators:true
    })
    res.status(200).json({
         success:true,
         data:user
    })

});

//@Desc deletes one users
//@Router  DELETE /api/v1/users/:id
//@Access  Private/Admin
exports.deleteUser =  asyncHandler(async (req,res,next)=>{
  
     await User.findByIdAndDelete(req.params.id);

    res.status(200).json({
         success:true,
         data:{}
    })

});

