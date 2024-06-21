import { EVENT_TYPE_ENUM } from "../../enums/sockets/eventType";
import { USER_ROLE_ENM } from "../../enums/users/role";

export type MessageData = {
    message: string;
    messageId: string;
};

export type ChatMessage = {
    role: USER_ROLE_ENM;
    eventType: EVENT_TYPE_ENUM;
    data: MessageData;
    userId: string;
    email: string;
    groupId: string;
    socketId: string;
};
