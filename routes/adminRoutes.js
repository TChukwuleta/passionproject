const express = require('express')
const router = express.Router()
const adminController = require('../controller/adminController')

router.post('register', adminController.registerAdminUser)
router.post('/login', adminController.loginAdminUser)
router

module.exports = router