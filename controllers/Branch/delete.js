const { deleteModelDataById } = require("../../utils/interServerComms");
const { errorResponse, successResponse } = require("../../utils/response");

exports.DeleteBranch = async (req, res) => {
    try {
        const id = req.query.id;
        if (!id) {
            return errorResponse(res, { error: 'Validation error', message: 'id is required' }, 403);
        }

        const response = await deleteModelDataById('Branch', id, req.headers.authorization);

        if (response.data.data[0].Branch.deletedCount === 0) {
            return errorResponse(res, { error: 'Not found', message: 'Branch not found' }, 404);

        }

        successResponse(res, response.data.data, 'Branch deleted successfully');
    } catch (error) {
        const errorObject = error?.response?.data || error;
        errorResponse(res, errorObject, errorObject?.response?.status || 500);
    }
}