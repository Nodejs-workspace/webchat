import { Router } from "express";

import UserContext from "../../../contexts/user";
import constants from "../../../constants";
import { IUser, IUserDocument } from "../../../databases/models/user";
import MulterMiddleware from "../../../middlewares/multer";
import { IdParam } from "../../../types/idParam";
import { ApiResponse, PathParams, QueryParams, RequestBody } from "../../../types/customRequest";
import { EmailParam } from "../../../types/emailParam";

const userApiRoutesV1 = Router();

userApiRoutesV1.get<PathParams<EmailParam>, ApiResponse<IUserDocument | string>, RequestBody, QueryParams>(
    constants.ROUTER_PATH.APIS.USER_BY_EMAIL,
    (...arg) => UserContext.getControllerContext().getUserByEmail(...arg),
);
userApiRoutesV1.get<IdParam, ApiResponse<string>, RequestBody, QueryParams>(
    constants.ROUTER_PATH.APIS.USER_IMAGE_BY_ID,
    (...arg) => UserContext.getControllerContext().getUserProfilePicById(...arg),
);
userApiRoutesV1.post(
    constants.ROUTER_PATH.APIS.UPLOAD_IMAGE_BY_ID,
    MulterMiddleware.getInstance().uploadCsv(),
    (...arg) => UserContext.getControllerContext().uploadByUserImageId(...arg),
);
userApiRoutesV1.get<PathParams<IdParam>, ApiResponse<IUserDocument | string>, RequestBody, QueryParams>(
    constants.ROUTER_PATH.APIS.ID_PARAM,
    (...arg) => UserContext.getControllerContext().getUserById(...arg),
);
userApiRoutesV1.put<PathParams<IdParam>, ApiResponse<IUserDocument | string>, RequestBody<IUser>, QueryParams>(
    constants.ROUTER_PATH.APIS.ID_PARAM,
    (...arg) => UserContext.getControllerContext().updateUserById(...arg),
);
userApiRoutesV1.get<PathParams, ApiResponse<Array<IUserDocument> | string>, RequestBody, QueryParams>(
    constants.ROUTER_PATH.APIS.INDEX,
    (...arg) => UserContext.getControllerContext().getUsers(...arg),
);
userApiRoutesV1.post<PathParams, ApiResponse<IUserDocument | string>, RequestBody<IUser>, QueryParams>(
    constants.ROUTER_PATH.APIS.INDEX,
    (...arg) => UserContext.getControllerContext().addUser(...arg),
);

export default userApiRoutesV1;
