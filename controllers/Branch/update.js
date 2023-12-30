const { saveDataByModel } = require("../../utils/interServerComms")
const { errorResponse, successResponse } = require("../../utils/response")

exports.UpdateBranch = async (req, res) => {
    try {
        const id = req.query.id
        if (!id) {
            return errorResponse(res, { error: "Validation error", message: "id is required" }, 403)
        }

        const response = await saveDataByModel("Branch", { _id: id, ...req.body }, req.headers.authorization)

        return successResponse(res, response.data.data, "Branch updated successfully")
    } catch (error) {
        const errorObject = error?.response?.data || error
        if (errorObject.message === 'Model data not found') {
            errorObject.message = 'Branch not found'
            errorObject.error.message = 'Branch not found'
        }
        errorResponse(res, errorObject, error?.response?.status || 500)
    }
}