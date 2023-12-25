// importing libraries
const { successResponse, errorResponse } = require('../utils/response');
const jwt = require('@netra-development-solutions/utils.crypto.jsonwebtoken');
const { TokenNotProvidedException, TokenNotValidException } = require('../exceptions/Base');
const { UserNotFoundException } = require('../exceptions/UserException');
const { getModelDataById } = require('../utils/interServerComms');

const authenticateUserMiddleware = async (req, res, next) => {
    try {
        // get whole url from request
        const url = req.originalUrl.split('?')[0];
        // by pass authentication for login/register routes
        if (url === "/api/user/login" || url === "/api/client/create" || url === "/api/developer/loginDev") {
            return next();
        }

        // Extract token
        const token = req.header('Authorization')?.replace('Bearer ', '');
        if (!token) {
            throw new TokenNotProvidedException();
        }

        // Verify token
        if (jwt.verify(token)) {
            const decoded = jwt.decode(token);

            // Check for user
            var response = await getModelDataById('User', decoded._id, token);
            const users = response.data.data[0].User;
            if (users.length) {
                req.user = users[0];
                req.token = token;
                req.user.role = 1
                return next();
            }

            // Check if the user is a developer
            response = await getModelDataById('Developer', decoded._id, token)
            const developers = response.data.data[0].Developer;
            if (!developers.length) {
                throw new UserNotFoundException();
            }
            req.user = developers[0];
            req.token = token;
            req.user.role = 0
        } else {
            throw new TokenNotValidException();
        }
        next();
    } catch (error) {
        // responding with unauthorized error
        const errorObject = error?.response?.data || error;
        errorResponse(res, errorObject, error.statusCode || 500);
    }
}

module.exports = authenticateUserMiddleware;