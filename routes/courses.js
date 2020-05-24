const express =  require("express")
const router  =  express.Router({mergeParams:true})
const Course =  require("../models/Course")


//Middleware
const advResults =  require('../middleware/advancedResults');

const {getCourses,
       getCourse,
       addCourse,
       updateCourse,
       deleteCourse
   
} =  require('../controllers/courses')


router
    .route('/')
        .get(advResults(Course),getCourses)
        .post(addCourse)


router
    .route('/:id')
        .get(getCourse)
        .put(updateCourse)
        .delete(deleteCourse)
    


module.exports =  router;