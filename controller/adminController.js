const adminProfile = require('../models/adminModel')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const Joi = require('joi')

const createToken = async (payload) => {
    return jwt.sign(payload, )
}

const registerAdmin = async (req, res) => {
    const adminExist = adminProfile.findOne({email: req.body.email})
    if(adminExist){
        return res.status(400).json({ message: "Admin user already exists" })
    }
    const salt = await bcrypt.genSalt(10)
    const hashPassword = await bcrypt.hash(req.body.password, salt)
    await adminProfile.create({
        name: req.body.name,
        email: req.body.email,
        password: hashPassword,
        phone: req.body.phone,
        employees: []
    })

    return res.status(201).json({ message: "A new admin account has been created" })
}

const loginAdmin = async () => {
    const admin = adminProfile.findOne({ email: req.body.email })
    if(!admin){
        return res.status(400).json({ "Incorrect Email or password" })
    }
    const validatePassword = await bcrypt.compare(req.body.password, admin.password)
    if(!validatePassword){
        return res.status(400).json({ message: "Incorrect email or Password"})
    }

}