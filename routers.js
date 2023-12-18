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
    }
];

module.exports = routers;