const createNewClient = require("../controllers/Client/createNewClient");

const routesConfig = [
    {
        method: 'post',
        path: '/create',
        controller: createNewClient,
        middleware: [],
        inputSchema: {
            key: 'CreateClientAPI',
            version: '1'
        },
        description: 'Create new client'
    }
];

module.exports = routesConfig;