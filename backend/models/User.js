const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: 'string',
        required: true,
        minLength: 6,
        maxLength: 20,
        unique: true
    },
    email: {
        type: 'string',
        required: true,
        minLength: 10,
        maxLength: 50,
        unique: true
    },
    password: {
        type: 'string',
        required: true,
        minLength: 6,

    },
    admin: {
        type: 'boolean',
        default: false,
    }
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema)

