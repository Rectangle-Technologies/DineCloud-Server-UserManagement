// importing libraries
const bcrypt = require('bcryptjs');
const jwt = require('@netra-development-solutions/utils.crypto.jsonwebtoken');
const User = require('../../models/User');
const { successResponse, errorResponse } = require('../../utils/response.js');
const { generateClientCode } = require('../../utils/generateClientCode.js');

const RegisterUser = async (req, res) => {
    try {
        const data = req.body;
        data.code = generateClientCode().toUpperCase();

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(data.password, salt);
        data.hashedPassword = hashedPassword;

        const user = new User(data);
        const u = await user.save();
        const token = jwt.sign({ _id: u._id, email: u.email, clientId: user.clientId, clientCode: user.clientCode }, process.env.AES_GCM_ENCRYPTION_KEY, process.env.JWT_TOKEN_SECRET, process.env.AES_GCM_ENCRYPTION_IV);
        u.hashedPassword = "Encrypted";
        successResponse(res, { user: u, token }, 200);
    } catch (error) {
        errorResponse(res, error, error.statusCode || 400);
    }
}

module.exports = {
    RegisterUser,
};
