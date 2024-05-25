import { Model } from "mongoose";

import RoomModel, { IRoom, IRoomDocument } from "../databases/models/room";

export default class RoomRepository {
    private readonly _roomModel: Model<IRoomDocument> = RoomModel;

    async addRoom(data: IRoom): Promise<IRoomDocument> {
        return await this._roomModel.create(data);
    }

    async getRooms(): Promise<Array<IRoomDocument>> {
        return await this._roomModel.find<IRoomDocument>();
    }

    async getRoomById(id: string): Promise<IRoomDocument | null> {
        return await this._roomModel.findById<IRoomDocument>(id);
    }

    async deleteRoomById(id: string): Promise<IRoomDocument | null> {
        return await this._roomModel.findByIdAndDelete<IRoomDocument>(id);
    }

    async addUserInRoom(id: string, userId: string) {
        return await this._roomModel.findByIdAndUpdate<IRoomDocument>(
            id,
            { $addToSet: { users: userId } },
            { new: true },
        );
    }

    async addGroupInRoom(roomId: string, groupId: string) {
        return await this._roomModel.findByIdAndUpdate<IRoomDocument>(
            roomId,
            { $addToSet: { groups: groupId } },
            { new: true },
        );
    }
}
