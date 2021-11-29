const mongoose = require('mongoose')
const schema = mongoose.Schema

const employeeSchema = new schema({
    firstname: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    employeeId: {
        type: String
    }
},{
    timestamps: true
})

const Admin = mongoose.model('employee', employeeSchema)

module.exports = Admin