// importing libraries
const { successResponse, errorResponse } = require('../utils/response');
const jwt = require('@netra-development-solutions/utils.crypto.jsonwebtoken');
const { TokenNotProvidedException, TokenNotValidException } = require('../exceptions/Base');
const { UserNotFoundException } = require('../exceptions/UserException');
const { getModelDataById } = require('../utils/interServerComms');

const authenticateUserMiddleware = async (req, res, next) => {
    try {
        // get whole url from request
        const url = req.originalUrl;

        // by pass authentication for login/register routes
        if (url.endsWith("/api/user/login") || url.endsWith("/api/client/create") || url.endsWith("/api/developer/loginDev")) {
            return next();
        }
        const token = req.header('Authorization')?.replace('Bearer ', '');
        if (!token) {
            throw new TokenNotProvidedException();
        }
        
        if (jwt.verify(token)) {
            const decoded = jwt.decode(token);
            const response = await getModelDataById('User', decoded._id, token);
            const user = response.data.data;
            if (!user.length) {
                throw new UserNotFoundException();
            }
            
            req.user = user[0].User;
            req.token = token;
            
        } else {
            throw new TokenNotValidException();
        }
        next();
    } catch (error) {
        // responding with unauthorized error
        errorResponse(res, error.message, error.statusCode);
    }
}

module.exports = authenticateUserMiddleware;