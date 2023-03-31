// Importing all dependencies
const express = require('express');
const router = express.Router();
const path = require('path');
const jwt = require("jsonwebtoken");
const authenticateToken = require("./middleware/auth");

const authController = require ("./controllers/authController");
const controller = require ("./controllers/controller");



// User Signin API
router.post('/auth/user_SignUp', authController.userSignUp)
router.post('/auth/user_Login', authController.userLogin)
router.post('/auth/user_LogOut', authController.userLogout)
// Payment API
router.get('/paystack', authController.paystack )
router.post('/paymentNotification', authController.paymentNotification)
router.post('/rentExpiryDate', authController.rentExpiryDate)
router.post('/rentRenewer', authController.rentRenewer)



 

module.exports = router