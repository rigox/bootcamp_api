const express =  require('express')
const router =  express.Router()

const {protect}   = require('../middleware/auth')

const  {
     register,
     login,
     getMe,
     forgotPassword,
     resetPassword,
     updateDetails,
     updatePassword
} = require('../controllers/auth')

router 
    .route('/register')
        .post(register)

router
    .route('/login')
        .post(login)


router
    .route('/me')
        .get(protect,getMe)
router
    .route('/forgotPassword')
        .post(forgotPassword)
router
    .route('/reset/:resettoken')
        .put(resetPassword)

router
    .route('/updateDetails')
        .put(protect,updateDetails)

        router
        .route('/updatePassword')
            .put(protect,updatePassword)

module.exports = router