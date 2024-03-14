const express = require('express');
const router = new express.Router();
const auth = require('../middleware/auth');
const userController = require('../controllers/user.controller');
const valid = require("../middleware/validator");
const upload = require("../config/multer");

router.post('/register', [upload.fields([{
    name: 'profile',
    maxCount: 1
},]), valid.registerSchema], userController.register);
router.post('/login', valid.loginSchema, userController.login);
router.get('/logout', auth, userController.logout);
router.get('/getMyDetails', auth, userController.getMyDetails);
router.put('/updateyMyDetails', [upload.fields([{
    name: 'profile',
    maxCount: 1
},]), valid.updateSchema, auth], userController.UpdateyMyDetails);
router.get('/follow', auth, userController.userFollow);
router.delete("/:id", auth, userController.deleteUserById) // for admin can have acces for this api

module.exports = router;
