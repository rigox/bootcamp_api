const moongose  =  require("mongoose")
const Schema =   moongose.Schema


const CourseSchema =  new Schema({
    title:{
           type:String,
           trim:true,
           required:[true,'Please  add a course title']
    },
    description:{
          type:String,
          required:[true,"Please add a description"]
    },
    weeks:{
        type:String,
        required:[true,"Please add number of weeks"]
  },
  tuition:{
    type:Number,
    required:[true,"Please add a tution cost"]
},
minimumSkill:{
    type:String,
    required:[true,"Please add a minimum skill"],
    enum:['beginner','intermediate','advanced']
},
scholarschipAvailable:{
    type:Boolean,
    default:false
},

createdAt:{
     type:Date,
     default: Date.now()
},
bootcamp:{
   type:Schema.ObjectId,
   ref:'bootcamps',
   required:true
},
user:{
    type:Schema.ObjectId,
    ref:'users',
    required:true
 }


});


//  static method to get average of course tuitions
CourseSchema.statics.getAverageCost  =  async function(bootcampId){

  console.log('calculatiing avg cost...'.blue);
  const obj  = await this.aggregate([
      {
            $match:{bootcamp:bootcampId}
      },
      {
        $group:{
            _id:'$bootcamp',
            averageCost:{$avg:'$tuition'}
        }
      }
  ]);
  
    try {
        await this.model('bootcamps').findByIdAndUpdate(bootcampId,{
             averageCost:Math.ceil(obj[0].averageCost/10)*10
        })
    } catch (err) {
         console.log(err)
    }
}

//Get  averageCost After Save
CourseSchema.post('save',function(){
    this.constructor.getAverageCost(this.bootcamp);
});

//call getAverageCost before remove
CourseSchema.pre('remove',function(){
    this.constructor.getAverageCost(this.bootcamp);
});

module.exports =  moongose.model('courses',CourseSchema);