import { Model } from "mongoose";
import UserModel, { IUser, IUserDocument } from "../databases/models/user";

export default class UserRepository {
    private readonly _userModel: Model<IUserDocument> = UserModel;

    async add(user: IUser): Promise<IUserDocument> {
        const dbUser = new this._userModel(user);
        return await dbUser.save();
    }

    async updateUserById(id: string, user: IUser): Promise<IUserDocument | null> {
        return await this._userModel.findByIdAndUpdate<IUserDocument>(id, user);
    }

    async getUsers(): Promise<Array<IUserDocument>> {
        return await this._userModel.find<IUserDocument>();
    }

    async getUserById(id: string): Promise<IUserDocument | null> {
        return await this._userModel.findById<IUserDocument>(id);
    }

    async getUserByEmail(email: string): Promise<IUserDocument | null> {
        return await this._userModel.findOne<IUserDocument>({ email });
    }

    async removeUserTokenById(id: string, token: string): Promise<IUserDocument | null> {
        return await this._userModel.findByIdAndUpdate(
            id,
            {
                $pull: {
                    tokens: {
                        token,
                    },
                },
            },
            {
                multi: true,
            },
        );
    }

    async getUserProfilePicById(id: string): Promise<IUserDocument | null> {
        return await this._userModel.findById<IUserDocument>(id);
    }

    async uploadByUserImageId(id: string, image: Buffer): Promise<IUserDocument | null> {
        return await this._userModel.findByIdAndUpdate<IUserDocument>(id, { profilePicture: image }, { new: true });
    }

    async addRoomInUser(userId: string, roomId: string) {
        return await this._userModel.findByIdAndUpdate<IUserDocument>(
            userId,
            { $addToSet: { rooms: roomId } },
            { new: true },
        );
    }

    async addGroupInUser(userId: string, groupId: string) {
        return await this._userModel.findByIdAndUpdate<IUserDocument>(
            userId,
            { $addToSet: { groups: groupId } },
            { new: true },
        );
    }
}
