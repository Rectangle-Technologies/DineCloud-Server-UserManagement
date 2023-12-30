const { CreateBranch } = require("../controllers/Branch/create");
const { DeleteBranch } = require("../controllers/Branch/delete");
const { GetAllBranches, GetBranchById } = require("../controllers/Branch/get");
const { UpdateBranch } = require("../controllers/Branch/update");

const routesConfig = [
    {
        method: 'post',
        path: '/createBranch',
        controller: CreateBranch,
        middlewares: [],
        inputSchema: {
            key: 'CreateBranchAPI',
            version: '1'
        },
        description: 'Create a branch'
    },
    {
        method: 'get',
        path: '/getAllBranches',
        controller: GetAllBranches,
        middlewares: [],
        inputSchema: {
            key: 'HealthCheckAPI',
            version: '1'
        },
        description: 'Get all branches'
    },
    {
        method: 'get',
        path: '/getBranchById',
        controller: GetBranchById,
        middlewares: [],
        inputSchema: {
            key: 'HealthCheckAPI',
            version: '1'
        },
        description: 'Get branch by id'
    },
    {
        method: 'put',
        path: '/updateBranch',
        controller: UpdateBranch,
        middlewares: [],
        inputSchema: {
            key: 'CreateBranchAPI',
            version: '1'
        },
        description: 'Update branch'
    },
    {
        method: 'delete',
        path: '/deleteBranch',
        controller: DeleteBranch,
        middlewares: [],
        inputSchema: {
            key: 'HealthCheckAPI',
            version: '1'
        },
        description: 'Delete branch'
    }
]

module.exports = routesConfig;