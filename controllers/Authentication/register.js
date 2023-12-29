// importing libraries
const bcrypt = require('bcryptjs');
const jwt = require('@netra-development-solutions/utils.crypto.jsonwebtoken');
// const User = require('../../models/User');
const { successResponse, errorResponse } = require('../../utils/response.js');
const { generateClientCode } = require('../../utils/generateClientCode.js');
const { saveDataByModel, getModelDataByFilter } = require('../../utils/interServerComms.js');
const { UserAlreadyExistsError } = require('../../exceptions/UserException.js');

const RegisterUser = async (req, res) => {
    try {
        const data = req.body;
        data.code = generateClientCode().toUpperCase();

        const userCheck = (await getModelDataByFilter('User', { email: data.email, clientCode: data.clientCode }, req.token, { "Bypass-Key": process.env.BYPASS_KEY })).data.data[0].User[0];

        if (userCheck) {
            throw new UserAlreadyExistsError();
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(data.password, salt);
        data.hashedPassword = hashedPassword;

        const user = (await saveDataByModel('User', data, req.token, { "Bypass-Key": process.env.BYPASS_KEY })).data.data[0].User
        const token = jwt.sign({ _id: user._id, email: user.email, clientId: user.clientId, clientCode: user.clientCode }, process.env.AES_GCM_ENCRYPTION_KEY, process.env.JWT_TOKEN_SECRET, process.env.AES_GCM_ENCRYPTION_IV);
        user.hashedPassword = "Encrypted";
        successResponse(res, { user, token }, 200);
    } catch (error) {
        const errorObject = error?.response?.data || error
        errorResponse(res, errorObject, error.statusCode || 400);
    }
}

module.exports = {
    RegisterUser,
};
