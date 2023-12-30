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
        path: '/branch',
        router: require('./routes/branch')
    }
];

module.exports = routers;