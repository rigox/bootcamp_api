const fs =  require("fs");
const mongoose =  require("mongoose")
const colors =  require("colors")
const dotenv =  require("dotenv")

//load env vars
dotenv.config({path:'./config/config.env'});

//load models 
const Bootcamp =  require("./models/Bootcamp");
const Course = require("./models/Course")
const User =  require('./models/User')
// conncect to database


mongoose.connect(process.env.MONGO_URI,{useUnifiedTopology:true,useNewUrlParser:true,useCreateIndex:true,useFindAndModify:false})

//Read JSON files

const bootcamps =  JSON.parse(fs.readFileSync(`${__dirname}/_data/bootcamps.json`,'utf-8'));


const courses = JSON.parse(fs.readFileSync(`${__dirname}/_data/courses.json`,'utf-8'))

const users  =  JSON.parse(fs.readFileSync(`${__dirname}/_data/users.json`,'utf-8'))

//Import into db
const importData  =  async () =>{
     try {
          await Bootcamp.create(bootcamps)
          await Course.create(courses)
          await User.create(users)
          console.log('Data Imported'.green.inverse)
          process.exit()
     } catch (error) {
         console.log(error)
     }
}

// Delete Data
const DeleteData   = async() =>{
     try {
          await Bootcamp.deleteMany()
          await Course.deleteMany()
          await User.deleteMany()
         console.log('Data Destroyed'.red.inverse)
         process.exit()
     } catch (error) {
          console.log(err)
     }
}

if(process.argv[2]==='-i'){
     importData()
}else if(process.argv[2] ==='-d'){
      DeleteData()
}

