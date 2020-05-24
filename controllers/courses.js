const Course =  require('../models/Course');
const Bootcamp  = require("../models/Bootcamp");
const errorResponse =  require('../utils/errorResponse')
const asyncHandler =  require("../middleware/async")




//@Desc  Get All Courses
//@Route GET /api/v1/courses
//@Route GET /api/v1/bootcamps/:bootcampId/courses
//@Access Public
exports.getCourses  = asyncHandler(async (req,res,next)=>{

    if(req.params.bootcampId){
         const courses  =  await Course.find({bootcamp:req.params.bootcampId})
         return res.status(200).json({
              succcess:true,
              count: courses.length,
              data:courses
         });
    }else{
         res.status(200).json(res.advancedResults)
    }

    
});

//@Desc  gets  a single course by id
//@Route POST /api/v1/courses/:id
//@Access Public
exports.getCourse =  asyncHandler(async (req,res,next)=>{
       const course = await Course.findById(req.params.id).populate({
            path:'bootcamp',
            select:'name description'
       })
       
       if(!course){
             return next(new errorResponse(`No course with the id of ${req.params.id} was found`,404))
       }


       res.status(200).json({
            success:true,
            data:course
       })

});


//@Desc  creates a course
//@Route POST /api/v1/bootcamps/:bootcampId/courses
//@Access private
exports.addCourse = asyncHandler(async (req,res,next)=>{
         req.body.bootcamp =  req.params.bootcampId;

         const bootcamp  =  await  Bootcamp.findById(req.params.bootcampId)

        if(!bootcamp){
            return next(new errorResponse(`no Bootcamp with the id of ${req.params.bootcampId}`,404));
        }

        const course = await Course.create(req.body);

        res.status(200).json({
             success:true,
             data:course
        });
});

//@Desc  updates a course
//@Route POST /api/v1/courses/:id
//@Access private
exports.updateCourse  = asyncHandler(async (req,res,next)=>{
    
     let  course =  await  Course.findById(req.params.id);

     if(!course){
          return next(new errorResponse(`No course with the of ${req.params.id}`,400))
     }
     course =  await  Course.findByIdAndUpdate(req.params.id,req.body,{
           new:true,
           runValidators:true
     })

     res.status(200).json({
          success:true,
          data:course
     })
     
});

//@Desc  deletes a course
//@Route Deletes /api/v1/course/:id
//@Access private
exports.deleteCourse =  asyncHandler(async (req,res,next)=>{
      let course =  await  Course.findById(req.params.id)

      if(!course){
          return next(new errorResponse(`no course with the id of ${req.params.id}`,404))
      }

       course.remove()

      res.status(200).json({
           success:true,
           data:{}
      })
});