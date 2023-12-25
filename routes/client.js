const createNewClient = require("../controllers/Client/createNewClient");

const routesConfig = [
    {
        method: 'post',
        path: '/create',
        controller: createNewClient,
        middlewares: [],
        inputSchema: {
            key: 'CreateClientAPI',
            version: '1'
        },
        description: 'Create new client'
    }
];

module.exports = routesConfig;