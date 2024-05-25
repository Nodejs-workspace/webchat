import { FilterQuery, Model, QueryOptions } from "mongoose";

import constants from "../constants";
import MessageModel, { IMessage, IMessageDocument } from "../databases/models/message";
import { SORTING_ENUM } from "../enums/sorting";

export default class MessageRepository {
    private readonly _messageModel: Model<IMessageDocument> = MessageModel;

    public async saveMessage(message: IMessage): Promise<IMessageDocument> {
        const storedMessage = await this._messageModel.create(message);
        await storedMessage.populate("messagedBy");
        await storedMessage.populate("group");

        return storedMessage;
    }

    public async getMessageByGroupId(groupId: string): Promise<Array<IMessageDocument>> {
        const filter: FilterQuery<IMessageDocument> = {
            group: groupId,
            createdAt: { $gt: new Date(Date.now() - constants.DEFAULTS.ONE_DAY_IN_MILI_SECOND) },
        };
        const options: QueryOptions<IMessageDocument> = {
            sort: { createAt: SORTING_ENUM.ASCENDING },
            limit: constants.MONGOOSE.LIMIT,
        };
        const storedMessage = await this._messageModel.find(filter, null, options);
        for (const message of storedMessage) {
            await message.populate("messagedBy");
            await message.populate("group");
        }
        return storedMessage;
    }

    public async getMessageByUserId(userId: string): Promise<Array<IMessageDocument>> {
        const storedMessage = await this._messageModel.find({ messagedBy: userId });
        for (const message of storedMessage) {
            await message.populate("messagedBy");
            await message.populate("group");
        }
        return storedMessage;
    }
}
