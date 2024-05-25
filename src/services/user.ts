import HttpStatus from "http-status-codes";

import errorConstants from "../constants/error";
import { IUser, IUserDocument } from "../databases/models/user";
import { ExpressError } from "../helpers/expressError";
import UserRepository from "../repositories/user";

export default class UserService {
    private readonly _userRepository: UserRepository;

    constructor(userRepository: UserRepository) {
        this._userRepository = userRepository;
    }

    async add(user: IUser): Promise<IUserDocument> {
        return await this._userRepository.add(user);
    }

    async updateUserById(id: string, user: IUser): Promise<IUserDocument> {
        const dbUser = await this._userRepository.updateUserById(id, user);
        if (!dbUser) throw new ExpressError(errorConstants.USER.NOT_FOUND_BY_ID, HttpStatus.NOT_FOUND);
        return dbUser;
    }

    async getUsers(): Promise<Array<IUserDocument>> {
        return await this._userRepository.getUsers();
    }

    async getUserById(id: string): Promise<IUserDocument> {
        const dbUser = await this._userRepository.getUserById(id);
        if (!dbUser) throw new ExpressError(errorConstants.USER.NOT_FOUND_BY_ID, HttpStatus.NOT_FOUND);
        return dbUser;
    }

    async getUserByEmail(email: string): Promise<IUserDocument> {
        const dbUser = await this._userRepository.getUserByEmail(email);
        if (!dbUser) throw new ExpressError(errorConstants.USER.NOT_FOUND_BY_EMAIL, HttpStatus.NOT_FOUND);
        return dbUser;
    }

    async removeUserTokenById(id: string, token: string): Promise<IUserDocument> {
        const dbUser = await this._userRepository.removeUserTokenById(id, token);
        if (!dbUser) throw new ExpressError(errorConstants.USER.NOT_FOUND_BY_ID, HttpStatus.NOT_FOUND);
        return dbUser;
    }

    async getUserProfilePicById(id: string): Promise<string> {
        const dbUser = await this._userRepository.getUserProfilePicById(id);
        if (!dbUser) throw new ExpressError(errorConstants.USER.NOT_FOUND_BY_ID, HttpStatus.NOT_FOUND);
        return dbUser.profilePicture;
    }

    async uploadByUserImageId(id: string, image: Buffer): Promise<string> {
        const dbUser = await this._userRepository.uploadByUserImageId(id, image);
        if (!dbUser) throw new ExpressError(errorConstants.USER.NOT_FOUND_BY_ID, HttpStatus.NOT_FOUND);
        return dbUser.profilePicture;
    }

    async addRoomInUser(id: string, roomId: string): Promise<IUserDocument> {
        const dbUser = await this._userRepository.addRoomInUser(id, roomId);
        if (!dbUser) throw new ExpressError(errorConstants.USER.NOT_FOUND_BY_ID, HttpStatus.NOT_FOUND);
        return dbUser;
    }

    async addGroupInUser(id: string, groupId: string) {
        const dbUser = await this._userRepository.addGroupInUser(id, groupId);
        if (!dbUser) throw new ExpressError(errorConstants.USER.NOT_FOUND_BY_ID, HttpStatus.NOT_FOUND);
        return dbUser;
    }
}
