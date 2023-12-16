const { LoginUser, LoginUserValidation } = require("../controllers/Authentication/login");
const { RegisterUser, RegisterUserValidation } = require("../controllers/Authentication/register");

const routesConfig = [
    {
        method: 'post',
        path: '/login',
        controller: LoginUser,
        middleware: [LoginUserValidation],
        inputSchema: {
            key: 'UserAPI',
            version: '1'
        },
        description: 'Login user'
    },
    {
        method: 'post',
        path: '/register',
        controller: RegisterUser,
        middleware: [RegisterUserValidation],
        inputSchema: {
            key: 'UserAPI',
            version: '1'
        },
        description: 'Register user'
    }
];

module.exports = routesConfig;