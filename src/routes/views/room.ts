import { Router } from "express";

import RoomContext from "../../contexts/room";
import constants from "../../constants";
import GroupContext from "../../contexts/group";

const roomViewRoutes = Router();

roomViewRoutes.get(constants.ROUTER_PATH.VIEWS.INDEX, async (...arg) =>
    RoomContext.getControllerContext().getUsersRoomsView(...arg),
);
roomViewRoutes.get(constants.ROUTER_PATH.VIEWS.ID_PARAM, (...arg) =>
    GroupContext.getControllerContext().getUsersRoomsGroupsView(...arg),
);

export default roomViewRoutes;
