import HttpStatus from "http-status-codes";

import errorConstants from "../constants/error";
import { IMessage, IMessageDocument } from "../databases/models/message";
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

        const dbUser = await this._userService.getUserById(`${message.userId._id}`);
        const dbGroup = await this._groupService.getGroupById(`${message.groupId._id}`);
        message.messagedBy = dbUser;
        message.group = dbGroup;
        return this._messageRepository.saveMessage(message);
    }

    public async getMessageByGroupId(groupId: string): Promise<Array<IMessageDocument>> {
        return await this._messageRepository.getMessageByGroupId(groupId);
    }

    public async getMessageByUserId(userId: string): Promise<Array<IMessageDocument>> {
        return await this._messageRepository.getMessageByUserId(userId);
    }
}
