import { Response, NextFunction, Request } from "express";

import HttpStatus from "http-status-codes";
import { Types } from "mongoose";

import constants from "../constants";
import errorConstants from "../constants/error";
import { IUser, IUserDocument } from "../databases/models/user";
import UserDTO from "../dtos/user";
import { RESPONSE_STATUS } from "../enums/responseStatus";
import logger from "../helpers/logger";
import { ExpressError } from "../helpers/expressError";
import UserService from "../services/user";
import { ApiResponse, CustomAPIRequest } from "../types/customRequest";
import { EmptyObject } from "../types/emptyObect";
import { IdParam } from "../types/idParam";
import { EmailParam } from "../types/emailParam";

export default class UserController {
    private readonly _userService: UserService;

    constructor(userService: UserService) {
        this._userService = userService;
    }

    async addUser(
        req: CustomAPIRequest<EmptyObject, ApiResponse<IUserDocument | string>, IUser, EmptyObject>,
        res: Response<ApiResponse<IUserDocument | string>>,
        _next: NextFunction,
    ): Promise<Response<ApiResponse<IUserDocument>> | void> {
        try {
            const userData = new UserDTO(req.body);
            const dbUser = await this._userService.add(userData);
            const response: ApiResponse<IUserDocument> = {
                status: RESPONSE_STATUS.SUCCESS,
                message: constants.DEFAULTS.EMPTY.STRING(),
                data: dbUser,
            };
            return res.status(HttpStatus.CREATED).send(response);
        } catch (error) {
            logger.error(error);
            const response: ApiResponse<string> = {
                status: RESPONSE_STATUS.FAILED,
                message: constants.DEFAULTS.EMPTY.STRING(),
                data: (<ExpressError>error).message,
            };
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(response);
        }
    }

    async updateUserById(
        req: CustomAPIRequest<IdParam, ApiResponse<IUserDocument | string>, IUser, EmptyObject>,
        res: Response<ApiResponse<IUserDocument | string>>,
        _next: NextFunction,
    ): Promise<Response<ApiResponse<IUserDocument | string>>> {
        try {
            const id = req.params.id ?? constants.DEFAULTS.EMPTY.STRING();
            if (!id || !Types.ObjectId.isValid(id))
                throw new ExpressError(errorConstants.USER.NOT_FOUND_BY_ID, HttpStatus.NOT_FOUND);
            const dbUser = await this._userService.updateUserById(id, req.body);
            const response: ApiResponse<IUserDocument> = {
                status: RESPONSE_STATUS.SUCCESS,
                message: constants.DEFAULTS.EMPTY.STRING(),
                data: dbUser,
            };
            return res.status(HttpStatus.ACCEPTED).send(response);
        } catch (error) {
            logger.error(error);
            const response: ApiResponse<string> = {
                status: RESPONSE_STATUS.FAILED,
                message: constants.DEFAULTS.EMPTY.STRING(),
                data: (<ExpressError>error).message,
            };
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(response);
        }
    }

    async getUsers(
        _req: CustomAPIRequest<EmptyObject, ApiResponse<Array<IUserDocument> | string>, EmptyObject, EmptyObject>,
        res: Response<ApiResponse<Array<IUserDocument> | string>>,
        _next: NextFunction,
    ): Promise<Response<ApiResponse<Array<IUserDocument> | string>>> {
        try {
            const dbUsers = await this._userService.getUsers();
            const response: ApiResponse<Array<IUserDocument>> = {
                status: RESPONSE_STATUS.SUCCESS,
                message: constants.DEFAULTS.EMPTY.STRING(),
                data: dbUsers,
            };
            return res.status(HttpStatus.OK).send(response);
        } catch (error) {
            logger.error(error);
            const response: ApiResponse<string> = {
                status: RESPONSE_STATUS.FAILED,
                message: constants.DEFAULTS.EMPTY.STRING(),
                data: (<ExpressError>error).message,
            };
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(response);
        }
    }

