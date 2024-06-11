import { Schema, model, Document, Model } from "mongoose";

import constants from "../../constants";
import { ITimestamp } from "../../interfaces/timestamp";

export interface IRoom {
    name: string;
    description?: string;
    profilePicture: Buffer;
    users: Array<string>;
    groups: Array<string>;
}

export interface IRoomDocument extends IRoom, Document, ITimestamp {}

const roomSchema: Schema = new Schema<IRoomDocument>(
    {
        name: String,
        description: { type: String, require: false, default: constants.DEFAULTS.EMPTY.STRING() },
        users: { type: [String], default: constants.DEFAULTS.EMPTY.ARRAY<string>() },
        groups: { type: [String], default: constants.DEFAULTS.EMPTY.ARRAY<string>() },
    },
    {
        timestamps: true,
    },
);

const RoomModel: Model<IRoomDocument> = model<IRoomDocument>(constants.MONGOOSE.COLLECTION.ROOMS.NAME, roomSchema);
export default RoomModel;
