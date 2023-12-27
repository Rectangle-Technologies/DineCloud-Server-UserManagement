const { generateClientCode } = require("../../utils/generateClientCode");
const { saveDataByModel, getModelDataByFilter } = require("../../utils/interServerComms");

const { successResponse, errorResponse } = require('../../utils/response');

const createNewClient = async (req, res) => {
    const data = req.body;
    data.code = generateClientCode().toUpperCase();

    try {
        const clientCheck = (await getModelDataByFilter('Client', { name: data.name }, req.token, { "Bypass-Key": process.env.BYPASS_KEY })).data.data[0].Client[0];
        if (clientCheck) {
            throw new Error('Client already exists');
        }

        const client = (await saveDataByModel('Client', data, req.token, { "Bypass-Key": process.env.BYPASS_KEY })).data.data[0].Client
        if (!client) {
            throw new Error('Unable to create client');
        }
        successResponse(res, client, 201);
    } catch (error) {
        errorResponse(res, error.message, error.statusCode || 400);
    }
}

module.exports = createNewClient;