import { Model } from "mongoose";

import GroupModel, { IGroup, IGroupDocument } from "../databases/models/group";

export default class GroupRepository {
    private readonly _groupModel: Model<IGroupDocument> = GroupModel;

    public async add(data: IGroup): Promise<IGroupDocument> {
        const group = new this._groupModel(data);
        return group.save();
    }

    public async getGroups(): Promise<Array<IGroupDocument>> {
        return await this._groupModel.find<IGroupDocument>();
    }

    public async getGroupsByRoomId(room: string): Promise<Array<IGroupDocument>> {
        return await this._groupModel.find<IGroupDocument>({ room });
    }

    public async getGroupById(id: string): Promise<IGroupDocument | null> {
        return await this._groupModel.findById<IGroupDocument>(id);
    }

    public async deleteGroupById(id: string): Promise<IGroupDocument | null> {
        return await this._groupModel.findByIdAndDelete<IGroupDocument>(id);
    }
}
