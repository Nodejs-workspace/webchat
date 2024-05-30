import { NextFunction, Response } from "express";

import HttpStatus from "http-status-codes";

import errorConstants from "../constants/error";
import { RESPONSE_STATUS } from "../enums/responseStatus";
import logger from "../helpers/logger";
import { ExpressError } from "../helpers/expressError";
import { ApiResponse, CustomAPIRequest, CustomRequest, CustomSessionWithSessionData } from "../types/customRequest";
import { EmptyObject } from "../types/emptyObect";
import UserService from "../services/user";

export default class AuthMiddleware {
    private readonly _userService: UserService;

    constructor(userService: UserService) {
        this._userService = userService;
    }

    public async checkAuthForAPI<
        path = EmptyObject,
        response = EmptyObject | string,
        request = EmptyObject,
        query = EmptyObject,
    >(
        req: CustomAPIRequest<path, ApiResponse<response | string>, request, query>,
        res: Response<ApiResponse<response | string>>,
        next: NextFunction,
    ) {
        try {
            const { user } = <CustomSessionWithSessionData>req.session;
            if (user) return next();
            throw new ExpressError(errorConstants.USER.NOT_FOUND_BY_ID, HttpStatus.UNAUTHORIZED);
        } catch (error) {
            logger.error(error);
            const status = (<ExpressError>error).status ?? HttpStatus.BAD_REQUEST;
            const response: ApiResponse<string> = {
                status: RESPONSE_STATUS.FAILED,
                message: errorConstants.AUTH.UNAUTHORIZED,
                data: (<ExpressError>error).message,
            };
            return res.status(status).send(response);
        }
    }

    async checkAuth(req: CustomRequest, _res: Response, next: NextFunction) {
        // const siteUrl = `${req.protocol}://${req.get("host")}`;
        try {
            const { user } = <CustomSessionWithSessionData>req.session;
            if (user) return next();
            throw new ExpressError(errorConstants.AUTH.UNAUTHORIZED, HttpStatus.UNAUTHORIZED);
        } catch (error) {
            return next(error);
        }
    }

    async addDbUserToSession(req: CustomRequest, _res: Response, next: NextFunction) {
        try {
            const {
                user: { email },
            } = <CustomSessionWithSessionData>req.session;

            const dbUser = await this._userService.getUserByEmail(email);
            req.session.dbUser = dbUser;
            return next();
        } catch (error) {
            logger.error(error);
            return next(error);
        }
    }
}
