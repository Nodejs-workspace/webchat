import { Schema, model, Document, Model } from "mongoose";

import constants from "../../constants";
import { ITimestamp } from "../../interfaces/timestamp";
import { IRoom } from "./room";

export interface IGroup {
    name: string;
    description: string;
    room: IRoom;
    profilePicture: {
        data: Buffer;
        contentType: string;
    };
}

export interface IGroupDocument extends Document, ITimestamp {}

const groupSchema: Schema = new Schema<IGroup>(
    {
        name: String,
        description: {
            type: String,
            require: constants.DEFAULTS.BOOLEAN.FALSE(),
            default: constants.DEFAULTS.EMPTY.STRING(),
        },
        room: {
            type: Schema.Types.ObjectId,
            ref: constants.MONGOOSE.COLLLECTION.ROOMS.NAME,
            required: constants.DEFAULTS.BOOLEAN.TRUE(),
        },
    },
    {
        timestamps: constants.DEFAULTS.BOOLEAN.TRUE(),
    },
);

const GroupModel: Model<IGroupDocument> = model<IGroupDocument>(
    constants.MONGOOSE.COLLLECTION.GROUPS.NAME,
    groupSchema,
);
export default GroupModel;
