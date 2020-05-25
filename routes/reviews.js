const express =  require("express")
const router =  express.Router({mergeParams:true})
const Review =  require('../models/Review');

const  {
 getReviews,
 getReview,
 createReview,
 updateReview,
 deleteReview

} =  require("../controllers/reviews")

const advResults = require("../middleware/advancedResults")
const { protect , authorize }  = require("../middleware/auth")

router
    .route('/')
        .get(advResults(Review), getReviews)
        .post(protect,createReview)

router
    .route('/:id')
        .get(getReview)
        .put(protect,updateReview)
        .delete(protect,authorize('admin'),deleteReview)


module.exports = router