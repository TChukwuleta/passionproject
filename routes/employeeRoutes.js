const express = require('express')
const router = express.Router()
const employeeController = require('../controller/employeeController')

router.post('/register', employeeController.registerEmployee)
router.post('/login', employeeController.loginEmployee)
router.put('/update', employeeController.updateEmployee)
router.post('/resetpassword', employeeController.employeeForgotPassword)

module.exports = router