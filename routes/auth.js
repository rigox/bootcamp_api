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
     updatePassword,
     logout
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

router
    .route('/logout')
        .get(protect,logout)

module.exports = router