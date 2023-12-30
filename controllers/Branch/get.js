const { getModelDataByFilter, getModelDataById } = require("../../utils/interServerComms")
const { successResponse, errorResponse } = require("../../utils/response")

exports.GetAllBranches = async (req, res) => {
    try {
        const response = await getModelDataByFilter("Branch", {}, req.headers.authorization)

        successResponse(res, response.data.data, "Branches fetched successfully")
    } catch (error) {
        const errorObject = error?.response?.data || error
        errorResponse(res, errorObject, error?.response?.status || 500)
    }
}

exports.GetBranchById = async (req, res) => {
    try {
        const id = req.query.id
        if (!id) {
            return errorResponse(res, { error: "Validation error", message: "id is required" }, 403)
        }
        const response = await getModelDataById("Branch", id, req.headers.authorization)

        if (!response.data.data[0].Branch.length) {
            return errorResponse(res, { error: 'Not found', message: 'Branch not found' }, 404)
        }

        successResponse(res, response.data.data, "Branch fetched successfully")
    } catch (error) {
        const errorObject = error?.response?.data || error
        errorResponse(res, errorObject, error?.response?.status || 500)
    }
}