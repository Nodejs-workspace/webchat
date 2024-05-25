import HttpStatus from "http-status-codes";
import MessageRepository from "../repositories/message";
import UserService from "./user";
import GroupService from "./group";
import { IMessage, IMessageDocument } from "../databases/models/message";
import { ExpressError } from "../helpers/expressError";
import errorConstants from "../constants/error";

export default class MessageService {
    private _messageRepository: MessageRepository;
    private _userService: UserService;
    private _groupService: GroupService;

    constructor(messageRepository: MessageRepository, userService: UserService, groupService: GroupService) {
        this._messageRepository = messageRepository;
        this._userService = userService;
        this._groupService = groupService;
    }

    async saveMessage(message: IMessage): Promise<IMessageDocument> {
        if (!(message.userId && message.groupId))
            throw new ExpressError(errorConstants.CLIENT_ERROR.VALID_ID_REQUIRED, HttpStatus.NOT_FOUND);

        const dbUser = await this._userService.getUserById(`${message.userId._id}`);
        const dbGroup = await this._groupService.getGroupById(`${message.groupId._id}`);
        message.messagedBy = dbUser;
        message.group = dbGroup;
        return this._messageRepository.saveMessage(message);
    }

    async getMessageByGroupId(groupId: string): Promise<Array<IMessageDocument>> {
        return await this._messageRepository.getMessageByGroupId(groupId);
    }

    async getMessageByUserId(userId: string) {
        return await this._messageRepository.getMessageByUserId(userId);
    }
}
