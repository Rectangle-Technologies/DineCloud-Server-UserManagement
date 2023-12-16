const { healthCheckController } = require("../controllers/healthCheck");

const routesConfig = [
    {
        method: 'get',
        path: '/manage',
        controller: healthCheckController,
        middleware: [],
        inputSchema: {
            key: 'HealthCheckAPI',
            version: '1'
        },
        description: 'server health check'
    }
]

module.exports = routesConfig;