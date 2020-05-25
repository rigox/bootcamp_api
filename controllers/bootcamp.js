const geocoder =  require("../utils/geocoder");
const Bootcamp =  require('../models/Bootcamp');
const errorResponse =  require('../utils/errorResponse')
const path  =  require("path")
const asyncHandler =  require("../middleware/async")




//@Desc  Get All Bootcamps
//@Method GET /api/v1/bootcamps
//@Access Public
exports.getBootcamps = asyncHandler(  async(req,res,next) => {
  
   
          res.status(200)
          .json(res.advancedResults)
     
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
   
    // Add user to req.body
    
    req.body.user  = req.user.id

   // Check for publish bootcamp 

    const publishedBootCamp = await Bootcamp.findOne({user:req.user.id})

    //if the user is not  an admin they can only add one bootcamp
    if(publishedBootCamp && req.user.role!=='admin'){
         return next(new errorResponse(`The user with ${req.user.id} has already published a bootcamp`,400))
    }
     
    const bootcamp  =  await Bootcamp.create(req.body)
     
    res.status(201).json({success:true,data:bootcamp})
   
});


//@Desc Updates a single bootcamp
//@Method UPDATE /api/v1/bootcamps/:id
//@Access Private
exports.updateBootcamp = asyncHandler( async (req,res,next) =>{
    
    let bootcamp = await Bootcamp.findById(req.params.id)

    if(!bootcamp){
         return res.status(400).json({success:false})
    }

     // make sure user is bootcamp owner
     if(bootcamp.user.toString() !== req.user.id && req.user.role !== 'admin'){
          return  next(new errorResponse(`user ${req.params.id} is not authorized to updatde bootcamp`,401))
     }
  
      bootcamp =  await Bootcamp.findOneAndUpdate(req.params.id,req.body,{
          new:true,
          runValidators:true
     })  
    res.status(200).json({success:true,data:bootcamp})

});


//@Desc Deletes a single Bootcamp
//@Method  DELETE /api/v1/bootcamps/:id
//@Access private
exports.deleteBootcamp = asyncHandler( async (req,res,next) =>{
    const deleteBootcamp =  await  Bootcamp.findById(req.params.id)
    if(!deleteBootcamp){
        return next(new errorResponse(`not Bootcamp with the id of ${req.params.id}`,400))
   }
    
   // make sure user is bootcamp owner
   if(deleteBootcamp.user.toString() !== req.user.id && req.user.role !== 'admin'){
   return  next(new errorResponse(`user ${req.params.id} is not authorized to delete bootcamp`,401))
}

   deleteBootcamp.remove()
    res.status(200)
    .json({
         sucess:true,
         data:{}
    })
});


//@Desc Gets  Bootcamps between a  radius
//@Method  GET /api/v1/bootcamps/radius/:zip/:distance
//@Access private
exports.getBootcampsInRadius =  asyncHandler(async (req,res,next)=>{
     const {zipcode , distance} = req.params;
      
     
     //Get Latitude and Longitude

    const  loc =  await geocoder.geocode(zipcode);
    console.log('here is the loc'.blue, loc)
    const lat  = loc[0].latitude
    const lang =  loc[0].longitude

    //calc radius usinf radians
    // divide distance by radius of earth
    // Earth radius -  3,963 miles / 6378 km

    const radius  = distance / 3963

    const bootcamps =  await Bootcamp.find({
         location : {$geoWithin:{$centerSphere:[ [lang,lat] ,radius] }  }
    }) 

    res.status(200).json({
         sucess:true,
         count: bootcamps.length,
         data: bootcamps
    })

});

//@Desc  uploads a photo for  Bootcamp
//@Route  PUT /api/v1/bootcamps/:id/photo
//@Access private
exports.bootcampPhotoUpload =  asyncHandler(async (req,res,next)=>{
      const bootcamp =  await  Bootcamp.findById(req.params.id);
      if(!bootcamp){
        return next(new errorResponse(`Bootcamp not found with id of ${req.params.id}`,404))
      }  

      if(!req.files){
        return next(new errorResponse(`Pleasea attach an  image to upload`,400))    
      }
  
      const file =  req.files.file

      //make sure the file is an image

      if(!file.mimetype.startsWith('image')){
        return next(new errorResponse('please the  file must be if  image file like jpg',400))
      }

      //check the file size

      if(file.size > process.env.MAX_FILE_UPLOAD){
          return next(new errorResponse(`please upload an image less than ${process.env.MAX_FILE_UPLOAD}`))
      }


      //Create custome file name

      file.name = `photo_${bootcamp._id}${path.parse(file.name).ext}`;

      file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`,async err=>{
           if(err){
               console.log(err)
               return next(errorResponse(`Problem with file upload`,500))
           }
      }) 

      await Bootcamp.findByIdAndUpdate(req.params.id,{photo:file.name})

      res.status(200).json({
            success:true,
            data:file.name
      })

});


