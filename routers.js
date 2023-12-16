const routers = [
    {
        path: '/api/healthCheck',
        router: require('./routes/healthCheck')
    },
    {
        path: '/api/user',
        router: require('./routes/user')
    }
];

module.exports = routers;