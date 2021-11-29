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

// Create admin user(HR)
const registerAdminUser = async (req, res) => {
    const { error } = registerSchema.validate(req.body)
    if(error){
        return res.status(400).send(error.details[0].message)
    }
    const adminExist = await adminProfile.findOne({email: req.body.email})
    if(adminExist){
        return res.status(400).json({ message: "A user with that Email already exists" })
    }
    const salt = await bcrypt.genSalt(10)
    const hashPassword = await bcrypt.hash(req.body.password, salt)
    await adminProfile.create({
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        email: req.body.email,
        password: hashPassword,
        phone: req.body.phone,
        employeeId: Math.floor(Math.random() * 10000), // Auto Generates employee ID
        employees: []
    })

    return res.status(201).json({ message: "Account created successfully" })
}

// Login Admin user
const loginAdminUser = async (req, res) => {
    const { error } = loginSchema.validate(req.body)
    if(error){
        return res.status(400).send(error.details[0].message)
    } 
    const admin = await adminProfile.findOne({ email: req.body.email })
    if(!admin){
        return res.status(400).json({message: "Incorrect Email or password" })
    }
    const validatePassword = await bcrypt.compare(req.body.password, admin.password)
    if(!validatePassword){
        return res.status(400).json({ message: "Incorrect email or Password"})
    }
    const signature = await createToken({
        _id: admin._id,
        email: admin.email
    })
    return res.status(201).json({ signature: signature })
}

// Forgot Password
const adminForgotPassword = async (req, res) => {
    const adminUser = await adminProfile.findOne({ email: req.body.email })
    if(adminUser){
        const { newPassword, confirmPassword } = req.body
        if(newPassword != confirmPassword){
            return res.status(400).json({ message: "Password doesn't match" })
        }
        const salt = await bcrypt.genSalt(10)
        const hashPassword = await bcrypt.hash(newPassword, salt)
        adminUser.password = hashPassword
        await adminUser.save()

        return res.status(201).json({ message: "Your password has been updated successfully" })
    }
    return res.status(400).json({ message: "Not an employee at OneTower" })
}

// Update admin user
const updateAdminUser = async (req, res) => {
    const adminUserId = req.params.id
    const adminUser = await adminProfile.findOne({ employeeId: adminUserId})
    if(adminUser){
        adminUser.firstName = req.body.firstName,
        adminUser.lastName = req.body.lastName,
        adminUser.phone = req.body.phone

        await adminUser.save()
        return res.status(201).json({ message: "User Profile has been successfully updated" })
    }
    return res.status(400).json({ message: "No user with that employee ID was found" })
}


// Delete employee user (when employee leaves the company)
const deleteEmployee = async (req, res) => {
    const user = req.user
    if(user){
        const adminUser = await adminProfile.findById(user._id)
        if(adminUser){
            employeeProfile.deleteOne({ employeeId: req.body.employeeId })
            .then(() => {
                return res.status(201).json({ message: "Employee has successfully been deleted from OneTower database" })
            })
            .catch((e) => {
                return res.status(400).send(e)
            })
        }
    }
}


module.exports = {
    registerAdminUser,
    loginAdminUser,
    updateAdminUser,
    adminForgotPassword,
    deleteEmployee
}