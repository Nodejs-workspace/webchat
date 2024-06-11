import { Router } from "express";

import constants from "../../../constants";
import RoomContext from "../../../contexts/room";
import { IRoomDocument } from "../../../databases/models/room";
import { ApiResponse, PathParams, QueryParams, RequestBody } from "../../../types/customRequest";
import { IdParam } from "../../../types/idParam";

const roomApiRoutesV1 = Router();

roomApiRoutesV1.get<PathParams<IdParam>, ApiResponse<IRoomDocument | string>, RequestBody, QueryParams>(
    `${constants.ROUTER_PATH.APIS.ID_PARAM}${constants.ROUTER_PATH.APIS.USER}`,
    (...arg) => RoomContext.getControllerContext().addUserInRoom(...arg),
);
roomApiRoutesV1.get<PathParams<IdParam>, ApiResponse<IRoomDocument | string>, RequestBody, QueryParams>(
    constants.ROUTER_PATH.APIS.ID_PARAM,
    (...arg) => RoomContext.getControllerContext().getRoomById(...arg),
);
roomApiRoutesV1.get<PathParams, ApiResponse<Array<IRoomDocument> | string>, RequestBody, QueryParams>(
    constants.ROUTER_PATH.APIS.INDEX,
    (...arg) => RoomContext.getControllerContext().getRooms(...arg),
);
roomApiRoutesV1.delete<PathParams<IdParam>, ApiResponse<IRoomDocument | string>, RequestBody, QueryParams>(
    constants.ROUTER_PATH.APIS.ID_PARAM,
    (...arg) => RoomContext.getControllerContext().deleteRoomById(...arg),
);
roomApiRoutesV1.post<PathParams, ApiResponse<IRoomDocument | string>, RequestBody<IRoomDocument>, QueryParams>(
    constants.ROUTER_PATH.APIS.INDEX,
    (...arg) => RoomContext.getControllerContext().addRoom(...arg),
);

export default roomApiRoutesV1;