    async getUserById(
        req: CustomAPIRequest<IdParam, ApiResponse<IUserDocument | string>, EmptyObject, EmptyObject>,
        res: Response<ApiResponse<IUserDocument | string>>,
        _next: NextFunction,
    ): Promise<Response<ApiResponse<IUserDocument | string>>> {
        try {
            const id = req.params.id ?? constants.DEFAULTS.EMPTY.STRING();
            if (!id || !Types.ObjectId.isValid(id))
                throw new ExpressError(errorConstants.USER.NOT_FOUND_BY_ID, HttpStatus.NOT_FOUND);
            const dbUser = await this._userService.getUserById(id);
            const response: ApiResponse<IUserDocument> = {
                status: RESPONSE_STATUS.SUCCESS,
                message: constants.DEFAULTS.EMPTY.STRING(),
                data: dbUser,
            };
            return res.status(HttpStatus.OK).send(response);
        } catch (error) {
            logger.error(error);
            const response: ApiResponse<string> = {
                status: RESPONSE_STATUS.FAILED,
                message: constants.DEFAULTS.EMPTY.STRING(),
                data: (<ExpressError>error).message,
            };
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(response);
        }
    }

    async getUserByEmail(
        req: CustomAPIRequest<EmailParam, ApiResponse<IUserDocument | string>, EmptyObject, EmptyObject>,
        res: Response<ApiResponse<IUserDocument | string>>,
        _next: NextFunction,
    ): Promise<Response<ApiResponse<IUserDocument | string>>> {
        try {
            const email = req.params.email;
            const dbUser = await this._userService.getUserByEmail(email);
            const response: ApiResponse<IUserDocument> = {
                status: RESPONSE_STATUS.SUCCESS,
                message: constants.DEFAULTS.EMPTY.STRING(),
                data: dbUser,
            };
            return res.status(HttpStatus.OK).send(response);
        } catch (error) {
            logger.error(error);
            const response: ApiResponse<string> = {
                status: RESPONSE_STATUS.FAILED,
                message: constants.DEFAULTS.EMPTY.STRING(),
                data: (<ExpressError>error).message,
            };
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(response);
        }
    }

    async getUserProfilePicById(
        req: CustomAPIRequest<IdParam, ApiResponse<string>, EmptyObject, EmptyObject>,
        res: Response<ApiResponse<string>>,
        _next: NextFunction,
    ): Promise<Response<ApiResponse<string>>> {
        try {
            const id = req.params.id ?? constants.DEFAULTS.EMPTY.STRING();
            if (!id || !Types.ObjectId.isValid(id))
                throw new ExpressError(errorConstants.USER.VALID_USER_ID_REQUIRED, HttpStatus.BAD_REQUEST);
            const profilePicture = await this._userService.getUserProfilePicById(id);
            const response: ApiResponse<string> = {
                status: RESPONSE_STATUS.SUCCESS,
                message: constants.DEFAULTS.EMPTY.STRING(),
                data: profilePicture,
            };
            return res.status(HttpStatus.OK).send(response);
        } catch (error) {
            logger.error(error);
            const response: ApiResponse<string> = {
                status: RESPONSE_STATUS.FAILED,
                message: constants.DEFAULTS.EMPTY.STRING(),
                data: (<ExpressError>error).message,
            };
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(response);
        }
    }

    async uploadByUserImageId(
        req: Request,
        res: Response<ApiResponse<string>>,
        _next: NextFunction,
    ): Promise<Response<ApiResponse<string>>> {
        try {
            const id = req.params.id ?? constants.DEFAULTS.EMPTY.STRING();

            if (!id || !Types.ObjectId.isValid(id))
                throw new ExpressError(errorConstants.USER.VALID_USER_ID_REQUIRED, HttpStatus.BAD_REQUEST);
            if (!req.file)
                throw new ExpressError(errorConstants.USER.IMAGE_NOT_FOUND_FOR_PROFILE_PICTURE, HttpStatus.NOT_FOUND);

            const profilePicture = await this._userService.uploadByUserImageId(id, req.file.buffer);
            const response: ApiResponse<string> = {
                status: RESPONSE_STATUS.SUCCESS,
                message: constants.DEFAULTS.EMPTY.STRING(),
                data: profilePicture,
            };
            return res.status(HttpStatus.ACCEPTED).send(response);
        } catch (error) {
            logger.error(error);
            const response: ApiResponse<string> = {
                status: RESPONSE_STATUS.FAILED,
                message: constants.DEFAULTS.EMPTY.STRING(),
                data: (<ExpressError>error).message,
            };
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(response);
        }
    }
}
