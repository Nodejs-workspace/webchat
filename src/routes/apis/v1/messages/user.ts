import { Router } from "express";

import constants from "../../../../constants";
import MessageContext from "../../../../contexts/message";
import { IMessageDocument } from "../../../../databases/models/message";
import { IdParam } from "../../../../types/idParam";
import { ApiResponse, QueryParams, RequestBody } from "../../../../types/customRequest";

const messageUserApiRouteV1 = Router();

messageUserApiRouteV1.get<IdParam, ApiResponse<Array<IMessageDocument> | string>, RequestBody, QueryParams>(
    constants.ROUTER_PATH.APIS.ID_PARAM,
    (...arg) => MessageContext.getControllerContext().getMessageByUserId(...arg),
);

export default messageUserApiRouteV1;
