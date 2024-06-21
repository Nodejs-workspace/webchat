import HttpStatus from "http-status-codes";

import errorConstants from "../constants/error";
import { IGroup, IGroupDocument } from "../databases/models/group";
import { ExpressError } from "../helpers/expressError";
import GroupRepository from "../repositories/group";
import { IMessage } from "../databases/models/message";

export default class GroupService {
    private _groupRepository: GroupRepository;

    constructor(groupRepository: GroupRepository) {
        this._groupRepository = groupRepository;
    }

    public async add(data: IGroup): Promise<IGroupDocument> {
        if (!data.name) throw new ExpressError(errorConstants.GROUP.NAME, HttpStatus.BAD_REQUEST);
        return await this._groupRepository.add(data);
    }

    public async getGroups(): Promise<Array<IGroupDocument>> {
        return await this._groupRepository.getGroups();
    }

    public async getGroupsWithRoomData(room: string): Promise<Array<IGroupDocument>> {
        const groupData = await this._groupRepository.getGroupsByRoomId(room);
        for (const group of groupData) await group.populate("room");
        return groupData;
    }

    public async getGroupById(id: string): Promise<IGroupDocument> {
        const groupData = await this._groupRepository.getGroupById(id);
        if (!groupData) throw new ExpressError(errorConstants.GROUP.NOT_FOUND_BY_ID, HttpStatus.NOT_FOUND);
        return groupData;
    }

    public async deleteGroupById(id: string): Promise<IGroupDocument> {
        const groupData = await this._groupRepository.deleteGroupById(id);
        if (!groupData) throw new ExpressError(errorConstants.GROUP.NOT_FOUND_BY_ID, HttpStatus.NOT_FOUND);
        return groupData;
    }

    public async sendMessageToGroup(_message: IMessage) {
        // const messageToSend = message;
    }
}
