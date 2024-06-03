import { Router } from "express";

import constants from "../../../constants";
import userApiRoutesV1 from "./user";
import groupApiRoutesV1 from "./group";
import loginApiRoutesV1 from "./login";

const apiRoutesV1 = Router();

apiRoutesV1.use(constants.ROUTER_PATH.APIS.USERS, userApiRoutesV1);
apiRoutesV1.use(constants.ROUTER_PATH.APIS.GROUPS, groupApiRoutesV1);
apiRoutesV1.use(constants.ROUTER_PATH.APIS.LOGIN, loginApiRoutesV1);

export default apiRoutesV1;
