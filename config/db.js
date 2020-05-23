const mongoose =  require("mongoose");
//const config =  require("config");
//const db  =  config.get('mongoURI')


const connectDB =  async()=>{
    console.log(process.env.MONGO_URI)

    try
     {
        await  mongoose.connect(process.env.MONGO_URI,{useUnifiedTopology:true,useNewUrlParser:true,useCreateIndex:true,useFindAndModify:false})
        console.log(`Mongo DB Connected`.yellow.underline.bold)
    }catch(err){
             console.log(err)

             process.exit(1)
     }
}


module.exports  = connectDB;