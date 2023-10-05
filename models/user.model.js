const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({

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
        required: true,
        unique: true,
        validate: [validator.isEmail, 'field must be a valid email address ']
    },
    password: {
        type: String,
        required: true
    }
    , token: String

})
//firstName lastName email password

module.exports = mongoose.model('User', userSchema);
