import { NextFunction, Response } from "express";

import HttpStatus from "http-status-codes";

import RoomService from "../services/room";
import {
    ApiResponse,
    CustomAPIRequest,
    CustomRequest,
    CustomSessionWithSessionData,
    RequestBody,
} from "../types/customRequest";
import { EmptyObject } from "../types/emptyObect";
import { IRoom, IRoomDocument } from "../databases/models/room";
import { RESPONSE_STATUS } from "../enums/responseStatus";
import constants from "../constants";
import logger from "../helpers/logger";
import { ExpressError } from "../helpers/expressError";
import { IdParam } from "../types/idParam";
import { Types } from "mongoose";
import errorConstants from "../constants/error";

export default class RoomController {
    private readonly _roomService: RoomService;

    constructor(roomService: RoomService) {
        this._roomService = roomService;
    }

    async addRoom(
        req: CustomAPIRequest<EmptyObject, ApiResponse<IRoomDocument | string>, RequestBody<IRoom>, EmptyObject>,
        res: Response<ApiResponse<IRoomDocument | string>>,
        _next: NextFunction,
    ) {
        try {
            const dbRoom = await this._roomService.addRoom(req.body);
            const response: ApiResponse<IRoomDocument> = {
                status: RESPONSE_STATUS.SUCCESS,
                message: constants.DEFAULTS.EMPTY.STRING(),
                data: dbRoom,
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

    async getRooms(
        _req: CustomAPIRequest<EmptyObject, ApiResponse<Array<IRoomDocument> | string>, EmptyObject, EmptyObject>,
        res: Response<ApiResponse<Array<IRoomDocument> | string>>,
        _next: NextFunction,
    ) {
        try {
            const dbRooms = await this._roomService.getRooms();
            const response: ApiResponse<Array<IRoomDocument>> = {
                status: RESPONSE_STATUS.SUCCESS,
                message: constants.DEFAULTS.EMPTY.STRING(),
                data: dbRooms,
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

    async getRoomById(
        req: CustomAPIRequest<IdParam, ApiResponse<IRoomDocument | string>, RequestBody<EmptyObject>, EmptyObject>,
        res: Response<ApiResponse<IRoomDocument | string>>,
        _next: NextFunction,
    ): Promise<Response<ApiResponse<IRoomDocument | string>>> {
        try {
            const id = req.params.id ?? constants.DEFAULTS.EMPTY.STRING();
            if (!id || !Types.ObjectId.isValid(id))
                throw new ExpressError(errorConstants.ROOM.VALID_ID_REQUIRED, HttpStatus.BAD_REQUEST);
            const dbRoom = await this._roomService.getRoomById(id);
            const response: ApiResponse<IRoomDocument> = {
                status: RESPONSE_STATUS.SUCCESS,
                message: constants.DEFAULTS.EMPTY.STRING(),
                data: dbRoom,
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

    async deleteRoomById(
        req: CustomAPIRequest<IdParam, ApiResponse<IRoomDocument | string>, RequestBody<EmptyObject>, EmptyObject>,
        res: Response<ApiResponse<IRoomDocument | string>>,
        _next: NextFunction,
    ) {
        try {
            const id = req.params.id ?? constants.DEFAULTS.EMPTY.STRING();
            if (!id || !Types.ObjectId.isValid(id))
                throw new ExpressError(errorConstants.ROOM.VALID_ID_REQUIRED, HttpStatus.BAD_REQUEST);

            const dbRoom = await this._roomService.deleteRoomById(id);
            const response: ApiResponse<IRoomDocument> = {
                status: RESPONSE_STATUS.SUCCESS,
                message: constants.DEFAULTS.EMPTY.STRING(),
                data: dbRoom,
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

    async getUsersRoomsView(req: CustomRequest, res: Response, _next: NextFunction) {
        const siteUrl = `${req.protocol}://${req.get("host")}`;
        const { dbUser } = <CustomSessionWithSessionData>req.session;
        try {
            const rooms = await this._roomService.getRooms();

            return res.render("rooms", {
                title: constants.DEFAULTS.EMPTY.STRING(),
                rooms,
                origin: siteUrl,
                user: dbUser,
            });
        } catch (error) {
            return res.render("rooms", {
                title: constants.DEFAULTS.EMPTY.STRING(),
                rooms: constants.DEFAULTS.EMPTY.ARRAY(),
                origin: siteUrl,
                user: dbUser,
            });
        }
    }

    async addUserInRoom(
        req: CustomAPIRequest<IdParam, ApiResponse<IRoomDocument | string>, RequestBody<EmptyObject>, EmptyObject>,
        res: Response<ApiResponse<IRoomDocument | string>>,
        _next: NextFunction,
    ): Promise<Response<ApiResponse<IRoomDocument | string>> | void> {
        try {
            const { dbUser } = <CustomSessionWithSessionData>req.session;
            const id = req.params.id ?? constants.DEFAULTS.EMPTY.STRING();
            if (!id || !Types.ObjectId.isValid(id))
                throw new ExpressError(errorConstants.ROOM.VALID_ID_REQUIRED, HttpStatus.BAD_REQUEST);
            await this._roomService.addUserInRoom(id, dbUser);
            return res.status(HttpStatus.ACCEPTED).send();
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
