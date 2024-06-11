import { Router } from "express";

import constants from "../../../constants";
import userApiRoutesV1 from "./user";
import groupApiRoutesV1 from "./group";
import loginApiRoutesV1 from "./login";
import roomApiRoutesV1 from "./room";
import AuthContext from "../../../contexts/auth";
import messageApiRouteV1 from "./messages";

const apiRoutesV1 = Router();

// NOTE: API to verify the user login.
apiRoutesV1.use(constants.ROUTER_PATH.APIS.LOGIN, loginApiRoutesV1);

// NOTE: The API requires authentication.
apiRoutesV1.use(
    constants.ROUTER_PATH.APIS.USERS,
    (...arg) => AuthContext.getMiddlewareContext().checkAuthForAPI(...arg),
    userApiRoutesV1,
);
apiRoutesV1.use(
    constants.ROUTER_PATH.APIS.GROUPS,
    (...arg) => AuthContext.getMiddlewareContext().checkAuthForAPI(...arg),
    groupApiRoutesV1,
);
apiRoutesV1.use(
    constants.ROUTER_PATH.APIS.ROOMS,
    (...arg) => AuthContext.getMiddlewareContext().checkAuthForAPI(...arg),
    roomApiRoutesV1,
);
apiRoutesV1.use(
    constants.ROUTER_PATH.APIS.MESSAGES,
    (...arg) => AuthContext.getMiddlewareContext().checkAuthForAPI(...arg),
    messageApiRouteV1,
);

export default apiRoutesV1;
