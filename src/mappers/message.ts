import { Types } from "mongoose";

import { IMessage } from "../databases/models/message";
import { IUserDocument } from "../databases/models/user";
import { IGroupDocument } from "../databases/models/group";
import { MESSAGE_STATUS_ENUM } from "../enums/messages/status";
import { ChatMessage } from "../types/sockets/chatMessage";

export default class MessageMapper {
    public static toMessageModel(body: ChatMessage, user: IUserDocument, group: IGroupDocument) {
        const message: IMessage = {
            message: body.data.message,
            messageId: body.data.messageId,
            messagedBy: user,
            userId: new Types.ObjectId(body.userId),
            messageType: body.role,
            groupId: new Types.ObjectId(body.groupId),
            group,
            status: MESSAGE_STATUS_ENUM.SENT,
        };
        return message;
    }
}
