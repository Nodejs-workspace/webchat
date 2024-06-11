import { Router } from "express";

import constants from "../../../constants";
import GroupContext from "../../../contexts/group";
import { IGroup, IGroupDocument } from "../../../databases/models/group";
import { IdParam } from "../../../types/idParam";
import { ApiResponse, PathParams, QueryParams, RequestBody } from "../../../types/customRequest";

const groupApiRoutesV1 = Router();

groupApiRoutesV1.get<PathParams<IdParam>, ApiResponse<IGroupDocument | string>, RequestBody, QueryParams>(
    constants.ROUTER_PATH.APIS.ID_PARAM,
    (...arg) => GroupContext.getControllerContext().getGroupById(...arg),
);
groupApiRoutesV1.delete<PathParams<IdParam>, ApiResponse<IGroupDocument | string>, RequestBody, QueryParams>(
    constants.ROUTER_PATH.APIS.ID_PARAM,
    (...arg) => GroupContext.getControllerContext().deleteByGroupId(...arg),
);
groupApiRoutesV1.post<PathParams, ApiResponse<IGroupDocument | string>, RequestBody<IGroup>, QueryParams>(
    constants.ROUTER_PATH.APIS.INDEX,
    (...arg) => GroupContext.getControllerContext().add(...arg),
);
groupApiRoutesV1.get<PathParams, ApiResponse<Array<IGroupDocument> | string>, RequestBody, QueryParams>(
    constants.ROUTER_PATH.APIS.INDEX,
    (...arg) => GroupContext.getControllerContext().getGroups(...arg),
);

export default groupApiRoutesV1;
