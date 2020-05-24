const express =  require("express")
const router  =  express.Router({mergeParams:true})
const Course =  require("../models/Course")


//Middleware
const advResults =  require('../middleware/advancedResults');
const {protect} =  require('../middleware/auth')

const {getCourses,
       getCourse,
       addCourse,
       updateCourse,
       deleteCourse
   
} =  require('../controllers/courses')


router
    .route('/')
        .get(advResults(Course),getCourses)
        .post(protect,addCourse)


router
    .route('/:id')
        .get(getCourse)
        .put(protect,updateCourse)
        .delete(protect,deleteCourse)
    


module.exports =  router;