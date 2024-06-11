import { Router } from "express";

import constants from "../../../../constants";
import MessageContext from "../../../../contexts/message";
import { IMessage, IMessageDocument } from "../../../../databases/models/message";
import messageGroupApiRouteV1 from "./group";
import { ApiResponse, PathParams, QueryParams, RequestBody } from "../../../../types/customRequest";
import messageUserApiRouteV1 from "./user";

const messageApiRouteV1 = Router();

messageApiRouteV1.use(constants.ROUTER_PATH.APIS.GROUPS, messageGroupApiRouteV1);
messageApiRouteV1.use(constants.ROUTER_PATH.APIS.USERS, messageUserApiRouteV1);
messageApiRouteV1.post<PathParams, ApiResponse<IMessageDocument | string>, RequestBody<IMessage>, QueryParams>(
    constants.ROUTER_PATH.APIS.INDEX,
    (...arg) => MessageContext.getControllerContext().saveMessage(...arg),
);

export default messageApiRouteV1;
