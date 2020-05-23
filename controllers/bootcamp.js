const Bootcamp =  require('../models/Bootcamp');
const errorResponse =  require('../utils/errorResponse')
const asyncHandler =  require("../middleware/async")

//@Desc  Get All Bootcamps
//@Method GET /api/v1/bootcamps
//@Access Public
exports.getBootcamps = asyncHandler(  async(req,res,next) => {
          const bootcamps =  await  Bootcamp.find();
          res.status(200)
          .json({
               success:true,
               count: bootcamps.length  ,
               data:bootcamps
          })
     
});


//@Desc Get A single  Bootcamp
//@Method GET /api/v1/bootcamps/:id
//@ Access Public
exports.getBootcamp = asyncHandler(async (req,res,next) =>{
   
     try {
          const bootcamp = await Bootcamp.findById(req.params.id)
          
          if(!bootcamp){
            return next(new errorResponse(`Bootcamp not found with the id of ${req.params.id}`,404))
          }
          
          res.status(200)
          .json({
               sucess:true,
               data:bootcamp
          })
     } catch (err) {
           next(err)
           
    }

});

//@Desc creates A single  Bootcamp
//@Method POST /api/v1/bootcamps/:id
//@Access private
exports.createBootcamp = asyncHandler(async (req,res,next) => {
   try {
    const bootcamp  =  await Bootcamp.create(req.body)
     
    res.status(201).json({success:true,data:bootcamp})
   } catch (err) {
        next(err)
   }
});


//@Desc Updates a single bootcamp
//@Method UPDATE /api/v1/bootcamps/:id
//@Access Private
exports.updateBootcamp = asyncHandler( async (req,res,next) =>{
    
    const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id,req.body,{
           new:true,
           runValidators:true 
    });
     
    if(!bootcamp){
         return res.status(400).json({success:false})
    }
    res.status(200).json({success:true,data:bootcamp})

});


//@Desc Deletes a single Bootcamp
//@Method  DELETE /api/v1/bootcamps/:id
//@Access private
exports.deleteBootcamp = asyncHandler( async (req,res,next) =>{
    const deleteBootcamp =  await  Bootcamp.findByIdAndDelete(req.params.id)
    if(!deleteBootcamp){
        return res.status(400).json({success:false})
   }
    res.status(200)
    .json({
         sucess:true,
         data:{}
    })
});
