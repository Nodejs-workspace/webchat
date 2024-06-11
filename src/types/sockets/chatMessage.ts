import { REQUEST_TYPE_ENUM } from "../../enums/chats/requestType";
import { USER_ROLE_ENM } from "../../enums/users/role";

export type MessageData = {
    message: string;
    messageId: string;
};

export type ChatMessage = {
    role: USER_ROLE_ENM;
    requestType: REQUEST_TYPE_ENUM;
    data: MessageData;
    userId: string;
    email: string;
    groupId: string;
};
