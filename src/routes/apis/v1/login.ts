import { Router } from "express";
import constants from "../../../constants";
import LoginContext from "../../../contexts/login";
import { ApiResponse, PathParams, QueryParams } from "../../../types/customRequest";
import { IUser, IUserDocument } from "../../../databases/models/user";

const loginApiRoutesV1 = Router();

loginApiRoutesV1.post<PathParams, ApiResponse<IUserDocument>, IUser, QueryParams>(
    constants.ROUTER_PATH.APIS.INDEX,
    (...arg) => LoginContext.getControllerContext().loginUser(...arg),
);

export default loginApiRoutesV1;
