const colors =  require("colors")
const dotenv =   require("dotenv")
const express  = require("express")

// Load env vars
dotenv.config({path:'./config/config.env'})
const app =  express()


//Set up middleware
app.use(express.urlencoded(), express.json())

//Load Routes
const bootcamps =  require('./routes/bootcamps')



//Set up routes
app.get('/',(req,res)=>{ res.send('welcome to the  bootcamp api')})

app.use('/api/v1/bootcamps', bootcamps)


const PORT = process.env.PORT || 5001;

app.listen(PORT
    ,()=>{
    console.log(`server running on ${process.env.NODE_ENV} mode on port ${PORT}`.green)
});