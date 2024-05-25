import { Router } from "express";

import constants from "../../constants";
import apiRoutesV1 from "./v1";

const apiRoutes = Router();

apiRoutes.use(constants.ROUTER_PATH.APIS.V1, apiRoutesV1);

export default apiRoutes;
