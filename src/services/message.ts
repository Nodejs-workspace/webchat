import HttpStatus from "http-status-codes";
import { Types } from "mongoose";
import { v4 as uuidV4 } from "uuid";

import errorConstants from "../constants/error";
import { IMessage, IMessageDocument } from "../databases/models/message";
import { MESSAGE_STATUS_ENUM } from "../enums/messages/status";
import { USER_ROLE_ENM } from "../enums/users/role";
import GroupService from "./group";
import { ExpressError } from "../helpers/expressError";
import MessageRepository from "../repositories/message";
import UserService from "./user";

export default class MessageService {
    private readonly _messageRepository: MessageRepository;
    private readonly _userService: UserService;
    private readonly _groupService: GroupService;

    constructor(messageRepository: MessageRepository, userService: UserService, groupService: GroupService) {
        this._messageRepository = messageRepository;
        this._userService = userService;
        this._groupService = groupService;
    }

    public async saveMessage(message: IMessage): Promise<IMessageDocument> {
        if (!(message.userId && message.groupId))
            throw new ExpressError(errorConstants.CLIENT_ERROR.VALID_ID_REQUIRED, HttpStatus.NOT_FOUND);

        const [dbUser, dbGroup] = await Promise.all([
            this._userService.getUserById(`${message.userId._id ?? message.userId}`),
            this._groupService.getGroupById(`${message.groupId._id ?? message.groupId}`),
        ]);
        message.messageType = USER_ROLE_ENM.GUEST;
        message.messageId = uuidV4();
        message.status = MESSAGE_STATUS_ENUM.SENT;
        message.messagedBy = dbUser;
        message.group = dbGroup;
        message.groupId = new Types.ObjectId(message.groupId._id ?? message.groupId);
        message.userId = new Types.ObjectId(message.userId._id ?? message.userId);
        return this._messageRepository.saveMessage(message);
    }

    public async getMessageByGroupId(groupId: string): Promise<Array<IMessageDocument>> {
        return await this._messageRepository.getMessageByGroupId(groupId);
    }

    public async getMessageByUserId(userId: string): Promise<Array<IMessageDocument>> {
        return await this._messageRepository.getMessageByUserId(userId);
    }
}
