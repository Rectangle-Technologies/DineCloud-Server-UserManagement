// importing libraries
const bcrypt = require('bcryptjs');
const jwt = require('@netra-development-solutions/utils.crypto.jsonwebtoken');
const { successResponse, errorResponse } = require('../../utils/response.js');
const { generateClientCode } = require('../../utils/generateClientCode.js');
const { saveDataByModel } = require('../../utils/interServerComms.js');

const RegisterUser = async (req, res) => {
    try {
        const data = req.body;
        data.code = generateClientCode().toUpperCase();

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(data.password, salt);
        data.hashedPassword = hashedPassword;

        const response = await saveDataByModel("User", data, req.headers.authorization);
        const user = response?.data?.data[0].User;
        const token = jwt.sign({ _id: user._id, email: user.email, clientId: user.clientId, clientCode: user.clientCode }, process.env.AES_GCM_ENCRYPTION_KEY, process.env.JWT_TOKEN_SECRET, process.env.AES_GCM_ENCRYPTION_IV);
        user.hashedPassword = "Encrypted";
        successResponse(res, { user, token }, 'User registered successfully');
    } catch (error) {
        const errorObject = error?.response?.data || error;
        errorResponse(res, errorObject, error.statusCode || 400);
    }
}

module.exports = {
    RegisterUser,
};
