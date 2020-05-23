const errorResponse = require("../utils/errorResponse")


const errorHandler = (err,req,res,next) => {
    let error  = {...err} 
    error.message =  err.message
    
       //Log to console for developer   
       console.log(err.stack.red);
       
       //Mongoose bad ObjectID
       if(err.name === 'CastError'){
            const message = `Resource not found with the id of ${err.value}`
            error  = new errorResponse(message,404)
        }
       
        //Mongoose duplicate Key
        if(err.code ===1000){
              const message = `Duplicate field value enter`
              error =  new errorResponse(message ,400)
            }

     if(err.name=== "ValidationError"){
        const message =  Object.values(err.errors).map(val => val.message)
        error  = new errorResponse(message,400)
        }
             
       res.status(error.statusCode || 500).json({
            success:false,
            error:error.message || 'Server Error'
       })
}


module.exports = errorHandler;