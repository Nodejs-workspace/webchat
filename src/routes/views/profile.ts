import { Router } from "express";

import constants from "../../constants";
import ProfileContext from "../../contexts/profile";

const profileViewRoute = Router();

profileViewRoute.get(constants.ROUTER_PATH.VIEWS.INDEX, (...arg) =>
    ProfileContext.getControllerContext().getProfileView(...arg),
);

export default profileViewRoute;
