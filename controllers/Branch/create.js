const { saveDataByModel } = require("../../utils/interServerComms")
const { errorResponse, successResponse } = require("../../utils/response")

exports.CreateBranch = async (req, res) => {
    try {
        const response = await saveDataByModel("Branch", req.body, req.headers.authorization)

        successResponse(res, response.data.data, "Branch created successfully")
    } catch (error) {
        const errorObject = error?.response?.data || error
        errorResponse(res, errorObject, error?.response?.status || 500)
    }
}