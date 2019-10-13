const  express =  require("express");
const PORT  = process.env.PORT || 5001;
const app =  express()

//routes
const test   =  require("./routes/main");

//set up middleware
app.use(express.json(), express.urlencoded({extended:true}))
app.use('/api/',test)




app.listen(PORT ,()=>{
      console.log(`listening on PORT ${PORT}`)
})
