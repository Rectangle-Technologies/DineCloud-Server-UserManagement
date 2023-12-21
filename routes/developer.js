const { RegisterDeveloper } = require("../controllers/Developer/registerDeveloper");

const routesConfig = [
    // {
    //     method: 'post',
    //     path: '/login',
    //     controller: LoginUser,
    //     middleware: [],
    //     inputSchema: {
    //         key: 'LoginAPI',
    //         version: '1'
    //     },
    //     description: 'Login user'
    // },
    {
        method: 'post',
        path: '/registerDev',
        controller: RegisterDeveloper,
        middleware: [],
        inputSchema: {
            key: 'RegisterDeveloperAPI',
            version: '1'
        },
        description: 'Register developer'
    }
];

module.exports = routesConfig;