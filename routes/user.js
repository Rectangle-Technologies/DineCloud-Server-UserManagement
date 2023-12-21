const { LoginUser } = require("../controllers/Authentication/login");
const { RegisterUser } = require("../controllers/Authentication/register");

const routesConfig = [
    {
        method: 'post',
        path: '/login',
        controller: LoginUser,
        middleware: [],
        inputSchema: {
            key: 'LoginAPI',
            version: '1'
        },
        description: 'Login user'
    },
    {
        method: 'post',
        path: '/register',
        controller: RegisterUser,
        middleware: [],
        inputSchema: {
            key: 'RegisterAPI',
            version: '1'
        },
        description: 'Register user'
    }
];

module.exports = routesConfig;