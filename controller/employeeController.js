const adminProfile = require('../models/adminModel')
const employeeProfile = require('../models/EmployeeModel')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const Joi = require('joi')

// Login Validation Schema
const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
})

// Registration Validation Schema
const registerSchema = Joi.object({
    firstname: Joi.string().required(),
    lastname: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    phone: Joi.string().required()
})

// Create validation token
const createToken = async (payload) => {
    return jwt.sign(payload, `${process.env.OneTowerKeys}`, {
        expiresIn: 60 * 60
    })
}

// Create employee user
const registerEmployee = async (req, res) => {
    const user = req.user
    if(user){
        const admin = await adminProfile.findById(user._id)
        if(admin){
            const { error } = registerSchema.validate(req.body)
            if(error){
                return res.status(400).send(error.details[0].message)
            }
            const employeeExist = await employeeProfile.findOne({email: req.body.email})
            if(employeeExist){
                return res.status(400).json({ message: "A user with that Email already exists" })
            }
            const salt = await bcrypt.genSalt(10)
            const hashPassword = await bcrypt.hash(req.body.password, salt)
            const newEmployee = await employeeProfile.create({
                firstname: req.body.firstname,
                lastname: req.body.lastname,
                email: req.body.email,
                password: hashPassword,
                phone: req.body.phone,
                employeeId: Math.floor(Math.random() * 10000), // Auto Generates employee ID
            })

            adminProfile.employees.push(newEmployee)
            await adminProfile.save()

            return res.status(201).json({ message: "Employee account created successfully" })
        }
        return res.status(400).json({ message: "Only Admins can create employee on the database"})
    }
}

// Login for employee
const loginEmployee = async () => {
    const { error } = loginSchema.validate(req.body)
    if(error){
        return res.status(400).send(error.details[0].message)
    } 
    const employee = await employeeProfile.findOne({ email: req.body.email })
    if(!employee){
        return res.status(400).json({message: "Incorrect Email or password" })
    }
    const validatePassword = await bcrypt.compare(req.body.password, employee.password)
    if(!validatePassword){
        return res.status(400).json({ message: "Incorrect email or Password"})
    }
    const signature = await createToken({
        _id: employee._id,
        email: employee.email
    })
    return res.status(201).json({ signature: signature })
}

// Forgot Password
const employeeForgotPassword = async (req, res) => {
    const employeeUser = await employeeProfile.findOne({ email: req.body.email })
    if(employeeUser){
        const { newPassword, confirmPassword } = req.body
        if(newPassword != confirmPassword){
            return res.status(400).json({ message: "Password doesn't match" })
        }
        const salt = await bcrypt.genSalt(10)
        const hashPassword = await bcrypt.hash(newPassword, salt)
        employeeUser.password = hashPassword
        await employeeUser.save()

        return res.status(201).json({ message: "Your password has been updated successfully" })
    }
    return res.status(400).json({ message: "Not an employee at OneTower" })
}

// Update admin user
const updateEmployee = async (req, res) => {
    const employeeUserId = req.params.id
    const employee = await employeeProfile.findOne({ employeeId: employeeUserId})
    if(employee){
        employee.firstName = req.body.firstName,
        employee.lastName = req.body.lastName,
        employee.phone = req.body.phone

        await employee.save()
        return res.status(201).json({ message: "User Profile has been successfully updated" })
    }
    return res.status(400).json({ message: "No user with that employee ID was found" })
}


module.exports = {
    registerEmployee,
    loginEmployee,
    updateEmployee,
    employeeForgotPassword
}