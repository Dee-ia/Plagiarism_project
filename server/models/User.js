// require mongoose
const mongoose = require('mongoose')

// get Mongoose schema
const { Schema } = mongoose


// init User Schema
const userSchema = new Schema({
    fullName: {
        type: String,
        required: true
    },
    email: String,
    password: String,
    admin: false,
}, { timestamps: true })


// export model
module.exports = mongoose.model('User', userSchema)