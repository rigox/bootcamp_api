const cors = require("cors")
const colors =  require("colors")
const dotenv =   require("dotenv")
const express  = require("express")
const morgan =  require("morgan")
const path =  require("path")
const cookieParser =  require("cookie-parser")
const expressFileUpload =  require("express-fileupload")
const mongoSanitizer =  require("express-mongo-sanitize")
const helmet =  require("helmet")
const xss =  require("xss-clean")
const rateLimit =  require("express-rate-limit")
const hpp =  require("hpp")

//inhouse imports
const db =  require("./config/db")
const errorHandler = require("./middleware/error")
// Load env vars
dotenv.config({path:'./config/config.env'})
const app =  express()

//load Database 
db();

//Set up middleware
app.use(express.urlencoded(), express.json())


//enable cors
app.use(cors())
// Dev loggin middleware
if(process.env.NODE_ENV=="development"){
     app.use(morgan('dev'));
}

//sanitize data
app.use(mongoSanitizer())

//add headers that help with security 
app.use(helmet())

//xxs prevents cross site scriptin
app.use(xss())


//rate limiting
const limiter =  rateLimit({
    windowMs:10 * 60 * 1000, // 10 mins
    max:100
})

app.use(limiter);

//prevents http params pollution
app.use(hpp())


app.use(expressFileUpload())
app.use(cookieParser())
//setup static folder
app.use(express.static(path.join(__dirname,'public')))

//Load Routes
const bootcamps =  require('./routes/bootcamps');
const courses =  require('./routes/courses');
const auth =  require('./routes/auth');
const users =  require("./routes/users")
const reviews =  require('./routes/reviews')
//Set up routes
app.get('/',(req,res)=>{ res.send('welcome to the  bootcamp api')})

app.use('/api/v1/bootcamps', bootcamps)

app.use('/api/v1/courses',courses)

app.use('/api/v1/auth',auth)

app.use('/api/v1/users',users)

app.use('/api/v1/reviews',reviews)

//setup errorhandler middleware
app.use(errorHandler)


const PORT = process.env.PORT || 5001;

const server = app.listen(PORT
    ,()=>{
    console.log(`server running on ${process.env.NODE_ENV} mode on port ${PORT}`.green)
});

// Handle unhandled promise rejections
process.on('unhandledRejection',(err,promise)=>{
         console.log(`Error: ${err.message}`.red.bold);
         //close server and exit process
         server.close(()=>{process.exit(1)});
});