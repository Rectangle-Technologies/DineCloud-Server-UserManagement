// importing mongoose
const mongoose = require('mongoose');
const emailValidator = require('../utils/emailValidator');

// schema for user
const userSchema = new mongoose.Schema({
    "firstName": {
        "type": "string",
        "required": true,
        "trim": true,
    },
    "lastName": {
        "type": "string",
        "required" : true,
        "trim": true,
    },
    "clientId": {
        "type": "string",
        "required": true,
        "ref": 'Client'
    },
    "clientCode":{
        "type": "string",
        "required": true,
        "trim": true
    },
    "code": {
        "type": "string",
        "required": true,
        "trim": true,
    },
    "email": {
        "type": "string",
        "required": true,
        "trim": true
    },
    "hashedPassword": {
        "type": "string",
        "required": true,
        "trim": true
    },
    "mobileNumber": {
        "type": "string",
        "trim": true
    },
}, {
    timestamps: true
});

// creating model for user
const User = mongoose.model('User', userSchema);

module.exports = User;