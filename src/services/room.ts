import HttpStatus from "http-status-codes";

import errorConstants from "../constants/error";
import { IUserDocument } from "../databases/models/user";
import { IRoom, IRoomDocument } from "../databases/models/room";
import { ExpressError } from "../helpers/expressError";
import RoomRepository from "../repositories/room";
import UserService from "./user";

export default class RoomService {
    private readonly _roomRepository: RoomRepository;
    private readonly _userService: UserService;

    constructor(groupRepository: RoomRepository, userService: UserService) {
        this._roomRepository = groupRepository;
        this._userService = userService;
    }

    async addRoom(data: IRoom): Promise<IRoomDocument> {
        if (!data.name) throw new ExpressError(errorConstants.ROOM.NAME, HttpStatus.NOT_FOUND);

        return await this._roomRepository.addRoom(data);
    }

    async getRooms(): Promise<Array<IRoomDocument>> {
        const dbRoom = await this._roomRepository.getRooms();
        if (!dbRoom.length) throw new ExpressError(errorConstants.ROOM.NOT_FOUND_BY_ID, HttpStatus.NOT_FOUND);
        return dbRoom;
    }

    async deleteRoomById(id: string): Promise<IRoomDocument> {
        const dbRoom = await this._roomRepository.deleteRoomById(id);
        if (!dbRoom) throw new ExpressError(errorConstants.ROOM.NOT_FOUND_BY_ID, HttpStatus.NOT_FOUND);
        return dbRoom;
    }

    async addUserInRoom(roomId: string, dbUser: IUserDocument) {
        const dbRoom = await this._roomRepository.addUserInRoom(roomId, `${dbUser._id}`);
        if (!dbRoom) throw new ExpressError(errorConstants.ROOM.NOT_FOUND_BY_ID, HttpStatus.NOT_FOUND);
        await this._userService.addRoomInUser(`${dbUser._id}`, roomId);
        return dbRoom;
    }

    async addGroupInRoom(roomId: string, groupId: string) {
        const dbRoom = await this._roomRepository.addGroupInRoom(roomId, groupId);
        if (!dbRoom) throw new ExpressError(errorConstants.ROOM.NOT_FOUND_BY_ID, HttpStatus.NOT_FOUND);
        return dbRoom;
    }

    async getRoomById(id: string) {
        const dbRoom = await this._roomRepository.getRoomById(id);
        if (!dbRoom) throw new ExpressError(errorConstants.ROOM.NOT_FOUND_BY_ID, HttpStatus.NOT_FOUND);
        return dbRoom;
    }
}
