import { Router } from "express";

import constants from "../../constants";
import AuthContext from "../../contexts/auth";
import HomeContext from "../../contexts/home";
import profileViewRoute from "./profile";
import roomViewRoutes from "./room";
import userViewRoutes from "./user";

const viewRoutes = Router();

viewRoutes.use(
    constants.ROUTER_PATH.VIEWS.PROFILE,
    (...arg) => AuthContext.getMiddlewareContext().checkAuth(...arg),
    (...arg) => AuthContext.getMiddlewareContext().addDbUserToSession(...arg),
    profileViewRoute,
);
viewRoutes.use(
    constants.ROUTER_PATH.VIEWS.ROOMS,
    (...arg) => AuthContext.getMiddlewareContext().checkAuth(...arg),
    (...arg) => AuthContext.getMiddlewareContext().addDbUserToSession(...arg),
    roomViewRoutes,
);
viewRoutes.use(
    constants.ROUTER_PATH.VIEWS.USERS,
    (...arg) => AuthContext.getMiddlewareContext().checkAuth(...arg),
    (...arg) => AuthContext.getMiddlewareContext().addDbUserToSession(...arg),
    userViewRoutes,
);
viewRoutes.get(constants.ROUTER_PATH.VIEWS.INDEX, (...arg) => HomeContext.getControllerContext().getHomeView(...arg));

export default viewRoutes;
