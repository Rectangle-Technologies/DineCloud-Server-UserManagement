// importing libraries
const bcrypt = require('bcryptjs');
const jwt = require('@netra-development-solutions/utils.crypto.jsonwebtoken');
const { UserAlreadyExistsError } = require('../../exceptions/UserException');
const User = require('../../models/User');
const { successResponse, errorResponse } = require('../../utils/response.js');
const { generateClientCode } = require('../../utils/generateClientCode.js');

const RegisterUser = async (req, res) => {
    try {
        const data = req.body;
        data.code = generateClientCode().toUpperCase();

        const user = new User(data);
        const u = await user.save();
        const token = jwt.sign({ _id: u._id, email: u.email }, process.env.AES_GCM_ENCRYPTION_KEY, process.env.JWT_TOKEN_SECRET, process.env.AES_GCM_ENCRYPTION_IV);
        u.hashedPassword = "Encrypted";
        successResponse(res, { user: u, token }, 200);
    } catch (error) {
        errorResponse(res, error, error.statusCode || 400);
    }
}

const RegisterUserValidation = async (req, res, next) => {
    try {
        // validating request body
        const data = req.body;

        // checking if all required fields are present
        if (!data.email || data.email === '') {
            throw new Error('Email is required');
        }
        // check if email is valid using regex
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(data.email)) {
            throw new Error('Email is not valid');
        }

        // checking if email already exists
        await UserAlreadyExistsException(data.email);

        // checking if first name is present
        if (!data.firstName || data.firstName === '') {
            throw new Error('First name is required');
        }

        // checking if last name is present
        if (!data.lastName || data.lastName === '') {
            throw new Error('Last name is required');
        }

        // checking if password is present
        if (!data.password || data.password === '') {
            throw new Error('Password is required');
        }

        // hashing password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(data.password, salt);

        // saving hashed password in request body
        data.hashedPassword = hashedPassword;

        // saving data in request body
        req.body = data;

        // calling next middleware
        next();

    } catch (error) {
        // sending error response for validation error
        errorResponse(res, error, error.statusCode || 400);
    }
}

const UserAlreadyExistsException = async (email) => {
    const user = await User.findOne({ email });

    if (user) {
        throw new UserAlreadyExistsError();
    }

    return false;
};

module.exports = {
    RegisterUser,
    RegisterUserValidation
};
