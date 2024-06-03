import { NextFunction, Response } from "express";

import HttpStatus from "http-status-codes";
import { Types } from "mongoose";

import errorConstants from "../constants/error";
import constants from "../constants";
import { IGroup, IGroupDocument } from "../databases/models/group";
import { RESPONSE_STATUS } from "../enums/responseStatus";
import { ExpressError } from "../helpers/expressError";
import GroupService from "../services/group";
import { IdParam } from "../types/idParam";
import {
    ApiResponse,
    CustomAPIRequest,
    CustomRequest,
    CustomSessionWithSessionData,
    RequestBody,
} from "../types/customRequest";
import { EmptyObject } from "../types/emptyObect";

export default class GroupController {
    private _groupService: GroupService;

    constructor(groupService: GroupService) {
        this._groupService = groupService;
    }

    async add(
        req: CustomAPIRequest<EmptyObject, ApiResponse<IGroupDocument>, RequestBody<IGroup>, EmptyObject>,
        res: Response<ApiResponse<IGroupDocument>>,
        next: NextFunction,
    ) {
        try {
            const dbGroup = await this._groupService.add(req.body);
            const response: ApiResponse<IGroupDocument> = {
                status: RESPONSE_STATUS.SUCCESS,
                message: constants.DEFAULTS.EMPTY.STRING(),
                data: dbGroup,
            };
            return res.status(HttpStatus.CREATED).send(response);
        } catch (error) {
            return next(error);
        }
    }

    async getGroups(
        _req: CustomAPIRequest<EmptyObject, ApiResponse<Array<IGroupDocument>>, EmptyObject, EmptyObject>,
        res: Response<ApiResponse<Array<IGroupDocument>>>,
        next: NextFunction,
    ) {
        try {
            const dbGroups = await this._groupService.getGroups();
            const response: ApiResponse<Array<IGroupDocument>> = {
                status: RESPONSE_STATUS.SUCCESS,
                message: constants.DEFAULTS.EMPTY.STRING(),
                data: dbGroups,
            };
            return res.status(HttpStatus.OK).send(response);
        } catch (error) {
            return next(error);
        }
    }

    async getGroupById(
        req: CustomAPIRequest<IdParam, ApiResponse<IGroupDocument>, EmptyObject, EmptyObject>,
        res: Response<ApiResponse<IGroupDocument>>,
        next: NextFunction,
    ) {
        try {
            const id = req.params.id ?? constants.DEFAULTS.EMPTY.STRING();
            if (!id || !Types.ObjectId.isValid(id))
                throw new ExpressError(errorConstants.GROUP.NOT_FOUND_BY_ID, HttpStatus.BAD_REQUEST);
            console.log(id);
            const dbGroup = await this._groupService.getGroupById(id);
            const response: ApiResponse<IGroupDocument> = {
                status: RESPONSE_STATUS.SUCCESS,
                message: constants.DEFAULTS.EMPTY.STRING(),
                data: dbGroup,
            };
            return res.status(HttpStatus.OK).send(response);
        } catch (error) {
            return next(error);
        }
    }

    async deleteByGroupId(
        req: CustomAPIRequest<IdParam, ApiResponse<IGroupDocument>, EmptyObject, EmptyObject>,
        res: Response<ApiResponse<IGroupDocument>>,
        next: NextFunction,
    ) {
        try {
            const id = req.params.id ?? constants.DEFAULTS.EMPTY.STRING();
            if (!id || !Types.ObjectId.isValid(id))
                throw new ExpressError(errorConstants.GROUP.NOT_FOUND_BY_ID, HttpStatus.BAD_REQUEST);

            const dbGroup = await this._groupService.deleteGroupById(id);
            const response: ApiResponse<IGroupDocument> = {
                status: RESPONSE_STATUS.SUCCESS,
                message: constants.DEFAULTS.EMPTY.STRING(),
                data: dbGroup,
            };
            return res.status(HttpStatus.OK).send(response);
        } catch (error) {
            return next(error);
        }
    }

    async getUsersRoomsGroupsView(req: CustomRequest, res: Response, _next: NextFunction) {
        const { dbUser } = <CustomSessionWithSessionData>req.session;
        const siteUrl = `${req.protocol}://${req.get("host")}`;
        try {
            const id = req.params.id ?? constants.DEFAULTS.EMPTY.STRING();
            if (!id || !Types.ObjectId.isValid(id))
                throw new ExpressError(errorConstants.ROOM.NOT_FOUND_BY_ID, HttpStatus.BAD_REQUEST);
            const groups = await this._groupService.getGroupsByRoomIdView(id);
            return res.render("groups", {
                title: constants.DEFAULTS.EMPTY.STRING(),
                groups,
                origin: siteUrl,
                user: dbUser,
            });
        } catch (error) {
            return res.render("groups", {
                title: constants.DEFAULTS.EMPTY.STRING(),
                groups: constants.DEFAULTS.EMPTY.OBJECT(),
                origin: siteUrl,
                user: dbUser,
            });
        }
    }
}
