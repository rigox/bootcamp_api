const mongoose =  require("mongoose")
const Schema =  mongoose.Schema;
const bcrypt =  require("bcryptjs")
const jwt =  require("jsonwebtoken")


const userSchema = new Schema({
   
     name:{
          type:String,
          required:[true,'please add a name']
     },
     email: {
        type: String,
        required:[true,'please add and email'],
        unique:true,
        match: [
          /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
          'Please add a valid email'
        ]
      },
      role:{
           type:String,
           enum:['user','publisher'],
           default:'user'
      },
      password:{
           type:String,
           required:[true,'please add a password'],
           maxlength:[6,'pass word should be 6 charachter long'],
           select:false
      },
      resetPasswordToke:String,
      resetPasswordExpire:Date,
      createdAt:{
           type:Date,
           default:Date.now()
      }
});


//Encrypt password using bcrypt
userSchema.pre('save',async function(next){
        const salt =  await  bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password ,  salt);

});

//Sign JWT and return
userSchema.methods.getSignedJwtToken =  function(){
      return jwt.sign({id:this._id},process.env.JWT_SECRET,{
           expiresIn:process.env.JWT_EXPIRE
      })
}

//Matc user enter password to hash password in databsse
userSchema.methods.matchPasswords =  async function(enteredPass){
     return await bcrypt.compare(enteredPass,this.password)
}

module.exports = mongoose.model('users',userSchema);