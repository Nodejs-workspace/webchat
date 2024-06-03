import { NextFunction, Response } from "express";

import HttpStatus from "http-status-codes";
import { Types } from "mongoose";

import constants from "../constants";
import errorConstants from "../constants/error";
import { IRoom, IRoomDocument } from "../databases/models/room";
import { RESPONSE_STATUS } from "../enums/responseStatus";
import { ExpressError } from "../helpers/expressError";
import RoomService from "../services/room";
import { IdParam } from "../types/idParam";
import {
    ApiResponse,
    CustomAPIRequest,
    CustomRequest,
    CustomSessionWithSessionData,
    RequestBody,
} from "../types/customRequest";
import { EmptyObject } from "../types/emptyObect";

export default class RoomController {
    private readonly _roomService: RoomService;

    constructor(roomService: RoomService) {
        this._roomService = roomService;
    }

    async addRoom(
        req: CustomAPIRequest<EmptyObject, ApiResponse<IRoomDocument>, RequestBody<IRoom>, EmptyObject>,
        res: Response<ApiResponse<IRoomDocument>>,
        next: NextFunction,
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
            return next(error);
        }
    }

    async getRooms(
        _req: CustomAPIRequest<EmptyObject, ApiResponse<Array<IRoomDocument>>, EmptyObject, EmptyObject>,
        res: Response<ApiResponse<Array<IRoomDocument>>>,
        next: NextFunction,
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
            return next(error);
        }
    }

    async getRoomById(
        req: CustomAPIRequest<IdParam, ApiResponse<IRoomDocument>, RequestBody<EmptyObject>, EmptyObject>,
        res: Response<ApiResponse<IRoomDocument>>,
        next: NextFunction,
    ) {
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
            return next(error);
        }
    }

    async deleteRoomById(
        req: CustomAPIRequest<IdParam, ApiResponse<IRoomDocument>, RequestBody<EmptyObject>, EmptyObject>,
        res: Response<ApiResponse<IRoomDocument>>,
        next: NextFunction,
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
            return next(error);
        }
    }

    async getUsersRoomsView(req: CustomRequest, res: Response, _next: NextFunction) {
        const siteUrl = `${req.protocol}://${req.get("host")}`;
        const { dbUser } = <CustomSessionWithSessionData>req.session;
        const layout = "./layouts/rooms/index.layout.ejs";
        try {
            const rooms = await this._roomService.getRooms();
            const options = {
                layout,
                siteUrl,
                title: "Web Chat 2",
                rooms,
                user: dbUser,
            };

            return res.render("rooms/index", options);
        } catch (error) {
            const options = {
                layout,
                siteUrl,
                title: "Web Chat 2",
                rooms: constants.DEFAULTS.EMPTY.ARRAY<IRoomDocument>(),
                user: dbUser,
            };
            return res.render("rooms/index", options);
        }
    }

    async addUserInRoom(
        req: CustomAPIRequest<IdParam, ApiResponse<IRoomDocument>, RequestBody<EmptyObject>, EmptyObject>,
        res: Response<ApiResponse<IRoomDocument>>,
        next: NextFunction,
    ) {
        try {
            const { dbUser } = <CustomSessionWithSessionData>req.session;
            const id = req.params.id ?? constants.DEFAULTS.EMPTY.STRING();
            if (!id || !Types.ObjectId.isValid(id))
                throw new ExpressError(errorConstants.ROOM.VALID_ID_REQUIRED, HttpStatus.BAD_REQUEST);
            await this._roomService.addUserInRoom(id, dbUser);
            return res.status(HttpStatus.ACCEPTED).send();
        } catch (error) {
            return next(error);
        }
    }
}
