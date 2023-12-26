// importing libraries
const bcrypt = require('bcryptjs');
const jwt = require('@netra-development-solutions/utils.crypto.jsonwebtoken');
const { InvalidCredentialsException } = require('../../exceptions/Base');
const { UserNotFoundException, EmailIsRequiredException, EmailIsNotValidException, PasswordIsRequiredException } = require('../../exceptions/UserException');
const { successResponse, errorResponse } = require('../../utils/response.js');
const { INVALID_CREDENTIALS } = require('../../constants/message/error');
const { REPLACE_PASSWORD_TEXT, EMAIL_REGEX } = require('../../constants/message/utils');
const { getModelDataByFilter } = require('../../utils/interServerComms.js');

const LoginUser = async (req, res) => {
    const data = req.body;
    const headers = {
        'Bypass-Key': process.env.BYPASS_KEY,
    }

    try {
        const response = await getModelDataByFilter('User', { email: data?.email, clientCode: data?.clientCode }, req.token, headers);
        const user = response.data.data.length ? response.data.data[0]?.User.length ? response.data.data[0].User[0] : null : null;
        if (!user) {
            throw new UserNotFoundException(INVALID_CREDENTIALS);
        }
        const isPasswordCorrect = await bcrypt.compare(data?.password, user?.hashedPassword);
        if (!isPasswordCorrect) {
            throw new InvalidCredentialsException(INVALID_CREDENTIALS);
        }
        const token = jwt.sign({ _id: user._id, email: user.email, clientId: user.clientId, clientCode: user.clientCode }, process.env.AES_GCM_ENCRYPTION_KEY, process.env.JWT_TOKEN_SECRET, process.env.AES_GCM_ENCRYPTION_IV);
        user.hashedPassword = REPLACE_PASSWORD_TEXT;

        successResponse(res, { user, token }, 200);
    } catch (error) {
        const errorObject = error?.response?.data || error;
        errorResponse(res, errorObject, error.statusCode || 400);
    }
};

module.exports = { LoginUser };
