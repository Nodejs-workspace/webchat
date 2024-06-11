import { NextFunction, Response } from "express";

import HttpStatus from "http-status-codes";

import constants from "../constants";
import { IUser, IUserDocument } from "../databases/models/user";
import LoginDTO from "../dtos/login";
import { RESPONSE_STATUS } from "../enums/responseStatus";
import { EmptyObject } from "../types/emptyObject";
import LoginService from "../services/login";
import { ApiResponse, CustomAPIRequest, ISessionUser } from "../types/customRequest";

export default class LoginController {
    private readonly _loginService: LoginService;

    constructor(loginService: LoginService) {
        this._loginService = loginService;
    }

    public async loginUser(
        req: CustomAPIRequest<EmptyObject, ApiResponse<IUserDocument>, IUser, EmptyObject>,
        res: Response<ApiResponse<IUserDocument>>,
        next: NextFunction,
    ) {
        try {
            const userRequest = new LoginDTO(req.body);
            const dbUser = await this._loginService.login(userRequest);
            req.session.dbUser = dbUser;
            req.session.user = <ISessionUser>{ email: dbUser.email, password: dbUser.password, name: dbUser.name };
            const response: ApiResponse<IUserDocument> = {
                status: RESPONSE_STATUS.SUCCESS,
                message: constants.DEFAULTS.EMPTY.STRING(),
                data: dbUser,
            };
            return res.status(HttpStatus.ACCEPTED).send(response);
        } catch (error) {
            return next(error);
        }
    }
}
