const Client = require("../../models/Client");
const { generateClientCode } = require("../../utils/generateClientCode");

const { successResponse, errorResponse } = require('../../utils/response');

const createNewClient = async (req, res) => {
    const data = req.body;
    data.code = generateClientCode().toUpperCase();

    try {
        const clientCheck = await Client.findOne({ name: data.name });
        if (clientCheck) {
            throw new Error("Client already exists");
        }
        
        const client = await Client.create(data);
        successResponse(res, client, 201);
    } catch (error) {
        errorResponse(res, error.message, error.statusCode || 400);
    }
}

module.exports = createNewClient;