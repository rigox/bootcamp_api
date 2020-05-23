
//@Desc  Get All Bootcamps
//@Method GET /api/v1/bootcamps
//@Access Public
exports.getBootcamps = (req,res,next) => {
    res.status(200).json({success:true,msg:'show all bootcamps'    });

}


//@Desc Get A single  Bootcamp
//@Method GET /api/v1/bootcamps/:id
//@ Access Public
exports.getBootcamp =  (req,res,next) =>{
    res.status(200).json({success:true,msg:'show one bootcamp'    });
}

//@Desc creates A single  Bootcamp
//@Method POST /api/v1/bootcamps/:id
//@Access private
exports.createBootcamp = (req,res,next) => {
    res.status(200).json({success:true,msg:'created new bootcamp'})
}


//@Desc Updates a single bootcamp
//@Method UPDATE /api/v1/bootcamps/:id
//@Access Private
exports.updateBootcamp =  (req,res,next) =>{
    res
    .status(200)
    .json({success:true,msg:`update bootcamp ID ${req.params.id}`})
}


//@Desc Deletes a single Bootcamp
//@Method  DELETE /api/v1/bootcamps/:id
//@Access private
exports.deleteBootcamp =  (req,res,next) =>{
    res.status(200)
        .json({sucess:true,msg:`deleted bootcamp with id of ${req.params.id}`})
}
