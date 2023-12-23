const { LoginDeveloper } = require("../controllers/Developer/loginDeveloper");
const { RegisterDeveloper } = require("../controllers/Developer/registerDeveloper");

const routesConfig = [
    {
        method: 'post',
        path: '/loginDev',
        controller: LoginDeveloper,
        middlewares: [],
        inputSchema: {
            key: 'LoginDeveloperAPI',
            version: '1'
        },
        description: 'Login developer'
    },
    {
        method: 'post',
        path: '/registerDev',
        controller: RegisterDeveloper,
        middlewares: [],
        inputSchema: {
            key: 'RegisterDeveloperAPI',
            version: '1'
        },
        description: 'Register developer'
    }
];

module.exports = routesConfig;