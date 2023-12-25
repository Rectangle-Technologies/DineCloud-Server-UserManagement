const bcrypt = require("bcryptjs");
const jwt = require('@netra-development-solutions/utils.crypto.jsonwebtoken');
const { saveDataByModel } = require("../../utils/interServerComms");

const { successResponse, errorResponse } = require("../../utils/response.js");

const RegisterDeveloper = async (req, res) => {
    const data = req.body;

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(data.developerPassword, salt);
    data.developerPassword = hashedPassword;

    try {
        const response = await saveDataByModel("Developer", req.body, req.headers.authorization)


        if (response.data?.data[0].Developer) {
            const token = jwt.sign({ _id: response.data?.data[0].Developer._id, email: response.data?.data[0].Developer.developerEmail }, process.env.AES_GCM_ENCRYPTION_KEY, process.env.JWT_TOKEN_SECRET, process.env.AES_GCM_ENCRYPTION_IV);
            return successResponse(res, {result: response.data.data[0].Developer, token}, "Developer registered successfully");
        }
    }
    catch (error) {
        return errorResponse(res, error, error.statusCode || 400);
    }
};

module.exports = {
    RegisterDeveloper
};