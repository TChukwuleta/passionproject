const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')
dotenv.config

const validateAuth = (req, res, next) => {
    const token = req.get('Authorization')
    if(token){
        jwt.verify(token.split[' '][1], `${process.env.OneTowerKeys}`, async (err, decoded) => {
            if(err){
                return false
            }
            else{
                req.user = decoded
                next()
            }
        })
    }
    else {
        return false
    }
}