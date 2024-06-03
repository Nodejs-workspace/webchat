import HttpStatus from "http-status-codes";

import errorConstants from "../constants/error";
import { IUserDocument } from "../databases/models/user";
import LoginDTO from "../dtos/login";
import { ExpressError } from "../helpers/expressError";
import UserService from "./user";

export default class LoginService {
    private readonly _userService: UserService;

    constructor(userService: UserService) {
        this._userService = userService;
    }

    public async login(user: LoginDTO): Promise<IUserDocument> {
        const dbUser = await this._userService.getUserByEmail(user.email);
        if (!dbUser) throw new ExpressError(errorConstants.USER.NOT_FOUND_BY_EMAIL, HttpStatus.NOT_FOUND);
        return dbUser;
    }
}
