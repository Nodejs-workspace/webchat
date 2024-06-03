import { NextFunction, Response } from "express";

import HttpStatus from "http-status-codes";
import { Types } from "mongoose";

import constants from "../constants";
import errorConstants from "../constants/error";
import { IMessage, IMessageDocument } from "../databases/models/message";
import { RESPONSE_STATUS } from "../enums/responseStatus";
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
        req: CustomAPIRequest<EmptyObject, ApiResponse<IMessageDocument>, IMessage, EmptyObject>,
        res: Response<ApiResponse<IMessageDocument>>,
        next: NextFunction,
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
            return next(error);
        }
    }

    async getMessageByGroupId(
        req: CustomAPIRequest<IdParam, ApiResponse<Array<IMessageDocument>>, EmptyObject, EmptyObject>,
        res: Response<ApiResponse<Array<IMessageDocument>>>,
        next: NextFunction,
    ) {
        try {
            const groupId = req.params.id ?? constants.DEFAULTS.EMPTY.STRING();
            if (!groupId || !Types.ObjectId.isValid(groupId))
                throw new ExpressError(errorConstants.GROUP.VALID_ID_REQUIRED, HttpStatus.BAD_REQUEST);
            const dbMessages = await this._messageService.getMessageByGroupId(groupId);
            const response: ApiResponse<Array<IMessageDocument>> = {
                status: RESPONSE_STATUS.SUCCESS,
                message: constants.DEFAULTS.EMPTY.STRING(),
                data: dbMessages,
            };
            return res.status(HttpStatus.OK).send(response);
        } catch (error) {
            return next(error);
        }
    }

    async getMessageByUserId(
        req: CustomAPIRequest<IdParam, ApiResponse<Array<IMessageDocument>>, EmptyObject, EmptyObject>,
        res: Response<ApiResponse<Array<IMessageDocument>>>,
        next: NextFunction,
    ) {
        try {
            const userId = req.params.id ?? constants.DEFAULTS.EMPTY.STRING();
            if (!userId || !Types.ObjectId.isValid(userId))
                throw new ExpressError(errorConstants.USER.VALID_ID_REQUIRED, HttpStatus.BAD_REQUEST);
            const dbMessages = await this._messageService.getMessageByGroupId(userId);
            const response: ApiResponse<Array<IMessageDocument>> = {
                status: RESPONSE_STATUS.SUCCESS,
                message: constants.DEFAULTS.EMPTY.STRING(),
                data: dbMessages,
            };
            return res.status(HttpStatus.OK).send(response);
        } catch (error) {
            return next(error);
        }
    }
}
