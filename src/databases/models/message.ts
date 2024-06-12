import mongoose, { Schema, model, Document, Model, Types } from "mongoose";

import constants from "../../constants";
import { USER_ROLE_ENM } from "../../enums/users/role";
import { MESSAGE_STATUS_ENUM } from "../../enums/messages/status";
import { ITimestamp } from "../../interfaces/timestamp";
import { IGroupDocument } from "./group";
import { IUser } from "./user";

export interface IMessage {
    message: string;
    messageId: string;
    messagedBy: IUser;
    group: IGroupDocument;
    userId: Types.ObjectId;
    groupId: Types.ObjectId;
    messageType: USER_ROLE_ENM;
    status: MESSAGE_STATUS_ENUM;
}

export interface IMessageDocument extends IMessage, Document, ITimestamp {}

const messageSchema: Schema = new Schema<IMessageDocument>(
    {
        messageId: { type: String, required: constants.DEFAULTS.BOOLEAN.TRUE() },
        message: { type: String },
        messagedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: constants.MONGOOSE.COLLECTION.USERS.NAME,
            required: constants.DEFAULTS.BOOLEAN.TRUE(),
        },
        group: {
            type: mongoose.Schema.Types.ObjectId,
            ref: constants.MONGOOSE.COLLECTION.GROUPS.NAME,
            required: constants.DEFAULTS.BOOLEAN.TRUE(),
        },
        userId: { type: mongoose.Schema.Types.ObjectId, required: constants.DEFAULTS.BOOLEAN.TRUE() },
        groupId: { type: mongoose.Schema.Types.ObjectId, required: constants.DEFAULTS.BOOLEAN.TRUE() },
        messageType: { type: String, enum: USER_ROLE_ENM },
        status: { type: String, enum: MESSAGE_STATUS_ENUM, default: MESSAGE_STATUS_ENUM.SENT },
    },
    {
        timestamps: constants.DEFAULTS.BOOLEAN.TRUE(),
    },
);

const MessageModel: Model<IMessageDocument> = model<IMessageDocument>(
    constants.MONGOOSE.COLLECTION.MESSAGES.NAME,
    messageSchema,
);
export default MessageModel;
