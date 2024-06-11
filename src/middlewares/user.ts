import { NextFunction, Response } from "express";

import HttpStatus from "http-status-codes";

import errorConstants from "../constants/error";
import { RESPONSE_STATUS } from "../enums/responseStatus";
import logger from "../helpers/logger";
import UserService from "../services/user";
import { EmptyObject } from "../types/emptyObject";
import { ApiResponse, CustomAPIRequest, CustomSessionWithSessionData } from "../types/customRequest";

export default class UserMiddleware {
    private readonly _userService: UserService;

    constructor(userService: UserService) {
        this._userService = userService;
    }

    public async addDbUserToSessionForAPI(
        req: CustomAPIRequest<EmptyObject, ApiResponse, EmptyObject, EmptyObject>,
        res: Response<ApiResponse>,
        next: NextFunction,
    ) {
        try {
            const { user } = <CustomSessionWithSessionData>req.session;

            if (user) {
                const dbUser = await this._userService.getUserByEmail(user.email);
                req.session.dbUser = dbUser;
                return next();
            }

            const status = HttpStatus.BAD_REQUEST;
            const response: ApiResponse = {
                message: errorConstants.AUTH.UNAUTHORIZED,
                status: RESPONSE_STATUS.FAILED,
                data: null,
            };
            return res.status(status).send(response);
        } catch (error) {
            logger.error(error);
            const status = HttpStatus.BAD_REQUEST;
            const response: ApiResponse = {
                message: errorConstants.AUTH.UNAUTHORIZED,
                status: RESPONSE_STATUS.FAILED,
                data: null,
            };
            return res.status(status).send(response);
        }
    }
}
