// importing libraries
const bcrypt = require('bcryptjs');
const jwt = require('@netra-development-solutions/utils.crypto.jsonwebtoken');
const { InvalidCredentialsException } = require('../../exceptions/Base');
const { UserNotFoundException, EmailIsRequiredException, EmailIsNotValidException, PasswordIsRequiredException } = require('../../exceptions/UserException');
const User = require('../../models/User');
const { successResponse, errorResponse } = require('../../utils/response.js');
const { INVALID_CREDENTIALS } = require('../../constants/message/error');
const { REPLACE_PASSWORD_TEXT, EMAIL_REGEX } = require('../../constants/message/utils');

const LoginUser = async (req, res) => {
    // getting data from request body
    const data = req.body;

    // finding user with email
    const user = await User.findOne({ email: data.email });

    try {
        // checking if user exists
        if (!user) {
            throw new UserNotFoundException(INVALID_CREDENTIALS);
        }
        
        // checking if password is correct
        const isPasswordCorrect = await bcrypt.compare(data?.password, user?.hashedPassword);

        // checking if password is correct
        if (!isPasswordCorrect) {
            throw new InvalidCredentialsException(INVALID_CREDENTIALS);
        }
        
        // creating jwt token with user id, email, expiry time
        const token = jwt.sign({ _id: user._id, email: user.email }, process.env.AES_GCM_ENCRYPTION_KEY, process.env.JWT_TOKEN_SECRET, process.env.AES_GCM_ENCRYPTION_IV);
    
        // removing hashed password from user object
        user.hashedPassword = REPLACE_PASSWORD_TEXT;
    
        // sending success response
        successResponse(res, { user, token }, 200);
    } catch (error) {
        // sending error response
        errorResponse(res, error.message, error.statusCode || 400);
    }
};

const LoginUserValidation = async (req, res, next) => {
    try {
        // validating request body
        const data = req.body;

        // checking if all required fields are present
        const emailRegex = EMAIL_REGEX;
        if (!data.email || data.email === '') {
            throw new EmailIsRequiredException();
        }
        // check if email is valid using regex
        
        if (!emailRegex.test(data.email)) {
            throw new EmailIsNotValidException();
        }

        // checking if password is present
        if (!data.password || data.password === '') {
            throw new PasswordIsRequiredException();
        }

        // calling next middleware
        next();
    } catch (error) {
        // sending error response
        errorResponse(res, error.message, error.statusCode);
    }
};

module.exports = { LoginUser, LoginUserValidation };
