const startTimestamp = new Date().getTime();

// importing modules
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const morgan = require('morgan');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const cluster = require('cluster');
const JSONschemaCore = require('./models/JSONschemaCore');
const authenticateUserMiddleware = require('./middlewares/authenticate');
const { validateSchemaMiddleware } = require('./middlewares/validateBodyData');

// configuring dotenv
require('dotenv').config();

// creating express object
const app = express();

// configuring morgan
if (process.env.NODE_ENV === 'development') {
    var accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' })
    app.use(morgan('dev', { stream: accessLogStream }));
    app.use(morgan('dev'));
} else {
    var accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' })
    app.use(morgan('combined', { stream: accessLogStream }));
    app.use(morgan('combined'));
}

// Create table containg all routes
var Table = require('cli-table');
var table = new Table({
    head: ['Method', 'Path', 'Description']
});

var generatedSchema = {}
var generatedRoutes = {}

// TODO: Cluster config

// using body-parser middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());
app.use('/api', authenticateUserMiddleware, validateSchemaMiddleware(generatedSchema, generatedRoutes))

const routers = require('./routers');

// Function to check schema
const checkSchema = async (route) => {
    const schemaKey = route.inputSchema.key;
    const version = route.inputSchema.version;
    const schemaIdentifier = `${schemaKey}_${version}`;

    const schemaResponse = await JSONschemaCore.findOne({ key: schemaKey, version: version });

    if (!generatedSchema[schemaIdentifier]) {
        generatedSchema[schemaIdentifier] = schemaResponse.schema;
    }

    if (!schemaResponse) {
        throw new Error('Schema not found');
    }

    if (!generatedRoutes[route.path]) {
        generatedRoutes[route.path] = route;
    }
}

// Function to generate routers
const generateRouters = async (routers) => {
    for (var routerIndex in routers) {
        const router = routers[routerIndex];
        for (var routeIndex in router.router) {
            const Router = express.Router();
            const route = router.router[routeIndex];

            if (process.env.FEATURE_API_INPUT_SCHEMA_VALIDATION === 'true') {
                checkSchema(route)
            }

            // Creating single router
            Router[route.method](route.path, [...route.middlewares], route.controller);

            // Adding route to table
            table.push([route.method, '/api' + router.path + route.path, route.description]);

            // Adding router to app
            app.use(`/api${router.path}`, Router);
        }
    }
}

// Function to start server
const startServer = async () => {
    try {
        // Connecting to database
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to database');

        // Creating routers
        await generateRouters(routers);
        console.log('Routers created');

        // listening to port 
        const port = process.env.PORT || 3000;
        app.listen(port, () => {
            console.log(`Listening to port ${port}`);
            console.log(table.toString());
            const endTimestamp = new Date().getTime();
            const timeTaken = endTimestamp - startTimestamp;
            console.log(`Time taken to start server: ${timeTaken} ms`);
        });

    } catch (err) {
        console.log(err);
    }
};

try {
    startServer();
} catch (err) {
    console.log('Error starting server');
    console.log(err);
}