const express =  require("express")
const router =  express.Router()
const Bootcamp =  require('../models/Bootcamp')


//Include other resource routers
const courseRouter =  require("./courses")

//Reroute into other resource routers
router.use('/:bootcampId/courses',courseRouter)

const {
    getBootcamp,
    getBootcamps,
    createBootcamp,
    deleteBootcamp,
    updateBootcamp,
    getBootcampsInRadius,
    bootcampPhotoUpload
} =  require('../controllers/bootcamp')

//Get middleware
const advResults =  require('../middleware/advancedResults');



router
    .route('/')
        .get(advResults(Bootcamp,'courses'),getBootcamps)
        .post(createBootcamp)

router
    .route('/:id')
        .get(getBootcamp)
        .put(updateBootcamp)
        .delete(deleteBootcamp)
router
    .route('/radius/:zipcode/:distance')
        .get(getBootcampsInRadius)

router
    .route('/:id/photo')
        .put(bootcampPhotoUpload)

module.exports = router;