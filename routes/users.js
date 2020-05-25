const express = require("express")
const router =  express.Router({mergeParams:true})
const User =  require('../models/User');

//middleware 
const advResults =  require('../middleware/advancedResults');
const {protect , authorize} =  require('../middleware/auth')

const {
    createUser,
    deleteUser,
    getUser,
    getUsers,
    updateUser
} = require("../controllers/users")

router.use(protect)
router.use(authorize('admin'));

router
    .route('/')
        .get(advResults(User),getUsers)
        .post(createUser)

router
    .route('/:id')
        .get(getUser)
        .put(updateUser)
        .delete(deleteUser)

module.exports = router;