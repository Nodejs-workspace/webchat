import constants from "../constants";
import { IUser, IUserToken } from "../databases/models/user";
import { USER_ROLE_ENM } from "../enums/users/role";

export default class UserDTO implements IUser {
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

    constructor(data: IUser) {
        this.name = data.name ?? constants.DEFAULTS.EMPTY.STRING();
        this.email = data.email ?? constants.DEFAULTS.EMPTY.STRING();
        this.city = data.city ?? constants.DEFAULTS.EMPTY.STRING();
        this.password = data.password ?? constants.DEFAULTS.EMPTY.STRING();
        this.tokens = constants.DEFAULTS.EMPTY.ARRAY<IUserToken>();
        this.profilePicture = data.profilePicture ?? constants.DEFAULTS.EMPTY.STRING();
        this.address = data.address ?? constants.DEFAULTS.EMPTY.STRING();
        this.rooms = data.rooms ?? constants.DEFAULTS.EMPTY.ARRAY<string>();
        this.groups = data.groups ?? constants.DEFAULTS.EMPTY.ARRAY<string>();
        this.role = data.role ?? USER_ROLE_ENM.GUEST;
    }
}
