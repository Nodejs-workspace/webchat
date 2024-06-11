import { IMessage } from "../databases/models/message";
import GroupService from "./group";
import MessageMapper from "../mappers/message";
import MessageService from "./message";
import { ChatMessage } from "../types/sockets/chatMessage";
import UserService from "./user";

export default class MemberService {
    private readonly _userService: UserService;
    private readonly _groupService: GroupService;
    private readonly _messageService: MessageService;

    constructor(userService: UserService, groupService: GroupService, messageService: MessageService) {
        this._userService = userService;
        this._groupService = groupService;
        this._messageService = messageService;
    }

    public async message(body: ChatMessage): Promise<void> {
        const [dbUser, dbGroup] = await Promise.all([
            this._userService.getUserByEmail(body.email),
            this._groupService.getGroupById(body.groupId),
        ]);
        const message: IMessage = MessageMapper.toMessageModel(body, dbUser, dbGroup);
        await this._messageService.saveMessage(message);
    }
}
