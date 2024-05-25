import mongoose, { Schema, model, Document, Model, Types } from "mongoose";

import constants from "../../constants";
import { IGroupDocument } from "./group";
import { ITimestamp } from "../../interfaces/timestamp";
import { IUser } from "./user";

export interface IMessage {
    message: string;
    messageId: string;
    messagedBy: IUser;
    group: IGroupDocument;
    userId: Types.ObjectId;
    groupId: Types.ObjectId;
}

export interface IMessageDocument extends IMessage, Document, ITimestamp {}

const messageSchema: Schema = new Schema<IMessageDocument>(
    {
        messageId: { type: String, required: constants.DEFAULTS.BOOLEAN.TRUE() },
        message: { type: String },
        messagedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: constants.MONGOOSE.COLLLECTION.USERS.NAME,
            required: constants.DEFAULTS.BOOLEAN.TRUE(),
        },
        groupId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: constants.MONGOOSE.COLLLECTION.GROUPS.NAME,
            required: constants.DEFAULTS.BOOLEAN.TRUE(),
        },
    },
    {
        timestamps: constants.DEFAULTS.BOOLEAN.TRUE(),
    },
);

const MessageModel: Model<IMessageDocument> = model<IMessageDocument>(
    constants.MONGOOSE.COLLLECTION.MESSAGES.NAME,
    messageSchema,
);
export default MessageModel;
