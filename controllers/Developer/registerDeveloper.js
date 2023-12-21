const bcrypt = require("bcryptjs");
const { saveDataByModel } = require("../../utils/interServerComms");

const { successResponse, errorResponse } = require("../../utils/response.js");

const RegisterDeveloper = async (req, res) => {
    const data = req.body;

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(data.developerPassword, salt);
    data.developerPassword = hashedPassword;

    try {
        const response = await saveDataByModel("Developer", req.body, req.headers.authorization)
        console.log(response.data || response.error.data);

        if (response.data) {
            return successResponse(res, response.data, "Developer registered successfully");
        }
    }
    catch (error) {
        return errorResponse(res, error, error.statusCode || 400);
    }
};

module.exports = {
    RegisterDeveloper
};