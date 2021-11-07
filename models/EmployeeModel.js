const mongoose = require('mongoose')
const schema = mongoose.Schema

const employeeSchema = new schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    passwoord: {
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

const Admin = mongoose.model('employee', adminSchema)

module.exports = Admin