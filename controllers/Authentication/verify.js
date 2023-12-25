const { successResponse, errorResponse } = require('../../utils/response.js');
const jwt = require('@netra-development-solutions/utils.crypto.jsonwebtoken');
const User = require('../../models/User');
const { UnauthorisedException } = require('../../exceptions/UserException.js');

const VerifyUserToken = async (req, res) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');

        if (!token) {
            throw new UnauthorisedException();
        }

        const verifyTokenResponse = jwt.verify(token, process.env.AES_GCM_ENCRYPTION_KEY, process.env.JWT_TOKEN_SECRET, process.env.AES_GCM_ENCRYPTION_IV);
        if (!verifyTokenResponse) {
            return successResponse(res, {
                isTokenValid: false
            }, 'Invalid token');
        }

        const user = await User.findById(verifyTokenResponse?._id)
        if (user == null || user == undefined || user == '') {
            return successResponse(res, {
                isTokenValid: false
            }, 'Invalid token');
        }

        user.hashedPassword = "Encrypted";

        return successResponse(res, {
            isTokenValid: true,
            user
        }, 'Token verified successfully');

    } catch (error) {
        // responding with unauthorized error
        errorResponse(res, "Unauthorised", error.statusCode);
    }
}

module.exports = {
    VerifyUserToken
}