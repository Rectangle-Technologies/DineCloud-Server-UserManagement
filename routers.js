const routers = [
    {
        path: '/api/healthCheck',
        router: require('./routes/healthCheck')
    },
    {
        path: '/api/user',
        router: require('./routes/user')
    },
    {
        path: '/api/client',
        router: require('./routes/client')
    },
    {
        path: "/api/developer",
        router: require("./routes/developer")
    }
];

module.exports = routers;