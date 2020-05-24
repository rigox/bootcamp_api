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
const {protect , authorize} =  require('../middleware/auth')


router
    .route('/')
        .get(advResults(Bootcamp,'courses'),getBootcamps)
        .post(protect,createBootcamp)

router
    .route('/:id')
        .get(getBootcamp)
        .put(protect,authorize('publisher','admin'),updateBootcamp)
        .delete(protect,authorize('publisher','admin'),deleteBootcamp)
router
    .route('/radius/:zipcode/:distance')
        .get(getBootcampsInRadius)

router
    .route('/:id/photo')
        .put(protect,authorize('publisher','admin'),bootcampPhotoUpload)

module.exports = router;