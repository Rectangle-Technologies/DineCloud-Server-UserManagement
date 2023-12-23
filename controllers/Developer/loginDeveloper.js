const bcrypt = require("bcryptjs");
const jwt = require('@netra-development-solutions/utils.crypto.jsonwebtoken');
const { getModelDataByFilter } = require("../../utils/interServerComms");
const { successResponse, errorResponse } = require("../../utils/response.js");

const LoginDeveloper = async (req, res) => {
    const data = req.body;

    try {
        const response = await getModelDataByFilter("Developer", { developerEmail: data.developerEmail }, req.headers.authorization)

        const developer = response.data?.data[0].Developer[0];

        if (response.data?.data[0].Developer[0]) {
            const isPasswordValid = await bcrypt.compare(data.developerPassword, developer.developerPassword);
            if (!isPasswordValid) {
                return errorResponse(res, "Invalid password", 400);
            }
            const token = jwt.sign({ _id: response.data?.data[0].Developer._id, email: response.data?.data[0].Developer.developerEmail }, process.env.AES_GCM_ENCRYPTION_KEY, process.env.JWT_TOKEN_SECRET, process.env.AES_GCM_ENCRYPTION_IV);
            return successResponse(res, {result: response.data.data[0].Developer, token}, "Developer logged in successfully");
        }
    }
    catch (error) {
        return errorResponse(res, error, error.statusCode || 400);
    }
};

module.exports = {
    LoginDeveloper
}