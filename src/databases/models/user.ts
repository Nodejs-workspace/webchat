import { Schema, model, Document, Model } from "mongoose";
import jwt from "jsonwebtoken";

import constants from "../../constants";
import serverConfig from "../../constants/serverConfig";
import { USER_ROLE_ENM } from "../../enums/users/role";
import { ITimestamp } from "../../interfaces/timestamp";

export interface IUserToken extends ITimestamp {
    token?: string;
}

interface IGenerateMethod {
    tokens: Array<IUserToken>;
    generateAuthToken(): string;
}

export interface IUser {
    name: string;
    email: string;
    tokens: Array<IUserToken>;
    profilePicture: string;
    city: string;
    address: string;
    password: string;
    rooms: Array<string>;
    groups: Array<string>;
    role: USER_ROLE_ENM;
}

export interface IUserDocument extends IUser, Document, IGenerateMethod, ITimestamp {}

const tokenSchema: Schema<IUserToken> = new Schema<IUserToken>(
    { token: { type: String } },
    { timestamps: constants.DEFAULTS.BOOLEAN.TRUE(), id: constants.DEFAULTS.BOOLEAN.FALSE() },
);
const userSchema: Schema<IUserDocument> = new Schema<IUserDocument>(
    {
        name: { type: String, index: constants.DEFAULTS.BOOLEAN.TRUE() },
        email: { type: String, required: constants.DEFAULTS.BOOLEAN.TRUE(), unique: constants.DEFAULTS.BOOLEAN.TRUE() },
        tokens: { type: [tokenSchema], default: constants.DEFAULTS.EMPTY.ARRAY<IUserToken> },
        profilePicture: { type: String, default: constants.DEFAULTS.EMPTY.STRING() },
        city: { type: String },
        address: { type: String },
        password: { type: String, required: constants.DEFAULTS.BOOLEAN.TRUE() },
        rooms: { type: [String], default: constants.DEFAULTS.EMPTY.ARRAY<string>() },
        groups: { tpe: [String], default: constants.DEFAULTS.EMPTY.ARRAY<string>() },
        role: { type: String, enum: USER_ROLE_ENM, default: USER_ROLE_ENM.GUEST },
    },
    {
        timestamps: constants.DEFAULTS.BOOLEAN.TRUE(),
    },
);

userSchema.methods.generateAuthToken = async function () {
    const token = jwt.sign({ _id: this._id }, serverConfig.SECRET_KEY, {
        expiresIn: constants.MONGOOSE.TOKEN_EXPIRES_TIME,
    });
    this.tokens = this.tokens.concat({ token });
    await this.save();
    return token;
};

const UserModel: Model<IUserDocument> = model<IUserDocument>(constants.MONGOOSE.COLLECTION.USERS.NAME, userSchema);
export default UserModel;
