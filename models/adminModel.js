const mongoose = require('mongoose')
const schema = mongoose.Schema

const adminSchema = new schema({
    name: {
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
        type: String,
        required: true
    },
    employees: [{
        type: schema.Types.ObjectId,
        ref: 'employee'
    }]
},{
    timestamps: true
})

const Admin = mongoose.model('adminprofile', adminSchema)

module.exports = Admin