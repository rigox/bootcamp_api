const Course =  require('../models/Course');
const Bootcamp  = require("../models/Bootcamp");
const errorResponse =  require('../utils/errorResponse')
const Review =  require("../models/Review")
const asyncHandler =  require("../middleware/async")

//@Desc  Get All Courses
//@Route GET /api/v1/reviews
//@Route GET /api/v1/bootcamps/:bootcampId/courses
//@Access Public
exports.getReviews  = asyncHandler(async (req,res,next)=>{

    if(req.params.bootcampId){
         const reviews  =  await Review.find({bootcamp:req.params.bootcampId})
         return res.status(200).json({
              succcess:true,
              count: reviews.length,
              data:reviews
         });
    }else{
         res.status(200).json(res.advancedResults)
    }

    
});

//@Desc gets a single review
//@Route GET /api/v1/reviews/:id
//@Access Public
exports.getReview  =  asyncHandler(async (req,res,next)=>{
    const review =  await Review.findById(req.params.id)

    if(!review){
     return   next(new  errorResponse(`no Review  found with id of ${req.params.id}`,400))
    }
    
    res.status(200).json({
         succcess:true,
         data:review
    })

});

//@Desc creates a review review
//@Route GET /api/v1/bootcams/:bootcampId/reviews
//@Access Private
exports.createReview  =  asyncHandler(async (req,res,next)=>{
    
     req.body.bootcamp =  req.params.bootcampId
     req.body.user =  req.user.id;
    
     const bootcamp =  await Bootcamp.findById(req.params.bootcampId);
    if(!bootcamp){
        return next(new errorResponse(`no bootcamp with the id of ${req.params.bootcampId}`,404))
    }

    const review =  await Review.create(req.body)
    
   
    res.status(201).json({
         succcess:true,
         data:review
    })

});


//@Desc  updates review 
//@Route PUT api/v1/reviews/:id
//@Access Private
exports.updateReview  = asyncHandler(async (req,res,next)=>{
   let  review =  Review.findOne(req.params.id)

   if(!review){
 return next(new errorResponse(`no review with the id of ${req.params.id}`,404))

   }
   review =   await Review.findByIdAndUpdate(req.params.id,req.body,{
    new:true,
    runValidators:true
})
  
 res.status(200).json({
      succcess:true,
      data:review
 })

});



//@Desc deletes a review 
//@Route GET /api/v1/reviews/:id
//@Access Private
exports.deleteReview  = asyncHandler(async (req,res,next)=>{ 
    let  review =  Review.findById(req.params.id)
    if(!review){
  return next(new errorResponse(`no review with the id of ${req.params.id}`,404))
 
    }

    await  review.remove()

    res.status(200).json({
         success:true,
         data:{}
    })

});