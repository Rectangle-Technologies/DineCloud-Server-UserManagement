const routers = [
    {
        path: '/healthCheck',
        router: require('./routes/healthCheck')
    },
    {
        path: '/user',
        router: require('./routes/user')
    },
    {
        path: '/client',
        router: require('./routes/client')
    },
    {
        path: "/developer",
        router: require("./routes/developer")
    }
];

module.exports = routers;