import { NextFunction, Response } from "express";

import HttpStatus from "http-status-codes";
import { Types } from "mongoose";

import constants from "../constants";
import errorConstants from "../constants/error";
import { IMessage, IMessageDocument } from "../databases/models/message";
import { RESPONSE_STATUS } from "../enums/responseStatus";
import logger from "../helpers/logger";
import { ExpressError } from "../helpers/expressError";
import MessageService from "../services/message";
import { ApiResponse, CustomAPIRequest } from "../types/customRequest";
import { EmptyObject } from "../types/emptyObect";
import { IdParam } from "../types/idParam";

export default class MessageController {
    private _messageService: MessageService;

    constructor(messageService: MessageService) {
        this._messageService = messageService;
    }

    async saveMessage(
        req: CustomAPIRequest<EmptyObject, ApiResponse<IMessageDocument | string>, IMessage, EmptyObject>,
        res: Response<ApiResponse<IMessageDocument | string>>,
        _next: NextFunction,
    ) {
        try {
            const dbMessage = await this._messageService.saveMessage(req.body);
            const response: ApiResponse<IMessageDocument> = {
                status: RESPONSE_STATUS.SUCCESS,
                message: constants.DEFAULTS.EMPTY.STRING(),
                data: dbMessage,
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

    async getMessageByGroupId(
        req: CustomAPIRequest<IdParam, ApiResponse<Array<IMessageDocument> | string>, EmptyObject, EmptyObject>,
        res: Response<ApiResponse<Array<IMessageDocument> | string>>,
        _next: NextFunction,
    ): Promise<Response<ApiResponse<Array<IMessageDocument>>> | void> {
        try {
            const groupId = req.params.id ?? constants.DEFAULTS.EMPTY.STRING();
            if (!groupId || !Types.ObjectId.isValid(groupId))
                throw new ExpressError(errorConstants.GROUP.VALID_GROUP_ID_REQUIRED, HttpStatus.BAD_REQUEST);
            const dbMessages = await this._messageService.getMessageByGroupId(groupId);
            const response: ApiResponse<Array<IMessageDocument>> = {
                status: RESPONSE_STATUS.SUCCESS,
                message: constants.DEFAULTS.EMPTY.STRING(),
                data: dbMessages,
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

    async getMessageByUserId(
        req: CustomAPIRequest<IdParam, ApiResponse<Array<IMessageDocument> | string>, EmptyObject, EmptyObject>,
        res: Response<ApiResponse<Array<IMessageDocument> | string>>,
        _next: NextFunction,
    ): Promise<Response<ApiResponse<Array<IMessageDocument>>> | void> {
        try {
            const userId = req.params.id ?? constants.DEFAULTS.EMPTY.STRING();
            if (!userId || !Types.ObjectId.isValid(userId))
                throw new ExpressError(errorConstants.USER.VALID_USER_ID_REQUIRED, HttpStatus.BAD_REQUEST);
            const dbMessages = await this._messageService.getMessageByGroupId(userId);
            const response: ApiResponse<Array<IMessageDocument>> = {
                status: RESPONSE_STATUS.SUCCESS,
                message: constants.DEFAULTS.EMPTY.STRING(),
                data: dbMessages,
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
}
