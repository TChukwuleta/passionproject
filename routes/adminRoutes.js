const express = require('express')
const router = express.Router()
const adminController = require('../controller/adminController')

router.post('/register', adminController.registerAdminUser)
router.post('/login', adminController.loginAdminUser)
router.post('/update/:id', adminController.updateAdminUser)
router.post('/forgotpassword/', adminController.adminForgotPassword)
router.post('/delete-employee', adminController.deleteEmployee)

module.exports = router