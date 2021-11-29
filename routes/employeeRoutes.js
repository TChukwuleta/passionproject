const express = require('express')
const router = express.Router()
const employeeController = require('../controller/employeeController')
const { validateAuth } = require('../middlewares/auth')

router.post('/register', validateAuth, employeeController.registerEmployee)
router.post('/login', employeeController.loginEmployee)
router.put('/update/:id', employeeController.updateEmployee)
router.post('/resetpassword', employeeController.employeeForgotPassword)

module.exports = router