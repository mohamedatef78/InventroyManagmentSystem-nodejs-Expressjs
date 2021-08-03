const authController = require('../Controller/authController');

const express = require('express');
const router = express.Router();

//Routes

router.post('/signup',authController.signup);
router.post('/login',authController.login);






module.exports = router ;