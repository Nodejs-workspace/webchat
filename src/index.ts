import path, { join } from "path";
import { config } from "dotenv";
config({ path: join(__dirname, "../..", ".env") });

import express from "express";
import expressLayouts from "express-ejs-layouts";
import session from "express-session";

import helmet from "helmet";
import morgan from "morgan";

import constants from "./constants";
import serverConfig from "./constants/serverConfig";
import SocketContext from "./contexts/socket";
import MongoDB from "./databases";
import logger from "./helpers/logger";
import { ErrorMiddleware } from "./middlewares/error";
import apiRoute from "./routes/apis";
import viewRoute from "./routes/views";

const app = express();
const port = serverConfig.PORT;
const dbUrl = serverConfig.DATABASE_URL;

MongoDB.connect(dbUrl);

// middleware
app.use(helmet.hsts({ maxAge: 123456 }));
app.use(express.json());
app.use(express.urlencoded({ extended: false, limit: "50mb" }));
app.use(morgan("dev"));

// set up express sessions
app.use(session(constants.EXPRESS_SESSION()));

// view engine setup for ejs
app.set("views", path.join(__dirname, "..", "..", "views"));
app.use(expressLayouts);
app.set("view engine", "ejs");

// set up public, api, and view routes
app.use(constants.ROUTER_PATH.PUBLIC, express.static("public"));
app.use(constants.ROUTER_PATH.PUBLIC, ErrorMiddleware.apiErrorHandle);

// API Routes
app.use(constants.ROUTER_PATH.APIS.BASE_PATH, apiRoute);
app.use(constants.ROUTER_PATH.APIS.BASE_PATH, ErrorMiddleware.notFoundHandle);
app.use(constants.ROUTER_PATH.APIS.BASE_PATH, ErrorMiddleware.apiErrorHandle);

// View Routes
app.use(constants.ROUTER_PATH.VIEWS.INDEX, viewRoute);
app.use(constants.ROUTER_PATH.VIEWS.INDEX, ErrorMiddleware.notFoundHandle);
app.use(constants.ROUTER_PATH.VIEWS.INDEX, ErrorMiddleware.errorHandle);

const httpServer = app.listen(port, () => {
    try {
        logger.info(`Server is listening, http://localhost:${port}`);
    } catch (error) {
        console.log(error);
    }
});

(async () => {
    try {
        SocketContext.getServiceContext().initialize(httpServer);
    } catch (error) {
        logger.error(error);
    }
})();
