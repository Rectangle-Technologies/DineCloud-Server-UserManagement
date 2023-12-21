// importing utils
const { successResponse, errorResponse } = require('../../utils/response');

const healthCheckController = async (req, res) => {
    try {
        return successResponse(res, null, "Health check successfull!! Server running OK!");
    } catch (error) {
        console.log(error);
        return errorResponse(res, error, 400);
    }
};

module.exports = {
    healthCheckController
};